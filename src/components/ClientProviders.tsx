'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/hooks/useCart'

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
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  )
}
