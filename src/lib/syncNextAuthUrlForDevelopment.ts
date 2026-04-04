import type { NextRequest } from 'next/server'

const DEV_NEXTAUTH_URL_SYNC_DISABLED =
  process.env.NEXTAUTH_URL_STRICT === 'true'

/**
 * NextAuth uses `NEXTAUTH_URL` as the canonical origin when not on Vercel and
 * `AUTH_TRUST_HOST` is unset. Accessing the dev server via a LAN IP while
 * `.env` still points at `http://localhost:3000` breaks credentials sign-in;
 * register still works because it does not go through NextAuth.
 *
 * In development only, align `NEXTAUTH_URL` with the incoming request host.
 * Set `NEXTAUTH_URL_STRICT=true` to disable (e.g. when testing a fixed URL).
 */
export function syncNextAuthUrlForDevelopment(req: NextRequest): void {
  if (process.env.NODE_ENV !== 'development' || DEV_NEXTAUTH_URL_SYNC_DISABLED) {
    return
  }

  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  if (!host) {
    return
  }

  const protoHeader = req.headers.get('x-forwarded-proto')
  const proto =
    protoHeader === 'http' || protoHeader === 'https' ? protoHeader : 'http'

  process.env.NEXTAUTH_URL = `${proto}://${host}`
}
