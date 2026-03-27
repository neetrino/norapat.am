'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Campaign } from '@/types'
import { useI18n } from '@/i18n/I18nContext'

const AUTO_ADVANCE_MS = 5000

export function ActionsSection() {
  const { t } = useI18n()
  const ac = t.home.actions
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/campaigns', { signal: controller.signal, cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch campaigns')
        return res.json()
      })
      .then((data: Campaign[]) => {
        const list = Array.isArray(data) ? data : []
        setCampaigns(list)
        setActiveIndex(0)
      })
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const goTo = useCallback(
    (index: number) => {
      const safe = (index + campaigns.length) % campaigns.length
      setActiveIndex(safe)
    },
    [campaigns.length]
  )

  useEffect(() => {
    if (campaigns.length <= 1) return
    const timer = setInterval(
      () => setActiveIndex((i) => (i + 1) % campaigns.length),
      AUTO_ADVANCE_MS
    )
    return () => clearInterval(timer)
  }, [campaigns.length])

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-gray-50" aria-label={ac.ariaLabel}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
          </div>
        </div>
      </section>
    )
  }

  if (campaigns.length === 0) {
    return null
  }

  const current = campaigns[activeIndex]
  const href = buildCampaignHref(current)

  return (
    <section
      className="py-16 lg:py-20 bg-gradient-to-b from-orange-50/60 to-white"
      aria-label={ac.ariaLabel}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {ac.title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            {ac.subtitle}
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl bg-white">
            {href ? (
              <Link
                href={href}
                className="block relative aspect-[21/9] sm:aspect-[3/1] min-h-[180px] group"
              >
                <CampaignBanner campaign={current} />
              </Link>
            ) : (
              <div className="relative aspect-[21/9] sm:aspect-[3/1] min-h-[180px]">
                <CampaignBanner campaign={current} />
              </div>
            )}
          </div>

          {campaigns.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-gray-700 transition-colors"
                aria-label="Previous campaign"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-gray-700 transition-colors"
                aria-label="Next campaign"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {campaigns.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === activeIndex
                        ? 'bg-white w-6'
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={`Go to campaign ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            <span>{ac.viewAll}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

function CampaignBanner({ campaign }: { campaign: Campaign }) {
  return (
    <>
      <Image
        src={campaign.image}
        alt={campaign.title}
        fill
        unoptimized
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          const el = e.currentTarget
          el.classList.add('hidden')
          const fallback = el.nextElementSibling as HTMLElement
          if (fallback) fallback.classList.remove('hidden')
        }}
      />
      <div
        className="absolute inset-0 hidden bg-gradient-to-r from-orange-400 to-red-500 items-center justify-center"
        aria-hidden
      >
        <span className="text-6xl">🏷️</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">{campaign.title}</h3>
        {campaign.description && (
          <p className="text-sm sm:text-base text-white/90 mt-1 line-clamp-2">
            {campaign.description}
          </p>
        )}
      </div>
    </>
  )
}

function buildCampaignHref(campaign: Campaign): string | null {
  if (campaign.linkType === 'NONE' || !campaign.linkValue) return null
  if (campaign.linkType === 'URL') return campaign.linkValue
  if (campaign.linkType === 'PRODUCT') return `/products/${campaign.linkValue}`
  if (campaign.linkType === 'CATEGORY') {
    const category = encodeURIComponent(campaign.linkValue)
    return `/products?category=${category}`
  }
  return null
}
