import { NextRequest, NextResponse } from 'next/server'
import { generateToken, setAdminCookie } from '@/lib/auth'
import { initDb, queryOne } from '@/lib/db'

export async function POST(req: NextRequest) {
  await initDb()
  const { password } = await req.json()
  const setting = await queryOne<{ value: string }>(`SELECT value FROM settings WHERE key = 'admin_password'`)
  const storedPassword = setting?.value || 'softride2025'

  if (password !== storedPassword) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const token = generateToken()
  const signed = setAdminCookie(token)
  const res = NextResponse.json({ success: true })
  res.cookies.set('softride_admin', signed, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 })
  return res
}
