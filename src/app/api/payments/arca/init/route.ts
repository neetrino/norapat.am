import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { getArcaConfig, arcaRegisterOrder } from '@/lib/payments/arca'

export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  orderId: z.string().min(1),
  arcaInitSecret: z.string().min(1),
  language: z.enum(['am', 'en', 'ru']).optional(),
})

function buildDescription(order: {
  items: { product: { name: string } }[]
}): string {
  const first = order.items[0]?.product.name ?? 'Order'
  const n = order.items.length
  return n > 1 ? `${first} (+${n - 1})` : first
}

function getAppBaseUrl(): string {
  const raw =
    process.env.APP_URL?.trim() ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  if (!raw) {
    throw new Error('APP_URL or NEXT_PUBLIC_APP_URL must be set for Arca callbacks')
  }
  return raw.replace(/\/$/, '')
}

export async function POST(request: NextRequest) {
  try {
    const json: unknown = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { orderId, arcaInitSecret, language } = parsed.data

    // Load order and verify it exists and belongs to Arca payment method
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
    })

    if (!order || order.paymentMethod !== 'arca') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify the one-time init secret (prevents unauthorized init calls)
    if (!order.arcaInitSecret || order.arcaInitSecret !== arcaInitSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Prevent re-initialization if Arca order ID already assigned
    if (order.arcaOrderId) {
      return NextResponse.json({ error: 'Payment already initialized' }, { status: 409 })
    }

    const config = getArcaConfig()
    const baseUrl = getAppBaseUrl()

    // Build the return URL — Arca redirects user here after payment (success or fail)
    // We include orderId and token so we can verify and check status on return
    const returnUrl =
      `${baseUrl}/wc-api/arca_return` +
      `?orderId=${encodeURIComponent(order.id)}` +
      `&token=${encodeURIComponent(arcaInitSecret)}`

    const lang = language ?? 'en'
    const description = buildDescription(order)

    const { arcaOrderId, formUrl } = await arcaRegisterOrder({
      credentials: config.credentials,
      baseUrl: config.baseUrl,
      orderNumber: order.id,
      amountAmd: order.total,
      returnUrl,
      description,
      language: lang,
    })

    // Persist Arca's internal order ID so we can query status later
    await prisma.order.update({
      where: { id: order.id },
      data: { arcaOrderId },
    })

    return NextResponse.json({ redirectUrl: formUrl })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Arca init failed'
    const notConfigured = message.startsWith('Arca is not configured')
    console.error('[arca/init]', message)
    return NextResponse.json(
      {
        error: message,
        ...(notConfigured ? { code: 'ARCA_NOT_CONFIGURED' as const } : {}),
      },
      { status: notConfigured ? 503 : 500 }
    )
  }
}
