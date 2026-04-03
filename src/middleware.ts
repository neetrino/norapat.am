import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { AUTH_SESSION_TOKEN_COOKIE_NAME } from '@/lib/nextAuthCookie'

const authSecret = process.env.NEXTAUTH_SECRET

export default withAuth(
  function middleware(req) {
    // Проверяем, если пользователь пытается зайти в админку
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Проверяем роль пользователя
      if (req.nextauth.token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
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
        if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/profile')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/profile', '/profile/:path*'],
}
