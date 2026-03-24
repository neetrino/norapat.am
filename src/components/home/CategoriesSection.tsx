'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { CategoryWithCount } from '@/types'
import { useI18n } from '@/i18n/I18nContext'
import { getCategoryDisplayName } from '@/i18n/getCategoryDisplayName'

const CATEGORY_ICONS: Record<string, string> = {
  // Russian (legacy)
  'Пиде': '🥟',
  'Комбо': '🍱',
  'Снэк': '🍟',
  'Соусы': '🥫',
  'Напитки': '🥤',
  // Armenian (актуальные имена из API)
  'Պիդե': '🥟',
  'Կոմբո': '🍱',
  'Սնաք': '🍟',
  'Սնեք': '🍟',
  'Սոուսներ': '🥫',
  'Ըմպելիքներ': '🥤',
}

const DEFAULT_ICON = '📂'

export interface CategoriesSectionProps {
  /** Եթե տրված է — կատեգորիայի սեղմումը կսահմանի ակտիվ կատեգորիան և կscroll անի products բլոկ */
  onSelectCategory?: (categoryName: string) => void
  /** ID էլեմենտի, որի վրա scroll անել (օր. products block) */
  productsSectionId?: string
}

/**
 * Կատեգորիաների ցուցադրման հատված — /api/categories, քարտեր, սեղմելով՝ filter կամ scroll.
 */
export function CategoriesSection({ onSelectCategory, productsSectionId = 'products-section' }: CategoriesSectionProps) {
  const { t, locale } = useI18n()
  const c = t.home.categories
  const ariaCategories = t.home.ariaCategories
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const handleCategoryClick = (name: string) => {
    onSelectCategory?.(name)
    if (productsSectionId) {
      const el = document.getElementById(productsSectionId)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-white" aria-label={ariaCategories}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">{c.title}</h2>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
          </div>
        </div>
      </section>
    )
  }

  if (error || categories.length === 0) {
    return (
      <section className="py-16 lg:py-20 bg-white" aria-label={ariaCategories}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">{c.title}</h2>
          <p className="text-center text-gray-500 py-8">
            {error ? c.loadError : c.empty}
          </p>
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-600"
            >
              {c.goToMenu} <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-20 bg-white" aria-label={ariaCategories}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{c.title}</h2>
          <p className="text-gray-600 max-w-xl mx-auto">{c.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => {
            const icon = CATEGORY_ICONS[cat.name] ?? DEFAULT_ICON
            const count = cat._count?.products ?? 0
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-left w-full"
              >
                <span className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform" aria-hidden>
                  {icon}
                </span>
                <span className="font-bold text-gray-900 text-base md:text-lg line-clamp-1">
                  {getCategoryDisplayName(cat.name, locale)}
                </span>
                {cat.description && (
                  <span className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</span>
                )}
                <span className="text-sm text-orange-600 font-semibold mt-2">
                  {c.itemsCount(count)}
                </span>
              </button>
            )
          })}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-600 transition-colors"
          >
            {c.viewAllMenu} <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
