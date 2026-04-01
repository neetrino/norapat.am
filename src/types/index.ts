import {
  User,
  Product,
  Order,
  OrderItem,
  OrderStatus,
  ProductStatus,
  Category,
  Campaign,
  CampaignLinkType,
} from '@prisma/client'

// Экспортируем типы из Prisma
export {
  Product,
  User,
  Order,
  OrderItem,
  OrderStatus,
  ProductStatus,
  Category,
  Campaign,
  CampaignLinkType,
}

// Расширенные типы для приложения
export type ProductWithIngredients = Product

/** Ապրանք category relation-ով (API products, featured, banner) */
export type ProductWithCategory = Product & {
  category: { id: string; name: string; isActive: boolean } | null
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
  paymentMethod: 'cash' | 'arca' | 'mastercard' | 'visa' | 'ameriabank' | 'idram'
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

// Հաստատուններ
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Սպասում հաստատման',
  CONFIRMED: 'Հաստատված',
  PREPARING: 'Պատրաստվում',
  READY: 'Պատրաստ',
  DELIVERED: 'Առաքված',
  CANCELLED: 'Չեղարկված'
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  REGULAR: 'Սովորական',
  HIT: 'Վաճառքի հիթ',
  NEW: 'Նորինք',
  CLASSIC: 'Կլասիկ',
  BANNER: 'Բաններ'
}

export const PAYMENT_METHODS = {
  cash: 'Cash',
  arca: 'ArCa',
  mastercard: 'Mastercard',
  visa: 'Visa',
  ameriabank: 'Ameriabank',
  idram: 'Idram',
} as const

export type PaymentMethod = keyof typeof PAYMENT_METHODS

// Типы категорий
export interface Category {
  id: string
  name: string
  description: string | null
  image: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Категория с количеством товаров (ответ /api/categories)
export interface CategoryWithCount extends Category {
  _count: { products: number }
}

// Старые типы категорий для обратной совместимости
export type CategoryName = 'Կոմբո' | 'Պիդե' | 'Սնաք' | 'Սոուսներ' | 'Ըմպելիքներ'
