import fs from 'fs'
import path from 'path'
import { createPrismaClient } from '../../src/lib/prisma'

const prisma = createPrismaClient()

/**
 * Скрипт для обновления JSON файла с данными продуктов
 * Синхронизирует JSON файл с текущим состоянием базы данных
 */

async function updateJsonData() {
  try {
    console.log('🔄 Начинаем обновление JSON файла с данными...')
    
    // Получаем все продукты из базы данных
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    console.log(`📦 Найдено ${products.length} продуктов в базе данных`)

    // Преобразуем данные в формат JSON файла
    const jsonData = products.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      ingredients: product.ingredients,
      isAvailable: product.isAvailable,
      source: "buy.am"
    }))

    // Путь к JSON файлу
    const jsonFilePath = path.join(process.cwd(), 'data', 'buy-am-products.json')
    
    // Создаем резервную копию
    const backupPath = path.join(process.cwd(), 'data', 'buy-am-products-backup.json')
    if (fs.existsSync(jsonFilePath)) {
      fs.copyFileSync(jsonFilePath, backupPath)
      console.log(`💾 Создана резервная копия: ${backupPath}`)
    }

    // Записываем обновленные данные
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8')
    console.log(`✅ JSON файл обновлен: ${jsonFilePath}`)

    // Показываем статистику
    const categories = jsonData.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('\n📊 Статистика обновленного JSON файла:')
    console.log(`  Всего продуктов: ${jsonData.length}`)
    console.log('\nПо категориям:')
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} товаров`)
    })

    // Показываем примеры обновленных путей к изображениям
    console.log('\n🔍 Примеры путей к изображениям:')
    const sampleProducts = jsonData.filter(p => p.image.includes('-Photoroom.png')).slice(0, 5)
    sampleProducts.forEach(product => {
      console.log(`  ${product.name}: ${product.image}`)
    })

    console.log('\n🎉 JSON файл успешно обновлен!')

  } catch (error) {
    console.error('❌ Ошибка при обновлении JSON файла:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем скрипт
if (require.main === module) {
  updateJsonData()
    .then(() => {
      console.log('✅ Скрипт выполнен успешно')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Ошибка выполнения скрипта:', error)
      process.exit(1)
    })
}

export { updateJsonData }
