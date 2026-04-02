import { NextRequest, NextResponse } from 'next/server'

import {
  parseIdramFormBody,
  processIdramResult,
} from '@/lib/payments/idram'

export const dynamic = 'force-dynamic'

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
    const msg = e instanceof Error ? e.message : 'Server error'
    return new NextResponse(msg, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
