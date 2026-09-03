import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected paths requiring authentication
  const isProtectedPath =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/editor') ||
    pathname.startsWith('/profile')

  if (isProtectedPath) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    const payload = await verifyToken(token)
    if (!payload) {
      const url = new URL('/login', request.url)
      return NextResponse.redirect(url)
    }

    // Role-specific route enforcement
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/courses', request.url))
    }

    if (pathname.startsWith('/editor') && payload.role !== 'ADMIN' && payload.role !== 'EDITOR') {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/editor/:path*', '/profile/:path*'],
}
