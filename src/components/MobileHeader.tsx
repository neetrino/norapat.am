'use client'

import { Search, Menu, X, Home, UtensilsCrossed, Info, Phone } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/i18n/I18nContext'
import type { PublicSiteSettingsState } from '@/hooks/usePublicSiteSettings'
import { HeaderSearch } from '@/components/HeaderSearch'
import { SiteBrandMark } from '@/components/SiteBrandMark'
import { useHeaderStack } from '@/contexts/HeaderStackContext'
import {
  TOP_CONTACT_BAR_TRANSITION_EASING,
  TOP_CONTACT_BAR_TRANSITION_MS,
} from '@/lib/headerTopBar.constants'

interface MobileHeaderProps {
  branding: PublicSiteSettingsState
}

export default function MobileHeader({ branding }: MobileHeaderProps) {
  const { topBarInsetPx } = useHeaderStack()
  const { t } = useI18n()
  const { search, nav } = t
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  const navItems = [
    { href: '/', label: nav.home, icon: Home, num: '01' },
    { href: '/products', label: nav.menu, icon: UtensilsCrossed, num: '02' },
    { href: '/about', label: nav.about, icon: Info, num: '03' },
    { href: '/contact', label: nav.contact, icon: Phone, num: '04' },
  ]

  return (
    <>
      <header
        className="fixed left-0 right-0 z-[100] border-b border-gray-200 bg-white/95 shadow-lg backdrop-blur-xl transition-[top]"
        style={{
          top: topBarInsetPx,
          transitionDuration: `${TOP_CONTACT_BAR_TRANSITION_MS}ms`,
          transitionTimingFunction: TOP_CONTACT_BAR_TRANSITION_EASING,
        }}
      >
        <div className="px-4 py-1.5">
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 justify-start">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="rounded-xl p-3 text-gray-900 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500 active:scale-95"
                aria-label="Մենյու"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="z-[101] flex min-w-0 flex-1 justify-center">
              <SiteBrandMark variant="mobile" branding={branding} />
            </div>

            <div className="flex min-w-0 flex-1 justify-end">
              <button
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className="rounded-xl p-3 text-gray-900 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500 active:scale-95"
                aria-label="Որոնել"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-full z-[100] border-t border-gray-200 bg-white/95 shadow-2xl backdrop-blur-xl">
              <div className="p-4">
                <HeaderSearch placeholder={search.menu} variant="mobile" autoFocus />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'linear-gradient(150deg, #1a0404 0%, #4a0a0a 45%, #8b1414 100%)' }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-500/10" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-red-700/15" />
          <div className="absolute right-8 bottom-32 h-32 w-32 rounded-full bg-red-400/10" />
        </div>

        {/* Top bar — logo + close */}
        <div className="relative flex items-center justify-between px-6 pt-6 pb-4">
          <div className="opacity-80">
            <SiteBrandMark variant="mobile" branding={branding} />
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 active:scale-95"
            aria-label="Փակել"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-white/10" />

        {/* Nav items */}
        <nav className="relative flex flex-1 flex-col justify-center px-6 gap-1">
          {navItems.map((item, i) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`group flex items-center gap-5 rounded-3xl px-5 py-5 transition-all duration-300 active:scale-[0.97] ${
                  active
                    ? 'bg-red-500/20 text-red-300'
                    : 'text-white/80 hover:bg-white/8 hover:text-white'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${i * 60}ms` : '0ms',
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: isMenuOpen ? 1 : 0,
                  transition: `transform 400ms ease ${i * 60}ms, opacity 400ms ease ${i * 60}ms, background-color 200ms, color 200ms`,
                }}
              >
                <span className="text-xs font-bold tracking-widest text-white/30 w-6">
                  {item.num}
                </span>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                  active ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-white/10 group-hover:bg-white/15'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold tracking-tight">{item.label}</span>
                {active && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-red-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom divider */}
        <div className="mx-6 h-px bg-white/10" />

        {/* Footer text */}
        <div className="relative px-6 py-6 text-center">
          <p className="text-xs text-white/30 tracking-widest uppercase">Norapat Food Court</p>
        </div>
      </div>
    </>
  )
}
