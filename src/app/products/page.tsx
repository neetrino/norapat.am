'use client'

import { useState, useEffect, useCallback, useRef, Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  ArrowDownUp,
  ChevronDown,
} from 'lucide-react'
import Image from 'next/image'
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
import { dedupeCategoriesForNav, isSameCategoryNavSelection } from '@/lib/categoryNav.utils'

function GridIcon({ cols }: { cols: 2 | 3 | 4 }) {
  const size = cols === 2 ? [1, 1] : cols === 3 ? [1, 1, 1] : [1, 1, 1, 1]
  return (
    <span
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: 12, height: 12 }}
    >
      {size.map((_, i) => (
        <span key={i} className="rounded-[1px] bg-current" />
      ))}
      {size.map((_, i) => (
        <span key={`b${i}`} className="rounded-[1px] bg-current" />
      ))}
    </span>
  )
}

function CategoryPromoImage({ className = '' }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.9rem] border border-[#ebe2dc] bg-[linear-gradient(180deg,#fff7f2_0%,#fffdfb_100%)] shadow-[0_14px_34px_rgba(15,23,42,0.05)] ${className}`}
    >
      <div className="flex items-center justify-center px-4 pb-2 pt-4">
        <div className="relative aspect-square w-full max-w-[196px]">
          <Image
            src="/menu-category-girl.webp"
            alt="Norapat menu mascot"
            fill
            sizes="(max-width: 1024px) 196px, 196px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}

function ProductsPageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[#eadfd9] bg-white/90 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] backdrop-blur sm:p-7">
          <div className="h-5 w-24 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-4 h-9 w-56 animate-pulse rounded-full bg-gray-100 sm:w-72" />
          <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:px-8 lg:gap-8">
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="rounded-[2rem] border border-[#eadfd9] bg-white/90 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="mb-4 h-5 w-28 animate-pulse rounded-full bg-gray-100" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-5">
          <div className="rounded-[2rem] border border-[#eadfd9] bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur sm:p-6">
            <div className="h-6 w-40 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-4 h-12 w-full animate-pulse rounded-[1.4rem] bg-gray-100" />
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="h-11 w-32 animate-pulse rounded-2xl bg-gray-100" />
              <div className="h-11 w-52 animate-pulse rounded-2xl bg-gray-100" />
              <div className="h-11 w-36 animate-pulse rounded-2xl bg-gray-100" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[2rem] border border-[#ede5df] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
              >
                <div className="h-48 animate-pulse bg-gray-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-5 w-3/4 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-gray-100" />
                  <div className="h-11 w-full animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(2)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [menuPage, setMenuPage] = useState(1)
  const [totalProductCount, setTotalProductCount] = useState(0)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist, isAuthenticated } = useWishlist()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const productGridTopRef = useRef<HTMLDivElement>(null)

  const navCategories = useMemo(() => dedupeCategoriesForNav(categories), [categories])

  const activeCategoryLabel = useMemo(() => {
    if (!selectedCategoryName) return productsCopy.allCategories
    return getCategoryDisplayName(selectedCategoryName, locale)
  }, [selectedCategoryName, locale, productsCopy.allCategories])

  const hasActiveFilters = useMemo(
    () =>
      selectedCategoryName !== null ||
      debouncedSearchQuery.trim().length > 0 ||
      minPrice.trim().length > 0 ||
      maxPrice.trim().length > 0 ||
      sortOrder !== 'newest',
    [selectedCategoryName, debouncedSearchQuery, minPrice, maxPrice, sortOrder]
  )

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategoryName) params.set('category', selectedCategoryName)
      if (debouncedSearchQuery) params.set('search', debouncedSearchQuery)
      params.set('sort', sortOrder)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      params.set('page', String(menuPage))
      params.set('limit', String(MENU_PRODUCTS_PAGE_SIZE))
      const response = await fetch(`/api/products?${params.toString()}`)
      const data: unknown = await response.json()
      const { items, total } = parseProductsListResponse(data)
      setFilteredProducts(items)
      setTotalProductCount(total)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategoryName, debouncedSearchQuery, sortOrder, minPrice, maxPrice, menuPage])

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/categories', { signal: controller.signal, cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then((data: CategoryWithCount[]) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false))
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
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (searchQuery !== debouncedSearchQuery) setSearching(true)
    searchTimeoutRef.current = setTimeout(() => {
      setMenuPage(1)
      setDebouncedSearchQuery(searchQuery)
      setSearching(false)
    }, 300)
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [searchQuery, debouncedSearchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (menuPage <= 1) return
    productGridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [menuPage])

  const totalPages = totalProductCount > 0 ? Math.ceil(totalProductCount / MENU_PRODUCTS_PAGE_SIZE) : 0

  useEffect(() => {
    if (totalPages === 0) {
      if (menuPage !== 1) setMenuPage(1)
      return
    }
    if (menuPage > totalPages) setMenuPage(totalPages)
  }, [totalPages, menuPage])

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product, 1)
      setAddedToCart((prev) => new Set(prev).add(product.id))
      setTimeout(() => {
        setAddedToCart((prev) => {
          const s = new Set(prev)
          s.delete(product.id)
          return s
        })
      }, 2000)
    },
    [addItem]
  )

  const selectCategory = useCallback((name: string | null) => {
    setMenuPage(1)
    setSelectedCategoryName(name)
  }, [])

  const handleToggleWishlist = useCallback(
    (productId: string) => {
      void toggleWishlist(productId)
    },
    [toggleWishlist]
  )

  if (loading) {
    return <ProductsPageLoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-slate-900">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-6 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:gap-8 lg:pt-6">
        <aside
          className="hidden w-64 shrink-0 lg:block"
          style={{
            position: 'sticky',
            top: 'calc(7.5rem + var(--top-bar-offset, 0px))',
            alignSelf: 'flex-start',
          }}
        >
          <div className="space-y-4">
            <CategoryPromoImage />

            <div className="rounded-[1.9rem] border border-[#ebe2dc] bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
              <div className="mb-3 border-b border-[#f3ebe6] px-2 pb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {productsCopy.categoryLabel}
                  </p>
                  <h2 className="mt-1.5 text-base font-black tracking-tight text-slate-900">
                    {productsCopy.allCategories}
                  </h2>
                </div>
              </div>

              <nav className="max-h-[calc(100vh-15rem-var(--top-bar-offset,0px))] space-y-1.5 overflow-y-auto pr-2 overscroll-contain [scrollbar-width:thin]">
              <button
                type="button"
                onClick={() => selectCategory(null)}
                className={`group flex w-full cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold transition-all duration-300 ${
                  selectedCategoryName === null
                    ? 'bg-[#ffd9df] text-[#E53225] shadow-[0_8px_20px_rgba(229,50,37,0.12)]'
                    : 'text-slate-600 hover:bg-[#fff5f3] hover:text-slate-900'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[15px] transition-all ${
                    selectedCategoryName === null
                      ? 'bg-white text-[#E53225]'
                      : 'bg-[#faf5f2] text-slate-500 group-hover:bg-white'
                  }`}
                >
                  🍽️
                </span>
                <span className="min-w-0 flex-1 truncate text-left text-sm font-bold">
                  {productsCopy.allCategories}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    selectedCategoryName === null
                      ? 'bg-white text-[#E53225]'
                      : 'bg-[#f7f2ee] text-slate-400'
                  }`}
                >
                  {navCategories.length + 1}
                </span>
              </button>

              {categoriesLoading
                ? [1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-2xl bg-gray-100" />
                  ))
                : navCategories.map((cat) => {
                    const active =
                      selectedCategoryName != null &&
                      isSameCategoryNavSelection(selectedCategoryName, cat.name)
                    const label = getCategoryDisplayName(cat.name, locale)

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => selectCategory(cat.name)}
                        className={`group flex w-full cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold transition-all duration-300 ${
                          active
                            ? 'bg-[#ffd9df] text-[#E53225] shadow-[0_8px_20px_rgba(229,50,37,0.12)]'
                            : 'text-slate-600 hover:bg-[#fff5f3] hover:text-slate-900'
                        }`}
                      >
                        {cat.image ? (
                          <div
                            className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-inset ${
                              active ? 'bg-white ring-[#ffd5cc]' : 'bg-[#faf5f2] ring-[#efe4dd]'
                            }`}
                          >
                            <Image src={cat.image} alt="" fill sizes="32px" className="object-cover" />
                          </div>
                        ) : (
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-[15px] ${
                              active ? 'bg-white text-[#E53225]' : 'bg-[#faf5f2] text-slate-500'
                            }`}
                          >
                            🍽️
                          </span>
                        )}
                          <span className="min-w-0 flex-1 truncate text-left text-[13px] font-semibold">
                            {label}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              active
                                ? 'bg-white text-[#E53225]'
                                : 'bg-[#f7f2ee] text-slate-400 group-hover:bg-white'
                          }`}
                        >
                          {cat._count.products}
                        </span>
                      </button>
                    )
                  })}
              </nav>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-20 pt-1 lg:pb-8">
          <section className="mb-5 overflow-hidden rounded-[2rem] border border-[#eadfd9] bg-white/90 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="space-y-4 px-5 py-5 sm:px-6">
              <div className="relative">
                <Search
                  className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    searching ? 'animate-pulse text-[#E53225]' : 'text-slate-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder={searchCopy.productsPage}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-[1.4rem] border border-[#eadfd9] bg-[#fcfaf8] py-3.5 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-[#e3d2ca] hover:bg-white focus:border-[#E53225] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#E53225]/10"
                />
                {searching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[#E53225]" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative flex items-center">
                    <ArrowDownUp className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
                    <select
                      value={sortOrder}
                      onChange={(e) => {
                        setMenuPage(1)
                        setSortOrder(e.target.value)
                      }}
                      className="cursor-pointer appearance-none rounded-2xl border border-[#eadfd9] bg-white py-3 pl-9 pr-9 text-xs font-semibold text-slate-700 shadow-sm transition-colors focus:border-[#E53225] focus:outline-none focus:ring-4 focus:ring-[#E53225]/10"
                    >
                      <option value="newest">{productsCopy.sortNewest}</option>
                      <option value="price_asc">{productsCopy.sortPriceAsc}</option>
                      <option value="price_desc">{productsCopy.sortPriceDesc}</option>
                      <option value="popular">{productsCopy.sortPopular}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 h-3 w-3 text-slate-400" />
                  </div>

                  <span className="hidden h-8 w-px bg-[#efe2db] md:block" />

                  <div className="flex items-center gap-2 rounded-2xl border border-[#eadfd9] bg-[#fcfaf8] p-1.5 shadow-sm">
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
                      className="w-24 rounded-xl border border-transparent bg-white px-3 py-2.5 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#E53225] focus:outline-none focus:ring-2 focus:ring-[#E53225]/10"
                    />
                    <span className="select-none text-sm text-slate-300">—</span>
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
                      className="w-24 rounded-xl border border-transparent bg-white px-3 py-2.5 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#E53225] focus:outline-none focus:ring-2 focus:ring-[#E53225]/10"
                    />
                    <span className="pr-1 text-xs font-semibold text-slate-400">֏</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 rounded-2xl border border-[#eadfd9] bg-[#fcfaf8] px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-1 rounded-full bg-white p-1">
                    {([2, 3, 4] as const).map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => setGridCols(cols)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                          gridCols === cols
                            ? 'bg-[#E53225] text-white shadow-[0_10px_20px_rgba(229,50,37,0.25)]'
                            : 'text-slate-500 hover:bg-[#fff3ec]'
                        }`}
                        aria-label={`${cols} columns`}
                      >
                        <GridIcon cols={cols} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-5 lg:hidden">
            <CategoryPromoImage className="mx-auto max-w-sm" />
          </div>

          <div className="mb-5 lg:hidden">
            <ProductsPageCategoryChips
              categories={categories}
              loading={categoriesLoading}
              selectedCategoryName={selectedCategoryName}
              onSelectCategory={selectCategory}
              allLabel={productsCopy.allCategories}
              locale={locale}
            />
          </div>

          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {productsCopy.categoryLabel}
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {activeCategoryLabel}
              </h2>
            </div>
            <div className="rounded-full border border-[#eadfd9] bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              {totalProductCount}
            </div>
          </div>

          <div ref={productGridTopRef} className="scroll-mt-28" aria-hidden />

          <div
            className={
              gridCols === 2
                ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6'
                : gridCols === 3
                  ? 'grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:gap-4'
                  : 'grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4'
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                variant={gridCols === 2 ? 'horizontal' : gridCols === 3 ? 'default' : 'compact'}
                addedToCart={addedToCart}
                isInWishlist={isAuthenticated ? isInWishlist(product.id) : false}
                onToggleWishlist={isAuthenticated ? handleToggleWishlist : undefined}
              />
            ))}
          </div>

          {totalPages > 1 && (
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
            <div className="rounded-[2rem] border border-dashed border-[#e7d9d1] bg-white/90 px-6 py-14 text-center shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle,#fff3ec_0%,#ffe8de_100%)] text-4xl shadow-inner">
                🍽️
              </div>
              {debouncedSearchQuery ? (
                <>
                  <h3 className="mb-2 text-xl font-black tracking-tight text-slate-900">
                    {productsCopy.searchNoResultsTitle(debouncedSearchQuery)}
                  </h3>
                  <p className="mx-auto mb-6 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                    {productsCopy.searchNoResultsHint}
                  </p>
                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuPage(1)
                        setSearchQuery('')
                        setDebouncedSearchQuery('')
                      }}
                      className="rounded-full border border-[#e6d9d2] bg-[#fcfaf8] px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
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
                      className="rounded-full bg-[#E53225] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(229,50,37,0.18)] transition-colors hover:bg-[#a51d1d]"
                    >
                      {productsCopy.showAllProducts}
                    </button>
                  </div>
                </>
              ) : selectedCategoryName ? (
                <>
                  <p className="mx-auto max-w-md text-base leading-7 text-slate-500">
                    {productsCopy.categoryEmpty(getCategoryDisplayName(selectedCategoryName, locale))}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{productsCopy.tryAnotherCategory}</p>
                </>
              ) : (
                <p className="mx-auto max-w-md text-base leading-7 text-slate-500">
                  {productsCopy.catalogEmpty}
                </p>
              )}
            </div>
          )}
        </main>
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
      <div className="h-16 lg:hidden" />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageLoadingSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  )
}
