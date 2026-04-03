import {
  Award,
  Clock,
  Heart,
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
