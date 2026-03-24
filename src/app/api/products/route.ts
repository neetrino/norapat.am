import { NextRequest, NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// GET /api/products - получить все товары
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const idsParam = searchParams.get('ids')
    const sort = searchParams.get('sort') ?? 'newest'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const whereClause: Prisma.ProductWhereInput = {}

    if (idsParam) {
      const ids = idsParam.split(',').map((s) => s.trim()).filter(Boolean)
      if (ids.length > 0) {
        whereClause.id = { in: ids }
      }
    } else {
      whereClause.isAvailable = true
    }

    if (category && category !== 'Все') {
      whereClause.category = {
        name: category
      }
    }

    if (status) {
      whereClause.status = status
    }

    if (search && !idsParam) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const minVal = minPrice != null && minPrice !== '' ? Number.parseFloat(minPrice) : null
    const maxVal = maxPrice != null && maxPrice !== '' ? Number.parseFloat(maxPrice) : null
    const hasMin = minVal != null && !Number.isNaN(minVal)
    const hasMax = maxVal != null && !Number.isNaN(maxVal)
    if (hasMin || hasMax) {
      whereClause.price = {
        ...(hasMin ? { gte: minVal } : {}),
        ...(hasMax ? { lte: maxVal } : {})
      } as Prisma.FloatFilter
    }

    type OrderOption = { price?: 'asc' | 'desc'; createdAt?: 'asc' | 'desc' }
    let orderBy: OrderOption | OrderOption[] = { createdAt: 'desc' }

    if (sort === 'price_asc') {
      orderBy = { price: 'asc' }
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' }
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' }
    } else if (sort === 'popular') {
      orderBy = { createdAt: 'desc' }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
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
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - создать товар (для админки)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoryId, ...productData } = body
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }
    
    const product = await prisma.product.create({
      data: {
        ...productData,
        categoryId,
        ingredients: productData.ingredients || []
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
