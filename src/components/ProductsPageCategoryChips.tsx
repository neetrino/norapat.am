'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import type { CategoryWithCount } from '@/types'
import { dedupeCategoriesForNav, isSameCategoryNavSelection } from '@/lib/categoryNav.utils'
import { getCategoryDisplayName } from '@/i18n/getCategoryDisplayName'
import type { AppLocale } from '@/i18n/types'

export interface ProductsPageCategoryChipsProps {
  categories: CategoryWithCount[]
  loading: boolean
  selectedCategoryName: string | null
  onSelectCategory: (name: string | null) => void
  allLabel: string
  locale: AppLocale
}

const pillClass = (active: boolean) =>
  `flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] motion-reduce:hover:scale-100 whitespace-nowrap shrink-0 ${
    active
      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
      : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
  }`

const pillStyle = (active: boolean) =>
  active
    ? {
        boxShadow:
          '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }
    : {}

/**
 * Կատեգորիայի ֆիլտրի պիլեր — «Բոլորը» + բոլոր ակտիվ կատեգորիաները
 */
export function ProductsPageCategoryChips({
  categories,
  loading,
  selectedCategoryName,
  onSelectCategory,
  allLabel,
  locale,
}: ProductsPageCategoryChipsProps) {
  const navCategories = useMemo(() => dedupeCategoriesForNav(categories), [categories])

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-3 lg:gap-4" aria-hidden>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-11 w-28 sm:h-12 sm:w-32 animate-pulse rounded-2xl bg-gray-200" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex max-h-[min(40vh,320px)] flex-wrap justify-center gap-3 overflow-y-auto lg:max-h-none lg:overflow-visible lg:gap-4">
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={pillClass(selectedCategoryName === null)}
        style={pillStyle(selectedCategoryName === null)}
      >
        {allLabel}
      </button>
      {navCategories.map((cat) => {
        const active =
          selectedCategoryName != null &&
          isSameCategoryNavSelection(selectedCategoryName, cat.name)
        const label = getCategoryDisplayName(cat.name, locale)
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className={pillClass(active)}
            style={pillStyle(active)}
          >
            {cat.image && (
              <div className="relative w-5 h-5 flex-shrink-0">
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="20px"
                  className="object-cover rounded-full"
                />
              </div>
            )}
            {label}
          </button>
        )
      })}
    </div>
  )
}
