import express from 'express'
import { db } from '../db/database.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

const mapStand = (stand) => {
  const images = db.prepare(`
    SELECT id, image_url as imageUrl, sort_order as sortOrder
    FROM stand_images
    WHERE stand_id = ?
    ORDER BY sort_order ASC, id ASC
  `).all(stand.id)

  return {
    id: stand.id,
    slug: stand.slug,
    title: stand.title,
    mallName: stand.mall_name,
    address: stand.address,
    city: stand.city,
    description: stand.description,
    lat: stand.lat,
    lng: stand.lng,
    isActive: Boolean(stand.is_active),
    images: images.map((img) => img.imageUrl)
  }
}

router.get('/', (req, res) => {
  const { mall, search, admin } = req.query

  const isAdmin = admin === '1'

  const page = Math.max(Number(req.query.page) || 1, 1)
  const limit = Math.min(Math.max(Number(req.query.limit) || 3, 1), 100)
  const offset = (page - 1) * limit

  let whereQuery = `WHERE 1 = 1`
  const params = []

  if (!isAdmin) {
    whereQuery += ` AND is_active = 1`
  }

  if (mall) {
    whereQuery += ` AND mall_name = ?`
    params.push(mall)
  }

  if (search) {
    whereQuery += ` AND (title LIKE ? OR mall_name LIKE ?)`
    params.push(`%${search}%`, `%${search}%`)
  }

  const totalResult = db
    .prepare(`SELECT COUNT(*) as total FROM stands ${whereQuery}`)
    .get(...params)

  let query = `
    SELECT *
    FROM stands
    ${whereQuery}
    ORDER BY id DESC
  `

  const queryParams = [...params]

  if (!isAdmin) {
    query += ` LIMIT ? OFFSET ?`
    queryParams.push(limit, offset)
  }

  const stands = db
    .prepare(query)
    .all(...queryParams)
    .map(mapStand)

  res.json({
    data: stands,
    meta: {
      total: totalResult.total,
      page,
      limit: isAdmin ? totalResult.total : limit,
      totalPages: isAdmin ? 1 : Math.ceil(totalResult.total / limit)
    }
  })
})

router.get('/malls', (_req, res) => {
  const malls = db
    .prepare(`SELECT DISTINCT mall_name as mallName FROM stands ORDER BY mall_name ASC`)
    .all()

  res.json(malls)
})

router.get('/:slug', (req, res) => {
  const stand = db
    .prepare(`SELECT * FROM stands WHERE slug = ? AND is_active = 1`)
    .get(req.params.slug)

  if (!stand) {
    return res.status(404).json({ message: 'Точка не найдена' })
  }

  res.json(mapStand(stand))
})

router.get('/admin/by-id/:id', authMiddleware, (req, res) => {
  const stand = db.prepare(`SELECT * FROM stands WHERE id = ?`).get(req.params.id)

  if (!stand) {
    return res.status(404).json({ message: 'Точка не найдена' })
  }

  res.json(mapStand(stand))
})

router.post('/', authMiddleware, (req, res) => {
  const { slug, title, mallName, address, city, description, lat, lng, isActive, images } = req.body

  if (!slug || !title || !mallName || !address || !city || !description) {
    return res.status(400).json({ message: 'Не все обязательные поля заполнены' })
  }

  const insert = db.prepare(`
    INSERT INTO stands (slug, title, mall_name, address, city, description, lat, lng, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const info = insert.run(
    slug,
    title,
    mallName,
    address,
    city,
    description,
    Number(lat),
    Number(lng),
    isActive ? 1 : 0
  )

  const insertImage = db.prepare(`
    INSERT INTO stand_images (stand_id, image_url, sort_order)
    VALUES (?, ?, ?)
  `)

  ;(images || []).forEach((imageUrl, index) => {
    insertImage.run(info.lastInsertRowid, imageUrl, index)
  })

  const created = db.prepare(`SELECT * FROM stands WHERE id = ?`).get(info.lastInsertRowid)
  res.status(201).json(mapStand(created))
})

router.put('/:id', authMiddleware, (req, res) => {
  const { slug, title, mallName, address, city, description, lat, lng, isActive, images } = req.body

  const current = db.prepare(`SELECT * FROM stands WHERE id = ?`).get(req.params.id)

  if (!current) {
    return res.status(404).json({ message: 'Точка не найдена' })
  }

  db.prepare(`
    UPDATE stands
    SET slug = ?, title = ?, mall_name = ?, address = ?, city = ?, description = ?, lat = ?, lng = ?, is_active = ?
    WHERE id = ?
  `).run(
    slug,
    title,
    mallName,
    address,
    city,
    description,
    Number(lat),
    Number(lng),
    isActive ? 1 : 0,
    req.params.id
  )

  db.prepare(`DELETE FROM stand_images WHERE stand_id = ?`).run(req.params.id)

  const insertImage = db.prepare(`
    INSERT INTO stand_images (stand_id, image_url, sort_order)
    VALUES (?, ?, ?)
  `)

  ;(images || []).forEach((imageUrl, index) => {
    insertImage.run(req.params.id, imageUrl, index)
  })

  const updated = db.prepare(`SELECT * FROM stands WHERE id = ?`).get(req.params.id)
  res.json(mapStand(updated))
})

router.delete('/:id', authMiddleware, (req, res) => {
  const current = db.prepare(`SELECT * FROM stands WHERE id = ?`).get(req.params.id)

  if (!current) {
    return res.status(404).json({ message: 'Точка не найдена' })
  }

  db.prepare(`DELETE FROM stand_images WHERE stand_id = ?`).run(req.params.id)
  db.prepare(`DELETE FROM stands WHERE id = ?`).run(req.params.id)

  res.json({ success: true })
})

export default router