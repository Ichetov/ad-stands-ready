import express from 'express'
import { ADMIN_LOGIN, ADMIN_PASSWORD, ADMIN_TOKEN } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', (req, res) => {
  const { login, password } = req.body

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_TOKEN })
  }

  return res.status(401).json({ message: 'Неверный логин или пароль' })
})

export default router