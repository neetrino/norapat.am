import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Загружаем данные товаров из JSON файла
  const productsPath = path.join(__dirname, '../data/buy-am-products.json')
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
  
  console.log(`📦 Загружено ${productsData.length} товаров из JSON файла`)

  // Очищаем существующие данные
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Очистили существующие данные')

  // Создаем категории
  const categories = ['Пиде', 'Комбо', 'Снэк', 'Соусы', 'Напитки']
  const categoryMap = new Map()
  
  for (const categoryName of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        description: `Категория ${categoryName}`,
        isActive: true
      }
    })
    categoryMap.set(categoryName, category.id)
    console.log(`✅ Создана категория: ${category.name}`)
  }

  // Создаем товары
  for (const productData of productsData) {
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
  const bcrypt = require('bcryptjs')
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
      email: 'admin@pideh-armenia.am',
      name: 'Администратор',
      phone: '+374 95 044 888',
      address: 'Ереван, ул. Абовяна, 1',
      password: await bcrypt.hash('admin123', 12),
      role: 'ADMIN'
    }
  })
  console.log(`✅ Создан админ-пользователь: ${adminUser.email}`)
  console.log(`🔑 Пароль админа: admin123`)

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
      paymentMethod: 'idram',
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
  console.log(`   - Товаров: ${productsData.length}`)
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
