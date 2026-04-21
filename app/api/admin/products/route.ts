import { NextRequest, NextResponse } from 'next/server'
import { initDb, query, run } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  const products = await query(`
    SELECT p.*, c.name as category_name FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `)
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  const data = await req.json()
  const result = await run(`
    INSERT INTO products (name, category_id, price, old_price, speed, range, images, badge, description, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.name, data.category_id || null, data.price, data.old_price || null,
    data.speed || null, data.range || null, JSON.stringify(data.images || []),
    data.badge || null, data.description || null, data.stock ?? 10, data.featured ? 1 : 0
  ])
  return NextResponse.json({ id: result.lastInsertRowid })
}
