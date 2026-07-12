import { NextResponse, type NextRequest } from 'next/server'

const UNAUTHORIZED_BODY = 'Authentication required.'
const MISSING_ENV_BODY = 'Server configuration error.'

function unauthorized() {
  return new NextResponse(UNAUTHORIZED_BODY, {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  })
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Constant-time length check (always compare full length)
    let result = a.length ^ b.length
    const maxLen = Math.max(a.length, b.length)
    const aPadded = a.padEnd(maxLen, '\0')
    const bPadded = b.padEnd(maxLen, '\0')
    for (let i = 0; i < maxLen; i++) {
      result |= aPadded.charCodeAt(i) ^ bPadded.charCodeAt(i)
    }
    return result === 0
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

/**
 * Next.js 16+ prefers proxy handlers over middleware.
 * We protect /admin/* with HTTP Basic Auth using timing-safe comparison.
 */
export default function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const user = process.env.ADMIN_USER
  const pass = process.env.ADMIN_PASSWORD

  if (!user || !pass) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse(MISSING_ENV_BODY, { status: 500 })
    }
    return NextResponse.next()
  }

  const auth = req.headers.get('authorization')
  if (!auth || !auth.toLowerCase().startsWith('basic ')) return unauthorized()

  try {
    const b64 = auth.slice('basic '.length)
    const decoded = atob(b64)
    const colonIdx = decoded.indexOf(':')
    if (colonIdx === -1) return unauthorized()

    const u = decoded.slice(0, colonIdx)
    const p = decoded.slice(colonIdx + 1)

    if (!timingSafeEqual(u, user) || !timingSafeEqual(p, pass)) return unauthorized()
  } catch {
    return unauthorized()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
