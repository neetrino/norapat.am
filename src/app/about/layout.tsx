import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Մեր մասին — Norapat Food Court',
  description:
    'Norapat Food Court-ի պատմություն, արժեքները և թիմը։ Համեղ ուտեստներ՝ թարմ բաղադրիչներով, Նորապատում։',
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
