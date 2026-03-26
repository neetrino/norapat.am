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
import { TOP_CONTACT_BAR_HEIGHT_PX } from '@/lib/headerTopBar.constants'

const SCROLL_DOWN_HIDE_DELTA_PX = 4
const SCROLL_UP_SHOW_DELTA_PX = 4
const SCROLL_TOP_SHOW_THRESHOLD_PX = 8

export type HeaderStackValue = {
  topBarVisible: boolean
  topBarInsetPx: number
}

const defaultValue: HeaderStackValue = {
  topBarVisible: true,
  topBarInsetPx: TOP_CONTACT_BAR_HEIGHT_PX,
}

const HeaderStackContext = createContext<HeaderStackValue>(defaultValue)

export function useHeaderStack(): HeaderStackValue {
  return useContext(HeaderStackContext)
}

export function HeaderStackProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') ?? false
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
    } else if (delta < -SCROLL_UP_SHOW_DELTA_PX) {
      setTopBarVisible(true)
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
        : `${TOP_CONTACT_BAR_HEIGHT_PX}px`
    document.documentElement.style.setProperty('--top-bar-offset', offset)
  }, [isAdmin, topBarVisible])

  const topBarInsetPx =
    isAdmin || !topBarVisible ? 0 : TOP_CONTACT_BAR_HEIGHT_PX

  const value: HeaderStackValue = {
    topBarVisible,
    topBarInsetPx,
  }

  return (
    <HeaderStackContext.Provider value={value}>
      {children}
    </HeaderStackContext.Provider>
  )
}
