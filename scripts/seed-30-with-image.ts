/**
 * Ավելացնում է 30 արտադրանք R2 նկարով (առանց արդեն գոյություն ունեցողների ջնջման)։
 * Գործարկում: pnpm exec tsx scripts/seed-30-with-image.ts
 */
import { createPrismaClient } from '../src/lib/prisma'

const prisma = createPrismaClient()

const IMAGE_URL = 'https://pub-fed62730cf2e41ee9c9fbd0114855cd2.r2.dev/images/1774364084635-dpxyrp.jpg'

const SEED_CATEGORIES = ['Պիդե', 'Կոմբո', 'Սնաք', 'Սոուսներ', 'Ըմպելիքներ'] as const

interface ProductInput {
  name: string
  shortDescription: string
  description: string
  price: number
  category: (typeof SEED_CATEGORIES)[number]
  ingredients: string[]
}

const PRODUCTS: ProductInput[] = [
  { name: 'Պիդե №1', shortDescription: 'Համեղ պիդե №1', description: 'Հատուկ պատրաստված պիդե թարմ բաղադրիչներով։', price: 850, category: 'Պիդե', ingredients: ['Խմոր', 'Պանիր', 'Լոլիկ'] },
  { name: 'Պիդե №2', shortDescription: 'Համեղ պիդե №2', description: 'Հատուկ պատրաստված պիդե թարմ բաղադրիչներով։', price: 900, category: 'Պիդե', ingredients: ['Խմոր', 'Միս', 'Պանիր'] },
  { name: 'Պիդե №3', shortDescription: 'Համեղ պիդե №3', description: 'Հատուկ պատրաստված պիդե թարմ բաղադրիչներով։', price: 950, category: 'Պիդե', ingredients: ['Խմոր', 'Բաստուրմա', 'Պանիր'] },
  { name: 'Պիդե №4', shortDescription: 'Համեղ պիդե №4', description: 'Հատուկ պատրաստված պիդե թարմ բաղադրիչներով։', price: 800, category: 'Պիդե', ingredients: ['Խմոր', 'Կանաչի', 'Պանիր'] },
  { name: 'Պիդե №5', shortDescription: 'Համեղ պիդե №5', description: 'Հատուկ պատրաստված պիդե թարմ բաղադրիչներով։', price: 880, category: 'Պիդե', ingredients: ['Խմոր', 'Բեկոն', 'Պանիր'] },
  { name: 'Պիդե №6', shortDescription: 'Համեղ պիդե №6', description: 'Հատուկ պատրաստված պիդե թարմ բաղադրիչներով։', price: 920, category: 'Պիդե', ingredients: ['Խմոր', 'Պեպերոնի', 'Պանիր'] },
  { name: 'Կոմբո №1', shortDescription: 'Կոմբո փաթեթ №1', description: 'Հատուկ կոմբո՝ պիդե, սնեք և ըմպելիք։', price: 1500, category: 'Կոմբո', ingredients: ['Պիդե', 'Սնեք', 'Ըմպելիք'] },
  { name: 'Կոմբո №2', shortDescription: 'Կոմբո փաթեթ №2', description: 'Հատուկ կոմբո՝ պիդե, սնեք և ըմպելիք։', price: 1800, category: 'Կոմբո', ingredients: ['2 Պիդե', 'Սնեք', '2 Ըմպելիք'] },
  { name: 'Կոմբո №3', shortDescription: 'Կոմբո փաթեթ №3', description: 'Հատուկ կոմբո՝ պիդե, սնեք և ըմպելիք։', price: 2200, category: 'Կոմբո', ingredients: ['2 Պիդե', '2 Սնեք', '2 Ըմպելիք'] },
  { name: 'Կոմբո №4', shortDescription: 'Կոմբո փաթեթ №4', description: 'Հատուկ կոմբո՝ պիդե, սնեք և ըմպելիք։', price: 2500, category: 'Կոմբո', ingredients: ['3 Պիդե', 'Սնեք', '3 Ըմպելիք'] },
  { name: 'Կոմբո №5', shortDescription: 'Կոմբո փաթեթ №5', description: 'Հատուկ կոմբո՝ պիդե, սնեք և ըմպելիք։', price: 3000, category: 'Կոմբո', ingredients: ['3 Պիդե', '2 Սնեք', '3 Ըմպելիք'] },
  { name: 'Սնեք №1', shortDescription: 'Սնեք №1', description: 'Համեղ սնեք թարմ պատրաստված։', price: 500, category: 'Սնաք', ingredients: ['Կարտոֆիլ', 'Համեմունքներ'] },
  { name: 'Սնեք №2', shortDescription: 'Սնեք №2', description: 'Համեղ սնեք թարմ պատրաստված։', price: 550, category: 'Սնաք', ingredients: ['Սունկ', 'Պանիր'] },
  { name: 'Սնեք №3', shortDescription: 'Սնեք №3', description: 'Համեղ սնեք թարմ պատրաստված։', price: 600, category: 'Սնաք', ingredients: ['Հավի միս', 'Պանիր'] },
  { name: 'Սնեք №4', shortDescription: 'Սնեք №4', description: 'Համեղ սնեք թարմ պատրաստված։', price: 450, category: 'Սնաք', ingredients: ['Սոխ', 'Պանիր'] },
  { name: 'Սնեք №5', shortDescription: 'Սնեք №5', description: 'Համեղ սնեք թարմ պատրաստված։', price: 520, category: 'Սնաք', ingredients: ['Բանջարեղեն', 'Համեմունքներ'] },
  { name: 'Սնեք №6', shortDescription: 'Սնեք №6', description: 'Համեղ սնեք թարմ պատրաստված։', price: 580, category: 'Սնաք', ingredients: ['Միս', 'Բանջարեղեն'] },
  { name: 'Սոուս №1', shortDescription: 'Սոուս №1', description: 'Հատուկ սոուս թարմ բաղադրիչներով։', price: 250, category: 'Սոուսներ', ingredients: ['Մայոնեզ', 'Համեմունքներ'] },
  { name: 'Սոուս №2', shortDescription: 'Սոուս №2', description: 'Հատուկ սոուս թարմ բաղադրիչներով։', price: 280, category: 'Սոուսներ', ingredients: ['Կեչափ', 'Սամիթ'] },
  { name: 'Սոուս №3', shortDescription: 'Սոուս №3', description: 'Հատուկ սոուս թարմ բաղադրիչներով։', price: 300, category: 'Սոուսներ', ingredients: ['ԲԲՔ', 'Համեմունքներ'] },
  { name: 'Սոուս №4', shortDescription: 'Սոուս №4', description: 'Հատուկ սոուս թարմ բաղադրիչներով։', price: 270, category: 'Սոուսներ', ingredients: ['Սխտոր', 'Պանիր'] },
  { name: 'Սոուս №5', shortDescription: 'Սոուս №5', description: 'Հատուկ սոուս թարմ բաղադրիչներով։', price: 320, category: 'Սոուսներ', ingredients: ['Թարման', 'Լոլիկ'] },
  { name: 'Սոուս №6', shortDescription: 'Սոուս №6', description: 'Հատուկ սոուս թարմ բաղադրիչներով։', price: 260, category: 'Սոուսներ', ingredients: ['Պեստո', 'Բազիլիկ'] },
  { name: 'Ըմպելիք №1', shortDescription: 'Ըմպելիք №1', description: 'Զովացնող ըմպելիք №1։', price: 400, category: 'Ըմպելիքներ', ingredients: ['Ջուր', 'Շաքար'] },
  { name: 'Ըմպելիք №2', shortDescription: 'Ըմպելիք №2', description: 'Զովացնող ըմպելիք №2։', price: 450, category: 'Ըմպելիքներ', ingredients: ['Հյութ', 'Սառույց'] },
  { name: 'Ըմպելիք №3', shortDescription: 'Ըմպելիք №3', description: 'Զովացնող ըմպելիք №3։', price: 500, category: 'Ըմպելիքներ', ingredients: ['Կակաո', 'Կաթ'] },
  { name: 'Ըմպելիք №4', shortDescription: 'Ըմպելիք №4', description: 'Զովացնող ըմպելիք №4։', price: 350, category: 'Ըմպելիքներ', ingredients: ['Թեյ', 'Կիտրոն'] },
  { name: 'Ըմպելիք №5', shortDescription: 'Ըմպելիք №5', description: 'Զովացնող ըմպելիք №5։', price: 550, category: 'Ըմպելիքներ', ingredients: ['Կաթ', 'Սուրճ'] },
  { name: 'Ըմպելիք №6', shortDescription: 'Ըմպելիք №6', description: 'Զովացնող ըմպելիք №6։', price: 480, category: 'Ըմպելիքներ', ingredients: ['Լիմոնադ', 'Դաղձ'] },
  { name: 'Ըմպելիք №7', shortDescription: 'Ըմպելիք №7', description: 'Զովացնող ըմպելիք №7։', price: 420, category: 'Ըմպելիքներ', ingredients: ['Մրգային հյութ'] },
]

async function ensureCategories(): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>()
  for (const name of SEED_CATEGORIES) {
    let cat = await prisma.category.findFirst({ where: { name } })
    if (!cat) {
      cat = await prisma.category.create({
        data: { name, description: name, isActive: true },
      })
      console.log(`✅ Ստեղծված կատեգորիա: ${name}`)
    }
    categoryMap.set(name, cat.id)
  }
  return categoryMap
}

async function main() {
  console.log('🌱 Ավելացնում ենք 30 արտադրանք R2 նկարով...')
  console.log(`   Նկար: ${IMAGE_URL}`)

  const categoryMap = await ensureCategories()
  let created = 0
  let skipped = 0

  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.category)
    if (!categoryId) {
      console.warn(`⚠️ Կատեգորիան չի գտնվել: ${p.category}, արտադրանքը բաց թողնված է: ${p.name}`)
      skipped++
      continue
    }

    const existing = await prisma.product.findFirst({ where: { name: p.name } })
    if (existing) {
      console.log(`⏭️ Արդեն կա: ${p.name}`)
      skipped++
      continue
    }

    await prisma.product.create({
      data: {
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        image: IMAGE_URL,
        images: [IMAGE_URL],
        categoryId,
        ingredients: p.ingredients,
        isAvailable: true,
        status: 'REGULAR',
      },
    })
    console.log(`   ✅ ${p.name} (${p.price} ֏)`)
    created++
  }

  console.log('\n🎉 Պատրաստ է:')
  console.log(`   Ավելացվել է: ${created}`)
  if (skipped > 0) console.log(`   Բաց թողնվել է: ${skipped}`)
}

main()
  .catch((e) => {
    console.error('❌ Սխալ:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
