import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Избранное | Pideh Armenia',
  description: 'Сохранённые блюда и комбо из меню Pideh Armenia'
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
