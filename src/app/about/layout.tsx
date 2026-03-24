import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Մեր մասին — Pideh Armenia',
  description:
    'Pideh Armenia-ի պատմություն, արժեքները և թիմը։ Հայկական պիդե՝ թարմ բաղադրիչներով, Երևանում։',
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
