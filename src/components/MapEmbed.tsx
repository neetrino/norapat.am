'use client'

/**
 * Zoom level so the venue fills the iframe without extra panning.
 */
const MAP_EMBED_ZOOM = 18

type MapEmbedProps = {
  /**
   * Google Maps search string — prefer the official business name + location so
   * the embed centers on the same POI as Google Maps (not a nearby street geocode).
   */
  embedQuery: string
  title?: string
}

function buildGoogleMapsEmbedSrc(query: string): string {
  const q = query.trim()
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${MAP_EMBED_ZOOM}&output=embed&hl=hy`
}

/**
 * Embedded map centered on a Google Maps place search result.
 */
export function MapEmbed({
  embedQuery,
  title = 'Norapat Food Court - location on map',
}: MapEmbedProps) {
  const src = buildGoogleMapsEmbedSrc(embedQuery)

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
      <iframe
        title={title}
        src={src}
        className="h-[440px] w-full border-0 sm:h-[460px] md:h-[500px]"
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
