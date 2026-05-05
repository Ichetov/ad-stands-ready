import express from 'express'
import { db } from '../db/database.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

const mapFaq = (faq) => ({
  id: faq.id,
  question: faq.question,
  answer: faq.answer,
  sortOrder: faq.sort_order,
  isActive: Boolean(faq.is_active),
})

router.get('/', (req, res) => {
  const { admin } = req.query

  let query = `SELECT * FROM faqs WHERE 1 = 1`

  if (admin !== '1') {
    query += ` AND is_active = 1`
  }

  query += ` ORDER BY sort_order ASC, id ASC`

  const faqs = db.prepare(query).all().map(mapFaq)

  res.json(faqs)
})

router.post('/', authMiddleware, (req, res) => {
  const { question, answer, sortOrder, isActive } = req.body

  if (!question || !answer) {
    return res.status(400).json({ message: 'Вопрос и ответ обязательны' })
  }

  const info = db.prepare(`
    INSERT INTO faqs (question, answer, sort_order, is_active)
    VALUES (?, ?, ?, ?)
  `).run(question, answer, Number(sortOrder) || 0, isActive ? 1 : 0)

  const created = db.prepare(`SELECT * FROM faqs WHERE id = ?`).get(info.lastInsertRowid)

  res.status(201).json(mapFaq(created))
})

router.put('/:id', authMiddleware, (req, res) => {
  const { question, answer, sortOrder, isActive } = req.body

  const current = db.prepare(`SELECT * FROM faqs WHERE id = ?`).get(req.params.id)

  if (!current) {
    return res.status(404).json({ message: 'FAQ не найден' })
  }

  db.prepare(`
    UPDATE faqs
    SET question = ?, answer = ?, sort_order = ?, is_active = ?
    WHERE id = ?
  `).run(question, answer, Number(sortOrder) || 0, isActive ? 1 : 0, req.params.id)

  const updated = db.prepare(`SELECT * FROM faqs WHERE id = ?`).get(req.params.id)

  res.json(mapFaq(updated))
})

router.delete('/:id', authMiddleware, (req, res) => {
  const current = db.prepare(`SELECT * FROM faqs WHERE id = ?`).get(req.params.id)

  if (!current) {
    return res.status(404).json({ message: 'FAQ не найден' })
  }

  db.prepare(`DELETE FROM faqs WHERE id = ?`).run(req.params.id)

  res.json({ success: true })
})

export default router