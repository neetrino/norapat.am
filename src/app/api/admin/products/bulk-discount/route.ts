import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type DiscountMode = 'PERCENT' | 'FIXED' | 'CLEAR'

function normalizeProductIds(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  return [...new Set(input.filter((item): item is string => typeof item === 'string' && item.trim().length > 0))]
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const productIds = normalizeProductIds(body.productIds)
    const mode: DiscountMode = ['PERCENT', 'FIXED', 'CLEAR'].includes(body.mode)
      ? body.mode
      : 'CLEAR'
    const amount = body.amount == null ? null : Number(body.amount)

    if (productIds.length === 0) {
      return NextResponse.json({ error: 'No products selected' }, { status: 400 })
    }

    if (mode !== 'CLEAR') {
      if (!Number.isFinite(amount)) {
        return NextResponse.json({ error: 'Discount amount is required' }, { status: 400 })
      }

      if (mode === 'PERCENT' && (amount <= 0 || amount >= 100)) {
        return NextResponse.json({ error: 'Percent must be between 0 and 100' }, { status: 400 })
      }

      if (mode === 'FIXED' && amount <= 0) {
        return NextResponse.json({ error: 'Fixed amount must be greater than 0' }, { status: 400 })
      }
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        price: true,
        originalPrice: true,
      },
    })

    if (products.length === 0) {
      return NextResponse.json({ error: 'Products not found' }, { status: 404 })
    }

    const operations = products.flatMap((product) => {
      const basePrice = product.originalPrice ?? product.price

      if (mode === 'CLEAR') {
        if (product.originalPrice == null) return []

        return prisma.product.update({
          where: { id: product.id },
          data: {
            price: product.originalPrice,
            originalPrice: null,
          },
          select: { id: true },
        })
      }

      const rawNextPrice =
        mode === 'PERCENT'
          ? basePrice * (1 - Number(amount) / 100)
          : basePrice - Number(amount)

      const nextPrice = Math.max(1, Math.round(rawNextPrice))

      if (nextPrice >= basePrice) {
        if (product.originalPrice == null) return []

        return prisma.product.update({
          where: { id: product.id },
          data: {
            price: basePrice,
            originalPrice: null,
          },
          select: { id: true },
        })
      }

      const shouldUpdate =
        product.price !== nextPrice || product.originalPrice !== basePrice

      if (!shouldUpdate) return []

      return prisma.product.update({
        where: { id: product.id },
        data: {
          price: nextPrice,
          originalPrice: basePrice,
        },
        select: { id: true },
      })
    })

    const updated = operations.length > 0 ? await prisma.$transaction(operations) : []

    return NextResponse.json({
      updatedCount: updated.length,
      matchedCount: products.length,
    })
  } catch (error) {
    console.error('Bulk discount update error:', error)
    return NextResponse.json(
      { error: 'Failed to update discounts' },
      { status: 500 }
    )
  }
}
