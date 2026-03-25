'use client'

import { PROMO_COLORS, PROMO_COPY } from './promoFoodBanner.constants'

const WAVE_PATH =
  'M0,52 C72,28 140,68 220,42 C280,24 340,48 400,36 L400,200 L0,200 Z'

/**
 * Bottom-right yellow organic shape with discount copy (SVG path, no bitmap).
 */
export function DiscountWaveCorner() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 z-20 flex h-[min(42%,13rem)] w-[min(58%,17.5rem)] items-end justify-end sm:h-[min(38%,14rem)] sm:w-[min(52%,19rem)] lg:h-56 lg:w-72"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <path fill={PROMO_COLORS.yellow} d={WAVE_PATH} />
      </svg>
      <div className="relative z-10 flex flex-col items-end pb-4 pr-4 pt-8 sm:pb-5 sm:pr-6 lg:pb-6 lg:pr-8">
        <div className="font-promo-marker flex flex-row items-start gap-0.5 text-[#7f1010]">
          <span className="text-[2.75rem] font-normal leading-none tracking-tight sm:text-[3.25rem]">
            {PROMO_COPY.offNumber}
          </span>
          <div className="flex flex-col items-start justify-start pt-1">
            <span className="text-lg leading-none sm:text-xl">{PROMO_COPY.offPercent}</span>
            <span className="mt-1 text-xl leading-none sm:text-2xl">{PROMO_COPY.offWord}</span>
          </div>
        </div>
        <p className="font-promo-caveat mt-1 text-right text-base font-semibold text-[#7f1010] sm:text-lg">
          {PROMO_COPY.offSubline}
        </p>
      </div>
    </div>
  )
}
