'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useSession } from 'next-auth/react'
import { LOCAL_STARRED_IDS_KEY } from '@/lib/productPreferences.constants'

function readGuestStarredIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STARRED_IDS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return []
  }
}

function writeGuestStarredIds(ids: string[]) {
  localStorage.setItem(LOCAL_STARRED_IDS_KEY, JSON.stringify(ids))
}

interface StarredContextType {
  productIds: string[]
  isStarred: (productId: string) => boolean
  toggle: (productId: string) => Promise<void>
  loading: boolean
}

const StarredContext = createContext<StarredContextType | undefined>(undefined)

export function StarredProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [productIds, setProductIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const mergeDoneForUserRef = useRef<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.id) {
      mergeDoneForUserRef.current = null
      const localIds = readGuestStarredIds()
      setProductIds(new Set(localIds))
      setLoading(false)
      return
    }

    const userId = session.user.id
    let cancelled = false

    void (async () => {
      setLoading(true)
      const guestIds = readGuestStarredIds()

      try {
        const res = await fetch('/api/starred')
        if (!res.ok) throw new Error('starred fetch failed')
        const data = (await res.json()) as { productIds?: string[] }
        const serverIds = new Set(
          Array.isArray(data.productIds) ? data.productIds : []
        )

        if (mergeDoneForUserRef.current !== userId && guestIds.length > 0) {
          for (const id of guestIds) {
            if (!serverIds.has(id)) {
              const post = await fetch('/api/starred', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id }),
              })
              if (post.ok) serverIds.add(id)
            }
          }
          writeGuestStarredIds([])
          mergeDoneForUserRef.current = userId
        }

        if (!cancelled) {
          setProductIds(serverIds)
        }
      } catch {
        if (!cancelled) {
          setProductIds(new Set(guestIds))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [session?.user?.id, status])

  const isStarred = useCallback(
    (id: string) => productIds.has(id),
    [productIds]
  )

  const toggle = useCallback(
    async (productId: string) => {
      const wasStarred = productIds.has(productId)

      if (!session?.user?.id) {
        setProductIds((prev) => {
          const next = new Set(prev)
          if (wasStarred) next.delete(productId)
          else next.add(productId)
          writeGuestStarredIds([...next])
          return next
        })
        return
      }

      const previous = new Set(productIds)
      setProductIds((prev) => {
        const next = new Set(prev)
        if (wasStarred) next.delete(productId)
        else next.add(productId)
        return next
      })

      try {
        if (wasStarred) {
          const res = await fetch(
            `/api/starred?productId=${encodeURIComponent(productId)}`,
            { method: 'DELETE' }
          )
          if (!res.ok) throw new Error('unstar failed')
        } else {
          const res = await fetch('/api/starred', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          })
          if (!res.ok) throw new Error('star failed')
        }
      } catch {
        setProductIds(previous)
      }
    },
    [session?.user?.id, productIds]
  )

  const value: StarredContextType = {
    productIds: [...productIds],
    isStarred,
    toggle,
    loading,
  }

  return (
    <StarredContext.Provider value={value}>{children}</StarredContext.Provider>
  )
}

export function useStarred() {
  const ctx = useContext(StarredContext)
  if (ctx === undefined) {
    throw new Error('useStarred must be used within a StarredProvider')
  }
  return ctx
}
