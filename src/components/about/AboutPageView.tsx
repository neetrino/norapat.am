'use client'

import Footer from '@/components/Footer'
import { useI18n } from '@/i18n/I18nContext'
import {
  AboutHero,
  AboutProcess,
  AboutStats,
  AboutStory,
  AboutTeam,
  AboutValues,
} from '@/components/about/aboutSections'

export function AboutPageView() {
  const { t } = useI18n()
  const a = t.aboutPage

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden h-16" />
      <div className="hidden lg:block h-24" />

      <AboutHero a={a} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AboutStory a={a} />
        <AboutValues a={a} />
        <AboutTeam a={a} />
        <AboutStats a={a} />
        <AboutProcess a={a} />
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>

      <div className="lg:hidden h-16" aria-hidden />
    </div>
  )
}
