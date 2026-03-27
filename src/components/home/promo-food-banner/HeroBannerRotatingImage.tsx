'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  HERO_BANNER_ROTATION_MS,
  HERO_BANNER_SLIDES,
} from '@/components/home/promo-food-banner/promoFoodBanner.constants'

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * Հերո բանների աջ սյուն — կերակրի պատկերների հերթական փոխարինում
 * (crossfade + թեթև scale / translateY / blur)։
 */
export function HeroBannerRotatingImage() {
  const reducedMotion = usePrefersReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion) return undefined
    const timerId = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_BANNER_SLIDES.length)
    }, HERO_BANNER_ROTATION_MS)
    return () => window.clearInterval(timerId)
  }, [reducedMotion])

  return (
    <div className="relative aspect-square w-full max-w-[min(100%,420px)] sm:max-w-[480px]">
      {HERO_BANNER_SLIDES.map((slide, i) => {
        const isOn = i === activeIndex
        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            aria-hidden={!isOn}
            className={cn(
              'hero-banner-slide-img origin-center object-contain object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.35)] will-change-[transform,opacity,filter]',
              isOn
                ? 'hero-banner-slide-img--active z-[1] opacity-100'
                : 'hero-banner-slide-img--idle z-0 opacity-0 pointer-events-none',
            )}
            priority={i === 0}
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 480px"
          />
        )
      })}
    </div>
  )
}
