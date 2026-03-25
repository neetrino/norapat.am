import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PUBLIC_SITE_SETTING_KEYS } from '@/lib/siteSettings.constants'

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

    return NextResponse.json(
      {
        logo: map.logo ?? '',
        siteName: map.siteName ?? '',
      },
      { headers: { 'Cache-Control': CACHE_CONTROL } }
    )
  } catch {
    return NextResponse.json(
      { logo: '', siteName: '' },
      { headers: { 'Cache-Control': CACHE_CONTROL } }
    )
  }
}
