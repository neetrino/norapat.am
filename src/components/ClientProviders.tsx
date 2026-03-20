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
      refetchInterval={5 * 60} // Обновляем каждые 5 минут
      refetchOnWindowFocus={true} // Обновляем при фокусе на окне
      refetchWhenOffline={false} // Не обновляем когда офлайн
    >
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  )
}
