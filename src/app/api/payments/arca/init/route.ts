import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import {
  getArcaConfig,
  arcaRegisterOrder,
  type ArcaPageView,
} from '@/lib/payments/arca'
import { arcaLogger } from '@/lib/payments/arca/arcaLogger'

export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  orderId: z.string().min(1),
  arcaInitSecret: z.string().min(1),
  language: z.enum(['hy', 'en', 'ru']).optional(),
  pageView: z.enum(['MOBILE', 'DESKTOP']).optional(),
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

function inferPageViewFromUserAgent(ua: string | null): ArcaPageView {
  if (!ua) return 'DESKTOP'
  const mobile = /Mobile|Android|iPhone|iPad|webOS/i.test(ua)
  return mobile ? 'MOBILE' : 'DESKTOP'
}

export async function POST(request: NextRequest) {
  try {
    const json: unknown = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { orderId, arcaInitSecret, language, pageView: bodyPageView } = parsed.data

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
    })

    if (!order || order.paymentMethod !== 'arca') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.arcaInitSecret || order.arcaInitSecret !== arcaInitSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (order.arcaOrderId) {
      return NextResponse.json({ error: 'Payment already initialized' }, { status: 409 })
    }

    const config = getArcaConfig()
    const baseUrl = getAppBaseUrl()

    const returnUrl =
      `${baseUrl}/api/payments/arca/return` +
      `?shopOrderId=${encodeURIComponent(order.id)}` +
      `&token=${encodeURIComponent(arcaInitSecret)}`

    const lang = language ?? 'en'
    const description = buildDescription(order)
    const pageView =
      bodyPageView ?? inferPageViewFromUserAgent(request.headers.get('user-agent'))

    const { arcaOrderId, formUrl } = await arcaRegisterOrder({
      credentials: config.credentials,
      baseUrl: config.baseUrl,
      orderNumber: order.id,
      amountAmd: order.total,
      returnUrl,
      description,
      language: lang,
      pageView,
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { arcaOrderId },
    })

    return NextResponse.json({ redirectUrl: formUrl })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Arca init failed'
    const notConfigured = message.startsWith('Arca is not configured')
    arcaLogger.error('init_failed', e)
    return NextResponse.json(
      {
        error: message,
        ...(notConfigured ? { code: 'ARCA_NOT_CONFIGURED' as const } : {}),
      },
      { status: notConfigured ? 503 : 500 }
    )
  }
}
