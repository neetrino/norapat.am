'use client'

import { ReactNode } from 'react'
import { CartProvider } from '@/hooks/useCart'
import {
  PublicSiteSettingsProvider,
} from '@/hooks/usePublicSiteSettings'
import { WishlistProvider } from '@/hooks/useWishlist'
import { I18nProvider } from '@/i18n/I18nContext'
import type { PublicSiteSettingsData } from '@/lib/publicSiteSettings'
import { SessionProvider } from 'next-auth/react'

interface ClientProvidersProps {
  children: ReactNode
  initialPublicSiteSettings: PublicSiteSettingsData
}

export default function ClientProviders({
  children,
  initialPublicSiteSettings,
}: ClientProvidersProps) {
  return (
    <SessionProvider
      refetchInterval={10 * 60}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <PublicSiteSettingsProvider initialData={initialPublicSiteSettings}>
        <I18nProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </I18nProvider>
      </PublicSiteSettingsProvider>
    </SessionProvider>
  )
}
