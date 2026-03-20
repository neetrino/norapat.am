import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/featured - получить товары-хиты
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // HIT, NEW, CLASSIC

    const whereClause: any = {
      isAvailable: true
    }

    if (status) {
      whereClause.status = status
    } else {
      // Если статус не указан, возвращаем все товары с особыми статусами (кроме BANNER)
      whereClause.status = {
        in: ['HIT', 'NEW', 'CLASSIC']
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: [
        { createdAt: 'desc' }
      ],
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
    const response = NextResponse.json(products)
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    
    return response
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    )
  }
}
