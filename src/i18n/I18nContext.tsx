'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppLocale, AppMessages } from './types'
import { dictionaries } from './dictionaries'

const STORAGE_KEY = 'pideh-locale'

function isAppLocale(value: string | null): value is AppLocale {
  return value === 'hy'
}

type I18nContextValue = {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
  t: AppMessages
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>('hy')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (isAppLocale(saved)) {
        setLocaleState(saved)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const setLocale = (next: AppLocale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  const t = useMemo(() => dictionaries[locale], [locale])

  useEffect(() => {
    document.documentElement.lang = 'hy'
  }, [locale])

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, t]
  )

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
