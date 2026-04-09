// Company contact information used by shared info blocks.
const primaryPhone = '+374 41 440 003'

export const companyInfo = {
  name: 'NORAPAT',
  description: 'Traditional Armenian flavors with fast and reliable service.',
  address: '5-րդ փողոց, Նորապատ գյուղ, Արմավիր, Հայաստան',
  phone: primaryPhone,
  callNowPhones: [primaryPhone, '+374 77 777 174'],
  email: 'info@norapat.am',
  workingHours: 'Mon-Sun: 09:00 - 00:00',
  socialMedia: {
    facebook: 'https://www.facebook.com/noorapatfoodcourt/?locale=hy_AM',
    instagram:
      'https://www.instagram.com/norapatfoodcourt?igsh=dDV4YnIxYmxwcXFs',
    /** Chat link for the primary business line (digits only per wa.me). */
    whatsapp: `https://wa.me/${primaryPhone.replace(/\D/g, '')}`,
    website: '/',
  },
}

export default companyInfo
