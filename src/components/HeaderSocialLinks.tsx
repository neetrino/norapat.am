'use client'

import { Facebook, Instagram } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import { companyInfo } from '@/constants/company'
import { cn } from '@/lib/utils'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'

const TOPBAR_BTN_BASE =
  'inline-flex shrink-0 items-center justify-center rounded-md p-1 text-red-500 transition-colors duration-200 sm:p-1.5'
const TOPBAR_HOVER_SURFACE = 'hover:bg-white/10'

const TOPBAR_LINKS: ReadonlyArray<{
  href: string
  label: string
  Icon: LucideIcon | ComponentType<{ className?: string }>
}> = [
  {
    href: companyInfo.socialMedia.facebook,
    label: 'Facebook',
    Icon: Facebook,
  },
  {
    href: companyInfo.socialMedia.instagram,
    label: 'Instagram',
    Icon: Instagram,
  },
  {
    href: companyInfo.socialMedia.whatsapp,
    label: 'WhatsApp',
    Icon: WhatsAppGlyph,
  },
]

/**
 * Social links for the fixed top contact bar (dark strip): compact red icons.
 */
export function HeaderSocialLinks() {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-1">
      {TOPBAR_LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(TOPBAR_BTN_BASE, TOPBAR_HOVER_SURFACE)}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  )
}
