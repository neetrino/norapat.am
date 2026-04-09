/** Height of the fixed top contact strip on `lg+` viewports, px */
export const TOP_CONTACT_BAR_HEIGHT_PX = 36

/** Slightly taller strip below `lg` (matches mobile header breakpoint). */
export const TOP_CONTACT_BAR_HEIGHT_MOBILE_PX = 40

/** Align with Tailwind `lg` — mobile vs desktop main header. */
export const TOP_CONTACT_BAR_LAYOUT_BREAKPOINT_MIN_WIDTH_PX = 1024

/** Hide/show animation length, kept in sync with main header `top` transition. */
export const TOP_CONTACT_BAR_TRANSITION_MS = 520

/** Smooth deceleration when the bar slides away. */
export const TOP_CONTACT_BAR_TRANSITION_EASING =
  'cubic-bezier(0.4, 0, 0.2, 1)' as const

/** Fallback when `settings.contactPhone` / `settings.address` are empty */
export const DEFAULT_PUBLIC_CONTACT_PHONE = '+374 41 440 003'

export const DEFAULT_PUBLIC_ADDRESS =
  '5-րդ փողոց, Նորապատ գյուղ, Արմավիր, Հայաստան'
