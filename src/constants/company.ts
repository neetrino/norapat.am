// Company contact information used by shared info blocks.
/** Primary line (E.164 +37441440003) — same number for WhatsApp Business chat links. */
const primaryPhone = '+374 41 440 003'

/**
 * Google Maps embed `q` — business name + address so the iframe targets the same
 * POI as the Maps listing (avoids a street-level geocode pin offset from the venue).
 */
const MAP_EMBED_QUERY =
  'Norapat Food Court, 5-րդ փողոց, Նորապատ գյուղ, Արմավիր, Հայաստան'

export const companyInfo = {
  name: 'NORAPAT',
  description: 'Traditional Armenian flavors with fast and reliable service.',
  address: '5-րդ փողոց, Նորապատ գյուղ, Արմավիր, Հայաստան',
  mapEmbedQuery: MAP_EMBED_QUERY,
  phone: primaryPhone,
  callNowPhones: [primaryPhone, '+374 77 777 174'],

  workingHours: 'Mon-Sun: 09:00 - 00:00',
  socialMedia: {
    facebook: 'https://www.facebook.com/noorapatfoodcourt/?locale=hy_AM',
    instagram:
      'https://www.instagram.com/norapatfoodcourt?igsh=dDV4YnIxYmxwcXFs',
    /** wa.me opens WhatsApp chat to +37441440003 (digits only, no +). */
    whatsapp: `https://wa.me/${primaryPhone.replace(/\D/g, '')}`,
    website: '/',
  },
}

export default companyInfo
