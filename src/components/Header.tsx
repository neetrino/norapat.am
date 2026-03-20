'use client'

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const headerKey = session ? `authenticated-${session.user?.id}` : 'unauthenticated'

  return (
    <>
      <div className="lg:hidden" key={`mobile-${headerKey}`}>
        <MobileHeader />
      </div>
      <div className="hidden lg:block" key={`desktop-${headerKey}`}>
        <DesktopHeader />
      </div>
    </>
  )
}