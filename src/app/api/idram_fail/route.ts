import { NextRequest, NextResponse } from 'next/server'

import { getPublicOriginFromRequest } from '@/lib/http/getPublicOriginFromRequest'

export const dynamic = 'force-dynamic'

/**
 * Idram FAIL_URL — browser redirect after failed or cancelled payment.
 */
export function GET(request: NextRequest) {
  const url = new URL(request.url)
  const dest = new URL('/payment/fail', getPublicOriginFromRequest(request))
  dest.searchParams.set('reason', 'idram')
  const order =
    url.searchParams.get('order_number') ?? url.searchParams.get('EDP_BILL_NO')
  if (order) {
    dest.searchParams.set('orderId', order)
  }
  return NextResponse.redirect(dest)
}
