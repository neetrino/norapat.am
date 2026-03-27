'use client'

/**
 * Embed map showing Pideh Armenia locations in Yerevan.
 * Uses OpenStreetMap iframe — no API key required.
 */
export function MapEmbed() {
  // Yerevan center bbox to show both branches: Zoravar Andranik 151/2, Eznik Koghbatsi 83
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
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-white text-sm">
        <a
          href="https://maps.google.com/?q=Zoravar+Andranik+151%2F2,+Yerevan,+Armenia"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 transition-colors"
        >
          Zoravar Andranik 151/2 ↗
        </a>
        <a
          href="https://maps.google.com/?q=Eznik+Koghbatsi+83,+Yerevan,+Armenia"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 transition-colors"
        >
          Eznik Koghbatsi 83 ↗
        </a>
      </div>
    </div>
  )
}
