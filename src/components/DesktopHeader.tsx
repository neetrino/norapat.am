'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, LogOut, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import { useHydration } from '@/hooks/useHydration'

export default function DesktopHeader() {
  const isHydrated = useHydration()
  const { getTotalItems } = useCart()
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  // Функция для определения активной ссылки
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  // Навигационные ссылки
  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/products', label: 'Меню' },
    { href: '/about', label: 'О нас' },
    { href: '/contact', label: 'Контакты' },
  ]

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-[60]" style={{ position: 'fixed' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Pideh Armenia Logo" 
              width={180} 
              height={60}
              className="h-16 w-auto"
              priority
            />
          </Link>

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

          {/* Search Bar - Compact */}
          <div className="max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
                  }
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-900 placeholder-gray-500 bg-gray-50 transition-all duration-300 hover:bg-white focus:bg-white"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
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

            {/* Auth Buttons */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-2">
                {/* User Profile */}
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
                  
                  {/* Активный индикатор для профиля */}
                  {isActive('/profile') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-500 rounded-full"></div>
                  )}
                </Link>
                
                {/* Admin Link */}
                {session.user?.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group
                      ${isActive('/admin')
                        ? 'text-orange-500 bg-orange-50 shadow-md'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      }
                    `}
                  >
                    Админ
                    
                    {/* Активный индикатор для админки */}
                    {isActive('/admin') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-500 rounded-full"></div>
                    )}
                  </Link>
                )}
                
                {/* Logout */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-gray-900 hover:text-orange-500 transition-colors"
                  title="Выйти"
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
                  Войти
                  
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
                  Регистрация
                  
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
  )
}
