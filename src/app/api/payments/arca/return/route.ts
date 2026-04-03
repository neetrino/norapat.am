import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import {
  getArcaConfig,
  arcaGetOrderStatusWithAcsRetry,
  ARCA_ORDER_STATUS,
} from '@/lib/payments/arca'
import { arcaLogger } from '@/lib/payments/arca/arcaLogger'

export const dynamic = 'force-dynamic'

const SHOP_ORDER_PARAM = 'shopOrderId'
const TOKEN_PARAM = 'token'
/** One retry after transient network failure */
const NETWORK_RETRY_DELAY_MS = 1_000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Arca return URL — browser redirect after payment (Merchant Manual: returnUrl).
 * Query: shopOrderId (our order id), token (arcaInitSecret).
 * Uses shopOrderId so Arca’s own orderId on the query string cannot collide.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const origin = `${url.protocol}//${url.host}`
  const shopOrderId = url.searchParams.get(SHOP_ORDER_PARAM) ?? ''
  const token = url.searchParams.get(TOKEN_PARAM) ?? ''

  const failRedirect = (reason = 'arca') => {
    const dest = new URL('/payment/fail', origin)
    dest.searchParams.set('reason', reason)
    if (shopOrderId) dest.searchParams.set('orderId', shopOrderId)
    return NextResponse.redirect(dest)
  }

  const successRedirect = () => {
    const dest = new URL('/order-success', origin)
    dest.searchParams.set('paid', '1')
    dest.searchParams.set('orderId', shopOrderId)
    return NextResponse.redirect(dest)
  }

  if (!shopOrderId || !token) {
    arcaLogger.warn('return_missing_query', { shopOrderId: shopOrderId || undefined })
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
      where: { id: shopOrderId },
      select: {
        id: true,
        arcaInitSecret: true,
        arcaOrderId: true,
        paymentMethod: true,
        status: true,
      },
    })
  } catch (err) {
    arcaLogger.error('return_db_lookup_failed', err, { shopOrderId })
    return failRedirect()
  }

  if (!order || order.paymentMethod !== 'arca') {
    arcaLogger.warn('return_order_not_found_or_method', { shopOrderId })
    return failRedirect()
  }

  if (order.status === 'CONFIRMED') {
    return successRedirect()
  }

  if (!order.arcaInitSecret || order.arcaInitSecret !== token) {
    arcaLogger.warn('return_token_mismatch', { shopOrderId })
    return failRedirect()
  }

  if (!order.arcaOrderId) {
    arcaLogger.warn('return_missing_arca_order_id', { shopOrderId })
    return failRedirect()
  }

  const config = getArcaConfig()
  const statusParams = {
    credentials: config.credentials,
    baseUrl: config.baseUrl,
    arcaOrderId: order.arcaOrderId,
  }

  let arcaStatus: number
  let errorCode: number
  try {
    let result = await arcaGetOrderStatusWithAcsRetry(statusParams)
    arcaStatus = result.orderStatus
    errorCode = result.errorCode
    arcaLogger.info('return_status', {
      shopOrderId,
      arcaOrderId: order.arcaOrderId,
      arcaStatus,
      errorCode,
    })
  } catch (err) {
    arcaLogger.warn('return_status_first_attempt_failed', {
      shopOrderId,
      error: err instanceof Error ? err.message : String(err),
    })
    try {
      await sleep(NETWORK_RETRY_DELAY_MS)
      const result = await arcaGetOrderStatusWithAcsRetry(statusParams)
      arcaStatus = result.orderStatus
      errorCode = result.errorCode
      arcaLogger.info('return_status_after_retry', {
        shopOrderId,
        arcaOrderId: order.arcaOrderId,
        arcaStatus,
        errorCode,
      })
    } catch (err2) {
      arcaLogger.error('return_status_failed', err2, { shopOrderId })
      return failRedirect()
    }
  }

  if (arcaStatus === ARCA_ORDER_STATUS.DEPOSITED) {
    try {
      await prisma.order.update({
        where: { id: shopOrderId },
        data: {
          status: 'CONFIRMED',
          arcaInitSecret: null,
        },
      })
    } catch (err) {
      arcaLogger.error('return_confirm_db_failed', err, { shopOrderId })
    }
    return successRedirect()
  }

  if (arcaStatus === ARCA_ORDER_STATUS.ACS_AUTH) {
    return failRedirect('arca_pending')
  }

  return failRedirect()
}
