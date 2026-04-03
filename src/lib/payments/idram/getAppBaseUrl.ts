/**
 * Public site origin for Idram (no trailing slash).
 * Idram merchant panel: RESULT_URL, SUCCESS_URL, FAIL_URL = `{origin}/api/idram_*`.
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
