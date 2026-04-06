'use client'

import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useHeaderStack } from '@/contexts/HeaderStackContext'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'
import {
  DEFAULT_PUBLIC_ADDRESS,
  DEFAULT_PUBLIC_CONTACT_PHONE,
  TOP_CONTACT_BAR_HEIGHT_PX,
  TOP_CONTACT_BAR_TRANSITION_EASING,
  TOP_CONTACT_BAR_TRANSITION_MS,
} from '@/lib/headerTopBar.constants'

function normalizeTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits ? `tel:+${digits}` : '#'
}

export function TopContactBar() {
  const pathname = usePathname()
  const { topBarVisible } = useHeaderStack()
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
    height: TOP_CONTACT_BAR_HEIGHT_PX,
    transitionProperty: 'transform, opacity, box-shadow',
    transitionDuration: `${TOP_CONTACT_BAR_TRANSITION_MS}ms`,
    transitionTimingFunction: TOP_CONTACT_BAR_TRANSITION_EASING,
  } as const

  return (
    <div
      className={`fixed left-0 right-0 z-[115] overflow-hidden border-b border-white/10 bg-black text-white ${
        topBarVisible
          ? 'translate-y-0 opacity-100 shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
          : 'pointer-events-none -translate-y-[calc(100%+2px)] opacity-0 shadow-none'
      }`}
      style={barTransitionStyle}
      aria-hidden={!topBarVisible}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        <a
          href={telHref}
          className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium tracking-wide sm:text-xs"
        >
          <Phone
            className="h-3 w-3 shrink-0 text-orange-300 sm:h-3.5 sm:w-3.5"
            aria-hidden
          />
          <span className="truncate">{phoneDisplay}</span>
        </a>
        <Link
          href="/contact"
          className="flex min-w-0 max-w-[65%] items-center justify-end gap-1.5 text-[11px] text-orange-100/95 transition-colors hover:text-white sm:max-w-none sm:text-xs"
        >
          <MapPin
            className="hidden h-3 w-3 shrink-0 text-orange-300 sm:inline sm:h-3.5 sm:w-3.5"
            aria-hidden
          />
          <span className="truncate text-right">{addressDisplay}</span>
        </Link>
      </div>
    </div>
  )
}

