'use client'

import Footer from '@/components/Footer'
import { useI18n } from '@/i18n/I18nContext'
import {
  AboutHero,
  AboutProcess,
  AboutStory,
  AboutValues,
} from '@/components/about/aboutSections'

export function AboutPageView() {
  const { t } = useI18n()
  const a = t.aboutPage

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />

      <AboutHero a={a} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AboutStory a={a} />
        <AboutValues a={a} />
<AboutProcess a={a} />
      </div>

      <Footer />
    </div>
  )
}
