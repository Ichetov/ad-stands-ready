import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { db } from '../db/database.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

const createToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      login: admin.login,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

const createResetToken = () => crypto.randomBytes(32).toString('hex')

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

router.post('/login', async (req, res) => {
  const { login, password } = req.body

  if (!login || !password) {
    return res.status(400).json({ message: 'Логин и пароль обязательны' })
  }

  const admin = db.prepare(`SELECT * FROM admins WHERE login = ?`).get(login)

  if (!admin) {
    return res.status(401).json({ message: 'Неверный логин или пароль' })
  }

  const isValidPassword = await bcrypt.compare(password, admin.password_hash)

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Неверный логин или пароль' })
  }

  const token = createToken(admin)

  res.json({
    token,
    admin: {
      id: admin.id,
      login: admin.login,
      email: admin.email,
    },
  })
})

router.get('/me', authMiddleware, (req, res) => {
  const admin = db.prepare(`
    SELECT id, login, email
    FROM admins
    WHERE id = ?
  `).get(req.user.id)

  if (!admin) {
    return res.status(404).json({ message: 'Админ не найден' })
  }

  res.json(admin)
})

router.put('/me', authMiddleware, async (req, res) => {
  const { login, email, currentPassword, newPassword } = req.body

  const admin = db.prepare(`SELECT * FROM admins WHERE id = ?`).get(req.user.id)

  if (!admin) {
    return res.status(404).json({ message: 'Админ не найден' })
  }

  if (!login || !email) {
    return res.status(400).json({ message: 'Логин и email обязательны' })
  }

  const existingLogin = db.prepare(`
    SELECT id FROM admins WHERE login = ? AND id != ?
  `).get(login, admin.id)

  if (existingLogin) {
    return res.status(400).json({ message: 'Такой логин уже используется' })
  }

  const existingEmail = db.prepare(`
    SELECT id FROM admins WHERE email = ? AND id != ?
  `).get(email, admin.id)

  if (existingEmail) {
    return res.status(400).json({ message: 'Такой email уже используется' })
  }

  let passwordHash = admin.password_hash

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ message: 'Введите текущий пароль' })
    }

    const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash)

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Текущий пароль неверный' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Новый пароль должен быть минимум 8 символов' })
    }

    passwordHash = await bcrypt.hash(newPassword, 10)
  }

  db.prepare(`
    UPDATE admins
    SET login = ?, email = ?, password_hash = ?
    WHERE id = ?
  `).run(login, email, passwordHash, admin.id)

  const updatedAdmin = db.prepare(`
    SELECT id, login, email
    FROM admins
    WHERE id = ?
  `).get(admin.id)

  const token = createToken(updatedAdmin)

  res.json({
    token,
    admin: updatedAdmin,
  })
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email обязателен' })
  }

  const admin = db.prepare(`SELECT * FROM admins WHERE email = ?`).get(email)

  if (!admin) {
    return res.json({ success: true })
  }

  const resetToken = createResetToken()
  const resetTokenHash = hashToken(resetToken)
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString()

  db.prepare(`
    UPDATE admins
    SET reset_token_hash = ?, reset_token_expires_at = ?
    WHERE id = ?
  `).run(resetTokenHash, expiresAt, admin.id)

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: admin.email,
    subject: 'Восстановление пароля',
    html: `
      <h2>Восстановление пароля</h2>
      <p>Перейдите по ссылке, чтобы задать новый пароль:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Ссылка действует 15 минут.</p>
    `,
  })

  res.json({ success: true })
})

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body

  if (!token || !password) {
    return res.status(400).json({ message: 'Токен и пароль обязательны' })
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Пароль должен быть минимум 8 символов' })
  }

  const tokenHash = hashToken(token)

  const admin = db.prepare(`
    SELECT * FROM admins
    WHERE reset_token_hash = ?
  `).get(tokenHash)

  if (!admin) {
    return res.status(400).json({ message: 'Ссылка недействительна' })
  }

  const isExpired = new Date(admin.reset_token_expires_at).getTime() < Date.now()

  if (isExpired) {
    return res.status(400).json({ message: 'Ссылка устарела' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  db.prepare(`
    UPDATE admins
    SET password_hash = ?,
        reset_token_hash = NULL,
        reset_token_expires_at = NULL
    WHERE id = ?
  `).run(passwordHash, admin.id)

  res.json({ success: true })
})

export default router