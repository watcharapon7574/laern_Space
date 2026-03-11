import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return Buffer.from(str, 'base64').toString()
}

function verifyToken(token: string): { username: string } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, signature] = parts

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    if (signature !== expectedSignature) return null

    const payload = JSON.parse(base64UrlDecode(encodedPayload))

    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return { username: payload.username }
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
