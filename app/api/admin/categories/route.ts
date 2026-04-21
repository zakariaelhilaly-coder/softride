import { NextRequest, NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = getDb()
  const categories = db.prepare(`SELECT * FROM categories ORDER BY name`).all()
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const { name, slug, icon } = await req.json()
  const result = db.prepare(`INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)`).run(name, slug, icon || '🛴')
  return NextResponse.json({ id: result.lastInsertRowid })
}
