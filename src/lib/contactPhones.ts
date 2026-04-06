/** `tel:` href for Armenian/international formats (digits and leading +). */
export function buildTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/**
 * Public contact phone from CMS, plus company defaults; deduped, order preserved.
 */
export function buildContactPhoneLines(
  contactPhoneFromSettings: string | null,
  defaults: readonly string[]
): string[] {
  const trimmed = contactPhoneFromSettings?.trim()
  if (!trimmed) {
    return [...defaults]
  }
  const rest = defaults.filter((p) => p.trim() !== trimmed)
  return [trimmed, ...rest]
}
