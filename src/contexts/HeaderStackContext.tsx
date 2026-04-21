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
import { usePathname } from 'next/navigation'
import { TOP_CONTACT_BAR_HEIGHT_MOBILE_PX } from '@/lib/headerTopBar.constants'
import { useTopContactBarStripHeightPx } from '@/hooks/useTopContactBarStripHeight'

const SCROLL_DOWN_HIDE_DELTA_PX = 4
const SCROLL_TOP_SHOW_THRESHOLD_PX = 8

export type HeaderStackValue = {
  topBarVisible: boolean
  /** Inset for fixed headers when the bar is visible (0 when hidden / admin). */
  topBarInsetPx: number
  /** Strip height for current viewport; use for the bar element `height` even when hidden. */
  topBarStripHeightPx: number
}

const defaultValue: HeaderStackValue = {
  topBarVisible: true,
  topBarInsetPx: TOP_CONTACT_BAR_HEIGHT_MOBILE_PX,
  topBarStripHeightPx: TOP_CONTACT_BAR_HEIGHT_MOBILE_PX,
}

const HeaderStackContext = createContext<HeaderStackValue>(defaultValue)

export function useHeaderStack(): HeaderStackValue {
  return useContext(HeaderStackContext)
}

export function HeaderStackProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin =
    pathname?.startsWith('/supersudo') || pathname?.startsWith('/admin') || false
  const topBarStripHeightPx = useTopContactBarStripHeightPx()
  const [topBarVisible, setTopBarVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    setTopBarVisible(true)
    lastScrollY.current =
      typeof window !== 'undefined' ? window.scrollY : 0
  }, [pathname])

  const onScroll = useCallback(() => {
    if (isAdmin) {
      return
    }
    const y = window.scrollY
    const prev = lastScrollY.current
    const delta = y - prev

    if (y < SCROLL_TOP_SHOW_THRESHOLD_PX) {
      setTopBarVisible(true)
    } else if (delta > SCROLL_DOWN_HIDE_DELTA_PX) {
      setTopBarVisible(false)
    }

    lastScrollY.current = y
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin) {
      return
    }
    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isAdmin, onScroll])

  useEffect(() => {
    const offset =
      isAdmin || !topBarVisible
        ? '0px'
        : `${topBarStripHeightPx}px`
    document.documentElement.style.setProperty('--top-bar-offset', offset)
  }, [isAdmin, topBarVisible, topBarStripHeightPx])

  const topBarInsetPx =
    isAdmin || !topBarVisible ? 0 : topBarStripHeightPx

  const value: HeaderStackValue = {
    topBarVisible,
    topBarInsetPx,
    topBarStripHeightPx,
  }

  return (
    <HeaderStackContext.Provider value={value}>
      {children}
    </HeaderStackContext.Provider>
  )
}
