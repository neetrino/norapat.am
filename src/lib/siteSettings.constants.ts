/** Default branding asset when `settings.logo` is empty */
export const DEFAULT_PUBLIC_LOGO_URL = '/logo.png'

/** Fallback when `settings.contactEmail` is empty */
export const DEFAULT_PUBLIC_CONTACT_EMAIL = 'norapatfoodcourt@gmail.com'

/** Keys stored in `settings` table for the public site / admin form */
export const SITE_SETTING_KEYS = [
  'logo',
  'siteName',
  'siteDescription',
  'contactPhone',
  'contactEmail',
  'address',
] as const

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number]

/** Public-safe keys exposed via GET /api/site-settings (no auth) */
export const PUBLIC_SITE_SETTING_KEYS = [
  'logo',
  'siteName',
  'contactPhone',
  'contactEmail',
  'address',
] as const

export type PublicSiteSettingKey = (typeof PUBLIC_SITE_SETTING_KEYS)[number]
