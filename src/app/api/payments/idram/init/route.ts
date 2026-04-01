import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import {
  IDRAM_GET_PAYMENT_URL,
  buildIdramFormFields,
  getIdramCredentials,
} from '@/lib/payments/idram'
import type { IdramLanguageCode } from '@/lib/payments/idram/buildIdramFormFields'

export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  orderId: z.string().min(1),
  idramInitSecret: z.string().min(1),
  language: z.enum(['EN', 'AM', 'RU']).optional(),
})

function buildDescription(order: {
  items: { product: { name: string } }[]
}): string {
  const first = order.items[0]?.product.name ?? 'Order'
  const n = order.items.length
  return n > 1 ? `${first} (+${n - 1})` : first
}

export async function POST(request: NextRequest) {
  try {
    const json: unknown = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const { orderId, idramInitSecret, language } = parsed.data

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
    })

    if (!order || order.paymentMethod !== 'idram') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.idramInitSecret || order.idramInitSecret !== idramInitSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (order.idramTransactionId) {
      return NextResponse.json({ error: 'Already paid' }, { status: 409 })
    }

    const credentials = getIdramCredentials()
    const lang: IdramLanguageCode = language ?? 'EN'
    const formFields = buildIdramFormFields({
      credentials,
      orderId: order.id,
      orderTotal: order.total,
      description: buildDescription(order),
      language: lang,
      customerEmail: null,
    })

    const formFieldsWithReturn = {
      ...formFields,
      order_number: order.id,
    }

    return NextResponse.json({
      formAction: IDRAM_GET_PAYMENT_URL,
      formFields: formFieldsWithReturn,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Init failed'
    const notConfigured = message.startsWith('Idram is not configured')
    return NextResponse.json(
      {
        error: message,
        ...(notConfigured ? { code: 'IDRAM_NOT_CONFIGURED' as const } : {}),
      },
      { status: notConfigured ? 503 : 500 }
    )
  }
}
