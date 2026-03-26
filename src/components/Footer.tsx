'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'
import { useI18n } from '@/i18n/I18nContext'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'
import { SiteBrandMark } from '@/components/SiteBrandMark'

const LINK_HOVER = 'transition-colors hover:text-red-800'
const LINK_BASE = `text-stone-600 ${LINK_HOVER}`
const ICON_ACCENT = 'text-red-800'

export default function Footer() {
  const { t } = useI18n()
  const { nav, footer: f } = t
  const branding = usePublicSiteSettings()

  return (
    <footer className="relative border-t border-stone-300 bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 pt-10 pb-6 xl:flex-row xl:items-end xl:gap-12 xl:pb-8">
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="mb-4">
                  <SiteBrandMark variant="footer" branding={branding} />
                </div>
                <p className="mb-4 max-w-xl text-stone-600">{f.tagline}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="tel:+37495044888"
                    className={LINK_BASE}
                    aria-label={f.ariaPhone}
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:info@pideh.am"
                    className={LINK_BASE}
                    aria-label={f.ariaEmail}
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK_BASE}
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK_BASE}
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-stone-900">
                  {f.navHeading}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className={LINK_BASE}>
                      {nav.home}
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className={LINK_BASE}>
                      {nav.menu}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className={LINK_BASE}>
                      {nav.about}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className={LINK_BASE}>
                      {nav.contact}
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund" className={LINK_BASE}>
                      {f.refundPolicy}
                    </Link>
                  </li>
                  <li>
                    <Link href="/delivery" className={LINK_BASE}>
                      {f.deliveryPolicy}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-stone-900">
                  {f.contactsHeading}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className={`h-4 w-4 ${ICON_ACCENT}`} />
                    <a href="tel:+37495044888" className={LINK_BASE}>
                      +374 95-044-888
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className={`h-4 w-4 ${ICON_ACCENT}`} />
                    <a href="mailto:info@pideh.am" className={LINK_BASE}>
                      info@pideh.am
                    </a>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className={`h-4 w-4 ${ICON_ACCENT}`} />
                      <a
                        href="https://maps.google.com/?q=Zoravar+Andranik+151%2F2,+Yerevan,+Armenia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_BASE}
                      >
                        {f.addressZoravar}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className={`h-4 w-4 ${ICON_ACCENT}`} />
                      <a
                        href="https://maps.google.com/?q=Eznik+Koghbatsi+83,+Yerevan,+Armenia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_BASE}
                      >
                        {f.addressEznik}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className={`h-4 w-4 ${ICON_ACCENT}`} />
                    <div className="text-stone-600">
                      <div>{f.hoursWeek}</div>
                      <div className="text-sm">{f.hoursDelivery}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-center xl:w-[260px] xl:justify-end">
            <Image
              src="/footer-taraz-mascot.png"
              alt={f.mascotAlt}
              width={320}
              height={640}
              className="h-[200px] w-auto select-none object-contain object-bottom sm:h-[240px] xl:h-[min(320px,42vh)]"
              sizes="(max-width: 640px) 200px, (max-width: 1280px) 240px, 280px"
              priority={false}
            />
          </div>
        </div>
      </div>

      <div className="promo-food-banner-bg promo-food-banner-vignette relative border-t border-white/15 text-white">
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm md:justify-start">
              <Link
                href="/privacy"
                className="text-white/95 transition-colors hover:text-[#FACC15]"
              >
                {f.privacy}
              </Link>
              <Link
                href="/terms"
                className="text-white/95 transition-colors hover:text-[#FACC15]"
              >
                {f.terms}
              </Link>
              <Link
                href="/refund"
                className="text-white/95 transition-colors hover:text-[#FACC15]"
              >
                {f.refundShort}
              </Link>
              <Link
                href="/delivery"
                className="text-white/95 transition-colors hover:text-[#FACC15]"
              >
                {f.deliveryShort}
              </Link>
            </div>
            <p className="text-center text-sm font-normal tracking-wide text-white/90 md:text-right">
              {f.copyright} {f.createdBy}{' '}
              <a
                href="https://neetrino.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#FACC15] transition-colors hover:text-[#fde047]"
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
