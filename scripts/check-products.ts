import { createPrismaClient } from '../src/lib/prisma'

const prisma = createPrismaClient()

async function checkProducts() {
  try {
    const products = await prisma.product.findMany()
    console.log(`📦 Товаров в базе: ${products.length}`)
    
    if (products.length > 0) {
      console.log('\n📋 Список товаров:')
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ${product.status} - ${product.price} ֏`)
      })
    } else {
      console.log('❌ База данных пуста')
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()