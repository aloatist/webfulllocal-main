import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Public routes that don't require authentication
    const publicRoutes = ['/api/auth']
    if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // Check authentication for other API routes
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check admin role
    if (token.role !== 'ADMIN' && token.role !== 'EDITOR') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*']
}