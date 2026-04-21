import { NextRequest, NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(params.id)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const data = await req.json()

  db.prepare(`
    UPDATE products SET
      name = ?, category_id = ?, price = ?, old_price = ?,
      speed = ?, range = ?, images = ?, badge = ?,
      description = ?, stock = ?, featured = ?
    WHERE id = ?
  `).run(
    data.name,
    data.category_id || null,
    data.price,
    data.old_price || null,
    data.speed || null,
    data.range || null,
    JSON.stringify(data.images || []),
    data.badge || null,
    data.description || null,
    data.stock ?? 10,
    data.featured ? 1 : 0,
    params.id
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  db.prepare(`DELETE FROM products WHERE id = ?`).run(params.id)
  return NextResponse.json({ success: true })
}
