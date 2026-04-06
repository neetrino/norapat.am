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

/** Selected chip: neutral surface — no peach/red gradient (reads as “hover” on mobile). */
const pillClass = (active: boolean) =>
  `cursor-pointer group inline-flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
    active
      ? 'border-[#E53225] bg-white text-[#E53225] shadow-sm'
      : 'border-[#eadfd9] bg-white/90 text-slate-700 hover:border-[#f1d3c7] hover:bg-[#fff8f4] hover:text-slate-900'
  }`

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
      <div className="flex gap-2.5 overflow-x-auto pb-2 pr-1" aria-hidden>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-11 w-24 shrink-0 animate-pulse rounded-2xl bg-gray-200" />
        ))}
      </div>
    )
  }

  return (
    <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2 pr-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:pr-1">
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={pillClass(selectedCategoryName === null)}
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
        >
          {cat.image && (
              <div
                className={`relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-inset ${
                  active ? 'ring-[#ffcaba]' : 'ring-[#efe4dd]'
                }`}
              >
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
            )}
            <span className="max-w-[8.5rem] truncate">{label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                active ? 'bg-white text-[#E53225]' : 'bg-[#f6f2ef] text-slate-400'
              }`}
            >
              {cat._count.products}
            </span>
          </button>
        )
      })}
    </div>
  )
}
