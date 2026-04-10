'use client'

import ServiceWorkerProvider from '@/components/ServiceWorkerProvider'
import FloatingCallWidget from '@/components/FloatingCallWidget'

export default function ClientDecorations() {
  return (
    <>
      <ServiceWorkerProvider />
      <FloatingCallWidget />
    </>
  )
}
