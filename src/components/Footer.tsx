'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'
import { useI18n } from '@/i18n/I18nContext'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'
import { SiteBrandMark } from '@/components/SiteBrandMark'
import { companyInfo } from '@/constants/company'

const LINK_HOVER = 'transition-colors hover:text-red-800'
const LINK_BASE = `text-sm text-stone-600 ${LINK_HOVER}`
const LINK_POLICY = `text-[13px] leading-5 text-stone-600 ${LINK_HOVER} sm:text-sm`
const ICON_ACCENT = 'text-red-800'
const SECTION_LABEL =
  'mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500'
const CONTACT_ICON_BOX = `mt-0.5 h-3.5 w-3.5 shrink-0 ${ICON_ACCENT}`
const SOCIAL_BTN =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200/80 bg-white/60 text-stone-600 shadow-sm transition-colors hover:border-stone-300 hover:text-red-800'

export default function Footer() {
  const { t } = useI18n()
  const { nav, footer: f } = t
  const branding = usePublicSiteSettings()

  return (
    <footer className="relative border-t border-stone-200/90 bg-gradient-to-b from-stone-50/90 to-white text-stone-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 py-7 md:gap-7 md:py-8 lg:flex-row lg:items-end lg:gap-8 xl:gap-10">
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-8 xl:gap-10">
              <div className="lg:col-span-4 lg:border-r lg:border-stone-200/70 lg:pr-6 xl:pr-8">
                <div className="mb-0.5">
                  <SiteBrandMark variant="footer" branding={branding} />
                </div>
                <p className="-mt-2 mb-3 max-w-md text-sm leading-relaxed text-stone-600">
                  {f.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={companyInfo.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SOCIAL_BTN}
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href={companyInfo.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SOCIAL_BTN}
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <nav
                className="lg:col-span-2 lg:border-r lg:border-stone-200/70 lg:pr-6 xl:pr-8"
                aria-labelledby="footer-nav-heading"
              >
                <h2 id="footer-nav-heading" className={SECTION_LABEL}>
                  {f.navHeading}
                </h2>
                <ul className="space-y-2">
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
                </ul>
              </nav>

              <div
                className="lg:col-span-3 lg:border-r lg:border-stone-200/70 lg:pl-6 lg:pr-10 xl:pl-8 xl:pr-12"
                aria-labelledby="footer-policies-heading"
              >
                <h2 id="footer-policies-heading" className={SECTION_LABEL}>
                  {f.policiesHeading}
                </h2>
                <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-1">
                  <Link href="/privacy" className={LINK_POLICY}>
                    {f.privacy}
                  </Link>
                  <Link href="/terms" className={LINK_POLICY}>
                    {f.terms}
                  </Link>
                  <Link href="/refund" className={LINK_POLICY}>
                    {f.refundPolicy}
                  </Link>
                  <Link href="/delivery" className={LINK_POLICY}>
                    {f.deliveryPolicy}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-3 lg:pl-8 xl:pl-10" aria-labelledby="footer-contact-heading">
                <h2 id="footer-contact-heading" className={SECTION_LABEL}>
                  {f.contactsHeading}
                </h2>
                <div className="space-y-2.5">
                  <div className="flex gap-2">
                    <Phone className={CONTACT_ICON_BOX} aria-hidden />
                    <a href="tel:+37495044888" className={LINK_BASE}>
                      +374 95-044-888
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Mail className={CONTACT_ICON_BOX} aria-hidden />
                    <a href="mailto:info@pideh.am" className={LINK_BASE}>
                      info@pideh.am
                    </a>
                  </div>
                  <div className="border-t border-stone-200/60 pt-2.5">
                    <div className="flex gap-2">
                      <MapPin className={CONTACT_ICON_BOX} aria-hidden />
                      <a
                        href="https://maps.google.com/?q=5th+Street,+Village+of+Norapat,+Armavir,+Armenia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_BASE}
                      >
                        {f.addressLine}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-stone-200/60 pt-2.5">
                    <Clock className={CONTACT_ICON_BOX} aria-hidden />
                    <div className="text-sm leading-snug text-stone-600">
                      <div>{f.hoursWeek}</div>
                      <div className="mt-0.5 text-xs text-stone-500">
                        {f.hoursDelivery}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-center lg:justify-end">
            <Image
              src="/footer-taraz-mascot.png"
              alt={f.mascotAlt}
              width={280}
              height={560}
              className="h-[180px] w-auto select-none object-contain object-bottom sm:h-[220px] lg:h-[min(280px,36vh)] xl:h-[min(320px,40vh)]"
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 320px"
              priority={false}
            />
          </div>
        </div>
      </div>

      <div className="promo-food-banner-bg promo-food-banner-vignette relative border-t border-white/10 text-white">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex justify-center md:justify-end">
            <p className="text-center text-[11px] font-normal leading-relaxed tracking-wide text-white/85 sm:text-xs md:text-right lg:whitespace-nowrap">
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
