'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, ArrowDownUp, SlidersHorizontal } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { Product, type CategoryWithCount } from '@/types'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { ProductsPageCategoryChips } from '@/components/ProductsPageCategoryChips'
import { ProductsPagePagination } from '@/components/ProductsPagePagination'
import { useI18n } from '@/i18n/I18nContext'
import { getCategoryDisplayName } from '@/i18n/getCategoryDisplayName'
import { MENU_PRODUCTS_PAGE_SIZE } from '@/constants/menuPagination.constants'
import { parseProductsListResponse } from '@/lib/parseProductsListResponse'

function ProductsPageContent() {
  const { t, locale } = useI18n()
  const productsCopy = t.products
  const searchCopy = t.search
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<string>('newest')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [menuPage, setMenuPage] = useState(1)
  const [totalProductCount, setTotalProductCount] = useState(0)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist } = useWishlist()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const productGridTopRef = useRef<HTMLDivElement>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategoryName) {
        params.set('category', selectedCategoryName)
      }
      if (debouncedSearchQuery) params.set('search', debouncedSearchQuery)
      params.set('sort', sortOrder)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      params.set('page', String(menuPage))
      params.set('limit', String(MENU_PRODUCTS_PAGE_SIZE))
      const url = `/api/products?${params.toString()}`
      const response = await fetch(url)
      const data: unknown = await response.json()
      const { items, total } = parseProductsListResponse(data)
      setFilteredProducts(items)
      setTotalProductCount(total)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [
    selectedCategoryName,
    debouncedSearchQuery,
    sortOrder,
    minPrice,
    maxPrice,
    menuPage,
  ])

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/categories', { signal: controller.signal, cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch categories')
        return res.json()
      })
      .then((data: CategoryWithCount[]) => {
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setCategories([])
      })
      .finally(() => {
        setCategoriesLoading(false)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearchQuery(searchParam)
      setDebouncedSearchQuery(searchParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery !== debouncedSearchQuery) {
      setSearching(true)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setMenuPage(1)
      setDebouncedSearchQuery(searchQuery)
      setSearching(false)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, debouncedSearchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (menuPage <= 1) return
    productGridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [menuPage])

  const totalPages =
    totalProductCount > 0 ? Math.ceil(totalProductCount / MENU_PRODUCTS_PAGE_SIZE) : 0

  useEffect(() => {
    if (totalPages === 0) {
      if (menuPage !== 1) setMenuPage(1)
      return
    }
    if (menuPage > totalPages) {
      setMenuPage(totalPages)
    }
  }, [totalPages, menuPage])

  const showPagination = totalPages > 1

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1)
    setAddedToCart((prev) => new Set(prev).add(product.id))

    setTimeout(() => {
      setAddedToCart((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }, [addItem])

  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-56 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-12 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded mx-auto mb-4 w-64 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto w-96 animate-pulse"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="flex flex-wrap justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-11 w-24 sm:h-12 sm:w-28 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <Footer />
        </div>
        <div className="lg:hidden h-16"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-visible">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 lg:w-80 relative">
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  searching ? 'text-orange-500 animate-pulse' : 'text-gray-500'
                }`}
              />
              <input
                type="text"
                placeholder={searchCopy.productsPage}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-gray-900 placeholder-gray-500 bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md focus:bg-white"
              />
              {searching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-5 w-5 text-gray-500" />
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setMenuPage(1)
                    setSortOrder(e.target.value)
                  }}
                  className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-gray-900 font-medium"
                >
                  <option value="newest">{productsCopy.sortNewest}</option>
                  <option value="price_asc">{productsCopy.sortPriceAsc}</option>
                  <option value="price_desc">{productsCopy.sortPriceDesc}</option>
                  <option value="popular">{productsCopy.sortPopular}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-gray-500" />
                <input
                  type="number"
                  placeholder={productsCopy.priceFrom}
                  value={minPrice}
                  onChange={(e) => {
                    setMenuPage(1)
                    setMinPrice(e.target.value)
                  }}
                  min={0}
                  step={100}
                  className="w-24 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-gray-900"
                />
                <span className="text-gray-500">—</span>
                <input
                  type="number"
                  placeholder={productsCopy.priceTo}
                  value={maxPrice}
                  onChange={(e) => {
                    setMenuPage(1)
                    setMaxPrice(e.target.value)
                  }}
                  min={0}
                  step={100}
                  className="w-24 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-gray-900"
                />
                <span className="text-gray-600 text-sm">֏</span>
              </div>
            </div>
          </div>

          <ProductsPageCategoryChips
            categories={categories}
            loading={categoriesLoading}
            selectedCategoryName={selectedCategoryName}
            onSelectCategory={(name) => {
              setMenuPage(1)
              setSelectedCategoryName(name)
            }}
            allLabel={productsCopy.allCategories}
            locale={locale}
          />
        </div>

        <div ref={productGridTopRef} className="scroll-mt-28 md:scroll-mt-32" aria-hidden />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16 md:gap-12 overflow-visible mt-24">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              variant="compact"
              addedToCart={addedToCart}
              isInWishlist={isInWishlist(product.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>

        {showPagination && (
          <ProductsPagePagination
            currentPage={menuPage}
            totalPages={totalPages}
            onPageChange={setMenuPage}
            prevLabel={productsCopy.paginationPrev}
            nextLabel={productsCopy.paginationNext}
            navAriaLabel={productsCopy.paginationAria(menuPage, totalPages)}
            pageNumberAriaLabel={productsCopy.paginationGoToPage}
          />
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            {debouncedSearchQuery ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {productsCopy.searchNoResultsTitle(debouncedSearchQuery)}
                </h3>
                <p className="text-gray-600 mb-6">
                  {productsCopy.searchNoResultsHint}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuPage(1)
                      setSearchQuery('')
                      setDebouncedSearchQuery('')
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                  >
                    {productsCopy.clearSearch}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuPage(1)
                      setSelectedCategoryName(null)
                      setSearchQuery('')
                      setDebouncedSearchQuery('')
                    }}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    {productsCopy.showAllProducts}
                  </button>
                </div>
              </>
            ) : (
              <>
                {selectedCategoryName ? (
                  <>
                    <p className="text-gray-500 text-lg max-w-lg mx-auto">
                      {productsCopy.categoryEmpty(
                        getCategoryDisplayName(selectedCategoryName, locale)
                      )}
                    </p>
                    <p className="text-gray-400 mt-2">
                      {productsCopy.tryAnotherCategory}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 text-lg max-w-lg mx-auto">
                    {productsCopy.catalogEmpty}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>

      <div className="lg:hidden h-16"></div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white overflow-visible">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 rounded mx-auto mb-4 w-64 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded mx-auto w-96 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse"
                >
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      <div className="h-12 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <Footer />
          </div>
          <div className="lg:hidden h-16"></div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  )
}
