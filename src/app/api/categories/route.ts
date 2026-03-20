import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories - получить все активные категории с количеством товаров
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        products: {
          some: {
            isAvailable: true
          }
        }
      },
      include: {
        _count: {
          select: { 
            products: {
              where: {
                isAvailable: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Добавляем кэширование на 5 минут
    const response = NextResponse.json(categories)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
