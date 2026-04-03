import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Նախընտրածներ | Norapat Food Court',
  description: 'Պահված ուտեստներ և կոմբոներ Norapat Food Court մենյուից',
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
