import { createPrismaClient } from '../src/lib/prisma'

const prisma = createPrismaClient()

async function main() {
  console.log('📋 Проверка категорий в базе данных...\n')

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  if (categories.length === 0) {
    console.log('⚠️  Категории не найдены')
    return
  }

  console.log(`Всего категорий: ${categories.length}\n`)

  categories.forEach((cat, index) => {
    console.log(`${index + 1}. ${cat.name}`)
    console.log(`   ID: ${cat.id}`)
    console.log(`   Изображение: ${cat.image || '(не установлено)'}`)
    console.log(`   Описание: ${cat.description || '(нет)'}`)
    console.log(`   Активна: ${cat.isActive ? 'Да' : 'Нет'}`)
    console.log(`   Товаров: ${cat._count.products}`)
    console.log('')
  })
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
