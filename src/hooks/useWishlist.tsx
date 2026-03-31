'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useSession } from 'next-auth/react'
import { LOCAL_WISHLIST_IDS_KEY } from '@/lib/productPreferences.constants'

export interface WishlistProduct {
  id: string
  name: string
  image: string
  price: number
  isAvailable: boolean
}

function readGuestWishlistIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_WISHLIST_IDS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return []
  }
}

function writeGuestWishlistIds(ids: string[]) {
  localStorage.setItem(LOCAL_WISHLIST_IDS_KEY, JSON.stringify(ids))
}

function placeholdersFromIds(ids: string[]): WishlistProduct[] {
  return ids.map((id) => ({
    id,
    name: '',
    image: 'no-image',
    price: 0,
    isAvailable: true,
  }))
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
  const mergeDoneForUserRef = useRef<string | null>(null)

  const fetchWishlist = useCallback(async () => {
    if (!session?.user?.id) return
    try {
      const res = await fetch('/api/wishlist')
      if (!res.ok) return
      const data = (await res.json()) as {
        productIds?: string[]
        products?: WishlistProduct[]
      }
      setProductIds(new Set(data.productIds ?? []))
      setProducts(Array.isArray(data.products) ? data.products : [])
    } catch {
      setProductIds(new Set())
      setProducts([])
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.id) {
      mergeDoneForUserRef.current = null
      const guestIds = readGuestWishlistIds()
      setProductIds(new Set(guestIds))
      setProducts(placeholdersFromIds(guestIds))
      setLoading(false)
      return
    }

    const userId = session.user.id
    let cancelled = false

    void (async () => {
      setLoading(true)
      try {
        const guestIds = readGuestWishlistIds()
        let res = await fetch('/api/wishlist')
        if (!res.ok) throw new Error('wishlist fetch failed')
        let data = (await res.json()) as {
          productIds?: string[]
          products?: WishlistProduct[]
        }

        if (mergeDoneForUserRef.current !== userId && guestIds.length > 0) {
          const serverSet = new Set(data.productIds ?? [])
          for (const id of guestIds) {
            if (!serverSet.has(id)) {
              const post = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id }),
              })
              if (post.ok) serverSet.add(id)
            }
          }
          writeGuestWishlistIds([])
          mergeDoneForUserRef.current = userId

          res = await fetch('/api/wishlist')
          if (res.ok) {
            data = (await res.json()) as {
              productIds?: string[]
              products?: WishlistProduct[]
            }
          }
        }

        if (cancelled) return
        setProductIds(new Set(data.productIds ?? []))
        setProducts(Array.isArray(data.products) ? data.products : [])
      } catch {
        if (!cancelled) {
          setProductIds(new Set())
          setProducts([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [session?.user?.id, status])

  const isInWishlist = useCallback(
    (id: string) => productIds.has(id),
    [productIds]
  )

  const add = useCallback(
    async (productId: string) => {
      if (!session?.user?.id) {
        setProductIds((prev) => {
          const next = new Set(prev).add(productId)
          writeGuestWishlistIds([...next])
          return next
        })
        setProducts((prev) => {
          if (prev.some((p) => p.id === productId)) return prev
          return [
            ...prev,
            {
              id: productId,
              name: '',
              image: 'no-image',
              price: 0,
              isAvailable: true,
            },
          ]
        })
        return
      }

      const prevIds = new Set(productIds)
      const prevProducts = products
      setProductIds((prev) => new Set(prev).add(productId))
      setProducts((prev) => {
        if (prev.some((p) => p.id === productId)) return prev
        return [
          ...prev,
          {
            id: productId,
            name: '',
            image: 'no-image',
            price: 0,
            isAvailable: true,
          },
        ]
      })
      try {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        if (!res.ok) throw new Error('add failed')
        await fetchWishlist()
      } catch {
        setProductIds(prevIds)
        setProducts(prevProducts)
      }
    },
    [session?.user?.id, productIds, products, fetchWishlist]
  )

  const remove = useCallback(
    async (productId: string) => {
      if (!session?.user?.id) {
        setProductIds((prev) => {
          const next = new Set(prev)
          next.delete(productId)
          writeGuestWishlistIds([...next])
          return next
        })
        setProducts((prev) => prev.filter((p) => p.id !== productId))
        return
      }

      const prevIds = new Set(productIds)
      const prevProducts = products
      setProductIds((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      try {
        const res = await fetch(
          `/api/wishlist?productId=${encodeURIComponent(productId)}`,
          { method: 'DELETE' }
        )
        if (!res.ok) throw new Error('remove failed')
        await fetchWishlist()
      } catch {
        setProductIds(prevIds)
        setProducts(prevProducts)
      }
    },
    [session?.user?.id, productIds, products, fetchWishlist]
  )

  const toggle = useCallback(
    async (productId: string) => {
      if (productIds.has(productId)) await remove(productId)
      else await add(productId)
    },
    [productIds, add, remove]
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
    isAuthenticated: !!session?.user?.id,
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
