'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

/**
 * Clears client cart after Idram success redirect (?paid=1).
 */
export function OrderSuccessClearCart() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  useEffect(() => {
    if (searchParams.get('paid') === '1') {
      clearCart()
    }
  }, [searchParams, clearCart])

  return null
}
