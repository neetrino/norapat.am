import type { NextRequest } from 'next/server'

/**
 * Idram sends application/x-www-form-urlencoded POST bodies.
 */
export async function parseIdramFormBody(
  request: NextRequest
): Promise<Record<string, string>> {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await request.text()
    const params = new URLSearchParams(text)
    const out: Record<string, string> = {}
    params.forEach((value, key) => {
      out[key] = value
    })
    return out
  }

  const formData = await request.formData()
  const out: Record<string, string> = {}
  formData.forEach((value, key) => {
    out[key] = typeof value === 'string' ? value : ''
  })
  return out
}
