'use client'

/**
 * Embed map centered on the selected Pideh Armenia branch.
 */
type MapEmbedProps = {
  addressQuery: string
  title?: string
}

export function MapEmbed({ addressQuery, title = 'Pideh Armenia - location on map' }: MapEmbedProps) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&t=&z=16&ie=UTF8&iwloc=B&output=embed`

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
      <iframe
        title={title}
        src={src}
        className="h-[350px] w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
