import 'dotenv/config'
import { createPrismaClient } from '../src/lib/prisma'
import fs from 'fs'
import path from 'path'

const prisma = createPrismaClient()
const ADMIN_EMAIL = 'sudo@norapat.com'
const ADMIN_PASSWORD = 'os£uC4=gm1t"GN65dreKXPn/qDjP>k'

type SeedProduct = {
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  isAvailable: boolean
}

const CATEGORY_NAME_MAP: Record<string, string> = {
  'Пиде': 'Պիդե',
  Pide: 'Պիդե',
  'Комбо': 'Կոմբո',
  Combo: 'Կոմբո',
  'Снэк': 'Սնաք',
  Snacks: 'Սնաք',
  'Соусы': 'Սոուսներ',
  Sauces: 'Սոուսներ',
  'Напитки': 'Ըմպելիքներ',
  Drinks: 'Ըմպելիքներ',
  'Պիդե': 'Պիդե',
  'Կոմբո': 'Կոմբո',
  'Սնաք': 'Սնաք',
  'Սնեք': 'Սնաք',
  'Սոուսներ': 'Սոուսներ',
  'Ըմպելիքներ': 'Ըմպելիքներ',
}

const ARMENIAN_CATEGORIES = ['Պիդե', 'Կոմբո', 'Սնաք', 'Սոուսներ', 'Ըմպելիքներ'] as const

const CATEGORY_IMAGES: Record<string, string> = {
  'Պիդե': '/categories/pide.svg',
  'Կոմբո': '/categories/combo.svg',
  'Սնաք': '/categories/snack.svg',
  'Սոուսներ': '/categories/sauce.svg',
  'Ըմպելիքներ': '/categories/drinks.svg',
}

const EXTRA_PRODUCTS: SeedProduct[] = [
  {
    name: 'Լոռու պանիրով պիդե',
    description: 'Փափուկ պիդե Լոռու պանրով և թարմ կանաչիներով',
    price: 890,
    image: '/images/classic-chees-Photoroom.png',
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Լոռու պանիր', 'Կանաչի'],
    isAvailable: true,
  },
  {
    name: 'Մածուն-սխտոր սոուս',
    description: 'Թեթև մածունով սոուս սխտորի և սամիթի նոտաներով',
    price: 320,
    image: '/images/Garlic-sauce-Pideh-Photoroom.png',
    category: 'Սոուսներ',
    ingredients: ['Մածուն', 'Սխտոր', 'Սամիթ', 'Աղ'],
    isAvailable: true,
  },
  {
    name: 'Տնական կոմպոտ',
    description: 'Սեզոնային մրգերից պատրաստված տնական կոմպոտ',
    price: 550,
    image: '/images/juice-Photoroom.png',
    category: 'Ըմպելիքներ',
    ingredients: ['Մրգեր', 'Ջուր', 'Շաքար'],
    isAvailable: true,
  },
]

function normalizeCategoryName(categoryName: string): string {
  const trimmedName = categoryName.trim()
  return CATEGORY_NAME_MAP[trimmedName] ?? trimmedName
}

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Загружаем данные товаров из JSON файла
  const productsPath = path.join(__dirname, '../data/buy-am-products.json')
  const rawProductsData = JSON.parse(fs.readFileSync(productsPath, 'utf8')) as SeedProduct[]
  const productsData: SeedProduct[] = rawProductsData.map((product) => ({
    ...product,
    category: normalizeCategoryName(product.category),
  }))
  const allProducts: SeedProduct[] = [...productsData, ...EXTRA_PRODUCTS]
  
  console.log(`📦 Загружено ${productsData.length} товаров из JSON файла`)
  console.log(`➕ Добавлено ${EXTRA_PRODUCTS.length} новых товаров для сида`)

  // Очищаем существующие данные
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Очистили существующие данные')

  // Создаем категории
  const categories = [...ARMENIAN_CATEGORIES]
  const categoryMap = new Map()
  
  for (const categoryName of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        description: `Категория ${categoryName}`,
        image: CATEGORY_IMAGES[categoryName] || null,
        isActive: true
      }
    })
    categoryMap.set(categoryName, category.id)
    console.log(`✅ Создана категория: ${category.name}`)
  }

  // Создаем товары
  for (const productData of allProducts) {
    const categoryId = categoryMap.get(productData.category)
    if (!categoryId) {
      console.log(`⚠️ Категория не найдена для товара: ${productData.name}`)
      continue
    }

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: productData.image,
        categoryId: categoryId,
        ingredients: productData.ingredients,
        isAvailable: productData.isAvailable
      }
    })
    console.log(`✅ Создан товар: ${product.name}`)
  }

  // Создаем тестового пользователя
  const testUser = await prisma.user.create({
    data: {
      email: 'test@pideh-armenia.am',
      name: 'Тестовый Пользователь',
      phone: '+374 99 123 456',
      address: 'Ереван, ул. Абовяна, 1',
      password: await bcrypt.hash('test123', 12),
      role: 'USER'
    }
  })
  console.log(`✅ Создан тестовый пользователь: ${testUser.email}`)

  // Создаем админ-пользователя
  const adminUser = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      name: 'Администратор',
      phone: '+374 95 044 888',
      address: 'Ереван, ул. Абовяна, 1',
      password: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: 'ADMIN'
    }
  })
  console.log(`✅ Создан админ-пользователь: ${adminUser.email}`)
  console.log(`🔑 Пароль админа: ${ADMIN_PASSWORD}`)

  // Создаем тестовый заказ
  const products = await prisma.product.findMany()
  const testOrder = await prisma.order.create({
    data: {
      userId: testUser.id,
      status: 'PENDING',
      total: 2500,
      address: 'Ереван, ул. Абовяна, 1',
      phone: '+374 99 123 456',
      notes: 'Тестовый заказ',
      paymentMethod: 'cash',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price
          }
        ]
      }
    }
  })
  console.log(`✅ Создан тестовый заказ: ${testOrder.id}`)

  console.log('🎉 База данных успешно заполнена!')
  console.log(`📊 Статистика:`)
  console.log(`   - Товаров: ${allProducts.length}`)
  console.log(`   - Пользователей: 2 (тестовый + админ)`)
  console.log(`   - Заказов: 1 (тестовый)`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import bcrypt from 'bcryptjs'
