import fs from 'fs'
import path from 'path'
import { createPrismaClient } from '../../src/lib/prisma'

const prisma = createPrismaClient()

interface ProductData {
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  isAvailable?: boolean
}

async function migrateCategories() {
  try {
    console.log('🔄 Начинаем миграцию категорий и товаров...')

    // Читаем данные из JSON файла
    const dataPath = path.join(process.cwd(), 'data', 'buy-am-products.json')
    const rawData = fs.readFileSync(dataPath, 'utf-8')
    const products: ProductData[] = JSON.parse(rawData)

    console.log(`📦 Найдено ${products.length} товаров для импорта`)

    // Получаем все уникальные категории
    const uniqueCategories = [...new Set(products.map(p => p.category))]
    console.log(`📂 Найдено ${uniqueCategories.length} уникальных категорий:`)
    uniqueCategories.forEach(cat => console.log(`  - ${cat}`))

    // Создаем категории
    console.log('\n🏷️ Создаем категории...')
    const categoryMap = new Map()
    
    for (const categoryName of uniqueCategories) {
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

    // Создаем продукты с привязкой к категориям
    console.log('\n📦 Создаем товары...')
    
    for (const productData of products) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          categoryId: categoryMap.get(productData.category),
          ingredients: productData.ingredients,
          isAvailable: productData.isAvailable ?? true,
        }
      })
      
      console.log(`✅ Создан товар: ${product.name} (${product.price} ֏) - ${productData.category}`)
    }

    // Получаем статистику
    const totalProducts = await prisma.product.count()
    const totalCategories = await prisma.category.count()
    const categoriesWithCounts = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    console.log('\n📊 Статистика:')
    console.log(`Всего категорий: ${totalCategories}`)
    console.log(`Всего товаров: ${totalProducts}`)
    console.log('\nПо категориям:')
    categoriesWithCounts.forEach(cat => {
      console.log(`  ${cat.name}: ${cat._count.products} товаров`)
    })

    console.log('\n🎉 Миграция завершена успешно!')

  } catch (error) {
    console.error('❌ Ошибка при миграции:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateCategories()
