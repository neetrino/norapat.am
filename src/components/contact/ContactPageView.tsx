'use client'

import { useState } from 'react'

import Footer from '@/components/Footer'
import { MapEmbed } from '@/components/MapEmbed'
import { BRAND_RED_CTA_IDLE_HOVER_CLASS } from '@/components/home/promo-food-banner/promoFoodBanner.constants'
import { useI18n } from '@/i18n/I18nContext'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
} from 'lucide-react'

export function ContactPageView() {
  const { t } = useI18n()
  const c = t.contactPage
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const faqItems = [
    { question: c.faqPrepQ, answer: c.faqPrepA },
    { question: c.faqDeliveryQ, answer: c.faqDeliveryA },
    { question: c.faqAdvanceQ, answer: c.faqAdvanceA },
    { question: c.faqPaymentQ, answer: c.faqPaymentA },
    { question: c.faqDiscountQ, answer: c.faqDiscountA },
    { question: c.faqContactQ, answer: c.faqContactA },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />

      <section className="promo-food-banner-bg promo-food-banner-vignette relative flex min-h-[min(50vh,26rem)] items-center justify-center overflow-hidden py-14 text-white sm:min-h-[min(52vh,30rem)] sm:py-16 md:py-20">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">{c.heroTitle}</h1>
          <p className="mx-auto max-w-3xl text-xl text-white/90 md:text-2xl">
            {c.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{c.phoneTitle}</h3>
            <p className="text-gray-600 mb-2">+374 95-044-888</p>
            <p className="text-sm text-gray-500">{c.phoneHours}</p>
            <a
              href="tel:+37495044888"
              className={`mt-4 inline-block rounded-xl px-6 py-2 font-medium ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
            >
              {c.callBtn}
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{c.emailTitle}</h3>
            <p className="text-gray-600 mb-2">info@pideh-armenia.am</p>
            <p className="text-sm text-gray-500">{c.emailResponse}</p>
            <a
              href="mailto:info@pideh-armenia.am"
              className={`mt-4 inline-block rounded-xl px-6 py-2 font-medium ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
            >
              {c.writeBtn}
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{c.hoursTitle}</h3>
            <p className="text-gray-600 mb-2">{c.phoneHours}</p>
            <p className="text-sm text-gray-500">{c.deliveryHours}</p>
          </div>
        </div>

        <div className="promo-food-banner-bg promo-food-banner-vignette relative mb-16 overflow-hidden rounded-2xl text-center text-white">
          <div className="relative z-10 px-6 py-8 text-center sm:px-8 sm:py-10">
            <h2 className="mb-4 text-2xl font-bold">{c.quickOrderTitle}</h2>
            <p className="mb-6 text-lg text-white/90">{c.quickOrderSubtitle}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="tel:+37495044888"
                className="inline-flex items-center justify-center space-x-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#A51D1D] transition-colors hover:bg-gray-100"
              >
                <Phone className="h-5 w-5" />
                <span>{c.callPhoneBtn}</span>
              </a>
              <a
                href="https://www.facebook.com/PIDEH.Armenia/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/pideh.armenia/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-700"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mb-16 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {c.branchesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-orange-500" />
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-orange-500" />
                <p className="text-gray-600 text-lg font-semibold">{c.addressZoravar}</p>
              </div>
              <a
                href="https://maps.google.com/?q=Zoravar+Andranik+151%2F2,+Yerevan,+Armenia"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block rounded-xl px-6 py-2 font-medium ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
              >
                {c.onMap}
              </a>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-orange-500" />
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-orange-500" />
                <p className="text-gray-600 text-lg font-semibold">{c.addressEznik}</p>
              </div>
              <a
                href="https://maps.google.com/?q=Eznik+Koghbatsi+83,+Yerevan,+Armenia"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block rounded-xl px-6 py-2 font-medium ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
              >
                {c.onMap}
              </a>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {c.mapTitle}
          </h2>
          <MapEmbed />
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
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
