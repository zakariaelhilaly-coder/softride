import { cookies } from 'next/headers'
import { createHmac, randomBytes } from 'crypto'

const SECRET = process.env.AUTH_SECRET || 'softride-secret-2025'
export const COOKIE_NAME = 'softride_admin'

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export function signToken(token: string): string {
  const sig = createHmac('sha256', SECRET).update(token).digest('hex')
  return `${token}.${sig}`
}

export function verifyToken(signed: string): boolean {
  const dotIdx = signed.lastIndexOf('.')
  if (dotIdx === -1) return false
  const token = signed.substring(0, dotIdx)
  const sig = signed.substring(dotIdx + 1)
  const expected = createHmac('sha256', SECRET).update(token).digest('hex')
  return sig === expected
}

export function isAdminAuthenticated(): boolean {
  try {
    const cookieStore = cookies()
    const cookie = cookieStore.get(COOKIE_NAME)
    if (!cookie) return false
    return verifyToken(cookie.value)
  } catch {
    return false
  }
}

export function setAdminCookie(token: string): string {
  return signToken(token)
}
