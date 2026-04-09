'use client'

import { useSyncExternalStore } from 'react'
import {
  TOP_CONTACT_BAR_HEIGHT_MOBILE_PX,
  TOP_CONTACT_BAR_HEIGHT_PX,
  TOP_CONTACT_BAR_LAYOUT_BREAKPOINT_MIN_WIDTH_PX,
} from '@/lib/headerTopBar.constants'

function subscribeLgViewport(onChange: () => void) {
  const mq = window.matchMedia(
    `(min-width: ${TOP_CONTACT_BAR_LAYOUT_BREAKPOINT_MIN_WIDTH_PX}px)`
  )
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getStripHeightSnapshot(): number {
  return window.matchMedia(
    `(min-width: ${TOP_CONTACT_BAR_LAYOUT_BREAKPOINT_MIN_WIDTH_PX}px)`
  ).matches
    ? TOP_CONTACT_BAR_HEIGHT_PX
    : TOP_CONTACT_BAR_HEIGHT_MOBILE_PX
}

/**
 * Physical height of the top contact strip for the current viewport (`lg` vs below).
 */
export function useTopContactBarStripHeightPx(): number {
  return useSyncExternalStore(
    subscribeLgViewport,
    getStripHeightSnapshot,
    () => TOP_CONTACT_BAR_HEIGHT_MOBILE_PX
  )
}
