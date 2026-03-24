import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const PROMO_LIMIT = 6

/**
 * GET /api/products/promo — ակցիաներ, զեղչեր, հատուկ առաջարկներ (02-FUNCTIONAL 1.4).
 * Returns products with status HIT or NEW, limit PROMO_LIMIT.
 */
export async function GET() {
  try {
    const whereClause: Prisma.ProductWhereInput = {
      isAvailable: true,
      status: { in: ['HIT', 'NEW'] },
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }],
      take: PROMO_LIMIT,
      select: {
        id: true,
        name: true,
        shortDescription: true,
        description: true,
        price: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        image: true,
        ingredients: true,
        isAvailable: true,
        status: true,
        createdAt: true,
      },
    })

    const response = NextResponse.json(products)
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch promo products' },
      { status: 500 }
    )
  }
}
