'use client'

import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Product, CartItem, CartContextType } from '@/types'
import { useHydration } from './useHydration'

const CART_STORAGE_KEY_PREFIX = 'pideh-cart'
const LEGACY_CART_STORAGE_KEY = 'pideh-cart'
const GUEST_CART_STORAGE_KEY = `${CART_STORAGE_KEY_PREFIX}:guest`

const getCartStorageKey = (userId?: string | null) =>
  userId ? `${CART_STORAGE_KEY_PREFIX}:${userId}` : GUEST_CART_STORAGE_KEY

const saveCartToStorage = (storageKey: string, cart: CartItem[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart))
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error)
  }
}

const loadCartFromStorage = (storageKey: string): CartItem[] => {
  try {
    const saved = localStorage.getItem(storageKey)

    if (!saved && storageKey === GUEST_CART_STORAGE_KEY) {
      const legacySaved = localStorage.getItem(LEGACY_CART_STORAGE_KEY)
      return legacySaved ? JSON.parse(legacySaved) : []
    }

    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error)
    return []
  }
}

const clearCartFromStorage = (storageKey: string) => {
  try {
    localStorage.removeItem(storageKey)
  } catch (error) {
    console.warn('Failed to clear cart from localStorage:', error)
  }
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const initialState: CartItem[] = []

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.find((item) => item.product.id === product.id)

      if (existingItem) {
        return state.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...state, { product, quantity }]
    }

    case 'REMOVE_ITEM':
      return state.filter((item) => item.product.id !== action.payload.productId)

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload

      if (quantity <= 0) {
        return state.filter((item) => item.product.id !== productId)
      }

      return state.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }

    case 'CLEAR_CART':
      return []

    case 'LOAD_CART':
      return action.payload

    default:
      return state
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, initialState)
  const isHydrated = useHydration()
  const { data: session, status } = useSession()
  const storageKey = getCartStorageKey(session?.user?.id)

  useEffect(() => {
    if (!isHydrated || status === 'loading') return

    const savedCart = loadCartFromStorage(storageKey)
    dispatch({ type: 'LOAD_CART', payload: savedCart })
  }, [isHydrated, status, storageKey])

  useEffect(() => {
    if (!isHydrated || status === 'loading') return

    if (items.length === 0) {
      clearCartFromStorage(storageKey)

      if (storageKey === GUEST_CART_STORAGE_KEY) {
        clearCartFromStorage(LEGACY_CART_STORAGE_KEY)
      }

      return
    }

    saveCartToStorage(storageKey, items)

    if (storageKey === GUEST_CART_STORAGE_KEY) {
      saveCartToStorage(LEGACY_CART_STORAGE_KEY, items)
    }
  }, [isHydrated, items, status, storageKey])

  const addItem = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const validateCart = async () => {
    if (items.length === 0) return

    try {
      const productIds = items.map((item) => item.product.id)
      const response = await fetch('/api/products/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds }),
      })

      if (response.ok) {
        const { validIds } = await response.json()
        const invalidItems = items.filter((item) => !validIds.includes(item.product.id))

        if (invalidItems.length > 0) {
          console.warn(
            'Removing missing products from cart:',
            invalidItems.map((item) => item.product.name)
          )

          invalidItems.forEach((item) => {
            dispatch({ type: 'REMOVE_ITEM', payload: { productId: item.product.id } })
          })
        }
      }
    } catch (error) {
      console.warn('Failed to validate cart:', error)
    }
  }

  const value: CartContextType = {
    items: isHydrated ? items : [],
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    validateCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
