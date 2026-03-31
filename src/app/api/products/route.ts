import { NextRequest, NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { ProductStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { MENU_PRODUCTS_API_MAX_LIMIT } from '@/constants/menuPagination.constants'

const PRODUCT_STATUS_VALUES = new Set<string>(Object.values(ProductStatus))

// GET /api/products - ստանալ բոլոր ապրանքները
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const statusInParam = searchParams.get('statusIn')
    const idsParam = searchParams.get('ids')
    const sort = searchParams.get('sort') ?? 'newest'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const pageRaw = searchParams.get('page')
    const limitRaw = searchParams.get('limit')
    const limitParsed =
      limitRaw != null && limitRaw !== '' ? Number.parseInt(limitRaw, 10) : Number.NaN
    const pageParsed =
      pageRaw != null && pageRaw !== '' ? Number.parseInt(pageRaw, 10) : Number.NaN
    const usePagination =
      Number.isFinite(limitParsed) &&
      limitParsed > 0 &&
      limitParsed <= MENU_PRODUCTS_API_MAX_LIMIT
    const pageOneBased =
      Number.isFinite(pageParsed) && pageParsed >= 1 ? pageParsed : 1
    const skip = usePagination ? (pageOneBased - 1) * limitParsed : 0
    const take = usePagination ? limitParsed : undefined

    const whereClause: Prisma.ProductWhereInput = {}

    if (idsParam) {
      const ids = idsParam.split(',').map((s) => s.trim()).filter(Boolean)
      if (ids.length > 0) {
        whereClause.id = { in: ids }
      }
    } else {
      whereClause.isAvailable = true
    }

    if (category && category !== 'Բոլորը') {
      whereClause.category = {
        name: category
      }
    }

    if (statusInParam) {
      const parsed = statusInParam
        .split(',')
        .map((s) => s.trim())
        .filter((s): s is ProductStatus => PRODUCT_STATUS_VALUES.has(s))
      if (parsed.length > 0) {
        whereClause.status = { in: parsed }
      }
    } else if (status && PRODUCT_STATUS_VALUES.has(status)) {
      whereClause.status = status as ProductStatus
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

    const selectClause = {
      id: true,
      name: true,
      shortDescription: true,
      description: true,
      price: true,
      originalPrice: true,
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
    } as const

    if (usePagination) {
      const [total, items] = await Promise.all([
        prisma.product.count({ where: whereClause }),
        prisma.product.findMany({
          where: whereClause,
          orderBy,
          skip,
          take,
          select: selectClause
        })
      ])

      const response = NextResponse.json({
        items,
        total,
        page: pageOneBased,
        pageSize: limitParsed
      })
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
      response.headers.set('CDN-Cache-Control', 'public, s-maxage=60')
      return response
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
      select: selectClause
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
