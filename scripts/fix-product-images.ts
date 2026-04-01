import { createPrismaClient } from '../src/lib/prisma'

const prisma = createPrismaClient()

const NAMES_WE_ADDED = [
  'Пиде с мясом', 'Сырное пиде', 'Комбо обед', 'Картофель фри', 'Кола',
  'Кетчуп', 'Пиде грибное', 'Сок апельсиновый', 'Чесночный соус', 'Наггетсы',
]

async function main() {
  const updated = await prisma.product.updateMany({
    where: { name: { in: NAMES_WE_ADDED } },
    data: { image: '/images/placeholder.svg' },
  })
  console.log('Обновлено товаров:', updated.count)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
