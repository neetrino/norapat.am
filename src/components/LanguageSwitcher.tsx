'use client'

import { useI18n } from '@/i18n/I18nContext'
import type { AppLocale } from '@/i18n/types'

type LanguageSwitcherProps = {
  className?: string
  variant?: 'default' | 'compact'
}

export function LanguageSwitcher({
  className = '',
  variant = 'default',
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n()

  const baseSelect =
    variant === 'compact'
      ? 'text-xs font-semibold bg-white/90 border border-gray-200 rounded-lg px-2 py-1 text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
      : 'text-sm font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[5.5rem]'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="sr-only">{t.languageSwitcher.label}</span>
      <select
        aria-label={t.languageSwitcher.label}
        value={locale}
        onChange={(e) => setLocale(e.target.value as AppLocale)}
        className={baseSelect}
      >
        <option value="hy">{t.languageSwitcher.hy}</option>
        <option value="en">{t.languageSwitcher.en}</option>
        <option value="ru">{t.languageSwitcher.ru}</option>
      </select>
    </div>
  )
}
