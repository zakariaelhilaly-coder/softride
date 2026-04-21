import { NextRequest, NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const { name, slug, icon } = await req.json()
  db.prepare(`UPDATE categories SET name = ?, slug = ?, icon = ? WHERE id = ?`).run(name, slug, icon, params.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  db.prepare(`DELETE FROM categories WHERE id = ?`).run(params.id)
  return NextResponse.json({ success: true })
}
