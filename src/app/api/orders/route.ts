import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { OrderItemForm } from '@/types'

const ALLOWED_PAYMENT_METHODS = new Set(['cash', 'idram', 'arca'])

function stripPaymentSecrets<
  T extends { idramInitSecret?: string | null; arcaInitSecret?: string | null }
>(row: T): Omit<T, 'idramInitSecret' | 'arcaInitSecret'> {
  const { idramInitSecret, arcaInitSecret, ...rest } = row
  void idramInitSecret
  void arcaInitSecret
  return rest
}

export async function GET(request: NextRequest) {
  void request
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders.map(stripPaymentSecrets))
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { name, phone, address, paymentMethod, notes, items, total, deliveryTime, promoCode } =
      await request.json()

    if (
      typeof paymentMethod !== 'string' ||
      !ALLOWED_PAYMENT_METHODS.has(paymentMethod)
    ) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    const orderItems = (items ?? []) as OrderItemForm[]

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    const productIds = orderItems.map((item) => item.productId)
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    })
    const missingProducts = productIds.filter(
      (id) => !existingProducts.some((p) => p.id === id)
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

    const idramInitSecret =
      paymentMethod === 'idram' ? randomBytes(24).toString('hex') : null

    const arcaInitSecret =
      paymentMethod === 'arca' ? randomBytes(24).toString('hex') : null

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id || null,
        name: name || 'Guest Customer',
        status: 'PENDING',
        total,
        address,
        phone,
        notes,
        paymentMethod,
        deliveryTime,
        ...(paymentMethod === 'idram' ? { paymentStatus: 'PENDING' as const } : {}),
        idramInitSecret,
        arcaInitSecret,
        items: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
