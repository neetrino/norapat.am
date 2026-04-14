'use client'

import { useState, useCallback } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import { useI18n } from '@/i18n/I18nContext'
import { PRODUCT_PAGE_MOBILE_CTA_BUTTON_CLASSES } from '@/constants/productPageUi'

interface ProductQuantityControlsProps {
  product: Product
  /** Grocery-style mobile row: quantity + full-width green CTA. */
  /** `responsive`: shared state; mobile row below `lg`, default block from `lg` up. */
  variant?: 'default' | 'mobileCommerce' | 'responsive'
}

export default function ProductQuantityControls({
  product,
  variant = 'default',
}: ProductQuantityControlsProps) {
  const { t } = useI18n()
  const pq = t.productQuantity
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = useCallback(() => {
    if (!product.isAvailable) return
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }, [product, quantity, addItem])

  const mobileCommerceBlock = (
    <div className="flex flex-row items-stretch gap-3">
        <div
          className={`inline-flex shrink-0 items-center overflow-hidden rounded-xl border bg-white ${
            !product.isAvailable ? 'border-slate-200 opacity-60' : 'border-slate-200/90'
          }`}
        >
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={!product.isAvailable}
            className="px-3 py-2.5 text-lg font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={pq.decreaseQuantity}
          >
            <Minus className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <span className="min-w-[2.5rem] px-2 py-2.5 text-center text-base font-bold tabular-nums text-slate-900">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            disabled={!product.isAvailable}
            className="px-3 py-2.5 text-lg font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={pq.increaseQuantity}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
          className={`flex min-h-[2.75rem] flex-1 items-center justify-center rounded-full px-4 py-2.5 text-base font-bold text-white transition-all duration-200 ${
            !product.isAvailable
              ? 'cursor-not-allowed bg-slate-300 opacity-75'
              : addedToCart
                ? 'bg-emerald-500 shadow-[0_10px_24px_rgba(34,197,94,0.3)]'
                : PRODUCT_PAGE_MOBILE_CTA_BUTTON_CLASSES
          }`}
        >
          <span className="text-center leading-tight">
            {!product.isAvailable
              ? 'Առկա չէ'
              : addedToCart
                ? pq.addedToCart
                : pq.addToCart}
          </span>
        </button>
      </div>
  )

  const defaultBlock = (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          {pq.quantity}
        </label>

        <div
          className={`inline-flex items-center self-start overflow-hidden rounded-2xl border bg-white shadow-sm ${
            !product.isAvailable ? 'border-slate-200 opacity-60' : 'border-[#ead8cf]'
          }`}
        >
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={!product.isAvailable}
            className="p-3 text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="min-w-[3.5rem] bg-[#fff8f4] px-5 py-3 text-center text-base font-bold text-slate-900">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            disabled={!product.isAvailable}
            className="p-3 text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!product.isAvailable}
        className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold transition-all duration-200 ${
          !product.isAvailable
            ? 'cursor-not-allowed bg-slate-300 text-white opacity-75'
            : addedToCart
              ? 'bg-emerald-500 text-white shadow-[0_14px_28px_rgba(34,197,94,0.22)]'
              : 'bg-orange-500 text-white shadow-[0_14px_28px_rgba(238,49,36,0.22)] hover:bg-orange-600'
        }`}
      >
        <ShoppingCart className="h-5 w-5" />
        <span>
          {!product.isAvailable
            ? 'Առկա չէ'
            : addedToCart
              ? pq.addedToCart
              : pq.addToCart}
        </span>
      </button>
    </div>
  )

  if (variant === 'mobileCommerce') {
    return mobileCommerceBlock
  }

  if (variant === 'responsive') {
    return (
      <>
        <div className="lg:hidden">{mobileCommerceBlock}</div>
        <div className="hidden lg:block">{defaultBlock}</div>
      </>
    )
  }

  return defaultBlock
}
