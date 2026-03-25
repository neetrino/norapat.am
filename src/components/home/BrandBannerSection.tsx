'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { useI18n } from '@/i18n/I18nContext'

const HERO_PIZZA_SRC = '/hero-pepperoni-pizza.png'

/**
 * Բրենդային բաննեռի հատված — հերո + շարժական պիցայի նկար (BANNER).
 * Կոմպոզիցիա՝ խորը կարմիր ֆոն, դիագոնալ սպիտակ շերտ, ոսկե ակցենտներ։
 */
export function BrandBannerSection() {
  const { t } = useI18n()
  const bb = t.brandBanner
  const homeAria = t.home.ariaBrandBanner

  return (
    <section
      className="brand-banner-section relative overflow-hidden bg-[var(--brand-banner-bg)] text-white"
      aria-label={homeAria}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-[18%] top-0 h-[125%] w-[min(72%,520px)] -skew-x-[17deg] bg-white/[0.09]" />
        <div className="brand-banner-corner-tl absolute -left-24 -top-28 h-[min(55vw,28rem)] w-[min(55vw,28rem)] rounded-full blur-3xl" />
        <div className="brand-banner-corner-br absolute -bottom-32 -right-20 h-[min(60vw,32rem)] w-[min(60vw,32rem)] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-2 pt-8 sm:px-6 sm:pb-4 sm:pt-10 lg:px-8 lg:pt-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 lg:mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="animate-badge-soft flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-white/90 bg-white/95 text-center shadow-lg ring-2 ring-[color-mix(in_srgb,var(--brand-banner-accent)_45%,transparent)]">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-banner-bg)]">
                {bb.promoBadge}
              </span>
            </div>
            <div className="rounded-full bg-[var(--brand-banner-accent)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-black shadow-md">
              {bb.fastDelivery}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="hero-col-enter space-y-5 sm:space-y-6">
            <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-white/25">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-[var(--brand-banner-accent)]" />
              {bb.badge}
            </div>

            <h1 className="leading-[1.1]">
              <span className="block font-serif text-3xl italic text-white sm:text-4xl lg:text-5xl">
                {bb.titleWhite}
              </span>
              <span className="mt-1 block text-4xl font-extrabold tracking-tight text-[var(--brand-banner-accent)] sm:text-5xl lg:text-6xl">
                {bb.titleAccent}
              </span>
              <span className="mt-3 block text-lg font-medium text-white/95 sm:text-xl lg:text-2xl">
                {bb.tagline}
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {bb.descriptionBefore}
              <span className="font-semibold text-[var(--brand-banner-accent)]">{bb.descriptionHighlight}</span>
              {bb.descriptionAfter}
            </p>

            <p className="text-sm font-medium text-[var(--brand-banner-accent)] sm:text-base lg:hidden">
              {bb.mobileTagline}
            </p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <div className="text-2xl font-bold text-[var(--brand-banner-accent)]">15+</div>
                <div className="text-white/75">{bb.statFlavors}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--brand-banner-accent)]">20</div>
                <div className="text-white/75">{bb.statMinutes}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-2xl font-bold text-[var(--brand-banner-accent)]">24/7</div>
                <div className="text-white/75">{bb.statDelivery}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center rounded-full bg-[var(--brand-banner-accent)] px-6 py-3 text-center text-base font-bold text-black shadow-lg transition hover:scale-[1.02] hover:brightness-95 hover:shadow-xl motion-reduce:hover:scale-100"
              >
                {bb.viewMenu}
                <svg
                  className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/90 bg-transparent px-6 py-3 text-center text-base font-bold text-white shadow-sm transition hover:bg-white/10"
              >
                <Phone className="mr-2 h-4 w-4" aria-hidden />
                {bb.contactUs}
              </Link>
            </div>
          </div>

          <div className="hero-col-enter-delay relative mx-auto flex w-full max-w-2xl items-center justify-center py-4 lg:max-w-none lg:py-0">
            <div
              className="hero-pizza-shadow pointer-events-none absolute bottom-[5%] left-1/2 z-0 h-12 w-[min(78%,380px)] -translate-x-1/2 rounded-[100%] bg-[color-mix(in_srgb,var(--brand-banner-bg-deep)_55%,black)]/35 blur-2xl"
              aria-hidden
            />
            <div className="hero-pizza-bob relative z-10 aspect-[4/3] w-full max-w-[580px]">
              <Image
                src={HERO_PIZZA_SRC}
                alt={`${bb.titleAccent} — ${bb.heroFeaturedLabel}`}
                fill
                priority
                sizes="(max-width: 640px) 94vw, (max-width: 1024px) 80vw, 580px"
                className="object-contain object-center drop-shadow-[0_20px_42px_rgba(74,10,10,0.45)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none relative -mb-px h-10 w-full overflow-hidden text-[var(--brand-banner-bg-deep)]"
        aria-hidden
      >
        <svg className="block h-full w-full" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path
            fill="currentColor"
            d="M0,18 C200,38 400,2 600,16 C800,30 1000,4 1200,22 L1200,40 L0,40 Z"
          />
        </svg>
      </div>

      <div className="relative z-10 bg-[var(--brand-banner-bg-deep)] px-4 py-5 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <a
            href="mailto:info@pideh.am"
            className="text-sm font-semibold text-white/80 underline-offset-4 hover:text-[var(--brand-banner-accent)] hover:underline"
          >
            info@pideh.am
          </a>
          <p className="text-sm font-bold tracking-wide">
            24/7 · {bb.statDelivery}
          </p>
          <a
            href="tel:+37495044888"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/80 transition hover:text-[var(--brand-banner-accent)]"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            +374 95-044-888
          </a>
        </div>
      </div>
    </section>
  )
}
