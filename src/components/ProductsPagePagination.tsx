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
  pageNumberAriaLabel: (page: number) => string
}

const numberButtonClass =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border text-sm font-semibold tabular-nums transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500'
const numberInactiveClass =
  'border-[#e8ddd7] bg-white/95 text-slate-700 shadow-sm hover:border-[#f2c5b7] hover:bg-[#fff6f1] hover:text-slate-900'
const numberActiveClass =
  'border-[#E53225] bg-[linear-gradient(135deg,#ff6a45_0%,#E53225_55%,#c9241d_100%)] text-white shadow-[0_16px_28px_rgba(229,50,37,0.22)] ring-1 ring-white/20'

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
    <nav className="mt-10 flex flex-col items-stretch gap-4 sm:items-center" aria-label={navAriaLabel}>
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-[2rem] border border-[#eadfd9] bg-white/90 px-3 py-3 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur sm:gap-2.5 sm:px-4">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#e8ddd7] bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-[#f2c5b7] hover:bg-[#fff6f1] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
          <span className="hidden sm:inline">{prevLabel}</span>
        </button>

        <ul className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {items.map((item, idx) =>
            item === 'ellipsis' ? (
              <li key={`e-${idx}`} className="flex items-center px-1 text-slate-300" aria-hidden>
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
          className="inline-flex items-center gap-2 rounded-2xl border border-[#e8ddd7] bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-[#f2c5b7] hover:bg-[#fff6f1] disabled:pointer-events-none disabled:opacity-40"
        >
          <span className="hidden sm:inline">{nextLabel}</span>
          <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
        </button>
      </div>
    </nav>
  )
}
