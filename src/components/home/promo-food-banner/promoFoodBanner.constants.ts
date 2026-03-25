/**
 * Promo food banner — design tokens (տեքստը՝ `i18n` → `home.brandBannerPromo`)։
 */

export const PROMO_COLORS = {
  plate: '#1A1A1A',
  plateRim: '#2a2a2a',
} as const

/**
 * Վառ կարմիր CTA — default #E53225, hover — բանների base (#a51d1d, `globals.css` `.promo-food-banner-bg`)։
 * ProductCard «Ավելացնել», գլխավոր `viewFullMenu` և նման կոճակներ։
 */
export const BRAND_RED_CTA_IDLE_HOVER_CLASS =
  'bg-[#E53225] text-white transition-colors duration-300 hover:bg-[#a51d1d]'

/** Հերո բանների սլայդերի փոխարինման interval (ms) — `HeroBannerRotatingImage`. */
export const HERO_BANNER_ROTATION_MS = 6000

/**
 * Հերո բանների պատկերների հերթականություն (`public/`)։
 * Պիցա / բուրգեր / բիրիանի — նույն aspect, object-contain ստեկում։
 */
export const HERO_BANNER_SLIDES = [
  { src: '/hero-banner-slide-pizza.png' },
  { src: '/hero-banner-slide-burger.png' },
  { src: '/hero-banner-slide-biryani.png' },
] as const
