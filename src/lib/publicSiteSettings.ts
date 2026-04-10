import { prisma } from '@/lib/prisma'
import {
  DEFAULT_PUBLIC_LOGO_URL,
  PUBLIC_SITE_SETTING_KEYS,
} from '@/lib/siteSettings.constants'

export interface PublicSiteSettingsData {
  logo: string | null
  siteName: string | null
  contactPhone: string | null
  contactEmail: string | null
  address: string | null
}

function normalizePublicSiteSettings(
  data: Partial<Record<(typeof PUBLIC_SITE_SETTING_KEYS)[number], string>>
): PublicSiteSettingsData {
  const logo =
    typeof data.logo === 'string' && data.logo.trim()
      ? data.logo.trim()
      : DEFAULT_PUBLIC_LOGO_URL

  const siteName =
    typeof data.siteName === 'string' && data.siteName.trim()
      ? data.siteName.trim()
      : null

  const contactPhone =
    typeof data.contactPhone === 'string' && data.contactPhone.trim()
      ? data.contactPhone.trim()
      : null

  const contactEmail =
    typeof data.contactEmail === 'string' && data.contactEmail.trim()
      ? data.contactEmail.trim()
      : null

  const address =
    typeof data.address === 'string' && data.address.trim()
      ? data.address.trim()
      : null

  return {
    logo,
    siteName,
    contactPhone,
    contactEmail,
    address,
  }
}

export async function fetchPublicSiteSettings(): Promise<PublicSiteSettingsData> {
  try {
    const rows = await prisma.settings.findMany({
      where: { key: { in: [...PUBLIC_SITE_SETTING_KEYS] } },
    })

    const map = rows.reduce(
      (acc, row) => {
        const key = row.key as (typeof PUBLIC_SITE_SETTING_KEYS)[number]
        acc[key] = row.value
        return acc
      },
      {} as Partial<Record<(typeof PUBLIC_SITE_SETTING_KEYS)[number], string>>
    )

    return normalizePublicSiteSettings(map)
  } catch {
    return normalizePublicSiteSettings({})
  }
}
