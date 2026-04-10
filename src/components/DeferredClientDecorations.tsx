'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ClientDecorations = dynamic(() => import('@/components/ClientDecorations'), {
  ssr: false,
})

function scheduleIdle(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1500 })
    return () => window.cancelIdleCallback(id)
  }

  const timeoutId = globalThis.setTimeout(callback, 600)
  return () => globalThis.clearTimeout(timeoutId)
}

export default function DeferredClientDecorations() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => scheduleIdle(() => setEnabled(true)), [])

  return enabled ? <ClientDecorations /> : null
}
