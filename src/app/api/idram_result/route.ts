import { NextRequest, NextResponse } from 'next/server'

import {
  idramLogger,
  parseIdramFormBody,
  processIdramResult,
} from '@/lib/payments/idram'

export const dynamic = 'force-dynamic'

/**
 * Idram RESULT_URL — two POSTs (precheck + payment confirmation). Plain-text body; must be exactly "OK" when valid.
 */
export async function POST(request: NextRequest) {
  try {
    const fields = await parseIdramFormBody(request)
    const text = await processIdramResult(fields)
    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (e) {
    idramLogger.error('idram_result_handler_failed', e)
    const msg = e instanceof Error ? e.message : 'Server error'
    return new NextResponse(msg, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
