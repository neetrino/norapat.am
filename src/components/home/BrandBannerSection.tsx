'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/I18nContext'
import { HeroBannerRotatingImage } from '@/components/home/promo-food-banner/HeroBannerRotatingImage'
import { HeroPizzaDecorIcons } from '@/components/home/promo-food-banner/HeroPizzaDecorIcons'

/**
 * Բրենդային բաններ՝ երկու սյուն, խորը կարմիր տեքստուրա, հերո պատկերներ (հերթական սլայդեր)։
 */
export function BrandBannerSection() {
  const { t } = useI18n()
  const homeAria = t.home.ariaBrandBanner
  const p = t.home.brandBannerPromo

  return (
    <section className="bg-white py-4 sm:py-5 lg:py-6" aria-label={homeAria}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="promo-food-banner-bg brand-banner-bg-dark promo-food-banner-vignette relative overflow-hidden rounded-[2rem] text-white shadow-[0_18px_48px_rgba(165,29,29,0.18)]">
          <div className="relative z-10 px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 lg:px-8 lg:pb-14 lg:pt-12">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-6 xl:gap-10">
          <div className="relative z-10 max-w-xl space-y-4 sm:space-y-5">
            <div className="relative pl-1">
              {p.super && (
                <span className="font-promo-caveat absolute -left-0.5 -top-7 text-base text-white sm:-top-8 sm:text-lg">
                  {p.super}
                </span>
              )}
              <span className="font-promo-marker block text-[clamp(2.5rem,8vw,3.75rem)] leading-[0.95] text-[#FACC15]">
                {p.delicious}
              </span>
            </div>

            <h1 className="font-promo-marker text-[clamp(3.25rem,11vw,4.5rem)] font-normal leading-[0.95] tracking-tight text-white">
              {p.menu}
            </h1>

            {(p.weekendBefore || p.weekendWord || p.weekendAfter) && (
              <div className="font-promo-caveat text-[clamp(1.35rem,4.2vw,1.85rem)] font-semibold text-[#FACC15]">
                {p.weekendBefore}
                <span className="relative inline-block">
                  {p.weekendWord}
                  <svg
                    className="absolute -bottom-1 left-0 h-3 w-[calc(100%+0.25rem)] text-white sm:h-3.5"
                    viewBox="0 0 200 12"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2 8c28-6 58 4 88-2 32-6 62 2 92-4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </span>
                {p.weekendAfter}
              </div>
            )}

            <p className="max-w-md font-sans text-sm leading-relaxed text-white/95 sm:text-base">
              {p.body}
            </p>

            <div>
              <Link
                href="/products"
                className="font-promo-marker inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#FACC15] px-10 py-3 text-sm font-bold uppercase tracking-wide text-[#A51D1D] transition hover:scale-[1.03] motion-reduce:hover:scale-100 sm:px-12 sm:text-base"
              >
                {p.cta}
              </Link>
            </div>
          </div>

          <div className="relative z-10 flex min-h-[280px] w-full flex-col items-center justify-center sm:min-h-[320px] lg:min-h-[360px]">
            <HeroPizzaDecorIcons />
            <div className="relative z-[5] mt-6 flex w-full -translate-y-2 items-center justify-center sm:mt-8 sm:-translate-y-3 lg:mt-10">
              <div className="animate-promo-plate-float relative z-[5] flex w-full items-center justify-center">
                <HeroBannerRotatingImage />
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
