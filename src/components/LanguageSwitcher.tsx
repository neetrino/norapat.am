'use client'

import Image from 'next/image'
import { useI18n } from '@/i18n/I18nContext'
import type { AppLocale } from '@/i18n/types'

const LOCALES: AppLocale[] = ['hy', 'en', 'ru']

const FLAG_SRC: Record<AppLocale, string> = {
  hy: '/images/flags/hy.png',
  en: '/images/flags/en.png',
  ru: '/images/flags/ru.svg',
}

type LanguageSwitcherProps = {
  className?: string
  variant?: 'default' | 'compact'
}

export function LanguageSwitcher({
  className = '',
  variant = 'default',
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n()

  const size =
    variant === 'compact'
      ? { className: 'h-3.5 w-[1.4rem] min-w-[1.4rem]', btn: 'p-0.5' }
      : { className: 'h-[18px] w-7 min-w-[1.75rem]', btn: 'p-1' }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50/90 p-1 shadow-sm ${className}`}
      role="group"
      aria-label={t.languageSwitcher.label}
    >
      {LOCALES.map((loc) => {
        const active = locale === loc
        const label = t.languageSwitcher[loc]
        const src = FLAG_SRC[loc]
        const isSvg = src.endsWith('.svg')
        return (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            title={label}
            aria-label={label}
            aria-pressed={active}
            className={`
              ${size.btn} rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1
              ${active ? 'ring-2 ring-orange-500 ring-offset-1 bg-white shadow-sm' : 'opacity-75 hover:opacity-100 hover:bg-white/80'}
            `}
          >
            <span className={`relative block overflow-hidden rounded-sm border border-black/10 ${size.className}`}>
              {isSvg ? (
                // eslint-disable-next-line @next/next/no-img-element -- SVG from /public
                <img src={src} alt="" className="h-full w-full object-cover" width={28} height={18} />
              ) : (
                <Image
                  src={src}
                  alt=""
                  width={28}
                  height={18}
                  className="h-full w-full object-cover"
                  sizes="28px"
                />
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
