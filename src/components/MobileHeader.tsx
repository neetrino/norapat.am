'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { useI18n } from '@/i18n/I18nContext'
import type { PublicSiteSettingsState } from '@/hooks/usePublicSiteSettings'
import { HeaderSearch } from '@/components/HeaderSearch'
import { SiteBrandMark } from '@/components/SiteBrandMark'
import { useHeaderStack } from '@/contexts/HeaderStackContext'
import {
  TOP_CONTACT_BAR_TRANSITION_EASING,
  TOP_CONTACT_BAR_TRANSITION_MS,
} from '@/lib/headerTopBar.constants'

interface MobileHeaderProps {
  branding: PublicSiteSettingsState
}

export default function MobileHeader({ branding }: MobileHeaderProps) {
  const { topBarInsetPx } = useHeaderStack()
  const { t } = useI18n()
  const { search } = t
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header
      className="fixed left-0 right-0 z-[100] border-b border-gray-200 bg-white/95 shadow-lg backdrop-blur-xl transition-[top]"
      style={{
        top: topBarInsetPx,
        transitionDuration: `${TOP_CONTACT_BAR_TRANSITION_MS}ms`,
        transitionTimingFunction: TOP_CONTACT_BAR_TRANSITION_EASING,
      }}
    >
      <div className="px-4 py-1.5">
        <div className="flex items-center gap-2">
          <div className="z-[101] flex min-w-0 flex-1 justify-start">
            <SiteBrandMark variant="mobile" branding={branding} />
          </div>
          <div className="flex-shrink-0" />

          <div className="flex min-w-0 flex-1 justify-end">
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="rounded-xl p-3 text-gray-900 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500 active:scale-95"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full z-[100] border-t border-gray-200 bg-white/95 shadow-2xl backdrop-blur-xl">
            <div className="p-4">
              <HeaderSearch placeholder={search.menu} variant="mobile" autoFocus />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
