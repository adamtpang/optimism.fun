/**
 * Gates /admin/* behind HTTP Basic Auth.
 *
 * - In production: ADMIN_PASSWORD must be set; missing → 503.
 * - In dev: open if ADMIN_PASSWORD is unset, so localhost work isn't blocked.
 * - Username can be anything (we only check the password).
 */
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/admin/:path*'],
}

export function middleware(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse(
        'Admin not configured. Set ADMIN_PASSWORD in Vercel env vars to enable.',
        { status: 503 },
      )
    }
    return NextResponse.next()
  }

  const header = req.headers.get('authorization') ?? ''
  if (header.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(header.slice(6), 'base64').toString('utf-8')
      const colon = decoded.indexOf(':')
      const password = colon >= 0 ? decoded.slice(colon + 1) : decoded
      if (password === expected) return NextResponse.next()
    } catch {
      // fall through to challenge
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="optimism.fun admin"' },
  })
}
