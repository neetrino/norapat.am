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
  Home,
  Users,
  BarChart2,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const SIDEBAR_NAV_ITEMS = [
  { href: '/', label: 'Գլխավոր էջ', icon: Home, external: false },
  { href: '/admin', label: 'Վահանակ', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Ապրանքներ', icon: Package },
  { href: '/admin/orders', label: 'Պատվերներ', icon: ShoppingCart },
  { href: '/admin/categories', label: 'Կատեգորիաներ', icon: Tag },
  { href: '/admin/discounts', label: 'Զեղչեր', icon: BadgePercent },
  { href: '/admin/promo', label: 'Պրոմո կոդեր', icon: Percent },
  { href: '/admin/users', label: 'Օգտատերեր', icon: Users },
  { href: '/admin/analytics', label: 'Վերլուծություն', icon: BarChart2 },
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
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-40 h-14 lg:h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              aria-label="Մենյու"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/admin" className="font-bold text-gray-900 text-lg">
              Ադմին վահանակ
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Դուրս գալ</span>
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`
          fixed top-14 lg:top-16 left-0 z-40 w-56 h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)]
          bg-white border-r border-gray-200 transform transition-transform duration-200 ease-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-3 space-y-0.5">
          {SIDEBAR_NAV_ITEMS.map(({ href, label, icon: Icon, external }) => {
            const isAdminLink = href.startsWith('/admin')
            const isActive =
              isAdminLink && (pathname === href || (href !== '/admin' && pathname.startsWith(href)))

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
      </aside>

      <main className="pt-14 lg:pt-16 lg:pl-56">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
