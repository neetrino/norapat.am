import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@prisma/client'
import { getArcaConfig, arcaGetOrderStatus, ARCA_ORDER_STATUS } from '@/lib/payments/arca'

export const dynamic = 'force-dynamic'

const VALID_STATUSES: PaymentStatus[] = ['PENDING', 'PAID', 'FAILED']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: orderId } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { paymentStatus, autoCheck } = body as {
    paymentStatus?: string
    autoCheck?: boolean
  }

  // ── Auto-check mode ──────────────────────────────────────────────────────────
  if (autoCheck) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    let resolvedStatus: PaymentStatus

    if (order.paymentMethod === 'arca') {
      if (!order.arcaOrderId) {
        return NextResponse.json({ paymentStatus: order.paymentStatus })
      }
      try {
        const config = getArcaConfig()
        const result = await arcaGetOrderStatus({
          credentials: config.credentials,
          baseUrl: config.baseUrl,
          arcaOrderId: order.arcaOrderId,
        })
        const s = result.orderStatus
        if (s === ARCA_ORDER_STATUS.DEPOSITED) {
          resolvedStatus = 'PAID'
        } else if (
          s === ARCA_ORDER_STATUS.CANCELLED ||
          s === ARCA_ORDER_STATUS.REFUNDED ||
          s === ARCA_ORDER_STATUS.DECLINED
        ) {
          resolvedStatus = 'FAILED'
        } else {
          resolvedStatus = 'PENDING'
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Arca check failed'
        return NextResponse.json({ error: message }, { status: 502 })
      }
    } else if (order.paymentMethod === 'idram') {
      // Idram has no pull-status API — derive from stored transaction ID
      resolvedStatus = order.idramTransactionId ? 'PAID' : 'PENDING'
    } else {
      // Cash — no gateway to check, return current status as-is
      return NextResponse.json({ paymentStatus: order.paymentStatus })
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: resolvedStatus },
    })
    return NextResponse.json({ paymentStatus: updated.paymentStatus })
  }

  // ── Manual set mode ──────────────────────────────────────────────────────────
  if (!paymentStatus || !VALID_STATUSES.includes(paymentStatus as PaymentStatus)) {
    return NextResponse.json({ error: 'Invalid paymentStatus' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: paymentStatus as PaymentStatus },
  })
  return NextResponse.json({ paymentStatus: updated.paymentStatus })
}
