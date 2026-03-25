'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { useI18n } from '@/i18n/I18nContext'

const HERO_PIZZA_SRC = '/hero-pepperoni-pizza.png'

/**
 * Բրենդային բաննեռի հատված — հերո + շարժական պիցայի նկար (BANNER).
 */
export function BrandBannerSection() {
  const { t } = useI18n()
  const bb = t.brandBanner
  const homeAria = t.home.ariaBrandBanner

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-white to-orange-100/50 text-gray-900" aria-label={homeAria}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-yellow-200/25 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-40 w-40 rounded-full bg-orange-300/20 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-2 pt-8 sm:px-6 sm:pb-4 sm:pt-10 lg:px-8 lg:pt-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 lg:mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="animate-badge-soft flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-yellow-200 bg-white text-center shadow-lg ring-2 ring-orange-200/80">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-orange-700">{bb.promoBadge}</span>
            </div>
            <div className="rounded-full bg-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md">
              {bb.fastDelivery}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="hero-col-enter space-y-5 sm:space-y-6">
            <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-orange-800 shadow-sm ring-1 ring-orange-100">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-orange-500" />
              {bb.badge}
            </div>

            <h1 className="leading-[1.1]">
              <span className="block font-serif text-3xl italic text-orange-600 sm:text-4xl lg:text-5xl">
                {bb.titleWhite}
              </span>
              <span className="mt-1 block text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {bb.titleAccent}
              </span>
              <span className="mt-3 block text-lg font-medium text-orange-600 sm:text-xl lg:text-2xl">
                {bb.tagline}
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-gray-700 sm:text-lg">
              {bb.descriptionBefore}
              <span className="font-semibold text-orange-600">{bb.descriptionHighlight}</span>
              {bb.descriptionAfter}
            </p>

            <p className="text-sm font-medium text-orange-700 sm:text-base lg:hidden">{bb.mobileTagline}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <div className="text-2xl font-bold text-orange-600">15+</div>
                <div className="text-gray-600">{bb.statFlavors}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">20</div>
                <div className="text-gray-600">{bb.statMinutes}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-gray-600">{bb.statDelivery}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-center text-base font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-orange-600 hover:shadow-xl motion-reduce:hover:scale-100"
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
                className="inline-flex items-center justify-center rounded-xl border-2 border-orange-500 bg-white px-6 py-3 text-center text-base font-bold text-orange-600 shadow-sm transition hover:bg-orange-50"
              >
                <Phone className="mr-2 h-4 w-4" aria-hidden />
                {bb.contactUs}
              </Link>
            </div>
          </div>

          <div className="hero-col-enter-delay relative mx-auto flex w-full max-w-2xl items-center justify-center py-4 lg:max-w-none lg:py-0">
            <div
              className="hero-pizza-shadow pointer-events-none absolute bottom-[5%] left-1/2 z-0 h-12 w-[min(78%,380px)] -translate-x-1/2 rounded-[100%] bg-orange-900/20 blur-2xl"
              aria-hidden
            />
            <div className="hero-pizza-bob relative z-10 aspect-[4/3] w-full max-w-[580px]">
              <Image
                src={HERO_PIZZA_SRC}
                alt={`${bb.titleAccent} — ${bb.heroFeaturedLabel}`}
                fill
                priority
                sizes="(max-width: 640px) 94vw, (max-width: 1024px) 80vw, 580px"
                className="object-contain object-center mix-blend-multiply drop-shadow-[0_20px_40px_rgba(238,49,36,0.25)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative -mb-px h-10 w-full overflow-hidden text-orange-600" aria-hidden>
        <svg className="block h-full w-full" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path
            fill="currentColor"
            d="M0,18 C200,38 400,2 600,16 C800,30 1000,4 1200,22 L1200,40 L0,40 Z"
          />
        </svg>
      </div>

      <div className="relative z-10 bg-orange-600 px-4 py-5 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <a
            href="mailto:info@pideh.am"
            className="text-sm font-semibold text-orange-100 underline-offset-4 hover:text-white hover:underline"
          >
            info@pideh.am
          </a>
          <p className="text-sm font-bold tracking-wide">
            24/7 · {bb.statDelivery}
          </p>
          <a
            href="tel:+37495044888"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-orange-100 transition hover:text-white"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            +374 95-044-888
          </a>
        </div>
      </div>
    </section>
  )
}
