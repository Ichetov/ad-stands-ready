import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// server/db -> server
const serverRoot = path.resolve(__dirname, '..')

const resolveDbPath = () => {
  const envDbPath = process.env.DB_PATH?.trim()

  if (!envDbPath) {
    return path.join(__dirname, 'adstands.db')
  }

  if (path.isAbsolute(envDbPath)) {
    return envDbPath
  }

  return path.resolve(serverRoot, envDbPath)
}

const dbPath = resolveDbPath()

fs.mkdirSync(path.dirname(dbPath), { recursive: true })

export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')