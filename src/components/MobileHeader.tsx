'use client'

import { Menu, Search, X, Home, UtensilsCrossed, Info, Phone } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/i18n/I18nContext'
import type { PublicSiteSettingsState } from '@/hooks/usePublicSiteSettings'
import { SearchModal } from '@/components/SearchModal'
import { MobileMenuBackgroundIcons } from '@/components/MobileMenuBackgroundIcons'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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
        <div className="px-4 py-1">
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 justify-start">
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false)
                  setIsMenuOpen((prev) => !prev)
                }}
                className="rounded-xl p-3 text-gray-900 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500 active:scale-95"
                aria-label="Մենյու"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="z-[101] flex min-w-0 flex-1 justify-center">
              <SiteBrandMark variant="mobile" branding={branding} />
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsSearchOpen(true)
                }}
                className="rounded-xl p-3 text-gray-900 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500 active:scale-95"
                aria-label={search.short}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'var(--mobile-menu-bg)' }}
      >
        <MobileMenuBackgroundIcons />

        {/* Top bar — միայն փակել (լոգո չկա) */}
        <div className="relative z-10 flex items-center justify-end px-6 pb-4 pt-[max(1.625rem,env(safe-area-inset-top,0px)+0.5rem)]">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
            aria-label="Փակել"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative z-10 mx-6 h-px bg-white/15" />

        {/* Nav items */}
        <nav className="relative z-10 flex flex-1 flex-col justify-center px-6 gap-1">
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
                    ? 'bg-white/12 text-white'
                    : 'text-white/75 hover:bg-white/8 hover:text-white'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${i * 60}ms` : '0ms',
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: isMenuOpen ? 1 : 0,
                  transition: `transform 400ms ease ${i * 60}ms, opacity 400ms ease ${i * 60}ms, background-color 200ms, color 200ms`,
                }}
              >
                <span className="text-xs font-bold tracking-widest text-white/40 w-6">
                  {item.num}
                </span>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                  active
                    ? 'bg-white shadow-md shadow-black/40'
                    : 'bg-white/10 group-hover:bg-white/15'
                }`}>
                  <Icon
                    className={`h-5 w-5 ${active ? 'text-zinc-900' : 'text-white'}`}
                  />
                </div>
                <span className="text-2xl font-bold tracking-tight">{item.label}</span>
                {active && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-white" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom divider */}
        <div className="relative z-10 mx-6 h-px bg-white/15" />

        {/* Footer — Food Court */}
        <div className="relative z-10 px-6 py-6 text-center">
          <p className="text-xs text-white/50 tracking-widest uppercase">
            Norapat Food Court
          </p>
        </div>
      </div>
    </>
  )
}
