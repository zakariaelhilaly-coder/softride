import { NextRequest, NextResponse } from 'next/server'
import { initDb, query, run } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  await initDb()
  const categories = await query(`SELECT * FROM categories ORDER BY name`)
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  const { name, slug, icon } = await req.json()
  const result = await run(`INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)`, [name, slug, icon || '🛴'])
  return NextResponse.json({ id: result.lastInsertRowid })
}
