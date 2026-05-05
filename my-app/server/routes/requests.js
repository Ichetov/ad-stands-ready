import express from 'express'
import { db } from '../db/database.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/', (req, res) => {
  const { standId, clientName, phone, email, message } = req.body

  if (!clientName || !phone || !email) {
    return res.status(400).json({ message: 'Заполни обязательные поля' })
  }

  const stmt = db.prepare(`
    INSERT INTO requests (stand_id, client_name, phone, email, message)
    VALUES (?, ?, ?, ?, ?)
  `)

  const info = stmt.run(standId || null, clientName, phone, email, message || '')

  res.status(201).json({ success: true, id: info.lastInsertRowid })
})

router.get('/', authMiddleware, (req, res) => {
  const { viewed } = req.query

  const page = Math.max(Number(req.query.page) || 1, 1)
  const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 100)
  const offset = (page - 1) * limit

  let whereQuery = `WHERE 1 = 1`
  const params = []

  if (viewed === '1') {
    whereQuery += ` AND requests.is_viewed = 1`
  }

  if (viewed === '0') {
    whereQuery += ` AND requests.is_viewed = 0`
  }

  const totalResult = db
    .prepare(`SELECT COUNT(*) as total FROM requests ${whereQuery}`)
    .get(...params)

  const requests = db.prepare(`
    SELECT
      requests.id,
      requests.client_name as clientName,
      requests.phone,
      requests.email,
      requests.message,
      requests.is_viewed as isViewed,
      requests.created_at as createdAt,
      stands.title as standTitle,
      stands.mall_name as mallName
    FROM requests
    LEFT JOIN stands ON stands.id = requests.stand_id
    ${whereQuery}
    ORDER BY requests.id DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset)

  res.json({
    data: requests.map((request) => ({
      ...request,
      isViewed: Boolean(request.isViewed),
    })),
    meta: {
      total: totalResult.total,
      page,
      limit,
      totalPages: Math.ceil(totalResult.total / limit),
    },
  })
})

router.patch('/:id/viewed', authMiddleware, (req, res) => {
  const current = db.prepare(`SELECT * FROM requests WHERE id = ?`).get(req.params.id)

  if (!current) {
    return res.status(404).json({ message: 'Заявка не найдена' })
  }

  db.prepare(`
    UPDATE requests
    SET is_viewed = 1
    WHERE id = ?
  `).run(req.params.id)

  res.json({ success: true })
})

router.delete('/:id', authMiddleware, (req, res) => {
  const current = db.prepare(`SELECT * FROM requests WHERE id = ?`).get(req.params.id)

  if (!current) {
    return res.status(404).json({ message: 'Заявка не найдена' })
  }

  db.prepare(`DELETE FROM requests WHERE id = ?`).run(req.params.id)

  res.json({ success: true })
})

export default router