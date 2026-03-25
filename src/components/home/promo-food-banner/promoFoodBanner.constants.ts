/**
 * Promo food banner — design tokens and copy (reference layout, English strings).
 */

export const PROMO_COLORS = {
  plate: '#1A1A1A',
  plateRim: '#2a2a2a',
} as const

/** Hero banner — pepperoni pizza PNG in `public/` (replace file to update artwork). */
export const HERO_BANNER_PIZZA_IMAGE = {
  src: '/hero-pepperoni-pizza.png',
  width: 520,
  height: 520,
} as const

export const PROMO_COPY = {
  super: 'Super',
  delicious: 'Delicious',
  menu: 'Menu',
  weekendBefore: 'This ',
  weekendWord: 'Weekend',
  weekendAfter: ' Only',
  body:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  cta: 'ORDER NOW',
  freeDelivery: 'Free Home Delivery',
} as const
