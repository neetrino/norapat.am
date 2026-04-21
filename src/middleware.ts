import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { AUTH_SESSION_TOKEN_COOKIE_NAME } from '@/lib/nextAuthCookie'

const authSecret = process.env.NEXTAUTH_SECRET
const ADMIN_INTERNAL_PATH = '/admin'
const ADMIN_PUBLIC_PATH = '/supersudo'

function isPathPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname

    if (isPathPrefix(pathname, ADMIN_INTERNAL_PATH)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = pathname.replace(ADMIN_INTERNAL_PATH, ADMIN_PUBLIC_PATH)
      return NextResponse.redirect(redirectUrl)
    }

    if (isPathPrefix(pathname, ADMIN_PUBLIC_PATH)) {
      // Проверяем роль пользователя
      if (req.nextauth.token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      const rewriteUrl = req.nextUrl.clone()
      rewriteUrl.pathname = pathname.replace(ADMIN_PUBLIC_PATH, ADMIN_INTERNAL_PATH)
      return NextResponse.rewrite(rewriteUrl)
    }
  },
  {
    secret: authSecret,
    pages: {
      signIn: '/login',
    },
    cookies: {
      sessionToken: {
        name: AUTH_SESSION_TOKEN_COOKIE_NAME,
      },
    },
    callbacks: {
      authorized: ({ token, req }) => {
        // Если пользователь пытается зайти в админку или профиль, проверяем авторизацию
        if (
          req.nextUrl.pathname.startsWith('/supersudo') ||
          req.nextUrl.pathname.startsWith('/profile')
        ) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/supersudo/:path*', '/profile', '/profile/:path*'],
}
