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
  ]

  const branches = [
    {
      title: c.addressZoravar,
      href: 'https://maps.google.com/?q=Zoravar+Andranik+151%2F2,+Yerevan,+Armenia',
    },
    {
      title: c.addressEznik,
      href: 'https://maps.google.com/?q=Eznik+Koghbatsi+83,+Yerevan,+Armenia',
    },
  ]

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f5_0%,#fffdfb_38%,#ffffff_100%)]">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />

      <section className="promo-food-banner-bg promo-food-banner-vignette relative flex min-h-[min(46vh,24rem)] items-center justify-center overflow-hidden py-14 text-white sm:min-h-[min(50vh,28rem)] sm:py-16 md:py-20">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
            NORAPAT
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            {c.heroTitle}
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-white/90 md:text-2xl">
            {c.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-transparent shadow-none">
            <div className="border-b border-stone-200 px-5 py-5 sm:px-6 sm:py-6">
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

            <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-3">
              {contactCards.map((card) => {
                const Icon = card.icon

                return (
                  <div
                    key={card.title}
                    className="flex h-full flex-col rounded-[1.35rem] border border-stone-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.04)]"
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
                        className={`mt-4 inline-flex w-fit items-center rounded-xl px-4 py-2 text-sm font-semibold ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
                      >
                        {card.actionLabel}
                      </a>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 bg-transparent p-4 shadow-none sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white text-red-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{c.branchesTitle}</h2>
                <p className="text-sm text-gray-500">{c.onMap}</p>
              </div>
            </div>

            <div className="space-y-3">
              {branches.map((branch) => (
                <a
                  key={branch.title}
                  href={branch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-stone-200 bg-white px-4 py-3 transition-colors hover:border-red-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-700">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 sm:text-[15px]">
                      {branch.title}
                    </span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-red-700">
                    {c.onMap}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            {c.mapTitle}
          </h2>
          <MapEmbed />
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
