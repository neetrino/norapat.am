/**
 * Promo food banner — design tokens (տեքստը՝ `i18n` → `home.brandBannerPromo`)։
 */

export const PROMO_COLORS = {
  plate: '#1A1A1A',
  plateRim: '#2a2a2a',
} as const

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
