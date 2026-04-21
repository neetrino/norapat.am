'use client'

import { usePathname } from 'next/navigation'
import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'
import { TopContactBar } from '@/components/TopContactBar'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'

export default function Header() {
  const pathname = usePathname()
  const branding = usePublicSiteSettings()

  if (pathname?.startsWith('/supersudo') || pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <TopContactBar />
      <div className="lg:hidden">
        <MobileHeader branding={branding} />
      </div>
      <div className="hidden lg:block">
        <DesktopHeader branding={branding} />
      </div>
    </>
  )
}