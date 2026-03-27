import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Նախընտրած | Pideh Armenia',
  description: 'Պահված ուտեստներ և կոմբոներ Pideh Armenia մենյուից',
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
