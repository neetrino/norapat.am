'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CategoryWithCount } from '@/types'
import { getCategoryNavImageSrc } from '@/constants/categoryNavImage.constants'
import { useI18n } from '@/i18n/I18nContext'
import { getCategoryDisplayName } from '@/i18n/getCategoryDisplayName'

const CATEGORY_NAV_ICON_PX = 32

const SCROLL_STEP_PX = 280

export interface CategoriesSectionProps {
  /** Ընտրված կատեգորիա (ընդգծման համար) */
  activeCategory?: string
  /** Եթե տրված է — կատեգորիայի սեղմումը կսահմանի ակտիվ կատեգորիան և կscroll անի products բլոկ */
  onSelectCategory?: (categoryName: string) => void
  /** ID էլեմենտի, որի վրա scroll անել (օր. products block) */
  productsSectionId?: string
}

/**
 * Կատեգորիաների հորիզոնական տող — նկար + տեքստ, սքրոլ սլաքերով, սեղմելով՝ filter կամ scroll.
 */
export function CategoriesSection({
  activeCategory,
  onSelectCategory,
  productsSectionId = 'products-section',
}: CategoriesSectionProps) {
  const { t, locale } = useI18n()
  const c = t.home.categories
  const ariaCategories = t.home.ariaCategories
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/categories', { signal: controller.signal, cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch categories')
        return res.json()
      })
      .then((data: CategoryWithCount[]) => {
        setCategories(Array.isArray(data) ? data : [])
        setError(null)
      })
      .catch((err) => {
        if (err.name !== 'AbortController') setError(err.message || 'Error')
        setCategories([])
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const scrollByDirection = (direction: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    const delta = direction * SCROLL_STEP_PX
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const handleCategoryClick = (name: string) => {
    onSelectCategory?.(name)
    if (productsSectionId) {
      const sectionEl = document.getElementById(productsSectionId)
      sectionEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-white py-6 border-b border-gray-100" aria-label={ariaCategories}>
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center py-6">
          <div
            className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"
            aria-hidden
          />
        </div>
      </section>
    )
  }

  if (error || categories.length === 0) {
    return (
      <section className="w-full bg-white py-6 border-b border-gray-100" aria-label={ariaCategories}>
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center text-gray-500 py-6">
          <p>{error ? c.loadError : c.empty}</p>
          <Link href="/products" className="inline-block mt-3 text-orange-500 font-semibold hover:text-orange-600">
            {c.goToMenu}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-white py-4 sm:py-5 border-b border-gray-100" aria-label={ariaCategories}>
      <div className="w-full flex items-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 min-w-0">
        <button
          type="button"
          onClick={() => scrollByDirection(-1)}
          className="shrink-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          aria-label={c.scrollPrev}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div
          ref={scrollRef}
          className="flex min-w-0 flex-1 flex-nowrap gap-3 sm:gap-4 md:gap-6 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name
            const label = getCategoryDisplayName(cat.name, locale)
            const iconSrc = getCategoryNavImageSrc(cat.name)
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm sm:text-base font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-[0.98]'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-8 sm:w-8 ${
                    isActive ? 'bg-white/20 ring-1 ring-white/40' : 'bg-white ring-1 ring-gray-200/80'
                  }`}
                >
                  <Image
                    src={iconSrc}
                    alt=""
                    width={CATEGORY_NAV_ICON_PX}
                    height={CATEGORY_NAV_ICON_PX}
                    className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                  />
                </span>
                <span className="whitespace-nowrap">{label}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollByDirection(1)}
          className="shrink-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          aria-label={c.scrollNext}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </section>
  )
}
