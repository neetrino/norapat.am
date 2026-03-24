import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildIdramPaymentParams, getIdramPaymentUrl, isIdramConfigured } from '@/lib/idram'
import type { OrderItemForm } from '@/types'

export async function POST(request: NextRequest) {
  try {
    if (!isIdramConfigured()) {
      return NextResponse.json(
        { error: 'Idram payment is not configured. Add IDRAM_EDP_REC_ACCOUNT and IDRAM_SECRET_KEY to .env' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    const body = await request.json()
    const {
      name,
      phone,
      address,
      notes,
      items,
      total,
      deliveryTime,
      promoCode,
      email
    } = body

    const orderItems = (items ?? []) as OrderItemForm[]

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    const productIds = orderItems.map((item: OrderItemForm) => item.productId)
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    })
    const missingProducts = productIds.filter(
      (id: string) => !existingProducts.some((p) => p.id === id)
    )
    if (missingProducts.length > 0) {
      return NextResponse.json(
        { error: `Products not found: ${missingProducts.join(', ')}` },
        { status: 400 }
      )
    }

    if (promoCode && typeof promoCode === 'string') {
      await prisma.promoCode.updateMany({
        where: { code: promoCode.trim().toUpperCase(), isActive: true },
        data: { usedCount: { increment: 1 } }
      })
    }

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        name: name || 'Guest Customer',
        status: 'PENDING',
        total: Number(total),
        address: address || '',
        phone: phone || '',
        notes: notes || null,
        paymentMethod: 'idram',
        deliveryTime: deliveryTime || 'asap',
        items: {
          create: orderItems.map((item: OrderItemForm) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const paymentParams = buildIdramPaymentParams({
      billNo: order.id,
      amount: order.total,
      email: email || session?.user?.email || undefined,
      description: `Պատվեր #${order.id.slice(-8)}`,
      language: 'AM',
      successUrl: `${baseUrl}/payment/success?orderId=${order.id}`,
      failUrl: `${baseUrl}/payment/fail?orderId=${order.id}`
    })

    return NextResponse.json({
      orderId: order.id,
      paymentUrl: getIdramPaymentUrl(),
      paymentParams
    })
  } catch (error) {
    console.error('Idram init error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
