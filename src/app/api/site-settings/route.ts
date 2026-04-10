import { NextResponse } from 'next/server'
import { fetchPublicSiteSettings } from '@/lib/publicSiteSettings'

const CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=120'

/**
 * Public read-only site branding (logo URL, site name) for header/footer.
 */
export async function GET() {
  try {
    const settings = await fetchPublicSiteSettings()

    return NextResponse.json(
      settings,
      { headers: { 'Cache-Control': CACHE_CONTROL } }
    )
  } catch {
    return NextResponse.json({}, { headers: { 'Cache-Control': CACHE_CONTROL } })
  }
}
