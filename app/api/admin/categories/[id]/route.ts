import { NextRequest, NextResponse } from 'next/server'
import { initDb, run } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  const { name, slug, icon } = await req.json()
  await run(`UPDATE categories SET name = ?, slug = ?, icon = ? WHERE id = ?`, [name, slug, icon, Number(params.id)])
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  await run(`DELETE FROM categories WHERE id = ?`, [Number(params.id)])
  return NextResponse.json({ success: true })
}
