'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CategoryWithCount } from '@/types'
import {
  dedupeCategoriesForNav,
  getMenuCategorySectionId,
  isSameCategoryNavSelection,
} from '@/lib/categoryNav.utils'
import { useI18n } from '@/i18n/I18nContext'
import { getCategoryDisplayName } from '@/i18n/getCategoryDisplayName'

const SCROLL_STEP_PX = 320

export interface CategoriesSectionProps {
  activeCategory?: string
  /** Գլխավորում — ընտրել կատեգորիան (օր. ֆիլտրի համաձայնեցում) */
  onSelectCategory?: (categoryName: string) => void
}

/**
 * Կատեգորիաների հորիզոնական տող — տեքստային պիլեր, սքրոլ սլաքերով
 */
export function CategoriesSection({
  activeCategory,
  onSelectCategory,
}: CategoriesSectionProps) {
  const { t, locale } = useI18n()
  const c = t.home.categories
  const ariaCategories = t.home.ariaCategories
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const navCategories = useMemo(() => dedupeCategoriesForNav(categories), [categories])

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

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const updateScrollButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      const max = scrollWidth - clientWidth
      setCanScrollLeft(scrollLeft > 1)
      setCanScrollRight(max > 1 && scrollLeft < max - 1)
    }

    updateScrollButtons()
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    const ro = new ResizeObserver(updateScrollButtons)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollButtons)
      ro.disconnect()
    }
  }, [navCategories.length])

  const scrollByDirection = (direction: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * SCROLL_STEP_PX, behavior: 'smooth' })
  }

  const navArrowClass =
    'shrink-0 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:pointer-events-none disabled:opacity-35'

  const navArrowEnabledClass =
    'border-orange-100/90 text-gray-700 hover:border-orange-200 hover:bg-orange-50/80 hover:text-orange-600 hover:shadow-md active:scale-95'

  if (loading) {
    return (
      <section
        className="w-full border-b border-orange-100/50 bg-gradient-to-b from-orange-50/70 via-white to-white"
        aria-label={ariaCategories}
      >
        <div className="flex w-full justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div
            className="h-10 w-10 animate-spin rounded-full border-[3px] border-orange-200 border-t-orange-500"
            aria-hidden
          />
        </div>
      </section>
    )
  }

  if (error || categories.length === 0) {
    return (
      <section
        className="w-full border-b border-orange-100/50 bg-gradient-to-b from-orange-50/70 via-white to-white"
        aria-label={ariaCategories}
      >
        <div className="w-full px-4 py-8 text-center text-gray-600 sm:px-6 lg:px-8">
          <p>{error ? c.loadError : c.empty}</p>
          <Link
            href="/products"
            className="mt-3 inline-block font-semibold text-orange-600 transition-colors hover:text-orange-700"
          >
            {c.goToMenu}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section
      className="w-full border-b border-orange-100/60 bg-gradient-to-b from-orange-50/80 via-white to-white shadow-[inset_0_-1px_0_0_rgba(238,49,36,0.06)]"
      aria-label={ariaCategories}
    >
      <div className="flex min-w-0 items-center gap-2 px-3 py-5 sm:gap-2.5 sm:px-5 lg:px-8">
        <button
          type="button"
          disabled={!canScrollLeft}
          onClick={() => scrollByDirection(-1)}
          className={`${navArrowClass} ${navArrowEnabledClass}`}
          aria-label={c.scrollPrev}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div
          ref={scrollRef}
          className="flex min-h-[60px] min-w-0 flex-1 snap-x snap-mandatory flex-nowrap gap-3 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] sm:min-h-[64px] sm:gap-3.5 md:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {navCategories.map((cat) => {
            const isActive = isSameCategoryNavSelection(activeCategory, cat.name)
            const label = getCategoryDisplayName(cat.name, locale)
            const menuHref = `/products#${getMenuCategorySectionId(cat.name)}`
            return (
              <Link
                key={cat.id}
                href={menuHref}
                onClick={() => onSelectCategory?.(cat.name)}
                className={`snap-start inline-flex shrink-0 items-center justify-center rounded-full px-6 py-3 text-base font-semibold tracking-tight transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 sm:px-7 sm:py-3.5 sm:text-lg ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 ring-1 ring-white/20'
                    : 'bg-white text-gray-900 shadow-sm ring-1 ring-orange-100/90 hover:-translate-y-0.5 hover:shadow-md hover:ring-orange-200/90 active:scale-[0.98] motion-reduce:hover:translate-y-0'
                }`}
              >
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          disabled={!canScrollRight}
          onClick={() => scrollByDirection(1)}
          className={`${navArrowClass} ${navArrowEnabledClass}`}
          aria-label={c.scrollNext}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </section>
  )
}
