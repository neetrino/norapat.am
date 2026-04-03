/**
 * Structured server-side logging for Arca payment flows (no secrets).
 */
function formatMeta(meta?: Record<string, unknown>): string {
  if (!meta || Object.keys(meta).length === 0) return ''
  try {
    return ` ${JSON.stringify(meta)}`
  } catch {
    return ''
  }
}

export const arcaLogger = {
  info(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'production') {
      console.info(`[payments.arca] ${message}${formatMeta(meta)}`)
    } else {
      console.info(`[payments.arca] ${message}`, meta ?? '')
    }
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(`[payments.arca] ${message}${formatMeta(meta)}`)
  },

  error(message: string, err?: unknown, meta?: Record<string, unknown>): void {
    const detail = err instanceof Error ? err.message : String(err)
    console.error(
      `[payments.arca] ${message}${formatMeta(meta)}`,
      detail !== '' ? detail : err
    )
  },
}
