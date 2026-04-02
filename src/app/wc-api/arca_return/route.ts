import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { getArcaConfig, arcaGetOrderStatus, ARCA_ORDER_STATUS } from '@/lib/payments/arca'

export const dynamic = 'force-dynamic'

/**
 * Arca return URL — the user is redirected here by Arca after payment
 * (regardless of success or failure).
 *
 * Query params added by our own init route:
 *   orderId — our internal order ID
 *   token   — arcaInitSecret (one-time verification token)
 *
 * Flow:
 *  1. Verify orderId + token match the DB record
 *  2. Query Arca for order status using the stored arcaOrderId
 *  3. If DEPOSITED (2): mark order CONFIRMED, redirect to /order-success
 *  4. Otherwise: redirect to /payment/fail
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const origin = `${url.protocol}//${url.host}`
  const orderId = url.searchParams.get('orderId') ?? ''
  const token = url.searchParams.get('token') ?? ''

  const failRedirect = (reason = 'arca') => {
    const dest = new URL('/payment/fail', origin)
    dest.searchParams.set('reason', reason)
    if (orderId) dest.searchParams.set('orderId', orderId)
    return NextResponse.redirect(dest)
  }

  if (!orderId || !token) {
    console.warn('[arca_return] Missing orderId or token in query params')
    return failRedirect()
  }

  let order: {
    id: string
    arcaInitSecret: string | null
    arcaOrderId: string | null
    paymentMethod: string
    status: string
  } | null

  try {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        arcaInitSecret: true,
        arcaOrderId: true,
        paymentMethod: true,
        status: true,
      },
    })
  } catch (err) {
    console.error('[arca_return] DB lookup failed:', err)
    return failRedirect()
  }

  if (!order || order.paymentMethod !== 'arca') {
    console.warn('[arca_return] Order not found or wrong payment method:', orderId)
    return failRedirect()
  }

  // Verify the token to prevent unauthorized status spoofing
  if (!order.arcaInitSecret || order.arcaInitSecret !== token) {
    console.warn('[arca_return] Token mismatch for order:', orderId)
    return failRedirect()
  }

  if (!order.arcaOrderId) {
    // Arca order was never registered (shouldn't happen, but guard it)
    console.warn('[arca_return] No arcaOrderId stored for order:', orderId)
    return failRedirect()
  }

  // If already confirmed (e.g. user hit back and revisited), go straight to success
  if (order.status === 'CONFIRMED') {
    const dest = new URL('/order-success', origin)
    dest.searchParams.set('paid', '1')
    dest.searchParams.set('orderId', orderId)
    return NextResponse.redirect(dest)
  }

  // Query Arca for the real payment status
  let arcaStatus: number
  try {
    const config = getArcaConfig()
    const result = await arcaGetOrderStatus({
      credentials: config.credentials,
      baseUrl: config.baseUrl,
      arcaOrderId: order.arcaOrderId,
    })
    arcaStatus = result.orderStatus
    console.info(
      `[arca_return] orderId=${orderId} arcaOrderId=${order.arcaOrderId} ` +
        `arcaStatus=${arcaStatus} errorCode=${result.errorCode}`
    )
  } catch (err) {
    console.error('[arca_return] Failed to query Arca status:', err)
    // Cannot verify — redirect to fail page to avoid false confirmations
    return failRedirect()
  }

  // orderStatus === 2 means fully deposited (paid)
  if (arcaStatus === ARCA_ORDER_STATUS.DEPOSITED) {
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CONFIRMED',
          arcaInitSecret: null, // consume the one-time token
        },
      })
    } catch (err) {
      console.error('[arca_return] Failed to update order status:', err)
      // Payment is confirmed by Arca — still redirect to success, log the DB error
    }

    const dest = new URL('/order-success', origin)
    dest.searchParams.set('paid', '1')
    dest.searchParams.set('orderId', orderId)
    return NextResponse.redirect(dest)
  }

  // Any other status (declined, cancelled, pending, etc.) → fail
  return failRedirect()
}
