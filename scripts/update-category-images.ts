import { createPrismaClient } from '../src/lib/prisma'

const prisma = createPrismaClient()

const CATEGORY_IMAGES: Record<string, string> = {
  'Պիդե': '/categories/pide.svg',
  'Կոմբո': '/categories/combo.svg',
  'Սնաք': '/categories/snack.svg',
  'Սոուսներ': '/categories/sauce.svg',
  'Ըմպելիքներ': '/categories/drinks.svg',
}

async function main() {
  console.log('🖼️  Обновляем изображения категорий...')

  const categories = await prisma.category.findMany()
  
  if (categories.length === 0) {
    console.log('⚠️  Категории не найдены в базе данных')
    return
  }

  for (const category of categories) {
    const imagePath = CATEGORY_IMAGES[category.name]
    
    if (imagePath) {
      await prisma.category.update({
        where: { id: category.id },
        data: { image: imagePath }
      })
      console.log(`✅ Обновлена категория "${category.name}" с изображением: ${imagePath}`)
    } else {
      console.log(`⚠️  Изображение не найдено для категории: ${category.name}`)
    }
  }

  console.log('🎉 Изображения категорий успешно обновлены!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при обновлении изображений категорий:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
