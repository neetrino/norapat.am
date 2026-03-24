'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/hooks/useCart'
import { I18nProvider } from '@/i18n/I18nContext'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider
      refetchInterval={10 * 60}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <I18nProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </I18nProvider>
    </SessionProvider>
  )
}
