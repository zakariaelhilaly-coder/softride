import { createClient } from '@libsql/client/web'

function getClient() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) throw new Error('TURSO_DATABASE_URL is not set')

  return createClient({ url, authToken })
}

export async function initDb() {
  const db = getClient()

  await db.execute(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT '🛴'
  )`)

  await db.execute(`CREATE TABLE IF NOT EXISTS products (
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
    created_at TEXT DEFAULT (datetime('now'))
  )`)

  await db.execute(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`)

  const defaults: [string, string][] = [
    ['whatsapp', '212770892279'],
    ['email', 'contact@softride.ma'],
    ['address', 'Rabat • Salé • Kénitra, Maroc'],
    ['admin_password', 'softride2025'],
    ['instagram', '@softride000'],
  ]
  for (const [key, value] of defaults) {
    await db.execute({ sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', args: [key, value] })
  }
}

export async function query<T = Record<string, unknown>>(sql: string, args: (string | number | null)[] = []): Promise<T[]> {
  const db = getClient()
  const result = await db.execute({ sql, args })
  return result.rows as unknown as T[]
}

export async function queryOne<T = Record<string, unknown>>(sql: string, args: (string | number | null)[] = []): Promise<T | null> {
  const rows = await query<T>(sql, args)
  return rows[0] ?? null
}

export async function run(sql: string, args: (string | number | null)[] = []) {
  const db = getClient()
  const result = await db.execute({ sql, args })
  return { lastInsertRowid: Number(result.lastInsertRowid ?? 0), changes: result.rowsAffected }
}

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
