'use client'

import Link from 'next/link'
import { Home, ShoppingCart, User, UtensilsCrossed, LogIn } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import { useHydration } from '@/hooks/useHydration'
import { useI18n } from '@/i18n/I18nContext'

export default function MobileBottomNav() {
  const { t } = useI18n()
  const { nav, cart, profile, auth } = t
  const pathname = usePathname()
  const isHydrated = useHydration()
  const { getTotalItems } = useCart()
  const { data: session, status } = useSession()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }
  const hideProfileActiveIndicator = pathname?.startsWith('/profile')

  const navItems = session ? [
    { href: '/', label: nav.home, icon: Home },
    { href: '/products', label: nav.menu, icon: UtensilsCrossed },
    { href: '/cart', label: cart.label, icon: ShoppingCart, showBadge: true },
    { href: '/profile', label: profile.label, icon: User },
  ] : [
    { href: '/', label: nav.home, icon: Home },
    { href: '/products', label: nav.menu, icon: UtensilsCrossed },
    { href: '/cart', label: cart.label, icon: ShoppingCart, showBadge: true },
    { href: '/login', label: auth.login, icon: LogIn },
  ]

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 w-full border-t border-gray-200 bg-white/95 shadow-md backdrop-blur-xl pb-[max(0.25rem,env(safe-area-inset-bottom,0px))]"
      aria-label={nav.navigation}
    >
      <div className="flex items-stretch justify-around gap-0.5 px-1 pt-1">
        {!isHydrated || status === 'loading' ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-10 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1"
            >
              <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
              <div className="mt-0 h-2.5 w-9 animate-pulse rounded bg-gray-200" />
            </div>
          ))
        ) : (
          navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex min-h-10 min-w-0 flex-1 max-w-[5.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 transition-colors duration-200 ${
                  active
                    ? 'bg-orange-50 text-orange-500'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                }`}
              >
                <div className="relative shrink-0">
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-105' : ''}`}
                    aria-hidden
                  />
                  {item.showBadge && isHydrated && getTotalItems() > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-0.5 text-[10px] font-bold text-white shadow-sm tabular-nums">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <span
                  className={`line-clamp-1 w-full text-center text-[10px] font-medium leading-none transition-colors duration-200 ${
                    active ? 'text-orange-600' : ''
                  }`}
                >
                  {item.label}
                </span>

                {active && !hideProfileActiveIndicator && (
                  <div className="absolute left-1/2 top-0 h-0.5 w-7 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-orange-500 to-red-500" />
                )}
              </Link>
            )
          })
        )}
      </div>
    </nav>
  )
}
