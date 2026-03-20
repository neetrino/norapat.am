import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/banner - получить товар для баннера
export async function GET(request: NextRequest) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        isAvailable: true,
        status: 'BANNER'
      },
      orderBy: {
        createdAt: 'desc' // Берем самый новый товар с статусом BANNER
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        },
        image: true,
        ingredients: true,
        isAvailable: true,
        status: true,
        createdAt: true
      }
    })

    // Улучшенное кэширование на 1 час
    const response = NextResponse.json(product)
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    
    return response
  } catch (error) {
    console.error('Error fetching banner product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banner product' },
      { status: 500 }
    )
  }
}
