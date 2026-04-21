import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac } from 'crypto'

const SECRET = process.env.AUTH_SECRET || 'softride-secret-2025'

function verifyToken(signed: string): boolean {
  const dotIdx = signed.lastIndexOf('.')
  if (dotIdx === -1) return false
  const token = signed.substring(0, dotIdx)
  const sig = signed.substring(dotIdx + 1)
  const expected = createHmac('sha256', SECRET).update(token).digest('hex')
  return sig === expected
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin/dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    const cookie = request.cookies.get('softride_admin')
    if (!cookie || !verifyToken(cookie.value)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}
