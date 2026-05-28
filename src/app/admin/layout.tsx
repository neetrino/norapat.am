'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Percent,
  BadgePercent,
  LogOut,
  Menu,
  X,
  Users,
  BarChart2,
  Truck,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { SiteBrandMark } from '@/components/SiteBrandMark'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'

const SIDEBAR_NAV_ITEMS = [
  { href: '/supersudo', label: 'Վահանակ', icon: LayoutDashboard },
  { href: '/supersudo/products', label: 'Ապրանքներ', icon: Package },
  { href: '/supersudo/orders', label: 'Պատվերներ', icon: ShoppingCart },
  { href: '/supersudo/categories', label: 'Կատեգորիաներ', icon: Tag },
  { href: '/supersudo/delivery', label: 'Առաքում', icon: Truck },
  { href: '/supersudo/discounts', label: 'Զեղչեր', icon: BadgePercent },
  { href: '/supersudo/promo', label: 'Պրոմո կոդեր', icon: Percent },
  { href: '/supersudo/users', label: 'Օգտատերեր', icon: Users },
  { href: '/supersudo/analytics', label: 'Վերլուծություն', icon: BarChart2 },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const branding = usePublicSiteSettings()

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <button
        type="button"
        onClick={() => setSidebarOpen((open) => !open)}
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 text-gray-600"
        aria-label="Մենյու"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 w-56 h-screen overflow-y-auto
          bg-white border-r border-gray-200 transform transition-transform duration-200 ease-out
          lg:sticky lg:top-0 lg:h-screen lg:self-start
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          <div className="px-4 pt-4 pb-2 border-b border-gray-100">
            <SiteBrandMark variant="mobile" branding={branding} />
          </div>

          <nav className="flex-1 p-3 space-y-0.5">
          {SIDEBAR_NAV_ITEMS.map(({ href, label, icon: Icon, external }) => {
            const isAdminLink = href.startsWith('/supersudo')
            const isActive =
              isAdminLink && (pathname === href || (href !== '/supersudo' && pathname.startsWith(href)))

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}
                `}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            )
          })}
          </nav>

          <div className="p-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Դուրս գալ</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="pt-14 lg:pt-0 lg:flex-1">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
