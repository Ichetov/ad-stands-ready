import express from 'express'
import { db } from '../db/database.js'

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

  stmt.run(standId || null, clientName, phone, email, message || '')

  res.status(201).json({ success: true })
})

export default router