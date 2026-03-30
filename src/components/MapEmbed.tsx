'use client'

/**
 * Embed map showing Pideh Armenia locations in Yerevan.
 * Uses OpenStreetMap iframe with no duplicate address links below the map.
 */
export function MapEmbed() {
  const bbox = '44.499,40.170,44.532,40.193'

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
      <iframe
        title="Pideh Armenia - locations on map"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=40.1814,44.5097`}
        className="h-[350px] w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
