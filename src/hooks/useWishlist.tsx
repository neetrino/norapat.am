'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode
} from 'react'
import { useSession } from 'next-auth/react'

export interface WishlistProduct {
  id: string
  name: string
  image: string
  price: number
  isAvailable: boolean
}

interface WishlistContextType {
  productIds: string[]
  products: WishlistProduct[]
  isInWishlist: (productId: string) => boolean
  add: (productId: string) => Promise<void>
  remove: (productId: string) => Promise<void>
  toggle: (productId: string) => Promise<void>
  refresh: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [productIds, setProductIds] = useState<Set<string>>(new Set())
  const [products, setProducts] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = useCallback(async () => {
    if (!session?.user) {
      setProductIds(new Set())
      setProducts([])
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/api/wishlist')
      if (res.ok) {
        const data = await res.json()
        setProductIds(new Set(data.productIds ?? []))
        setProducts(Array.isArray(data.products) ? data.products : [])
      }
    } catch {
      setProductIds(new Set())
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [session?.user])

  useEffect(() => {
    if (status === 'loading') return
    fetchWishlist()
  }, [status, fetchWishlist])

  const add = useCallback(
    async (productId: string) => {
      if (!session?.user) return
      try {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
        if (res.ok) {
          setProductIds((prev) => new Set(prev).add(productId))
          await fetchWishlist()
        }
      } catch {
        // ignore
      }
    },
    [session?.user, fetchWishlist]
  )

  const remove = useCallback(
    async (productId: string) => {
      if (!session?.user) return
      try {
        const res = await fetch(
          `/api/wishlist?productId=${encodeURIComponent(productId)}`,
          { method: 'DELETE' }
        )
        if (res.ok) {
          setProductIds((prev) => {
            const next = new Set(prev)
            next.delete(productId)
            return next
          })
          setProducts((prev) => prev.filter((p) => p.id !== productId))
        }
      } catch {
        // ignore
      }
    },
    [session?.user]
  )

  const toggle = useCallback(
    async (productId: string) => {
      if (!session?.user) return
      if (productIds.has(productId)) await remove(productId)
      else await add(productId)
    },
    [session?.user, productIds, add, remove]
  )

  const isInWishlist = useCallback(
    (id: string) => productIds.has(id),
    [productIds]
  )

  const value: WishlistContextType = {
    productIds: Array.from(productIds),
    products,
    isInWishlist,
    add,
    remove,
    toggle,
    refresh: fetchWishlist,
    loading,
    isAuthenticated: !!session?.user
  }

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
