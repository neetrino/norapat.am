import { createPrismaClient } from '../../src/lib/prisma'

const prisma = createPrismaClient()

async function initSettings() {
  try {
    console.log('🚀 Инициализация настроек сайта...')

    // Настройки по умолчанию
    const defaultSettings = [
      { key: 'logo', value: '/logo.png' },
      { key: 'siteName', value: 'Pideh Armenia' },
      { key: 'siteDescription', value: 'Мини-пиццы в виде аджарских хачапури. Свежие ингредиенты, быстрая доставка!' },
      { key: 'contactPhone', value: '+374 XX XXX XXX' },
      { key: 'contactEmail', value: 'info@pideh.am' },
      { key: 'address', value: 'Ереван, Армения' }
    ]

    // Создаем или обновляем настройки
    for (const setting of defaultSettings) {
      await prisma.settings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value }
      })
      console.log(`✅ Настройка "${setting.key}" инициализирована`)
    }

    console.log('🎉 Все настройки успешно инициализированы!')
  } catch (error) {
    console.error('❌ Ошибка при инициализации настроек:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initSettings()

