'use client'

import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  type CSSProperties,
  type RefObject,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { Product, ProductWithCategory } from '@/types'
import { useI18n } from '@/i18n/I18nContext'

/** Գլխավոր էջի հորիզոնական շարքում առավելագույն ապրանքների քանակ */
const HOME_SHOWCASE_SCROLL_MAX_ITEMS = 12

/** Քիչ քարտերով կենտրոնացնելը իմաստ չունի; սքրոլը երկկողմանի է միայն 2+ ապրանքի դեպքում */
const MIN_PRODUCT_COUNT_TO_CENTER_INITIAL_SCROLL = 2

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

const navArrowBaseClass =
  'flex shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:pointer-events-none disabled:opacity-30'

const navArrowSizeClasses = {
  md: 'h-10 w-10 sm:h-11 sm:w-11',
  sm: 'h-8 w-8',
} as const

const navArrowEnabledClass =
  'border-red-200/80 text-red-700 hover:border-red-400/80 hover:bg-red-50 hover:shadow-md active:scale-95'

function centerInitialShowcaseScroll(outer: HTMLDivElement): void {
  const items = outer.querySelectorAll<HTMLElement>('[data-showcase-item="true"]')
  if (items.length < MIN_PRODUCT_COUNT_TO_CENTER_INITIAL_SCROLL) return

  const mid = Math.floor((items.length - 1) / 2)
  const item = items[mid]
  const itemCenter = item.offsetLeft + item.offsetWidth / 2
  const targetScroll = itemCenter - outer.clientWidth / 2
  const maxScroll = Math.max(0, outer.scrollWidth - outer.clientWidth)
  outer.scrollLeft = Math.max(0, Math.min(targetScroll, maxScroll))
}

function getShowcaseProductItems(outer: HTMLDivElement): HTMLElement[] {
  return Array.from(outer.querySelectorAll<HTMLElement>('[data-showcase-item="true"]'))
}

/**
 * Finds the product index whose center is closest to the viewport center, then scrolls so the
 * adjacent card (or track end) is centered — avoids fixed px steps that never match card+gap width.
 */
function scrollShowcaseByOneCard(outer: HTMLDivElement, direction: -1 | 1): void {
  const items = getShowcaseProductItems(outer)
  if (items.length === 0) return

  const viewportCenterX = outer.scrollLeft + outer.clientWidth / 2
  let bestIdx = 0
  let bestDist = Infinity
  items.forEach((el, i) => {
    const c = el.offsetLeft + el.offsetWidth / 2
    const d = Math.abs(c - viewportCenterX)
    if (d < bestDist) {
      bestDist = d
      bestIdx = i
    }
  })

  const maxScroll = Math.max(0, outer.scrollWidth - outer.clientWidth)

  const scrollToCenterItem = (el: HTMLElement) => {
    const itemCenter = el.offsetLeft + el.offsetWidth / 2
    const targetScroll = itemCenter - outer.clientWidth / 2
    outer.scrollTo({ left: Math.max(0, Math.min(targetScroll, maxScroll)), behavior: 'auto' })
  }

  if (direction === 1) {
    if (bestIdx < items.length - 1) {
      scrollToCenterItem(items[bestIdx + 1]!)
    } else {
      outer.scrollTo({ left: maxScroll, behavior: 'auto' })
    }
    return
  }

  if (bestIdx > 0) {
    scrollToCenterItem(items[bestIdx - 1]!)
  } else {
    outer.scrollTo({ left: 0, behavior: 'auto' })
  }
}

function useShowcaseCarouselScroll(listLength: number) {
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

  /** Սկզբից միջին քարտը կենտրոնում՝ թե առաջ, թե ետ սքրոլի հնարավորությամբ */
  useLayoutEffect(() => {
    const outer = scrollRef.current
    if (!outer) return

    const applyCenter = () => {
      centerInitialShowcaseScroll(outer)
      updateEdges()
    }

    applyCenter()
    requestAnimationFrame(applyCenter)
  }, [listLength, updateEdges])

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

  const scrollByDirection = useCallback((direction: -1 | 1) => {
    const outer = scrollRef.current
    if (!outer) return
    scrollShowcaseByOneCard(outer, direction)
  }, [])

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
  size?: keyof typeof navArrowSizeClasses
}) {
  const size = props.size ?? 'md'
  const Icon = props.direction === 'prev' ? ChevronLeft : ChevronRight
  const iconClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      className={`${navArrowBaseClass} ${navArrowSizeClasses[size]} ${navArrowEnabledClass}`}
      aria-label={props.ariaLabel}
    >
      <Icon className={iconClass} aria-hidden />
    </button>
  )
}

function ShowcaseCarouselTrack(props: {
  scrollRef: RefObject<HTMLDivElement | null>
  list: ProductWithCategory[]
  compactLayout: 'standard' | 'showcaseNarrow'
  /** Mobile — հորիզոնական սքրոլ + կենտրոնացված scale, առանց snap/սլաքեր */
  isMobileScrollOnly: boolean
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

  /** Աջ վերևի փոքր սլաքերի տարածություն + սքրոլբար թաքնված */
  const scrollRegionClass =
    'min-w-0 w-full overflow-x-auto overflow-y-visible scroll-smooth pb-2 pt-10 sm:pb-3 sm:pt-11 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

  /** Stretch row height so every shell matches the tallest card; avoids shorter cards looking “wrong” next to scale. */
  const trackSnapClass = props.isMobileScrollOnly
    ? 'flex w-max items-stretch gap-4 overflow-visible pr-2 sm:gap-5 sm:snap-x sm:snap-mandatory md:gap-6'
    : 'flex w-max snap-x snap-mandatory items-stretch gap-3 overflow-visible pr-2 sm:gap-5 md:gap-6'

  const cardShellClass = props.isMobileScrollOnly
    ? `${CARD_SHELL_CLASS} overflow-visible transform-gpu transition-[transform,opacity] duration-300 ease-out will-change-transform sm:snap-start sm:snap-always`
    : `${CARD_SHELL_CLASS} snap-start snap-always overflow-visible transform-gpu transition-[transform,opacity] duration-300 ease-out will-change-transform`

  const innerTransformStyle = {
    opacity: 'var(--showcase-card-opacity)',
    transform: 'scale(var(--showcase-card-scale))',
    transformOrigin: 'center center',
  } as CSSProperties

  return (
    <div ref={props.scrollRef} className={scrollRegionClass}>
      <div className={trackSnapClass}>
        {props.list.map((product) => (
          <div
            key={product.id}
            data-showcase-item="true"
            style={cardScaleStyle}
            className={`${cardShellClass} flex flex-col`}
          >
            <div
              className="h-full min-h-0 min-w-0 flex-1 transition-[transform,filter] duration-300 ease-out"
              style={innerTransformStyle}
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
      </div>
    </div>
  )
}

export interface HomeShowcaseCarouselProps {
  products: ProductWithCategory[]
  onAddToCart?: (product: Product) => void
  addedToCart?: Set<string>
  isInWishlist?: (productId: string) => boolean
  onToggleWishlist?: (productId: string) => void
}

/**
 * Գլխավոր էջ — մինչև 12 ապրանք, աջ վերևի փոքր սլաքեր (առանց սքրոլբարի)։
 */
export function HomeShowcaseCarousel({
  products,
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

  const { scrollRef, canScrollLeft, canScrollRight, scrollByDirection } =
    useShowcaseCarouselScroll(list.length)

  return (
    <div className="relative -mx-4 px-1 sm:mx-0 sm:px-0">
      <div className="absolute right-1 top-0 z-20 flex gap-1 sm:right-0">
        <CarouselArrowButton
          size="sm"
          direction="prev"
          disabled={!canScrollLeft}
          onClick={() => scrollByDirection(-1)}
          ariaLabel={h.carouselScrollPrev}
        />
        <CarouselArrowButton
          size="sm"
          direction="next"
          disabled={!canScrollRight}
          onClick={() => scrollByDirection(1)}
          ariaLabel={h.carouselScrollNext}
        />
      </div>
      <ShowcaseCarouselTrack
        scrollRef={scrollRef}
        list={list}
        compactLayout={isNarrowViewport ? 'showcaseNarrow' : 'standard'}
        isMobileScrollOnly={isNarrowViewport}
        onAddToCart={onAddToCart}
        addedToCart={addedToCart}
        isInWishlist={isInWishlist}
        onToggleWishlist={onToggleWishlist}
      />
    </div>
  )
}
