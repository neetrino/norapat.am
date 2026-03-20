'use client'

import Link from 'next/link'
import { Home, ShoppingCart, User, Menu, LogIn } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import { useHydration } from '@/hooks/useHydration'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const isHydrated = useHydration()
  const { getTotalItems } = useCart()
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Принудительное обновление при изменении сессии
  const navKey = session ? `nav-authenticated-${session.user?.id}` : 'nav-unauthenticated'

  // Блокировка скролла когда меню открыто
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  // Ссылки для меню
  const menuLinks = [
    { href: '/', label: 'Главная' },
    { href: '/products', label: 'Меню' },
    { href: '/about', label: 'О нас' },
    { href: '/contact', label: 'Контакты' },
  ]

  // Навигационные элементы в зависимости от состояния авторизации
  const navItems = session ? [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/products', label: 'Меню', icon: Menu, isMenu: true },
    { href: '/cart', label: 'Корзина', icon: ShoppingCart, showBadge: true },
    { href: '/profile', label: 'Профиль', icon: User },
  ] : [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/products', label: 'Меню', icon: Menu, isMenu: true },
    { href: '/cart', label: 'Корзина', icon: ShoppingCart, showBadge: true },
    { href: '/login', label: 'Войти', icon: LogIn },
  ]

  const menuOverlay = isMenuOpen && isHydrated && createPortal(
    <div 
      className="fixed inset-0 bg-white z-[9999] animate-menu-fade-in"
      onClick={() => setIsMenuOpen(false)}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* Menu Content Container */}
      <div className="relative z-10 h-full flex flex-col animate-menu-slide-in">
        {/* Menu Header */}
        <div className="bg-orange-500 text-white p-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Menu className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Навигация</h2>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(false)
            }}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 active:scale-95"
          >
            <span className="text-white text-xl font-bold">×</span>
          </button>
        </div>

        {/* Menu Items - Centered */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="space-y-3">
            {menuLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  group block px-8 py-6 rounded-2xl text-gray-700 hover:bg-orange-500 hover:text-white transition-all duration-300 font-semibold text-xl text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 animate-slide-in-up
                  ${isActive(link.href) 
                    ? 'bg-orange-500 text-white shadow-xl scale-105' 
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <span className="block">{link.label}</span>
                {isActive(link.href) && (
                  <div className="mt-2 w-8 h-1 bg-white/30 rounded-full mx-auto"></div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          {/* Legal Links */}
          <div className="flex justify-center space-x-4 mb-4">
            <Link 
              href="/privacy" 
              className="text-xs text-gray-400 hover:text-orange-500 transition-colors duration-200 underline decoration-dotted underline-offset-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Политика конфиденциальности
            </Link>
            <span className="text-xs text-gray-300">•</span>
            <Link 
              href="/terms" 
              className="text-xs text-gray-400 hover:text-orange-500 transition-colors duration-200 underline decoration-dotted underline-offset-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Условия использования
            </Link>
          </div>
          
          <div className="text-center text-gray-600">
            <p className="text-xs text-gray-500 mb-2">
              Copyright © 2025. All Rights Reserved.
            </p>
            <p className="text-xs text-gray-500">
              Created by{' '}
              <a 
                href="https://neetrino.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-200"
              >
                Neetrino
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )

  return (
    <>
      <nav key={navKey} className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 z-40 shadow-2xl">
        <div className="flex justify-around items-center py-3">
          {status === 'loading' ? (
            // Показываем загрузку для всех кнопок
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center justify-center py-3 px-4 rounded-2xl">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-12 h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
              </div>
            ))
          ) : (
            navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            // Если это меню, показываем кнопку
            if (item.isMenu) {
              return (
                <button
                  key={item.href}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 relative ${
                    isMenuOpen
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'scale-110' : ''}`} />
                  </div>
                  <span className={`text-xs font-semibold mt-1 transition-all duration-300 ${isMenuOpen ? 'text-orange-600' : ''}`}>{item.label}</span>
                  
                  {/* Active indicator */}
                  {isMenuOpen && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-b-full shadow-lg"></div>
                  )}
                </button>
              )
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 relative ${
                  active
                    ? 'text-orange-500 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-6 w-6 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
                  {item.showBadge && isHydrated && getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-semibold mt-1 transition-all duration-300 ${active ? 'text-orange-600' : ''}`}>{item.label}</span>
                
                {/* Active indicator */}
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-b-full shadow-lg"></div>
                )}
              </Link>
            )
          })
          )}
        </div>
      </nav>
      {menuOverlay}
    </>
  )
}
