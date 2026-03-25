'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'
import { useI18n } from '@/i18n/I18nContext'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'
import { SiteBrandMark } from '@/components/SiteBrandMark'

export default function Footer() {
  const { t } = useI18n()
  const { nav, footer: f } = t
  const branding = usePublicSiteSettings()

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <SiteBrandMark variant="footer" branding={branding} />
            </div>
            <p className="text-gray-600 mb-4">
              {f.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="tel:+37495044888" className="text-gray-600 hover:text-orange-500 transition-colors" aria-label={f.ariaPhone}>
                <Phone className="h-5 w-5" />
              </a>
              <a href="mailto:info@pideh.am" className="text-gray-600 hover:text-orange-500 transition-colors" aria-label={f.ariaEmail}>
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">{f.navHeading}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {nav.home}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {nav.menu}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {nav.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {nav.contact}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {f.refundPolicy}
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-gray-600 hover:text-orange-500 transition-colors">
                  {f.deliveryPolicy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">{f.contactsHeading}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <a href="tel:+37495044888" className="text-gray-600 hover:text-orange-500 transition-colors">
                  +374 95-044-888
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <a href="mailto:info@pideh.am" className="text-gray-600 hover:text-orange-500 transition-colors">
                  info@pideh.am
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <a 
                    href="https://maps.google.com/?q=Zoravar+Andranik+151%2F2,+Yerevan,+Armenia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    {f.addressZoravar}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <a 
                    href="https://maps.google.com/?q=Eznik+Koghbatsi+83,+Yerevan,+Armenia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    {f.addressEznik}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div className="text-gray-600">
                  <div>{f.hoursWeek}</div>
                  <div className="text-sm">{f.hoursDelivery}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-orange-500 transition-colors">
                {f.privacy}
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-orange-500 transition-colors">
                {f.terms}
              </Link>
              <Link href="/refund" className="text-gray-500 hover:text-orange-500 transition-colors">
                {f.refundShort}
              </Link>
              <Link href="/delivery" className="text-gray-500 hover:text-orange-500 transition-colors">
                {f.deliveryShort}
              </Link>
            </div>
            <p className="text-sm font-light tracking-wide text-gray-500">
              {f.copyright} {f.createdBy}{' '}
              <a 
                href="https://neetrino.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 transition-colors font-normal"
              >
                Neetrino IT Company
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
