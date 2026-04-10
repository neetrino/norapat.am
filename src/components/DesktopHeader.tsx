'use client'

import Link from 'next/link'
import { ShoppingCart, User, LogOut, Heart, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useHydration } from '@/hooks/useHydration'
import { useI18n } from '@/i18n/I18nContext'
import type { PublicSiteSettingsState } from '@/hooks/usePublicSiteSettings'
import { SiteBrandMark } from '@/components/SiteBrandMark'
import { SearchModal } from '@/components/SearchModal'
import { useHeaderStack } from '@/contexts/HeaderStackContext'
import {
  TOP_CONTACT_BAR_TRANSITION_EASING,
  TOP_CONTACT_BAR_TRANSITION_MS,
} from '@/lib/headerTopBar.constants'

interface DesktopHeaderProps {
  branding: PublicSiteSettingsState
}

export default function DesktopHeader({ branding }: DesktopHeaderProps) {
  const { topBarInsetPx } = useHeaderStack()
  const { t } = useI18n()
  const { nav, auth, wishlist } = t
  const isHydrated = useHydration()
  const [searchOpen, setSearchOpen] = useState(false)
  const { getTotalItems } = useCart()
  const { products: wishlistProducts } = useWishlist()
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Функция для определения активной ссылки
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  // Навигационные ссылки
  const navLinks = [
    { href: '/', label: nav.home },
    { href: '/products', label: nav.menu },
    { href: '/about', label: nav.about },
    { href: '/contact', label: nav.contact },
  ]

  return (
    <>
    <header
      className="fixed left-0 right-0 z-[60] bg-white shadow-sm transition-[top]"
      style={{
        top: topBarInsetPx,
        transitionDuration: `${TOP_CONTACT_BAR_TRANSITION_MS}ms`,
        transitionTimingFunction: TOP_CONTACT_BAR_TRANSITION_EASING,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <SiteBrandMark variant="desktop" branding={branding} />

          {/* Desktop Navigation */}
          <nav className="flex space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 group
                  ${isActive(link.href)
                    ? 'text-orange-500 bg-orange-50 shadow-md'
                    : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                  }
                `}
              >
                <span className="flex items-center">
                  <span>{link.label}</span>
                </span>
                
                {/* Активный индикатор */}
                {isActive(link.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-orange-500 rounded-full"></div>
                )}
                
                {/* Hover эффект */}
                <div className="absolute inset-0 rounded-lg bg-orange-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-3 rounded-xl text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300"
              aria-label="Որոնել"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Cart */}
            <Link 
              href="/cart" 
              className={`
                relative p-3 rounded-xl transition-all duration-300 group
                ${isActive('/cart')
                  ? 'text-orange-500 bg-orange-50 shadow-md'
                  : 'text-gray-900 hover:text-orange-500 hover:bg-orange-50'
                }
              `}
            >
              <ShoppingCart className="h-6 w-6" />
              {isHydrated && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
              
              {/* Активный индикатор для корзины */}
              {isActive('/cart') && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-500 rounded-full"></div>
              )}
            </Link>

            {/* Wishlist — только для авторизованных */}
            {isHydrated && session?.user && (
              <Link
                href="/wishlist"
                className={`
                  relative p-3 rounded-xl transition-all duration-300 group
                  ${isActive('/wishlist')
                    ? 'text-orange-500 bg-orange-50 shadow-md'
                    : 'text-gray-900 hover:text-red-500 hover:bg-red-50'
                  }
                `}
                title={wishlist.title}
              >
                <Heart className={`h-6 w-6 ${isActive('/wishlist') ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlistProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center">
                    {wishlistProducts.length}
                  </span>
                )}
                {isActive('/wishlist') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-500 rounded-full" />
                )}
              </Link>
            )}

            {/* Auth: до гидратации показываем скелетон, чтобы не было mismatch server/client */}
            {!isHydrated || status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" aria-hidden />
            ) : session ? (
              <div className="flex items-center space-x-2">
                {/* Admin: один элемент — кнопка Админ; обычный пользователь — профиль */}
                {session.user?.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                      ${isActive('/admin')
                        ? 'text-orange-600 bg-orange-100 shadow-md'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      }
                    `}
                  >
                    {auth.admin}
                    {isActive('/admin') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-500 rounded-full" />
                    )}
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 group
                      ${isActive('/profile')
                        ? 'text-orange-500 bg-orange-50 shadow-md'
                        : 'text-gray-900 hover:text-orange-500 hover:bg-orange-50'
                      }
                    `}
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block font-medium">{session.user?.name}</span>
                    {isActive('/profile') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-500 rounded-full" />
                    )}
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-gray-900 hover:text-orange-500 transition-colors"
                  title={auth.logoutTitle}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login" 
                  className={`
                    relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group
                    ${isActive('/login')
                      ? 'text-orange-500 bg-orange-50 shadow-md'
                      : 'text-gray-900 hover:text-orange-500 hover:bg-orange-50'
                    }
                  `}
                >
                  {auth.login}
                  
                  {/* Активный индикатор для входа */}
                  {isActive('/login') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-500 rounded-full"></div>
                  )}
                </Link>
                <Link 
                  href="/register" 
                  className={`
                    relative px-4 py-2 rounded-xl font-semibold transition-all duration-300 group
                    ${isActive('/register')
                      ? 'text-orange-500 bg-orange-50 shadow-md'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                    }
                  `}
                >
                  {auth.register}
                  
                  {/* Активный индикатор для регистрации */}
                  {isActive('/register') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-500 rounded-full"></div>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  </>
  )
}
