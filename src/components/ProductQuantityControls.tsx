'use client'

import { useState, useCallback } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'

interface ProductQuantityControlsProps {
  product: Product
}

export default function ProductQuantityControls({ product }: ProductQuantityControlsProps) {
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = useCallback(() => {
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }, [product, quantity, addItem])

  return (
    <>
      <div className="flex items-center space-x-6">
        <label className="text-lg font-medium text-gray-900">Количество:</label>
        <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-orange-100 transition-colors text-gray-700 hover:text-orange-600"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="px-6 py-3 min-w-[4rem] text-center text-lg font-semibold bg-gray-50 text-gray-900">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-orange-100 transition-colors text-gray-700 hover:text-orange-600"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleAddToCart}
          className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
            addedToCart
              ? 'bg-green-500 text-white scale-105 shadow-lg'
              : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
        >
          <ShoppingCart className="h-6 w-6" />
          <span>
            {addedToCart ? '✓ Добавлено в корзину!' : 'Добавить в корзину'}
          </span>
        </button>
      </div>
    </>
  )
}
