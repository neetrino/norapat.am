/**
 * Base URL for wc-api callbacks (no trailing slash).
 * Idram panel must register SUCCESS_URL / FAIL_URL / RESULT_URL under this host.
 */
export function getAppBaseUrl(): string {
  const raw =
    process.env.APP_URL?.trim() ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  if (!raw) {
    throw new Error(
      'APP_URL or NEXT_PUBLIC_APP_URL must be set for Idram callbacks'
    )
  }
  return raw.replace(/\/$/, '')
}
