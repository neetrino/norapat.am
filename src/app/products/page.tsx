import type { Prisma } from '@prisma/client'
import { MENU_PRODUCTS_PAGE_SIZE } from '@/constants/menuPagination.constants'
import ProductsPageClient from '@/components/ProductsPageClient'
import { prisma } from '@/lib/prisma'
import type { CategoryWithCount, ProductWithCategory } from '@/types'

export const dynamic = 'force-dynamic'

const PRODUCT_SELECT = {
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
      isActive: true,
    },
  },
  image: true,
  ingredients: true,
  isAvailable: true,
  status: true,
  createdAt: true,
} as const

type ProductsSearchParams = {
  category?: string | string[]
  search?: string | string[]
  page?: string | string[]
  sort?: string | string[]
  minPrice?: string | string[]
  maxPrice?: string | string[]
}

function getSingleParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

async function fetchProductsPageData(searchParams: ProductsSearchParams) {
  const category = getSingleParam(searchParams.category) ?? null
  const search = getSingleParam(searchParams.search) ?? ''
  const sort = getSingleParam(searchParams.sort) ?? 'newest'
  const minPrice = getSingleParam(searchParams.minPrice) ?? ''
  const maxPrice = getSingleParam(searchParams.maxPrice) ?? ''
  const pageRaw = getSingleParam(searchParams.page)
  const pageNumber = pageRaw ? Number.parseInt(pageRaw, 10) : 1
  const currentPage = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1

  const whereClause: Prisma.ProductWhereInput = {
    isAvailable: true,
  }

  if (category && category !== 'Բոլորը') {
    whereClause.category = { name: category }
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  const minVal = minPrice ? Number.parseFloat(minPrice) : Number.NaN
  const maxVal = maxPrice ? Number.parseFloat(maxPrice) : Number.NaN
  if (!Number.isNaN(minVal) || !Number.isNaN(maxVal)) {
    whereClause.price = {
      ...(!Number.isNaN(minVal) ? { gte: minVal } : {}),
      ...(!Number.isNaN(maxVal) ? { lte: maxVal } : {}),
    } as Prisma.FloatFilter
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = {
    createdAt: 'desc',
  }

  if (sort === 'price_asc') {
    orderBy = { price: 'asc' }
  } else if (sort === 'price_desc') {
    orderBy = { price: 'desc' }
  }

  const skip = (currentPage - 1) * MENU_PRODUCTS_PAGE_SIZE

  const [categories, total, items] = await Promise.all([
    prisma.category.findMany({
      where: {
        isActive: true,
        products: {
          some: {
            isAvailable: true,
          },
        },
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isAvailable: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.product.count({ where: whereClause }),
    prisma.product.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: MENU_PRODUCTS_PAGE_SIZE,
      select: PRODUCT_SELECT,
    }),
  ])

  return {
    categories: categories as CategoryWithCount[],
    items: items as unknown as ProductWithCategory[],
    total,
    currentPage,
    search,
    category,
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: ProductsSearchParams
}) {
  let initialProducts: ProductWithCategory[] | undefined
  let initialCategories: CategoryWithCount[] | undefined
  let initialTotalProductCount: number | undefined
  let initialSearchQuery = ''
  let initialSelectedCategoryName: string | null = null
  let initialMenuPage = 1

  try {
    const data = await fetchProductsPageData(searchParams ?? {})
    initialProducts = data.items
    initialCategories = data.categories
    initialTotalProductCount = data.total
    initialSearchQuery = data.search
    initialSelectedCategoryName = data.category
    initialMenuPage = data.currentPage
  } catch (error) {
    console.error('[ProductsPage SSR] Failed to fetch initial data:', error)
  }

  return (
    <ProductsPageClient
      initialProducts={initialProducts}
      initialCategories={initialCategories}
      initialTotalProductCount={initialTotalProductCount}
      initialSearchQuery={initialSearchQuery}
      initialSelectedCategoryName={initialSelectedCategoryName}
      initialMenuPage={initialMenuPage}
    />
  )
}
