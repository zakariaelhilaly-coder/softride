import { DatabaseSync } from 'node:sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'softride.db')

const db = new DatabaseSync(DB_PATH)
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

// Create tables
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

// Insert default settings
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

// Insert categories
const categories = [
  ['Trottinettes', 'trottinettes', '🛴'],
  ['Pièces', 'pieces', '🔧'],
  ['Accessoires', 'accessoires', '🎒'],
]
for (const [name, slug, icon] of categories) {
  db.prepare(`INSERT OR IGNORE INTO categories (name, slug, icon) VALUES (?, ?, ?)`).run(name, slug, icon)
}

const trottinetteCat = db.prepare(`SELECT id FROM categories WHERE slug = 'trottinettes'`).get()

// Clear and re-insert products
db.exec(`DELETE FROM products`)

db.prepare(`
  INSERT INTO products (name, category_id, price, old_price, speed, range, images, badge, description, stock, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'Xiaomi Mi Essential',
  trottinetteCat.id,
  1449,
  3500,
  25,
  25,
  JSON.stringify(['xiaomi-essential-1.jpg', 'xiaomi-essential-2.jpg']),
  'PROMO',
  'تروتينة Xiaomi بحال الجديدة | 25 كلم/س | 25 كلم استقلالية',
  5,
  1
)

db.prepare(`
  INSERT INTO products (name, category_id, price, old_price, speed, range, images, badge, description, stock, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'Dualtron Popular',
  trottinetteCat.id,
  4850,
  null,
  60,
  50,
  JSON.stringify(['dualtron-popular-1.jpg', 'dualtron-popular-2.jpg', 'dualtron-popular-3.jpg']),
  'TOP VENTE',
  'تروتينة Dualtron Popular بحال الجديدة | 60 كلم/س | 50 كلم استقلالية',
  3,
  1
)

console.log('✅ Base de données créée avec succès !')
console.log('📦 2 produits insérés')
console.log('🗂️  3 catégories créées')
console.log('⚙️  Paramètres configurés')
console.log('')
console.log('🔐 Mot de passe admin: softride2025')
console.log('🌐 Lancez: npm run dev')

db.close()
