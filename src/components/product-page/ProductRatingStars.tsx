import { Star, StarHalf } from 'lucide-react'

type ProductRatingStarsProps = {
  reviewLabel: string
}

/** Visual reference rating for PDP until live reviews exist. */
const DISPLAY_RATING = 4.5

export function ProductRatingStars({ reviewLabel }: ProductRatingStarsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="flex items-center gap-0.5 text-amber-400"
        aria-label={`${DISPLAY_RATING} of 5`}
      >
        {[0, 1, 2, 3].map((i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
        ))}
        <StarHalf className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
      </div>
      <span className="text-xs text-slate-500">{reviewLabel}</span>
    </div>
  )
}
