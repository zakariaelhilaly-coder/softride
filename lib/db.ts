// @ts-ignore - node:sqlite is available in Node.js 22+ (experimental flag required for <24)
import { DatabaseSync } from 'node:sqlite'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'softride.db')

let db: InstanceType<typeof DatabaseSync>

function getDb(): InstanceType<typeof DatabaseSync> {
  if (!db) {
    db = new DatabaseSync(DB_PATH)
    db.exec('PRAGMA journal_mode = WAL')
    db.exec('PRAGMA foreign_keys = ON')
    initDb()
  }
  return db
}

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT DEFAULT '🛴'
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER,
      price INTEGER NOT NULL,
      old_price INTEGER,
      speed INTEGER,
      range INTEGER,
      images TEXT DEFAULT '[]',
      badge TEXT,
      description TEXT,
      stock INTEGER DEFAULT 10,
      featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)

  const settingsData = [
    ['whatsapp', '212770892279'],
    ['email', 'contact@softride.ma'],
    ['address', 'Rabat • Salé • Kénitra, Maroc'],
    ['admin_password', 'softride2025'],
    ['instagram', '@softride000'],
  ]
  for (const [key, value] of settingsData) {
    db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`).run(key, value)
  }
}

export default getDb

export interface Product {
  id: number
  name: string
  category_id: number | null
  price: number
  old_price: number | null
  speed: number | null
  range: number | null
  images: string
  badge: string | null
  description: string | null
  stock: number
  featured: number
  created_at: string
  category_name?: string
  category_slug?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  icon: string
}
