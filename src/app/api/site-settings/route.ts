import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  DEFAULT_PUBLIC_LOGO_URL,
  PUBLIC_SITE_SETTING_KEYS,
} from '@/lib/siteSettings.constants'

const CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=120'

/**
 * Public read-only site branding (logo URL, site name) for header/footer.
 */
export async function GET() {
  try {
    const rows = await prisma.settings.findMany({
      where: { key: { in: [...PUBLIC_SITE_SETTING_KEYS] } },
    })

    const map = rows.reduce(
      (acc, row) => {
        acc[row.key] = row.value
        return acc
      },
      {} as Record<string, string>
    )

    const hasLogoKey = rows.some((row) => row.key === 'logo')
    const logoFromDb = map.logo?.trim() ?? ''
    const logo =
      logoFromDb || (!hasLogoKey ? DEFAULT_PUBLIC_LOGO_URL : '')

    return NextResponse.json(
      {
        logo,
        siteName: map.siteName ?? '',
        contactPhone: map.contactPhone ?? '',
        address: map.address ?? '',
      },
      { headers: { 'Cache-Control': CACHE_CONTROL } }
    )
  } catch {
    return NextResponse.json(
      {
        logo: DEFAULT_PUBLIC_LOGO_URL,
        siteName: '',
        contactPhone: '',
        address: '',
      },
      { headers: { 'Cache-Control': CACHE_CONTROL } }
    )
  }
}
