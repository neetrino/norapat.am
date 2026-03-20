import { User, Product, Order, OrderItem, OrderStatus, ProductStatus, Category } from '@prisma/client'

// Экспортируем типы из Prisma
export { Product, User, Order, OrderItem, OrderStatus, ProductStatus, Category }

// Расширенные типы для приложения
export interface ProductWithIngredients extends Product {
  // PostgreSQL уже возвращает ingredients как массив
}

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    product: Product
  })[]
  user: User
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  validateCart: () => Promise<void>
}

export interface OrderItemForm {
  productId: string
  quantity: number
  price: number
}

// Типы для форм
export interface OrderFormData {
  name: string
  phone: string
  address: string
  notes?: string
  paymentMethod: 'idram' | 'arca' | 'ameriabank'
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

// Константы
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Ожидает подтверждения',
  CONFIRMED: 'Подтвержден',
  PREPARING: 'Готовится',
  READY: 'Готов к выдаче',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменен'
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  REGULAR: 'Обычный',
  HIT: 'Хит продаж',
  NEW: 'Новинка',
  CLASSIC: 'Классика',
  BANNER: 'Баннер'
}

export const PAYMENT_METHODS = {
  idram: 'Idram',
  arca: 'ArCa',
  ameriabank: 'Ameriabank'
} as const

export type PaymentMethod = keyof typeof PAYMENT_METHODS

// Типы категорий
export interface Category {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Старые типы категорий для обратной совместимости
export type CategoryName = 'Комбо' | 'Пиде' | 'Снэк' | 'Соусы' | 'Напитки'