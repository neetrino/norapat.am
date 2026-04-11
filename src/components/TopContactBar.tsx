'use client'

import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useHeaderStack } from '@/contexts/HeaderStackContext'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'
import { HeaderSocialLinks } from '@/components/HeaderSocialLinks'
import {
  DEFAULT_PUBLIC_ADDRESS,
  DEFAULT_PUBLIC_CONTACT_PHONE,
  TOP_CONTACT_BAR_TRANSITION_EASING,
  TOP_CONTACT_BAR_TRANSITION_MS,
} from '@/lib/headerTopBar.constants'

function normalizeTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits ? `tel:+${digits}` : '#'
}

export function TopContactBar() {
  const pathname = usePathname()
  const { topBarVisible, topBarStripHeightPx } = useHeaderStack()
  const { contactPhone, address } = usePublicSiteSettings()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const phoneDisplay =
    contactPhone?.trim() || DEFAULT_PUBLIC_CONTACT_PHONE
  const addressDisplay = address?.trim() || DEFAULT_PUBLIC_ADDRESS
  const telHref = normalizeTelHref(phoneDisplay)

  const barTransitionStyle = {
    top: 0,
    height: topBarStripHeightPx,
    transitionProperty: 'opacity, filter, box-shadow',
    transitionDuration: `${TOP_CONTACT_BAR_TRANSITION_MS}ms`,
    transitionTimingFunction: TOP_CONTACT_BAR_TRANSITION_EASING,
    filter: topBarVisible ? 'blur(0px)' : 'blur(8px)',
  } as const

  return (
    <div
      className={`fixed left-0 right-0 z-[115] overflow-hidden border-b border-white/10 bg-black text-white ${
        topBarVisible
          ? 'opacity-100 shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
          : 'pointer-events-none opacity-0 shadow-none'
      }`}
      style={barTransitionStyle}
      aria-hidden={!topBarVisible}
    >
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between gap-3 pl-1.5 pr-3 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8">
        <div className="relative z-10 flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <a
            href={telHref}
            className="flex min-w-0 flex-1 items-center gap-1.5 text-[11px] font-medium tracking-wide sm:text-xs"
          >
            <Phone
              className="h-3 w-3 shrink-0 text-red-500 sm:h-3.5 sm:w-3.5"
              aria-hidden
            />
            <span className="truncate">{phoneDisplay}</span>
          </a>
          <div className="hidden sm:block">
            <HeaderSocialLinks />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center sm:hidden">
          <div className="pointer-events-auto translate-x-2">
            <HeaderSocialLinks />
          </div>
        </div>
        <Link
          href="/contact"
          aria-label={addressDisplay}
          className="relative z-10 flex min-w-0 max-w-[65%] flex-1 items-center justify-end gap-1.5 text-[11px] text-orange-100/95 transition-colors hover:text-white sm:max-w-none sm:text-xs"
        >
          <MapPin
            className="h-5 w-5 shrink-0 text-red-500 sm:h-3.5 sm:w-3.5"
            aria-hidden
          />
          <span className="hidden truncate text-right sm:inline">{addressDisplay}</span>
        </Link>
      </div>
    </div>
  )
}

