'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/I18nContext'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'

type SearchProduct = {
  id: string
  name: string
  shortDescription: string | null
  description: string | null
  image: string | null
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const { locale } = useI18n()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const trimmedQuery = useMemo(() => query.trim(), [query])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Fetch products
  useEffect(() => {
    if (!trimmedQuery) {
      setResults([])
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const id = window.setTimeout(async () => {
      try {
        setIsLoading(true)
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(trimmedQuery)}&limit=5&page=1`,
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error('fetch failed')
        const data: unknown = await res.json()
        const items: SearchProduct[] = Array.isArray(data)
          ? data
          : data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items?: unknown }).items)
            ? (data as { items: SearchProduct[] }).items
            : []
        setResults(items.slice(0, 5))
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => {
      controller.abort()
      window.clearTimeout(id)
    }
  }, [trimmedQuery])

  const submitSearch = () => {
    if (!trimmedQuery) return
    onClose()
    router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh]"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(15,23,42,0.45)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-xl mx-4 rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(15,23,42,0.25)] animate-[modalIn_0.18s_ease-out]"
        style={{ background: 'rgba(255,255,255,0.97)' }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Որոնել ապրանք..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); submitSearch() }
            }}
            className="flex-1 bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        {trimmedQuery && (
          <div>
            {isLoading ? (
              <div className="px-5 py-4 text-sm text-slate-500">Որոնում...</div>
            ) : results.length > 0 ? (
              <>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 border-b border-gray-50 hover:bg-orange-50/60 transition-colors last:border-b-0"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                      {product.image && product.image !== 'no-image' ? (
                        <Image
                          src={product.image}
                          alt={getProductDisplayName(product.name, locale)}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg">🍽️</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {getProductDisplayName(product.name, locale)}
                      </div>
                      {(product.shortDescription ?? product.description) && (
                        <div className="truncate text-xs text-slate-500 mt-0.5">
                          {product.shortDescription ?? product.description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={submitSearch}
                  className="w-full px-5 py-3 text-left text-sm font-semibold text-[#E53225] bg-orange-50/40 hover:bg-orange-50 transition-colors"
                >
                  Տեսնել բոլոր արդյունքները →
                </button>
              </>
            ) : (
              <div className="px-5 py-4 text-sm text-slate-500">Ապրանք չի գտնվել</div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  )
}
