'use client'

import { PROMO_COLORS } from './promoFoodBanner.constants'

const PLATE_VIEWBOX = '0 0 320 320'

/**
 * Vector-only hero “plate” — no photos; approximates fried chicken, wedges, lemon, herbs.
 */
export function HeroFoodPlateSvg() {
  return (
    <svg
      viewBox={PLATE_VIEWBOX}
      className="h-full w-full max-h-[min(72vw,22rem)] max-w-[min(72vw,22rem)] drop-shadow-[0_18px_36px_rgba(0,0,0,0.45)] sm:max-h-[min(52vw,26rem)] sm:max-w-[min(52vw,26rem)] lg:max-h-[28rem] lg:max-w-[28rem]"
      aria-hidden
    >
      <defs>
        <radialGradient id="plateShine" cx="32%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#3d3d3d" />
          <stop offset="55%" stopColor={PROMO_COLORS.plate} />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
        <radialGradient id="chickenGrad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#e8c48a" />
          <stop offset="45%" stopColor="#c9954a" />
          <stop offset="100%" stopColor="#7a4f1e" />
        </radialGradient>
        <radialGradient id="chickenGrad2" cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#f0d4a8" />
          <stop offset="50%" stopColor="#c48a3c" />
          <stop offset="100%" stopColor="#6b3f12" />
        </radialGradient>
        <linearGradient id="wedgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e6c79a" />
          <stop offset="100%" stopColor="#a67c4a" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="160" cy="278" rx="118" ry="14" fill="rgba(0,0,0,0.35)" />

      <circle cx="160" cy="158" r="132" fill="url(#plateShine)" stroke={PROMO_COLORS.plateRim} strokeWidth="3" />

      <g filter="url(#softShadow)">
        <path
          d="M88 148c12-28 38-44 62-40 18 3 32 18 38 36 6 22-4 46-24 58-22 14-52 10-72-10-14-14-18-34-4-44z"
          fill="url(#chickenGrad)"
        />
        <path
          d="M175 118c28-6 52 8 60 32 10 28-6 58-34 72-26 12-56 4-70-22-10-20-6-44 12-58 12-10 22-22 32-24z"
          fill="url(#chickenGrad2)"
        />
        <path
          d="M118 175c8 18 28 30 48 26 14-2 24-14 26-28 2-14-6-28-20-34-22-10-48 4-54 36z"
          fill="url(#chickenGrad)"
          opacity="0.95"
        />
      </g>

      <g opacity="0.92">
        <path
          d="M195 210l22 38 8-42-18-14z"
          fill="url(#wedgeGrad)"
          stroke="#6b4423"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M152 218l-6 44 32-28-10-20z"
          fill="url(#wedgeGrad)"
          stroke="#6b4423"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M128 200l-28 24 40 6-6-26z"
          fill="url(#wedgeGrad)"
          stroke="#6b4423"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M210 188l36 10-28 22-12-20z"
          fill="url(#wedgeGrad)"
          stroke="#6b4423"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>

      <path
        d="M232 168c16-4 28 6 30 22 2 14-8 26-22 28-10 2-20-4-24-14l-8-36z"
        fill="#fde047"
        stroke="#ca8a04"
        strokeWidth="1.2"
        opacity="0.95"
      />

      <g fill="#4d7c0f" opacity="0.85">
        <circle cx="142" cy="132" r="3.5" />
        <circle cx="158" cy="124" r="2.8" />
        <circle cx="188" cy="138" r="3" />
        <circle cx="198" cy="152" r="2.5" />
      </g>
    </svg>
  )
}
