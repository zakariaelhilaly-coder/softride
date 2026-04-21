import { NextRequest, NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const settings = db.prepare(`SELECT * FROM settings`).all() as { key: string; value: string }[]
  const obj: Record<string, string> = {}
  settings.forEach(s => { obj[s.key] = s.value })
  return NextResponse.json(obj)
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const data = await req.json()

  const stmt = db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`)
  for (const [key, value] of Object.entries(data)) {
    stmt.run(key, String(value))
  }
  return NextResponse.json({ success: true })
}
