'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMenuPaginationItems } from '@/lib/menuPaginationRange'

export interface ProductsPagePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  prevLabel: string
  nextLabel: string
  navAriaLabel: string
  /** Կոճակի aria-label համարների համար */
  pageNumberAriaLabel: (page: number) => string
}

const numberButtonClass =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border-2 text-sm font-semibold tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500'
const numberInactiveClass =
  'border-gray-200 bg-white text-gray-800 hover:border-orange-300 hover:bg-orange-50'
const numberActiveClass =
  'border-orange-500 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/25 ring-1 ring-white/20'

/**
 * Մենյուի էջավորում — նախորդ/հաջորդ + համարակալված էջեր
 */
export function ProductsPagePagination({
  currentPage,
  totalPages,
  onPageChange,
  prevLabel,
  nextLabel,
  navAriaLabel,
  pageNumberAriaLabel,
}: ProductsPagePaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const items = getMenuPaginationItems(currentPage, totalPages)

  return (
    <nav
      className="mt-12 flex flex-col items-stretch gap-4 sm:items-center"
      aria-label={navAriaLabel}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-orange-300 hover:bg-orange-50 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
          <span className="hidden sm:inline">{prevLabel}</span>
        </button>

        <ul className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {items.map((item, idx) =>
            item === 'ellipsis' ? (
              <li key={`e-${idx}`} className="flex items-center px-1 text-gray-400" aria-hidden>
                <span className="select-none text-lg font-bold leading-none tracking-tight">…</span>
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onPageChange(item)}
                  aria-label={pageNumberAriaLabel(item)}
                  aria-current={currentPage === item ? 'page' : undefined}
                  className={`${numberButtonClass} ${
                    currentPage === item ? numberActiveClass : numberInactiveClass
                  }`}
                >
                  {item}
                </button>
              </li>
            )
          )}
        </ul>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-orange-300 hover:bg-orange-50 disabled:pointer-events-none disabled:opacity-40"
        >
          <span className="hidden sm:inline">{nextLabel}</span>
          <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
        </button>
      </div>
    </nav>
  )
}
