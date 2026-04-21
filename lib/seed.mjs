import { createClient } from '@libsql/client'

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:softride.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

await db.executeMultiple(`
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
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`)

const defaults = [
  ['whatsapp', '212770892279'],
  ['email', 'contact@softride.ma'],
  ['address', 'Rabat • Salé • Kénitra, Maroc'],
  ['admin_password', 'softride2025'],
  ['instagram', '@softride000'],
]
for (const [key, value] of defaults) {
  await db.execute({ sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', args: [key, value] })
}

const cats = [
  ['Trottinettes', 'trottinettes', '🛴'],
  ['Pièces', 'pieces', '🔧'],
  ['Accessoires', 'accessoires', '🎒'],
]
for (const [name, slug, icon] of cats) {
  await db.execute({ sql: 'INSERT OR IGNORE INTO categories (name, slug, icon) VALUES (?, ?, ?)', args: [name, slug, icon] })
}

const cat = await db.execute({ sql: `SELECT id FROM categories WHERE slug = 'trottinettes'`, args: [] })
const catId = cat.rows[0].id

await db.execute({ sql: 'DELETE FROM products', args: [] })

await db.execute({
  sql: `INSERT INTO products (name, category_id, price, old_price, speed, range, images, badge, description, stock, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  args: ['Xiaomi Mi Essential', catId, 1449, 3500, 25, 25,
    JSON.stringify(['xiaomi-essential-1.jpg', 'xiaomi-essential-2.jpg']),
    'PROMO', 'تروتينة Xiaomi بحال الجديدة | 25 كلم/س | 25 كلم استقلالية', 5, 1]
})

await db.execute({
  sql: `INSERT INTO products (name, category_id, price, old_price, speed, range, images, badge, description, stock, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  args: ['Dualtron Popular', catId, 4850, null, 60, 50,
    JSON.stringify(['dualtron-popular-1.jpg', 'dualtron-popular-2.jpg', 'dualtron-popular-3.jpg']),
    'TOP VENTE', 'تروتينة Dualtron Popular بحال الجديدة | 60 كلم/س | 50 كلم استقلالية', 3, 1]
})

console.log('✅ Base de données Turso seedée avec succès !')
console.log('📦 2 produits insérés')
console.log('🗂️  3 catégories créées')

db.close()
