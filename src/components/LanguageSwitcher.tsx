'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useI18n } from '@/i18n/I18nContext'
import type { AppLocale } from '@/i18n/types'

const LOCALES: AppLocale[] = ['hy', 'en', 'ru']

const FLAG_SRC: Record<AppLocale, string> = {
  hy: '/images/flags/hy.png',
  en: '/images/flags/en.png',
  ru: '/images/flags/ru.svg',
}

const NATIVE_LANGUAGE_NAME: Record<AppLocale, string> = {
  hy: 'Հայերեն',
  en: 'English',
  ru: 'Русский',
}

type LanguageSwitcherProps = {
  className?: string
  variant?: 'default' | 'compact'
  placement?: 'top' | 'bottom'
}

export function LanguageSwitcher({
  className = '',
  variant = 'default',
  placement = 'bottom',
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [open])

  const pick = (loc: AppLocale) => {
    setLocale(loc)
    setOpen(false)
  }

  const isCompact = variant === 'compact'
  const flagFrame = isCompact
    ? 'h-[18px] w-[26px] min-w-[26px] rounded-[4px]'
    : 'h-5 w-8 min-w-[2rem] rounded-md'

  const triggerPad = isCompact ? 'px-2 py-1.5 gap-1.5' : 'px-3 py-2 gap-2'

  const panelPosition =
    placement === 'top'
      ? 'bottom-full left-1/2 mb-2 -translate-x-1/2 origin-bottom'
      : 'top-full left-1/2 mt-2 -translate-x-1/2 origin-top'

  return (
    <div ref={wrapRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t.languageSwitcher.label}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className={`
          group flex items-center ${triggerPad}
          rounded-full border border-slate-200/90 bg-gradient-to-b from-white to-slate-50
          shadow-sm ring-1 ring-slate-200/50
          transition-all duration-200
          hover:border-orange-200 hover:shadow-md hover:ring-orange-100
          focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
          ${open ? 'border-orange-200 ring-orange-200 shadow-md' : ''}
        `}
      >
        <span className={`relative block overflow-hidden ${flagFrame} border border-black/[0.08] shadow-inner`}>
          {FLAG_SRC[locale].endsWith('.svg') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={FLAG_SRC[locale]}
              alt=""
              className="h-full w-full object-cover"
              width={32}
              height={20}
            />
          ) : (
            <Image
              src={FLAG_SRC[locale]}
              alt=""
              width={32}
              height={20}
              className="h-full w-full object-cover"
              sizes="32px"
            />
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? 'rotate-180 text-orange-500' : 'group-hover:text-orange-400'
          }`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t.languageSwitcher.label}
          className={`
            absolute z-[10020] min-w-[13.5rem] overflow-hidden
            rounded-2xl border border-slate-200/90 bg-white/95 py-1.5
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.18),0_4px_12px_rgba(249,115,22,0.12)]
            backdrop-blur-md
            ${panelPosition}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-slate-100 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {t.languageSwitcher.label}
            </p>
          </div>
          <ul className="px-1.5 pb-1">
            {LOCALES.map((loc) => {
              const active = locale === loc
              const src = FLAG_SRC[loc]
              const isSvg = src.endsWith('.svg')
              return (
                <li key={loc}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(loc)}
                    className={`
                      flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm font-medium
                      transition-colors duration-150
                      ${
                        active
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50/80 text-orange-800'
                          : 'text-slate-700 hover:bg-slate-50'
                      }
                    `}
                  >
                    <span className="relative h-5 w-8 shrink-0 overflow-hidden rounded border border-black/[0.06] shadow-sm">
                      {isSvg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="h-full w-full object-cover" width={32} height={20} />
                      ) : (
                        <Image src={src} alt="" width={32} height={20} className="h-full w-full object-cover" sizes="32px" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">{NATIVE_LANGUAGE_NAME[loc]}</span>
                    {active && (
                      <Check className="h-4 w-4 shrink-0 text-orange-500" strokeWidth={2.5} aria-hidden />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
