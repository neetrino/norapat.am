/** Height of the fixed top contact strip (phone + address), px */
export const TOP_CONTACT_BAR_HEIGHT_PX = 36

/** Hide/show animation length, kept in sync with main header `top` transition. */
export const TOP_CONTACT_BAR_TRANSITION_MS = 520

/** Smooth deceleration when the bar slides away. */
export const TOP_CONTACT_BAR_TRANSITION_EASING =
  'cubic-bezier(0.4, 0, 0.2, 1)' as const

/** Fallback when `settings.contactPhone` / `settings.address` are empty */
export const DEFAULT_PUBLIC_CONTACT_PHONE = '+374 41 440 003'

export const DEFAULT_PUBLIC_ADDRESS =
  '5-րդ փողոց, Նորապատ գյուղ, Արմավիր, Հայաստան'
