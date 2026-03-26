'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useI18n } from '@/i18n/I18nContext'
import type { PublicSiteSettingsState } from '@/hooks/usePublicSiteSettings'
import { SiteBrandMark } from '@/components/SiteBrandMark'
import { useHeaderStack } from '@/contexts/HeaderStackContext'

interface MobileHeaderProps {
  branding: PublicSiteSettingsState
}

export default function MobileHeader({ branding }: MobileHeaderProps) {
  const { topBarInsetPx } = useHeaderStack()
  const { t } = useI18n()
  const { search, nav } = t
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header
      className="fixed left-0 right-0 z-[100] border-b border-gray-200 bg-white/95 shadow-lg backdrop-blur-xl transition-[top] duration-300 ease-out"
      style={{ top: topBarInsetPx }}
    >
      <div className="px-4 py-1.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex justify-start min-w-0 z-[101]" />
          <div className="flex-shrink-0">
            <SiteBrandMark variant="mobile" branding={branding} />
          </div>

          {/* Mobile Search Button */}
          <div className="flex-1 flex justify-end min-w-0">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-3 text-gray-900 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all duration-300 active:scale-95"
          >
            <Search className="h-5 w-5" />
          </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200 z-[100]">
            <div className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder={search.menu}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base text-gray-900 placeholder-gray-500 bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md focus:bg-white"
                    autoFocus
                  />
                </div>
                <button 
                  onClick={() => {
                    if (searchQuery.trim()) {
                      // Перенаправляем на страницу продуктов с поисковым запросом
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
                    }
                  }}
                  className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Search className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  )
}
