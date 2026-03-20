'use client'

import { useSession } from 'next-auth/react'
import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'

export default function Header() {
  const { data: session } = useSession()
  
  // Принудительное обновление Header при изменении сессии
  const headerKey = session ? `authenticated-${session.user?.id}` : 'unauthenticated'

  return (
    <>
      {/* Mobile Header - показывается на мобильных устройствах и планшетах */}
      <div className="lg:hidden" key={`mobile-${headerKey}`}>
        <MobileHeader />
      </div>
      
      {/* Desktop Header - показывается только на десктопе */}
      <div className="hidden lg:block" key={`desktop-${headerKey}`}>
        <DesktopHeader />
      </div>
    </>
  )
}