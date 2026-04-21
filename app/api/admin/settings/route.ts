import { NextRequest, NextResponse } from 'next/server'
import { initDb, query, run } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  const settings = await query<{ key: string; value: string }>(`SELECT * FROM settings`)
  const obj: Record<string, string> = {}
  settings.forEach(s => { obj[s.key] = s.value })
  return NextResponse.json(obj)
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await initDb()
  const data = await req.json()
  for (const [key, value] of Object.entries(data)) {
    await run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, String(value)])
  }
  return NextResponse.json({ success: true })
}
