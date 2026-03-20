/**
 * Добавляет в базу ~30 дополнительных товаров без удаления существующих данных.
 * Использует существующие категории (Пиде, Комбо, Снэк, Соусы, Напитки).
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ADDITIONAL_PRODUCTS = [
  { name: 'Пиде с тунцом', description: 'Пиде с тунцом, каперсами и сыром', price: 900, image: '/images/pide-s-govyadinoj-Photoroom.png', category: 'Пиде', ingredients: ['Тесто', 'Тунец', 'Каперсы', 'Сыр'] },
  { name: 'Пиде с курицей терияки', description: 'Пиде с курицей в соусе терияки и кунжутом', price: 850, image: '/images/kurinye-legkie-pide-Photoroom.png', category: 'Пиде', ingredients: ['Тесто', 'Курица', 'Соус терияки', 'Кунжут'] },
  { name: 'Четыре сыра пиде', description: 'Пиде с моцареллой, пармезаном, дор блю и горгондзолой', price: 950, image: '/images/classic-chees-Photoroom.png', category: 'Пиде', ingredients: ['Тесто', 'Моцарелла', 'Пармезан', 'Дор блю', 'Горгондзола'] },
  { name: 'Пиде с лососем', description: 'Пиде со слабосоленым лососем и сливочным сыром', price: 1100, image: '/images/caucasus-cheese-Photoroom.png', category: 'Пиде', ingredients: ['Тесто', 'Лосось', 'Сливочный сыр', 'Укроп'] },
  { name: 'Веганское пиде', description: 'Пиде с тофу, авокадо и томатами', price: 750, image: '/images/ovoshchnoe-pide-Photoroom.png', category: 'Пиде', ingredients: ['Тесто', 'Тофу', 'Авокадо', 'Томаты'] },
  { name: 'Комбо «Семейное»', description: '3 пиде на выбор + картофель фри + 3 напитка', price: 4500, image: '/images/kombo-my-vdvoyom-Photoroom.png', category: 'Комбо', ingredients: ['3 пиде', 'Картофель фри', '3 напитка'] },
  { name: 'Комбо «Обед»', description: 'Пиде + снэк + напиток', price: 1400, image: '/images/kombo-ya-odin-Photoroom.png', category: 'Комбо', ingredients: ['Пиде', 'Снэк', 'Напиток'] },
  { name: 'Комбо «Пиде + соус»', description: 'Любое пиде + соус на выбор', price: 1100, image: '/images/pepperoni-pide-Photoroom.png', category: 'Комбо', ingredients: ['Пиде', 'Соус'] },
  { name: 'Комбо «Детское»', description: 'Маленькое пиде + сок + картофель фри', price: 1600, image: '/images/kombo-ya-odin-Photoroom.png', category: 'Комбо', ingredients: ['Пиде', 'Сок', 'Картофель фри'] },
  { name: 'Комбо «Пикник»', description: '2 пиде + 2 снэка + 2 напитка', price: 3200, image: '/images/kombo-my-golodny-Photoroom.png', category: 'Комбо', ingredients: ['2 пиде', '2 снэка', '2 напитка'] },
  { name: 'Луковые кольца', description: 'Хрустящие луковые кольца в панировке', price: 550, image: '/images/kurinyy-popkorn-Photoroom.png', category: 'Снэк', ingredients: ['Лук', 'Панировка', 'Специи'] },
  { name: 'Наггетсы', description: 'Куриные наггетсы с соусом', price: 650, image: '/images/kurinyy-popkorn-Photoroom.png', category: 'Снэк', ingredients: ['Курица', 'Панировка', 'Соус'] },
  { name: 'Сырные палочки', description: 'Сырные палочки в панировке', price: 600, image: '/images/kartofel-fri-Photoroom.png', category: 'Снэк', ingredients: ['Сыр моцарелла', 'Панировка'] },
  { name: 'Картофель по-деревенски', description: 'Запеченный картофель с кожурой и специями', price: 500, image: '/images/kartofel-fri-Photoroom.png', category: 'Снэк', ingredients: ['Картофель', 'Специи', 'Зелень'] },
  { name: 'Микс снэков', description: 'Картофель фри + куриный попкорн + луковые кольца', price: 1200, image: '/images/kombo-my-golodny-Photoroom.png', category: 'Снэк', ingredients: ['Картофель фри', 'Куриный попкорн', 'Луковые кольца'] },
  { name: 'Соус тартар', description: 'Классический соус тартар с огурцами', price: 300, image: '/images/Cocktail-sauce-Pideh-Photoroom.png', category: 'Соусы', ingredients: ['Майонез', 'Огурцы', 'Укроп', 'Лимон'] },
  { name: 'Соус ранч', description: 'Сливочный соус ранч с травами', price: 300, image: '/images/Mayonnaise-Pideh-Photoroom.png', category: 'Соусы', ingredients: ['Сливки', 'Чеснок', 'Травы'] },
  { name: 'Острый соус', description: 'Острый соус на основе перца чили', price: 300, image: '/images/BBQ-sauce-Pideh-Photoroom.png', category: 'Соусы', ingredients: ['Перец чили', 'Томаты', 'Чеснок'] },
  { name: 'Соус песто', description: 'Соус песто с базиликом и кедровыми орехами', price: 400, image: '/images/Garlic-sauce-Pideh-Photoroom.png', category: 'Соусы', ingredients: ['Базилик', 'Кедровые орехи', 'Пармезан', 'Оливковое масло'] },
  { name: 'Соус сладкий чили', description: 'Сладко-острый соус чили', price: 300, image: '/images/Ketchup-Pideh-Photoroom.png', category: 'Соусы', ingredients: ['Перец чили', 'Сахар', 'Чеснок'] },
  { name: 'Кофе эспрессо', description: 'Классический эспрессо', price: 450, image: '/images/jur0000-Photoroom.png', category: 'Напитки', ingredients: ['Кофе'] },
  { name: 'Капучино', description: 'Капучино с молочной пенкой', price: 600, image: '/images/juice-Photoroom.png', category: 'Напитки', ingredients: ['Эспрессо', 'Молоко', 'Пена'] },
  { name: 'Латте', description: 'Латте с нежным молоком', price: 600, image: '/images/tan-Photoroom.png', category: 'Напитки', ingredients: ['Эспрессо', 'Молоко'] },
  { name: 'Чай (ассорти)', description: 'Чай на выбор: черный, зеленый, травяной', price: 350, image: '/images/jur0000-Photoroom.png', category: 'Напитки', ingredients: ['Чай'] },
  { name: 'Лимонад домашний', description: 'Свежий лимонад с мятой', price: 450, image: '/images/cola-sprite-fanta-Photoroom.png', category: 'Напитки', ingredients: ['Лимон', 'Мята', 'Сахар', 'Вода'] },
  { name: 'Морс ягодный', description: 'Морс из ягод', price: 500, image: '/images/juice-Photoroom.png', category: 'Напитки', ingredients: ['Ягоды', 'Вода', 'Сахар'] },
  { name: 'Смузи фруктовый', description: 'Смузи из сезонных фруктов', price: 700, image: '/images/juice-Photoroom.png', category: 'Напитки', ingredients: ['Фрукты', 'Йогурт', 'Лед'] },
  { name: 'Энергетический напиток', description: 'Энергетический напиток в ассортименте', price: 600, image: '/images/cola-sprite-fanta-Photoroom.png', category: 'Напитки', ingredients: ['Кофеин', 'Таурин', 'Витамины'] },
  { name: 'Пиде с прошутто', description: 'Пиде с прошутто, рукколой и пармезаном', price: 1050, image: '/images/pide-s-basturmoj-Photoroom.png', category: 'Пиде', ingredients: ['Тесто', 'Прошутто', 'Руккола', 'Пармезан'] },
  { name: 'Пиде с креветками', description: 'Пиде с тигровыми креветками и чесночным соусом', price: 1200, image: '/images/ovoshchnoe-pide-Photoroom.png', category: 'Пиде', ingredients: ['Тесто', 'Креветки', 'Чеснок', 'Сыр'] },
]

const SEED_CATEGORIES = ['Пиде', 'Комбо', 'Снэк', 'Соусы', 'Напитки'] as const

async function ensureCategories(): Promise<Map<string, string>> {
  const categoryByName = new Map<string, string>()
  for (const name of SEED_CATEGORIES) {
    let cat = await prisma.category.findFirst({ where: { name } })
    if (!cat) {
      cat = await prisma.category.create({
        data: { name, description: `Категория ${name}`, isActive: true },
      })
      console.log(`✅ Создана категория: ${name}`)
    }
    categoryByName.set(name, cat.id)
  }
  return categoryByName
}

async function main() {
  console.log('🌱 Добавляем 30 товаров в базу (без удаления существующих данных)...')

  const categoryByName = await ensureCategories()

  let created = 0
  let skipped = 0

  for (const p of ADDITIONAL_PRODUCTS) {
    const categoryId = categoryByName.get(p.category)
    if (!categoryId) {
      console.warn(`⚠️ Категория не найдена: ${p.category}, товар пропущен: ${p.name}`)
      skipped++
      continue
    }

    const existing = await prisma.product.findFirst({
      where: { name: p.name },
    })
    if (existing) {
      console.log(`⏭️ Уже есть: ${p.name}`)
      skipped++
      continue
    }

    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        categoryId,
        ingredients: p.ingredients,
        isAvailable: true,
      },
    })
    console.log(`✅ Добавлен: ${p.name} (${p.price} ֏)`)
    created++
  }

  console.log('\n🎉 Готово!')
  console.log(`   Добавлено: ${created}`)
  if (skipped > 0) console.log(`   Пропущено: ${skipped}`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
