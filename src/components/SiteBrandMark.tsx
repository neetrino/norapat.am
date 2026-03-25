'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/i18n/I18nContext'
import type { PublicSiteSettingsState } from '@/hooks/usePublicSiteSettings'

const LOGO_WIDTH_DESKTOP = 180
const LOGO_HEIGHT_DESKTOP = 48
const LOGO_WIDTH_MOBILE = 140
const LOGO_HEIGHT_MOBILE = 40

interface SiteBrandMarkProps {
  variant: 'desktop' | 'mobile' | 'footer'
  branding: PublicSiteSettingsState
}

export function SiteBrandMark({ variant, branding }: SiteBrandMarkProps) {
  const { t } = useI18n()
  const { nav } = t
  const { logo, siteName, isLoading } = branding
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [logo])

  const label = siteName ?? nav.siteBrand
  const hasLogo = Boolean(logo?.trim()) && !imageFailed

  const isDesktop = variant === 'desktop'
  const isMobile = variant === 'mobile'
  const isFooter = variant === 'footer'

  if (isLoading) {
    if (isFooter) {
      return (
        <div className="flex min-h-[2rem] items-center" aria-hidden>
          <span className="text-2xl font-bold text-orange-500/90">{nav.siteBrand}</span>
        </div>
      )
    }
    return (
      <div
        className={
          isMobile
            ? 'flex min-h-[2rem] min-w-[6rem] items-center justify-center'
            : 'flex min-h-[3rem] min-w-[8rem] items-center'
        }
        aria-hidden
      >
        <span
          className={
            isMobile
              ? 'text-lg font-bold text-orange-500/90'
              : 'text-2xl font-bold text-orange-500/90 sm:text-3xl'
          }
        >
          {nav.siteBrand}
        </span>
      </div>
    )
  }

  const linkClassName = isDesktop
    ? 'flex min-h-[3rem] items-center rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500'
    : isFooter
      ? 'inline-flex max-w-full items-center rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500'
      : 'block transition-opacity hover:opacity-90'

  const imageWidth = isMobile ? LOGO_WIDTH_MOBILE : LOGO_WIDTH_DESKTOP
  const imageHeight = isMobile ? LOGO_HEIGHT_MOBILE : LOGO_HEIGHT_DESKTOP

  const imageClassName = isDesktop || isFooter
    ? 'h-10 w-auto max-w-[180px] object-contain object-left'
    : 'mx-auto h-8 w-auto max-w-[140px] object-contain'

  const textClassName = isDesktop || isFooter
    ? 'text-2xl font-bold tracking-tight text-orange-500 sm:text-3xl'
    : 'mx-auto block text-center text-lg font-bold tracking-tight text-orange-500'

  return (
    <Link href="/" className={linkClassName} aria-label={label}>
      {hasLogo ? (
        <Image
          src={logo!}
          alt={label}
          width={imageWidth}
          height={imageHeight}
          className={imageClassName}
          priority={isDesktop}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className={textClassName}>{label}</span>
      )}
    </Link>
  )
}
