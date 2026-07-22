import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin-auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin') return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+', '/api/admin/articles/:path*'],
}
