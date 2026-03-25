'use client'

import { ChefHat, Clock, Flame, Leaf, Star, Truck } from 'lucide-react'

const DECOR_BASE = 'absolute text-white/[0.14] max-sm:opacity-60'

const DECOR_YELLOW = 'text-[#FACC15]/[0.22]'

/**
 * Դեկորատիվ պատկերակներ պիցայի հետևում՝ առանց ինտերակտիվության (միայն ֆոն)։
 */
export function HeroPizzaDecorIcons() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <ChefHat
        className={`${DECOR_BASE} left-[2%] top-[6%] h-14 w-14 -rotate-12 sm:h-16 sm:w-16`}
        strokeWidth={1.25}
      />
      <Flame
        className={`${DECOR_YELLOW} absolute right-[4%] top-[10%] h-12 w-12 rotate-6 sm:h-14 sm:w-14`}
        strokeWidth={1.25}
      />
      <Clock
        className={`${DECOR_BASE} left-[8%] top-[38%] h-11 w-11 -rotate-6 sm:h-12 sm:w-12`}
        strokeWidth={1.25}
      />
      <Leaf
        className={`${DECOR_YELLOW} absolute right-[14%] top-[42%] h-10 w-10 rotate-12 sm:h-11 sm:w-11`}
        strokeWidth={1.25}
      />
      <Truck
        className={`${DECOR_BASE} bottom-[18%] right-[6%] h-14 w-14 -rotate-3 sm:bottom-[14%] sm:h-16 sm:w-16`}
        strokeWidth={1.25}
      />
      <Star
        className={`${DECOR_BASE} bottom-[28%] left-[4%] h-10 w-10 rotate-[18deg] sm:bottom-[24%] sm:h-11 sm:w-11`}
        strokeWidth={1.25}
      />
    </div>
  )
}
