import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Idram SUCCESS_URL — user redirect after successful payment.
 */
export function GET(request: NextRequest) {
  const url = new URL(request.url)
  const order =
    url.searchParams.get('order_number') ??
    url.searchParams.get('EDP_BILL_NO') ??
    ''
  const dest = new URL('/order-success', `${url.protocol}//${url.host}`)
  dest.searchParams.set('paid', '1')
  if (order) {
    dest.searchParams.set('orderId', order)
  }
  return NextResponse.redirect(dest)
}
