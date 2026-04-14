'use client'

import type { LucideIcon } from 'lucide-react'
import { ChefHat, Coffee, Flame, Star, UtensilsCrossed } from 'lucide-react'

const STROKE = 1.15

const BASE = 'text-white/18 motion-reduce:animate-none'

/** Ամբողջ մոբայլ մենյու — շատ քիչ դեկորատիվ պատկերակ, տարբեր չափերով */
export function MobileMenuBackgroundIcons() {
  const items: { Icon: LucideIcon; className: string }[] = [
    {
      Icon: ChefHat,
      className: `absolute -left-2 top-[4%] h-24 w-24 -rotate-6 ${BASE} animate-float [animation-duration:4.2s]`,
    },
    {
      Icon: UtensilsCrossed,
      className: `absolute right-[6%] top-[42%] h-14 w-14 rotate-[12deg] ${BASE} animate-float-delay [animation-duration:3.6s]`,
    },
    {
      Icon: Coffee,
      className: `absolute bottom-[18%] left-[12%] h-8 w-8 -rotate-3 ${BASE} animate-float [animation-delay:0.5s] [animation-duration:3.4s]`,
    },
    {
      Icon: Flame,
      className: `absolute right-[10%] top-[12%] h-5 w-5 rotate-6 ${BASE} animate-float-delay [animation-duration:2.8s]`,
    },
    {
      Icon: Star,
      className: `absolute bottom-[10%] right-[18%] h-4 w-4 ${BASE} animate-float [animation-delay:0.9s] [animation-duration:3.1s]`,
    },
  ]

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {items.map(({ Icon, className }, i) => (
        <Icon key={i} className={className} strokeWidth={STROKE} />
      ))}
    </div>
  )
}
