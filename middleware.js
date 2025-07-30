import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // DEMO MODE: Skip authentication for dashboard access in production
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  const protectedRoutes = ['/agents', '/leads', '/workflows', '/analytics']
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // If accessing protected route without session, redirect to signin
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  // If accessing auth pages with session, redirect to dashboard
  if ((req.nextUrl.pathname === '/signin' || req.nextUrl.pathname === '/signup') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If accessing root with session, redirect to dashboard
  if (req.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}