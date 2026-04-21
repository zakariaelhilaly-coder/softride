import { NextRequest, NextResponse } from 'next/server'
import { initDb, queryOne, run } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  const product = await queryOne(`SELECT * FROM products WHERE id = ?`, [Number(params.id)])
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  const data = await req.json()
  await run(`
    UPDATE products SET
      name = ?, category_id = ?, price = ?, old_price = ?,
      speed = ?, range = ?, images = ?, badge = ?,
      description = ?, stock = ?, featured = ?
    WHERE id = ?
  `, [
    data.name, data.category_id || null, data.price, data.old_price || null,
    data.speed || null, data.range || null, JSON.stringify(data.images || []),
    data.badge || null, data.description || null, data.stock ?? 10,
    data.featured ? 1 : 0, Number(params.id)
  ])
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  await run(`DELETE FROM products WHERE id = ?`, [Number(params.id)])
  return NextResponse.json({ success: true })
}
