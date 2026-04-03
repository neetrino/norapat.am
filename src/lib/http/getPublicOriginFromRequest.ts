import type { NextRequest } from 'next/server'

function trimFirstCsv(value: string | null): string | undefined {
  if (!value) return undefined
  const first = value.split(',')[0]?.trim()
  return first || undefined
}

function optionalAppOriginFromEnv(): string | undefined {
  const raw =
    process.env.APP_URL?.trim() ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  return raw ? raw.replace(/\/$/, '') : undefined
}

function isLoopbackHostname(hostname: string): boolean {
  const h = hostname.toLowerCase()
  return h === 'localhost' || h === '127.0.0.1' || h === '::1'
}

/**
 * Protocol + host (no path) for redirects when the app is behind a proxy/tunnel.
 * Uses `X-Forwarded-Host` / `X-Forwarded-Proto` when present; if the request URL
 * targets loopback and `APP_URL` / `NEXT_PUBLIC_APP_URL` is set, uses that so
 * browser redirects stay on the public tunnel domain.
 */
export function getPublicOriginFromRequest(request: NextRequest): string {
  const forwardedHost = trimFirstCsv(request.headers.get('x-forwarded-host'))
  const forwardedProtoRaw = trimFirstCsv(request.headers.get('x-forwarded-proto'))
  if (forwardedHost) {
    const proto =
      forwardedProtoRaw === 'http' || forwardedProtoRaw === 'https'
        ? forwardedProtoRaw
        : 'https'
    return `${proto}://${forwardedHost}`
  }

  const url = new URL(request.url)
  if (isLoopbackHostname(url.hostname)) {
    const fromEnv = optionalAppOriginFromEnv()
    if (fromEnv) {
      return fromEnv
    }
  }

  return `${url.protocol}//${url.host}`
}
