'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/I18nContext'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'

type HeaderSearchProduct = {
  id: string
  name: string
  shortDescription: string | null
  description: string | null
  image: string | null
}

interface HeaderSearchProps {
  placeholder: string
  variant?: 'desktop' | 'mobile'
  autoFocus?: boolean
  /** Smaller field when embedded in the mobile header row */
  compact?: boolean
}

export function HeaderSearch({
  placeholder,
  variant = 'desktop',
  autoFocus = false,
  compact = false,
}: HeaderSearchProps) {
  const router = useRouter()
  const { locale } = useI18n()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<HeaderSearchProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const trimmedQuery = useMemo(() => query.trim(), [query])
  const isMobile = variant === 'mobile'
  const isCompactMobile = isMobile && compact

  useEffect(() => {
    if (!trimmedQuery) {
      setResults([])
      setIsOpen(false)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(trimmedQuery)}&limit=5&page=1`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }

        const data: unknown = await response.json()
        const items = Array.isArray(data)
          ? data
          : data &&
              typeof data === 'object' &&
              'items' in data &&
              Array.isArray((data as { items?: unknown }).items)
            ? (data as { items: HeaderSearchProduct[] }).items
            : []

        setResults(items.slice(0, 5))
        setIsOpen(true)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Header search failed:', error)
          setResults([])
        }
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [trimmedQuery])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const submitSearch = () => {
    if (!trimmedQuery) return
    setIsOpen(false)
    router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <div ref={containerRef} className="relative">
      <Search
        className={`absolute top-1/2 z-10 -translate-y-1/2 text-gray-500 ${
          isCompactMobile ? 'left-3 h-4 w-4' : isMobile ? 'left-4 h-5 w-5' : 'left-3 h-4 w-4'
        }`}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onFocus={() => {
          if (trimmedQuery) setIsOpen(true)
        }}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            submitSearch()
          }

          if (e.key === 'Escape') {
            setIsOpen(false)
          }
        }}
        className={
          isCompactMobile
            ? 'w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-300 hover:shadow-md focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500'
            : isMobile
              ? 'w-full rounded-2xl border-2 border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-base text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-300 hover:shadow-md focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500'
              : 'w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 transition-all duration-300 hover:bg-white focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500'
        }
        autoFocus={autoFocus}
      />

      {isOpen && trimmedQuery && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[120] overflow-hidden rounded-2xl border border-[#eadfd9] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-slate-500">Որոնում...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 border-b border-[#f4ebe6] px-4 py-3 transition-colors duration-200 hover:bg-[#fff7f2] last:border-b-0"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#fff7f2]">
                    {product.image && product.image !== 'no-image' ? (
                      <Image
                        src={product.image}
                        alt={getProductDisplayName(product.name, locale)}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl">🍽️</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {getProductDisplayName(product.name, locale)}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {product.shortDescription ?? product.description ?? ''}
                    </div>
                  </div>
                </Link>
              ))}
              <button
                type="button"
                onClick={submitSearch}
                className="w-full bg-[#fffaf7] px-4 py-3 text-left text-sm font-semibold text-[#E53225] transition-colors hover:bg-[#fff3ec]"
              >
                Տեսնել բոլոր արդյունքները
              </button>
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">Ապրանք չի գտնվել</div>
          )}
        </div>
      )}
    </div>
  )
}
