import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PRODUCTS = [
  { name: 'Пиде с мясом', description: 'Классическое пиде с мясной начинкой и специями', price: 850, image: '/images/pide-myaso.png', category: 'Пиде', ingredients: ['Тесто', 'Мясо', 'Лук', 'Специи'] },
  { name: 'Сырное пиде', description: 'Пиде с белым сыром и зеленью', price: 750, image: '/images/pide-cheese.png', category: 'Пиде', ingredients: ['Тесто', 'Белый сыр', 'Зелень'] },
  { name: 'Комбо обед', description: 'Пиде + напиток + соус', price: 1200, image: '/images/combo.png', category: 'Комбо', ingredients: ['Пиде', 'Напиток', 'Соус на выбор'] },
  { name: 'Картофель фри', description: 'Хрустящий картофель фри с солью', price: 400, image: '/images/fries.png', category: 'Снэк', ingredients: ['Картофель', 'Соль', 'Масло'] },
  { name: 'Кола', description: 'Охлаждённая газировка 0.5л', price: 350, image: '/images/cola.png', category: 'Напитки', ingredients: ['Кола'] },
  { name: 'Кетчуп', description: 'Томатный соус кетчуп', price: 250, image: '/images/ketchup.png', category: 'Соусы', ingredients: ['Томаты', 'Специи'] },
  { name: 'Пиде грибное', description: 'Пиде с грибами и сыром', price: 800, image: '/images/pide-mushroom.png', category: 'Пиде', ingredients: ['Тесто', 'Грибы', 'Сыр'] },
  { name: 'Сок апельсиновый', description: 'Свежевыжатый апельсиновый сок', price: 450, image: '/images/juice.png', category: 'Напитки', ingredients: ['Апельсины'] },
  { name: 'Чесночный соус', description: 'Кремовый чесночный соус', price: 300, image: '/images/garlic-sauce.png', category: 'Соусы', ingredients: ['Чеснок', 'Майонез', 'Зелень'] },
  { name: 'Наггетсы', description: 'Куриные наггетсы 6 шт', price: 550, image: '/images/nuggets.png', category: 'Снэк', ingredients: ['Курица', 'Панировка', 'Масло'] },
]

async function main() {
  const categories = await prisma.category.findMany()
  const categoryByName = new Map(categories.map((c) => [c.name, c.id]))

  const toCreate = [...new Set(PRODUCTS.map((p) => p.category))].filter((name) => !categoryByName.has(name))
  for (const name of toCreate) {
    const cat = await prisma.category.create({ data: { name, description: `Категория ${name}`, isActive: true } })
    categoryByName.set(name, cat.id)
  }

  for (const p of PRODUCTS) {
    const categoryId = categoryByName.get(p.category)
    if (!categoryId) continue
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        categoryId,
        ingredients: p.ingredients,
        isAvailable: true,
        status: 'REGULAR',
      },
    })
    console.log('✅', p.name)
  }
  console.log('🎉 Добавлено 10 товаров.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
