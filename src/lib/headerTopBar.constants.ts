/** Height of the fixed top contact strip (phone + address), px */
export const TOP_CONTACT_BAR_HEIGHT_PX = 36

/** Hide/show animation length — kept in sync with main header `top` transition */
export const TOP_CONTACT_BAR_TRANSITION_MS = 520

/**
 * Smooth deceleration (Material-like) — feels softer than linear `ease-out`
 * when the bar slides away.
 */
export const TOP_CONTACT_BAR_TRANSITION_EASING =
  'cubic-bezier(0.4, 0, 0.2, 1)' as const

/** Fallback when `settings.contactPhone` / `settings.address` are empty */
export const DEFAULT_PUBLIC_CONTACT_PHONE = '+374 95-044-888'

export const DEFAULT_PUBLIC_ADDRESS =
  'Երևան · Զորավար Անդրանիկ 151/2 · Եզնիկ Կողբացի 83'
