import { db } from './database.js'

export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS stands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      mall_name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      description TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stand_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stand_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (stand_id) REFERENCES stands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stand_id INTEGER,
      client_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stand_id) REFERENCES stands(id) ON DELETE SET NULL
    );
  `)

  const count = db.prepare('SELECT COUNT(*) as count FROM stands').get()

  if (count.count === 0) {
    const insertStand = db.prepare(`
      INSERT INTO stands (slug, title, mall_name, address, city, description, lat, lng, is_active)
      VALUES (@slug, @title, @mall_name, @address, @city, @description, @lat, @lng, @is_active)
    `)

    const insertImage = db.prepare(`
      INSERT INTO stand_images (stand_id, image_url, sort_order)
      VALUES (@stand_id, @image_url, @sort_order)
    `)

    const stands = [
      {
        slug: 'origo-riga',
        title: 'Рекламная стойка Origo',
        mall_name: 'Origo',
        address: 'Stacijas laukums 2, Riga',
        city: 'Riga',
        description: 'Стойка у центрального входа рядом с основным потоком посетителей.',
        lat: 56.946285,
        lng: 24.117174,
        is_active: 1,
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      {
        slug: 'akropole-riga',
        title: 'Рекламная стойка Akropole',
        mall_name: 'Akropole',
        address: 'Maskavas iela 257, Riga',
        city: 'Riga',
        description: 'Расположение возле зоны фудкорта и основных маршрутов посетителей.',
        lat: 56.915484,
        lng: 24.178965,
        is_active: 1,
        images: [
          'https://images.unsplash.com/photo-1519567770579-c2fc5d7845d0?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop'
        ]
      }
    ]

    for (const stand of stands) {
      const info = insertStand.run({
        slug: stand.slug,
        title: stand.title,
        mall_name: stand.mall_name,
        address: stand.address,
        city: stand.city,
        description: stand.description,
        lat: stand.lat,
        lng: stand.lng,
        is_active: stand.is_active
      })

      stand.images.forEach((imageUrl, index) => {
        insertImage.run({
          stand_id: info.lastInsertRowid,
          image_url: imageUrl,
          sort_order: index
        })
      })
    }
  }
}