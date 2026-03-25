import Link from 'next/link'
import {
  Award,
  ChefHat,
  Clock,
  Heart,
  Truck,
  Users,
} from 'lucide-react'
import type { AppMessages } from '@/i18n/types'

type AboutCopy = AppMessages['aboutPage']

export function AboutHero({ a }: { a: AboutCopy }) {
  return (
    <section className="promo-food-banner-bg promo-food-banner-vignette relative flex min-h-[min(50vh,26rem)] items-center justify-center overflow-hidden py-14 text-white sm:min-h-[min(52vh,30rem)] sm:py-16 md:py-20">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-8 text-5xl font-bold md:text-7xl">{a.heroTitle}</h1>
        <p className="mx-auto max-w-4xl text-xl leading-relaxed text-white/90 md:text-2xl">
          {a.heroSubtitle}
        </p>
      </div>
    </section>
  )
}

export function AboutStory({ a }: { a: AboutCopy }) {
  return (
    <div className="mb-24">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">{a.storyTitle}</h2>
        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>{a.storyP1}</p>
          <p>{a.storyP2}</p>
          <p>{a.storyP3}</p>
        </div>
      </div>
    </div>
  )
}

const VALUE_ICONS = [Heart, Award, Clock, Users] as const

export function AboutValues({ a }: { a: AboutCopy }) {
  const items = [
    { Icon: VALUE_ICONS[0], title: a.valueLoveTitle, desc: a.valueLoveDesc },
    { Icon: VALUE_ICONS[1], title: a.valueQualityTitle, desc: a.valueQualityDesc },
    { Icon: VALUE_ICONS[2], title: a.valueSpeedTitle, desc: a.valueSpeedDesc },
    { Icon: VALUE_ICONS[3], title: a.valueCommunityTitle, desc: a.valueCommunityDesc },
  ]
  return (
    <div className="mb-24">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
        {a.valuesTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Icon className="h-10 w-10 text-orange-500" aria-hidden />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
            <p className="text-gray-700 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutTeam({ a }: { a: AboutCopy }) {
  const slots = [
    { Icon: ChefHat, title: a.teamChefTitle, desc: a.teamChefDesc },
    { Icon: Users, title: a.teamManagerTitle, desc: a.teamManagerDesc },
    { Icon: Truck, title: a.teamDeliveryTitle, desc: a.teamDeliveryDesc },
  ]
  return (
    <div className="mb-24">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
        {a.teamTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {slots.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Icon className="h-16 w-16 text-orange-500" aria-hidden />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-700 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutStats({ a }: { a: AboutCopy }) {
  const stats = [
    { value: a.statOrdersValue, label: a.statOrdersLabel },
    { value: a.statFlavorsValue, label: a.statFlavorsLabel },
    { value: a.statBranchesValue, label: a.statBranchesLabel },
    { value: a.statPrepValue, label: a.statPrepLabel },
  ]
  return (
    <div className="promo-food-banner-bg promo-food-banner-vignette relative mb-16 overflow-hidden rounded-3xl text-white">
      <div className="relative z-10 flex min-h-[min(42vh,24rem)] flex-col justify-center gap-10 px-6 py-12 text-center sm:px-10 sm:py-14 md:min-h-[26rem] md:px-14 md:py-16">
        <h2 className="text-4xl font-bold">{a.statsTitle}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="group">
              <div className="mb-4 text-6xl font-bold transition-transform group-hover:scale-110">
                {value}
              </div>
              <div className="text-xl text-white/90">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AboutProcess({ a }: { a: AboutCopy }) {
  const steps = [
    { n: 1, title: a.processStep1Title, desc: a.processStep1Desc },
    { n: 2, title: a.processStep2Title, desc: a.processStep2Desc },
    { n: 3, title: a.processStep3Title, desc: a.processStep3Desc },
    { n: 4, title: a.processStep4Title, desc: a.processStep4Desc },
  ]
  return (
    <div className="bg-white rounded-3xl p-16 shadow-lg mb-16">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
        {a.processTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map(({ n, title, desc }) => (
          <div key={n} className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-500">{n}</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-700">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutCta({ a }: { a: AboutCopy }) {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 p-12 md:p-16 text-white text-center shadow-xl mb-4">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{a.ctaTitle}</h2>
      <p className="text-lg text-orange-100 max-w-2xl mx-auto mb-8">{a.ctaSubtitle}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="inline-flex justify-center bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 transition-colors"
        >
          {a.ctaMenu}
        </Link>
        <Link
          href="/contact"
          className="inline-flex justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors"
        >
          {a.ctaContact}
        </Link>
      </div>
    </section>
  )
}
