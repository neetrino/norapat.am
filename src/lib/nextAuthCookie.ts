/**
 * NextAuth JWT session cookie name must match between Route Handler and middleware `getToken`.
 * If NEXTAUTH_URL starts with `http://` on Vercel (misconfiguration), next-auth/jwt defaults
 * `secureCookie` to false (`false ?? !!VERCEL` keeps false), while the real request is HTTPS
 * and sets `__Secure-next-auth.session-token` — middleware then sees no token and redirects to /login.
 */
const NEXTAUTH_URL_HTTPS =
  process.env.NEXTAUTH_URL?.startsWith('https://') === true

export const useSecureAuthCookies =
  NEXTAUTH_URL_HTTPS ||
  (process.env.VERCEL === '1' && process.env.NODE_ENV === 'production')

export const AUTH_SESSION_TOKEN_COOKIE_NAME = useSecureAuthCookies
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token'
