'use client'

import { usePathname } from 'next/navigation'
import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'

export default function Header() {
  const pathname = usePathname()
  const branding = usePublicSiteSettings()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <div className="lg:hidden">
        <MobileHeader branding={branding} />
      </div>
      <div className="hidden lg:block">
        <DesktopHeader branding={branding} />
      </div>
    </>
  )
}