import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Skip middleware for Next.js static files and internal routes
  // These should be served directly by Next.js
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // Skip files with extensions (images, fonts, etc.)
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request })
  
  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Public routes that don't require authentication
    const publicRoutes = [
      '/api/auth',
      '/api/public',
      '/api/health',
      '/api/analytics',
      '/api/search',
      '/api/tours',
      '/api/homestays',
      '/api/bookings',
      '/api/promotions',
      '/api/contact',
      '/api/payment',
    ]
    
    // GET requests cho một số routes public (read-only, không cần authentication)
    const publicGetRoutes = [
      '/api/categories',
      '/api/tags',
      '/api/posts',
      '/api/media', // Media GET cho phép public (listing only)
    ]
    
    // Check if it's a public route
    if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.next()
    }
    
    // Check if it's a public GET route
    if (request.method === 'GET' && publicGetRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
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
  // Explicitly exclude Next.js static files and internal routes
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (files in public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    '/api/:path*',
    '/admin/:path*'
  ]
}