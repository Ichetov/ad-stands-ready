import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import standsRoutes from './routes/stands.js'
import requestsRoutes from './routes/requests.js'
import uploadsRoutes from './routes/uploads.js'
import faqsRoutes from './routes/faqs.js'
import { initDb } from './db/init.js'

const app = express()
const PORT = 4000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

initDb()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/stands', standsRoutes)
app.use('/api/requests', requestsRoutes)
app.use('/api/uploads', uploadsRoutes)
app.use('/api/faqs', faqsRoutes)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})