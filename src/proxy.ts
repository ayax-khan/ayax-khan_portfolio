import { NextResponse, type NextRequest } from 'next/server'

function unauthorized() {
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin"',
    },
  })
}

/**
 * Next.js 16+ prefers proxy handlers over middleware.
 * We protect /admin/* with HTTP Basic Auth.
 */
export default function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const user = process.env.ADMIN_USER
  const pass = process.env.ADMIN_PASSWORD

  if (!user || !pass) {
    if (process.env.NODE_ENV === 'production') return unauthorized()
    return NextResponse.next()
  }

  const auth = req.headers.get('authorization')
  if (!auth || !auth.toLowerCase().startsWith('basic ')) return unauthorized()

  try {
    const b64 = auth.slice('basic '.length)
    const [u, p] = Buffer.from(b64, 'base64').toString('utf8').split(':')
    if (u !== user || p !== pass) return unauthorized()
  } catch {
    return unauthorized()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
