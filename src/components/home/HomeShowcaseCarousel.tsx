'use client'

import { useRef, useState, useEffect, useCallback, type CSSProperties, type RefObject } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { Product, ProductWithCategory } from '@/types'
import { useI18n } from '@/i18n/I18nContext'

/** Դեսքթոփ՝ մեկ սեղմումով ոլորման քայլ (մոտավորապես մեկ քարտի լայնություն) */
const SCROLL_STEP_PX_NARROW = 176
const SCROLL_STEP_PX_WIDE = 280

/** Գլխավոր էջի հորիզոնական շարքում առավելագույն ապրանքների քանակ */
const HOME_SHOWCASE_SCROLL_MAX_ITEMS = 12

/**
 * Mobile — ավելի compact, ամբողջ քարտը տեսանելի; sm+ — նախկին ռիթմ (~4 քարտ max-w-7xl-ում)։
 */
const CARD_SHELL_CLASS =
  'max-sm:min-w-[138px] max-sm:w-[min(184px,calc(100vw-7rem))] max-sm:max-w-[184px] sm:min-w-[max(200px,min(280px,calc((min(100vw,80rem)-4rem)/4)))] sm:max-w-[280px] flex-shrink-0'

/** Կենտրոնին մոտ քարտի սքեյլ — desktop-ում արտահայտիչ, mobile-ում գրեթե նույն չափի բոլոր քարտերը */
const SHOWCASE_SCALE_MIN_NARROW = 0.92
const SHOWCASE_SCALE_SPAN_NARROW = 0.08
const SHOWCASE_OPACITY_MIN_NARROW = 0.82
const SHOWCASE_OPACITY_SPAN_NARROW = 0.18
const SHOWCASE_SCALE_MIN_WIDE = 0.88
const SHOWCASE_SCALE_SPAN_WIDE = 0.2
const SHOWCASE_OPACITY_MIN_WIDE = 0.65
const SHOWCASE_OPACITY_SPAN_WIDE = 0.35

const SHOWCASE_VIEWPORT_NARROW_MAX_PX = 639

/** Բրենդի կարմիր (#EE3124) — երկու հատվածներում նույն CTA-ն */
const stripToneClasses = {
  orange:
    'border-gray-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-gray-100 hover:border-red-300/80 hover:shadow-[0_12px_32px_rgba(238,49,36,0.10)] hover:ring-red-100/80',
  amber:
    'border-gray-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-gray-100 hover:border-red-300/80 hover:shadow-[0_12px_32px_rgba(238,49,36,0.10)] hover:ring-red-100/80',
} as const

const stripIconToneClasses = {
  orange:
    'bg-gradient-to-br from-red-100/90 to-red-50 text-red-700 ring-red-300/60 group-hover:from-red-200/80 group-hover:to-red-100',
  amber:
    'bg-gradient-to-br from-red-100/90 to-red-50 text-red-700 ring-red-300/60 group-hover:from-red-200/80 group-hover:to-red-100',
} as const

const navArrowClass =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:pointer-events-none disabled:opacity-30 sm:h-11 sm:w-11'

const navArrowEnabledClass =
  'border-red-200/80 text-red-700 hover:border-red-400/80 hover:bg-red-50 hover:shadow-md active:scale-95'

function useShowcaseCarouselScroll(listLength: number, scrollStepPx: number) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateEdges = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth
    setCanScrollLeft(scrollLeft > 1)
    setCanScrollRight(maxScroll > 1 && scrollLeft < maxScroll - 1)
  }, [])

  useEffect(() => {
    const outer = scrollRef.current
    if (!outer) return
    const inner = outer.firstElementChild as HTMLElement | null

    updateEdges()
    outer.addEventListener('scroll', updateEdges, { passive: true })
    const ro = new ResizeObserver(updateEdges)
    ro.observe(outer)
    if (inner) ro.observe(inner)

    return () => {
      outer.removeEventListener('scroll', updateEdges)
      ro.disconnect()
    }
  }, [listLength, updateEdges])

  const scrollByDirection = useCallback(
    (direction: -1 | 1) => {
      scrollRef.current?.scrollBy({ left: direction * scrollStepPx, behavior: 'smooth' })
    },
    [scrollStepPx]
  )

  return { scrollRef, canScrollLeft, canScrollRight, scrollByDirection }
}

function useCenteredCardScale(listLength: number, scrollRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const outer = scrollRef.current
    if (!outer) return
    const inner = outer.firstElementChild as HTMLElement | null
    if (!inner) return

    let frameId = 0

    const applyScale = () => {
      frameId = 0
      const outerRect = outer.getBoundingClientRect()
      const viewportCenter = outerRect.left + outerRect.width / 2
      const items = Array.from(inner.querySelectorAll<HTMLElement>('[data-showcase-item="true"]'))

      const isNarrow = outerRect.width <= SHOWCASE_VIEWPORT_NARROW_MAX_PX
      const scaleMin = isNarrow ? SHOWCASE_SCALE_MIN_NARROW : SHOWCASE_SCALE_MIN_WIDE
      const scaleSpan = isNarrow ? SHOWCASE_SCALE_SPAN_NARROW : SHOWCASE_SCALE_SPAN_WIDE
      const opacityMin = isNarrow ? SHOWCASE_OPACITY_MIN_NARROW : SHOWCASE_OPACITY_MIN_WIDE
      const opacitySpan = isNarrow ? SHOWCASE_OPACITY_SPAN_NARROW : SHOWCASE_OPACITY_SPAN_WIDE

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        const itemCenter = itemRect.left + itemRect.width / 2
        const distance = Math.abs(viewportCenter - itemCenter)
        const falloff = outerRect.width * 0.65
        const proximity = Math.max(0, 1 - distance / Math.max(falloff, 1))
        const scale = scaleMin + proximity * scaleSpan
        const opacity = opacityMin + proximity * opacitySpan

        item.style.setProperty('--showcase-card-scale', scale.toFixed(3))
        item.style.setProperty('--showcase-card-opacity', opacity.toFixed(3))
        item.style.zIndex = String(Math.round(scale * 100))
      })
    }

    const scheduleScale = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(applyScale)
    }

    scheduleScale()
    outer.addEventListener('scroll', scheduleScale, { passive: true })
    window.addEventListener('resize', scheduleScale)

    const ro = new ResizeObserver(scheduleScale)
    ro.observe(outer)
    ro.observe(inner)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      outer.removeEventListener('scroll', scheduleScale)
      window.removeEventListener('resize', scheduleScale)
      ro.disconnect()
    }
  }, [listLength, scrollRef])
}

function CarouselArrowButton(props: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
  ariaLabel: string
}) {
  const Icon = props.direction === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      className={`${navArrowClass} ${navArrowEnabledClass}`}
      aria-label={props.ariaLabel}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  )
}

function ViewEntireStripLink(props: {
  stripClass: string
  stripIconClass: string
  viewEntireWords: string[]
  viewEntireLabel: string
}) {
  const words = props.viewEntireWords.length > 0 ? props.viewEntireWords : [props.viewEntireLabel]
  return (
    <Link
      href="/products"
      className={`group flex h-fit min-h-0 w-[5.75rem] flex-shrink-0 snap-end flex-col items-center justify-center gap-3 rounded-2xl border-2 px-2.5 py-5 text-center transition-all duration-300 sm:w-[6.5rem] sm:px-3 sm:py-6 ${props.stripClass} hover:-translate-y-0.5`}
    >
      <span className="flex flex-col gap-0.5 text-center">
        {words.map((word, wordIndex) => (
          <span
            key={`${wordIndex}-${word}`}
            className="text-[11px] font-semibold leading-snug tracking-tight text-red-950 sm:text-xs"
          >
            {word}
          </span>
        ))}
      </span>
    </Link>
  )
}

function ShowcaseCarouselTrack(props: {
  scrollRef: RefObject<HTMLDivElement | null>
  list: ProductWithCategory[]
  stripClass: string
  stripIconClass: string
  viewEntireWords: string[]
  viewEntireLabel: string
  compactLayout: 'standard' | 'showcaseNarrow'
  onAddToCart?: (product: Product) => void
  addedToCart?: Set<string>
  isInWishlist?: (productId: string) => boolean
  onToggleWishlist?: (productId: string) => void
}) {
  useCenteredCardScale(props.list.length, props.scrollRef)

  const isNarrow = props.compactLayout === 'showcaseNarrow'
  const cardScaleStyle = {
    '--showcase-card-scale': isNarrow ? SHOWCASE_SCALE_MIN_NARROW : SHOWCASE_SCALE_MIN_WIDE,
    '--showcase-card-opacity': isNarrow ? SHOWCASE_OPACITY_MIN_NARROW : SHOWCASE_OPACITY_MIN_WIDE,
  } as CSSProperties

  return (
    <div
      ref={props.scrollRef}
      className="min-w-0 flex-1 overflow-x-auto overflow-y-visible scroll-smooth pb-2 pt-4 sm:pb-3 sm:pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max snap-x snap-mandatory items-center gap-3 overflow-visible pr-2 sm:gap-5 md:gap-6">
        {props.list.map((product) => (
          <div
            key={product.id}
            data-showcase-item="true"
            style={cardScaleStyle}
            className={`snap-start snap-always overflow-visible ${CARD_SHELL_CLASS} transform-gpu transition-[transform,opacity] duration-300 ease-out will-change-transform`}
          >
            <div
              className="transition-[transform,filter] duration-300 ease-out"
              style={{
                opacity: 'var(--showcase-card-opacity)',
                transform: 'scale(var(--showcase-card-scale))',
                transformOrigin: 'center center',
              }}
            >
              <ProductCard
                product={product}
                onAddToCart={props.onAddToCart}
                variant="compact"
                compactLayout={props.compactLayout}
                addedToCart={props.addedToCart}
                isInWishlist={props.isInWishlist?.(product.id)}
                onToggleWishlist={props.onToggleWishlist}
              />
            </div>
          </div>
        ))}
        <ViewEntireStripLink
          stripClass={props.stripClass}
          stripIconClass={props.stripIconClass}
          viewEntireWords={props.viewEntireWords}
          viewEntireLabel={props.viewEntireLabel}
        />
      </div>
    </div>
  )
}

export interface HomeShowcaseCarouselProps {
  products: ProductWithCategory[]
  tone: keyof typeof stripToneClasses
  viewEntireLabel: string
  onAddToCart?: (product: Product) => void
  addedToCart?: Set<string>
  isInWishlist?: (productId: string) => boolean
  onToggleWishlist?: (productId: string) => void
}

/**
 * Գլխավոր էջ — մինչև 12 ապրանք, ոլորում սլաքերով (առանց սքրոլբարի), վերջում «Դիտել ամբողջը»։
 */
export function HomeShowcaseCarousel({
  products,
  tone,
  viewEntireLabel,
  onAddToCart,
  addedToCart,
  isInWishlist,
  onToggleWishlist,
}: HomeShowcaseCarouselProps) {
  const { t } = useI18n()
  const h = t.home
  const list = products.slice(0, HOME_SHOWCASE_SCROLL_MAX_ITEMS)
  const [isNarrowViewport, setIsNarrowViewport] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${SHOWCASE_VIEWPORT_NARROW_MAX_PX}px)`)
    const sync = () => setIsNarrowViewport(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const scrollStepPx = isNarrowViewport ? SCROLL_STEP_PX_NARROW : SCROLL_STEP_PX_WIDE
  const { scrollRef, canScrollLeft, canScrollRight, scrollByDirection } =
    useShowcaseCarouselScroll(list.length, scrollStepPx)
  const stripClass = stripToneClasses[tone]
  const stripIconClass = stripIconToneClasses[tone]
  const viewEntireWords = viewEntireLabel.trim().split(/\s+/).filter(Boolean)

  return (
    <div className="-mx-4 px-1 sm:mx-0 sm:px-0">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <CarouselArrowButton
          direction="prev"
          disabled={!canScrollLeft}
          onClick={() => scrollByDirection(-1)}
          ariaLabel={h.carouselScrollPrev}
        />
        <ShowcaseCarouselTrack
          scrollRef={scrollRef}
          list={list}
          stripClass={stripClass}
          stripIconClass={stripIconClass}
          viewEntireWords={viewEntireWords}
          viewEntireLabel={viewEntireLabel}
          compactLayout={isNarrowViewport ? 'showcaseNarrow' : 'standard'}
          onAddToCart={onAddToCart}
          addedToCart={addedToCart}
          isInWishlist={isInWishlist}
          onToggleWishlist={onToggleWishlist}
        />
        <CarouselArrowButton
          direction="next"
          disabled={!canScrollRight}
          onClick={() => scrollByDirection(1)}
          ariaLabel={h.carouselScrollNext}
        />
      </div>
    </div>
  )
}
