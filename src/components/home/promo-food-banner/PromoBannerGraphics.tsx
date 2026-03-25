'use client'

function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M20 4v32M4 20h32M9 9l22 22M31 9L9 31" />
    </svg>
  )
}

export function PromoBannerSparkles() {
  return (
    <>
      <Sparkle className="pointer-events-none absolute left-[6%] top-[18%] h-9 w-9 text-white/90 motion-safe:animate-promo-sparkle" />
      <Sparkle className="pointer-events-none absolute right-[8%] top-[52%] h-8 w-8 text-white/85 motion-safe:animate-promo-sparkle-delay" />
    </>
  )
}

export function PromoBannerDeliveryArrow() {
  return (
    <svg
      className="promo-arrow-draw mt-1 h-10 w-14 text-white"
      viewBox="0 0 56 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6c14 2 26 10 34 22" />
      <path d="M32 24l10 6-4 10" />
    </svg>
  )
}
