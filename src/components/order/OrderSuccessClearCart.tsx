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
  const paid = searchParams.get('paid')

  useEffect(() => {
    if (paid !== '1') return
    clearCart()
  }, [paid, clearCart])

  return null
}
