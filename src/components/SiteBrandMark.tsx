'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/i18n/I18nContext'
import type { PublicSiteSettingsState } from '@/hooks/usePublicSiteSettings'

const LOGO_WIDTH_DESKTOP = 240
const LOGO_HEIGHT_DESKTOP = 64
const LOGO_WIDTH_MOBILE = 176
const LOGO_HEIGHT_MOBILE = 48
const LOGO_WIDTH_FOOTER = 720
const LOGO_HEIGHT_FOOTER = 192

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
        <div className="flex min-h-[1.75rem] items-center" aria-hidden>
          <span className="text-xl font-bold text-orange-500/90 sm:text-2xl">{nav.siteBrand}</span>
        </div>
      )
    }
    return (
      <div
        className={
          isMobile
            ? 'flex min-h-[2rem] min-w-[6rem] items-center justify-center'
            : 'flex min-h-[4rem] min-w-[10rem] items-center'
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
    ? 'flex min-h-[4rem] items-center rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500'
    : isFooter
      ? 'inline-flex max-w-full items-center rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500'
      : 'block transition-opacity hover:opacity-90'

  const imageWidth = isMobile
    ? LOGO_WIDTH_MOBILE
    : isFooter
      ? LOGO_WIDTH_FOOTER
      : LOGO_WIDTH_DESKTOP
  const imageHeight = isMobile
    ? LOGO_HEIGHT_MOBILE
    : isFooter
      ? LOGO_HEIGHT_FOOTER
      : LOGO_HEIGHT_DESKTOP

  const imageClassName = isDesktop
    ? 'h-14 w-auto max-w-[240px] object-contain object-left sm:h-16 sm:max-w-[260px]'
    : isFooter
      ? 'h-[132px] w-auto max-w-[600px] object-contain object-left sm:h-[144px] sm:max-w-[660px]'
    : 'mx-auto h-11 w-auto max-w-[176px] object-contain sm:h-12 sm:max-w-[192px]'

  const textClassName = isDesktop
    ? 'text-2xl font-bold tracking-tight text-orange-500 sm:text-3xl'
    : isFooter
      ? 'text-xl font-bold tracking-tight text-orange-500 sm:text-2xl'
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
