'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'
import { useI18n } from '@/i18n/I18nContext'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'
import { SiteBrandMark } from '@/components/SiteBrandMark'
import { companyInfo } from '@/constants/company'
import { buildContactPhoneLines, buildTelHref } from '@/lib/contactPhones'

const LINK_HOVER = 'transition-colors hover:text-red-800'
const LINK_BASE = `text-[13px] leading-snug text-stone-600 sm:text-sm sm:leading-normal ${LINK_HOVER}`
const LINK_POLICY = `text-xs leading-snug text-stone-600 sm:text-[13px] sm:leading-5 ${LINK_HOVER}`
const ICON_ACCENT = 'text-red-800'
const SECTION_LABEL =
  'mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-stone-500 sm:mb-2 sm:text-[11px]'
const CONTACT_ICON_BOX = `mt-0.5 h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5 ${ICON_ACCENT}`
const SOCIAL_BTN =
  'inline-flex h-8 w-8 items-center justify-center rounded-md border border-stone-200/80 bg-white/60 text-stone-600 shadow-sm transition-colors hover:border-stone-300 hover:text-red-800 sm:h-9 sm:w-9 sm:rounded-lg'
/** Extra top offset: mobile — once after brand; lg — all three columns aligned below footer top */
const FOOTER_NAV_TOP = 'pt-4 sm:pt-5 lg:pt-6'
/** Horizontal rule below nav & policies — mobile & tablet only (sits flush between stacked rows) */
const FOOTER_MOBILE_RULE_BELOW =
  'max-lg:border-b max-lg:border-stone-200/70 max-lg:pb-4 lg:border-b-0 lg:pb-0'

/** Split artwork — mobile/tablet footer only; desktop keeps `SiteBrandMark` */
const FOOTER_MOBILE_BRAND_SRC = {
  left: '/footer-mobile-brand-1.png',
  right: '/footer-mobile-brand-2.png',
} as const
const FOOTER_MOBILE_BRAND_INTRINSIC = { width: 360, height: 480 } as const
/** Display height — mobile footer split artwork */
const FOOTER_MOBILE_BRAND_HEIGHT_CLASS =
  'h-[6.5rem] w-auto max-w-[48%] shrink-0 object-contain object-top sm:h-[7.5rem]'

/** Footer promo bar — payment badge row (uniform visual height; tighter on narrow screens) */
const FOOTER_PAYMENT_ICON_CLASS =
  'h-4 w-auto max-w-[3.25rem] object-contain object-left opacity-95 sm:h-6 sm:max-w-[4.5rem]'

/** Mobile: stick promo strip above fixed tab bar (`MobileBottomNav` uses `bottom-16` clearance). */
const FOOTER_PROMO_MOBILE_DOCK =
  'max-lg:sticky max-lg:bottom-16 max-lg:z-30 max-lg:shadow-[0_-4px_24px_rgba(0,0,0,0.14)] lg:static lg:shadow-none'

const FOOTER_PAYMENT_LOGOS = [
  { src: '/payment-visa.png', alt: 'Visa', width: 48, height: 16 },
  { src: '/payment-mastercard.png', alt: 'Mastercard', width: 56, height: 36 },
  { src: '/idram-logo.png', alt: 'Idram', width: 56, height: 24 },
  { src: '/arca-logo.png', alt: 'ArCa', width: 48, height: 20 },
] as const

export default function Footer() {
  const { t } = useI18n()
  const { nav, footer: f } = t
  const branding = usePublicSiteSettings()
  const footerPhoneLines = buildContactPhoneLines(
    branding.contactPhone,
    companyInfo.callNowPhones
  )
  const homeAriaLabel = branding.siteName?.trim() || nav.siteBrand

  return (
    <>
    <footer className="relative border-t border-stone-200/90 bg-gradient-to-b from-stone-50/90 to-white text-stone-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-4 sm:gap-4 sm:py-5 md:py-6 lg:flex-row lg:items-end lg:gap-6 xl:gap-8">
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 max-lg:gap-y-0 lg:grid-cols-12 lg:gap-x-10 xl:gap-12">
              <div className="lg:col-span-4">
                <div className="mb-0.5">
                  <div className="lg:hidden">
                    <Link
                      href="/"
                      className="flex w-full max-w-full items-start justify-center gap-1.5 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                      aria-label={homeAriaLabel}
                    >
                      <Image
                        src={FOOTER_MOBILE_BRAND_SRC.right}
                        alt=""
                        width={FOOTER_MOBILE_BRAND_INTRINSIC.width}
                        height={FOOTER_MOBILE_BRAND_INTRINSIC.height}
                        className={FOOTER_MOBILE_BRAND_HEIGHT_CLASS}
                        sizes="(max-width: 1024px) 48vw, 1px"
                        priority={false}
                      />
                      <Image
                        src={FOOTER_MOBILE_BRAND_SRC.left}
                        alt=""
                        width={FOOTER_MOBILE_BRAND_INTRINSIC.width}
                        height={FOOTER_MOBILE_BRAND_INTRINSIC.height}
                        className={FOOTER_MOBILE_BRAND_HEIGHT_CLASS}
                        sizes="(max-width: 1024px) 48vw, 1px"
                        priority={false}
                      />
                    </Link>
                  </div>
                  <div className="hidden lg:block">
                    <SiteBrandMark variant="footer" branding={branding} />
                  </div>
                </div>
                <p className="-mt-1.5 mb-2 max-w-md text-xs leading-snug text-stone-600 sm:-mt-2 sm:mb-2.5 sm:text-sm sm:leading-relaxed">
                  {f.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <a
                    href={companyInfo.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SOCIAL_BTN}
                    aria-label="Facebook"
                  >
                    <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href={companyInfo.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SOCIAL_BTN}
                    aria-label="Instagram"
                  >
                    <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href={companyInfo.socialMedia.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SOCIAL_BTN}
                    aria-label="WhatsApp"
                  >
                    <WhatsAppGlyph className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                </div>
              </div>

              <nav
                className={`${FOOTER_NAV_TOP} lg:col-span-2 ${FOOTER_MOBILE_RULE_BELOW}`}
                aria-labelledby="footer-nav-heading"
              >
                <h2 id="footer-nav-heading" className={SECTION_LABEL}>
                  {f.navHeading}
                </h2>
                <ul className="space-y-1 sm:space-y-1.5">
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
                className={`max-lg:pt-4 lg:col-span-3 ${FOOTER_MOBILE_RULE_BELOW} lg:pt-6`}
                aria-labelledby="footer-policies-heading"
              >
                <h2 id="footer-policies-heading" className={SECTION_LABEL}>
                  {f.policiesHeading}
                </h2>
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-2 sm:gap-y-1.5 lg:grid-cols-1">
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

              <div
                className="max-lg:pt-4 lg:col-span-3 lg:pt-6"
                aria-labelledby="footer-contact-heading"
              >
                <h2 id="footer-contact-heading" className={SECTION_LABEL}>
                  {f.contactsHeading}
                </h2>
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex gap-1.5 sm:gap-2">
                    <Phone className={CONTACT_ICON_BOX} aria-hidden />
                    <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
                      {footerPhoneLines.map((phone) => (
                        <a
                          key={phone}
                          href={buildTelHref(phone)}
                          className={LINK_BASE}
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2">
                    <Mail className={CONTACT_ICON_BOX} aria-hidden />
                    <a href={`mailto:${companyInfo.email}`} className={LINK_BASE}>
                      {companyInfo.email}
                    </a>
                  </div>
                  <div className="border-t border-stone-200/60 pt-2 sm:pt-2.5">
                    <div className="flex gap-1.5 sm:gap-2">
                      <MapPin className={CONTACT_ICON_BOX} aria-hidden />
                      <a
                        href="https://maps.google.com/?q=5-%D6%80%D5%A4+%D6%83%D5%B8%D5%B2%D5%B8%D6%81,+%D5%86%D5%B8%D6%80%D5%A1%D5%BA%D5%A1%D5%BF+%D5%A3%D5%B5%D5%B8%D6%82%D5%B2,+%D4%B1%D6%80%D5%B4%D5%A1%D5%BE%D5%AB%D6%80,+%D5%80%D5%A1%D5%B5%D5%A1%D5%BD%D5%BF%D5%A1%D5%B6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_BASE}
                      >
                        {f.addressLine}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-1.5 border-t border-stone-200/60 pt-2 sm:gap-2 sm:pt-2.5">
                    <Clock className={CONTACT_ICON_BOX} aria-hidden />
                    <div className="text-[13px] leading-snug text-stone-600 sm:text-sm">
                      <div>{f.hoursWeek}</div>
                      <div className="mt-0.5 text-[11px] text-stone-500 sm:text-xs">
                        {f.hoursDelivery}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden shrink-0 justify-center lg:flex lg:justify-end lg:translate-x-12">
            <Image
              src="/footer-taraz-mascot.png"
              alt={f.mascotAlt}
              width={280}
              height={560}
              className="h-[min(240px,32vh)] w-auto select-none object-contain object-bottom xl:h-[min(280px,36vh)]"
              sizes="(max-width: 1280px) 240px, 280px"
              priority={false}
            />
          </div>
        </div>
      </div>

      <div
        className={`promo-food-banner-bg promo-food-banner-vignette relative border-t border-white/10 text-white ${FOOTER_PROMO_MOBILE_DOCK}`}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2 sm:gap-3">
            <p className="min-w-0 max-w-full text-center text-[11px] font-normal leading-snug tracking-wide text-white/90 sm:text-left sm:leading-relaxed lg:whitespace-nowrap xl:text-xs">
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
            <div
              className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-end sm:gap-6"
              aria-label={f.paymentMethodsAria}
            >
              {FOOTER_PAYMENT_LOGOS.map((logo) => (
                <Image
                  key={logo.src}
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={FOOTER_PAYMENT_ICON_CLASS}
                  sizes="(max-width: 640px) 25vw, 96px"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
    {/* Scroll clearance above fixed MobileBottomNav (root layout) */}
    <div className="h-16 lg:hidden" aria-hidden />
    </>
  )
}
