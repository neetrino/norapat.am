'use client'

import { useState } from 'react'

import Footer from '@/components/Footer'
import { MapEmbed } from '@/components/MapEmbed'
import { BRAND_RED_CTA_IDLE_HOVER_CLASS } from '@/components/home/promo-food-banner/promoFoodBanner.constants'
import { usePublicSiteSettings } from '@/hooks/usePublicSiteSettings'
import { useI18n } from '@/i18n/I18nContext'
import { ChevronDown, Clock, Mail, MapPin, Phone } from 'lucide-react'

export function ContactPageView() {
  const { t } = useI18n()
  const c = t.contactPage
  const { contactPhone, contactEmail } = usePublicSiteSettings()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const phoneNumber = contactPhone?.trim() || '+374 95-044-888'
  const emailAddress = contactEmail?.trim() || 'info@pideh.am'
  const locationAddress = c.addressLine
  const locationMapQuery = '5-րդ փողոց, Նորապատ գյուղ, Արմավիր, Հայաստան'
  const phoneHref = `tel:${phoneNumber.replace(/[^\d+]/g, '')}`
  const emailHref = `mailto:${emailAddress}`

  const faqItems = [
    { question: c.faqPrepQ, answer: c.faqPrepA },
    { question: c.faqDeliveryQ, answer: c.faqDeliveryA },
    { question: c.faqAdvanceQ, answer: c.faqAdvanceA },
    { question: c.faqPaymentQ, answer: c.faqPaymentA },
    { question: c.faqDiscountQ, answer: c.faqDiscountA },
    { question: c.faqContactQ, answer: c.faqContactA },
  ]

  const contactCards = [
    {
      icon: Phone,
      title: c.phoneTitle,
      value: phoneNumber,
      caption: null,
      href: phoneHref,
      actionLabel: c.callBtn,
    },
    {
      icon: Mail,
      title: c.emailTitle,
      value: emailAddress,
      caption: c.emailResponse,
      href: emailHref,
      actionLabel: c.writeBtn,
    },
    {
      icon: Clock,
      title: c.hoursTitle,
      value: c.phoneHours,
      caption: c.deliveryHours,
      href: null,
      actionLabel: null,
    },
    {
      icon: MapPin,
      title: c.locationTitle,
      value: locationAddress,
      caption: c.onMap,
      href: null,
      actionLabel: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f5_0%,#fffdfb_38%,#ffffff_100%)]">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />

      <section className="promo-food-banner-bg promo-food-banner-vignette relative flex min-h-[min(46vh,24rem)] items-start justify-center overflow-hidden pt-10 pb-14 text-white sm:min-h-[min(50vh,28rem)] sm:pt-12 sm:pb-16 md:pt-14 md:pb-20">
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-5 inline-flex items-center self-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
            NORAPAT
          </div>
          <h1 className="mx-auto mb-6 text-center text-4xl font-bold tracking-tight md:text-6xl">
            {c.heroTitle}
          </h1>
          <p className="mx-auto max-w-3xl text-center text-lg leading-8 text-white/90 md:text-2xl">
            {c.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-transparent shadow-none">
            <div className="flex flex-col items-center border-b border-stone-200 px-5 py-5 text-center sm:px-6 sm:py-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-700/75">
                {c.quickOrderTitle}
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {c.heroTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                {c.quickOrderSubtitle}
              </p>
            </div>

            <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-4">
              {contactCards.map((card) => {
                const Icon = card.icon

                return (
                  <div
                    key={card.title}
                    className="flex h-full flex-col items-center rounded-[1.35rem] border border-stone-200 bg-white p-4 text-center shadow-[0_8px_22px_rgba(15,23,42,0.04)]"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{card.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-gray-800 sm:text-base">
                      {card.value}
                    </p>
                    {card.caption ? (
                      <p className="mt-1.5 text-sm leading-6 text-gray-500">
                        {card.caption}
                      </p>
                    ) : null}
                    {card.href && card.actionLabel ? (
                      <a
                        href={card.href}
                        className={`mt-auto inline-flex w-fit self-center rounded-xl px-4 py-2 text-sm font-semibold ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
                      >
                        {card.actionLabel}
                      </a>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div id="contact-map" className="mb-16 scroll-mt-32">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            {c.mapTitle}
          </h2>
          <div className="mb-4 flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-800 sm:text-base">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{locationAddress}</span>
          </div>
          <MapEmbed addressQuery={locationMapQuery} title={`${locationAddress} - map`} />
        </div>

        <div className="mb-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            {c.faqTitle}
          </h2>
          <div className="promo-food-banner-bg promo-food-banner-vignette relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(165,29,29,0.22)]">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index

              return (
                <div
                  key={item.question}
                  className={index !== faqItems.length - 1 ? 'border-b border-white/12' : ''}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaqIndex((currentIndex) =>
                        currentIndex === index ? null : index
                      )
                    }
                    className="relative z-10 flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5 sm:px-7 sm:py-5"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold leading-relaxed text-white sm:text-xl sm:leading-[1.45]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-white/90 transition-transform duration-300 sm:h-6 sm:w-6 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen ? (
                    <div className="relative z-10 px-5 pb-4 sm:px-7 sm:pb-5">
                      <p className="max-w-5xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                        {item.answer}
                      </p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}
