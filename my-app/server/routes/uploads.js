import express from 'express'
import { upload } from '../middleware/upload.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware, upload.array('images', 10), (req, res) => {
  const files = req.files || []

  const urls = files.map((file) => `/uploads/${file.filename}`)

  res.json({ urls })
})

export default router