'use client'

import dynamic from 'next/dynamic'
import { ReactNode, useEffect, useState } from 'react'

const PullToRefresh = dynamic(() => import('@/components/PullToRefresh'))

interface DeferredPullToRefreshProps {
  children: ReactNode
}

function scheduleIdle(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1500 })
    return () => window.cancelIdleCallback(id)
  }

  const timeoutId = globalThis.setTimeout(callback, 600)
  return () => globalThis.clearTimeout(timeoutId)
}

export default function DeferredPullToRefresh({
  children,
}: DeferredPullToRefreshProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const isTouchLike =
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0

    if (!isTouchLike) return

    return scheduleIdle(() => setEnabled(true))
  }, [])

  return enabled ? <PullToRefresh>{children}</PullToRefresh> : <>{children}</>
}
