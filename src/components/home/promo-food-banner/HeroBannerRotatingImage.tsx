'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
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
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const previousIndexResetTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (previousIndexResetTimeoutRef.current != null) {
        window.clearTimeout(previousIndexResetTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const nextSlide = HERO_BANNER_SLIDES[(activeIndex + 1) % HERO_BANNER_SLIDES.length]
    const preloadImage = new window.Image()
    preloadImage.src = nextSlide.src
  }, [activeIndex])

  useEffect(() => {
    if (reducedMotion) return undefined
    const timerId = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % HERO_BANNER_SLIDES.length
        setPreviousIndex(currentIndex)
        if (previousIndexResetTimeoutRef.current != null) {
          window.clearTimeout(previousIndexResetTimeoutRef.current)
        }
        previousIndexResetTimeoutRef.current = window.setTimeout(() => {
          setPreviousIndex(null)
          previousIndexResetTimeoutRef.current = null
        }, 450)
        return nextIndex
      })
    }, HERO_BANNER_ROTATION_MS)
    return () => window.clearInterval(timerId)
  }, [reducedMotion])

  const renderIndices = Array.from(
    new Set([activeIndex, previousIndex].filter((index): index is number => index != null))
  )

  return (
    <div className="relative aspect-square w-full max-w-[min(100%,420px)] sm:max-w-[480px]">
      {renderIndices.map((i) => {
        const slide = HERO_BANNER_SLIDES[i]
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
            priority={activeIndex === 0 && previousIndex == null && i === 0}
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 480px"
          />
        )
      })}
    </div>
  )
}
