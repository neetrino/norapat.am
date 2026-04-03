/**
 * Structured server-side logging for Idram payment flows (no secrets).
 */
function formatMeta(meta?: Record<string, unknown>): string {
  if (!meta || Object.keys(meta).length === 0) return ''
  try {
    return ` ${JSON.stringify(meta)}`
  } catch {
    return ''
  }
}

export const idramLogger = {
  info(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'production') {
      console.info(`[payments.idram] ${message}${formatMeta(meta)}`)
    } else {
      console.info(`[payments.idram] ${message}`, meta ?? '')
    }
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(`[payments.idram] ${message}${formatMeta(meta)}`)
  },

  error(message: string, err?: unknown, meta?: Record<string, unknown>): void {
    const detail = err instanceof Error ? err.message : String(err)
    console.error(
      `[payments.idram] ${message}${formatMeta(meta)}`,
      detail !== '' ? detail : err
    )
  },
}
