/**
 * Թեստի համար՝ մի քանի ապրանք նշում է որպես հատուկ առաջարկ (NEW) և մի քանիսը՝ որպես լավագույն (CLASSIC)։
 * - NEW — երևում է և հատուկ առաջարկների, և լավագույնների ֆիլտրում
 * - CLASSIC — միայն լավագույնների բաժնում
 *
 * Գործարկում. pnpm exec tsx scripts/set-showcase-demo-status.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PROMO_SAMPLE = 3
const BEST_ONLY_SAMPLE = 3

async function main() {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, status: true },
  })

  if (products.length === 0) {
    console.log('Ապրանքներ չկան։ Նախ լցրու ԲԴ-ն (pnpm run db:seed)։')
    process.exit(1)
  }

  const promoSlice = products.slice(0, Math.min(PROMO_SAMPLE, products.length))
  const rest = products.slice(promoSlice.length)
  const classicSlice = rest.slice(0, Math.min(BEST_ONLY_SAMPLE, rest.length))

  for (const p of promoSlice) {
    await prisma.product.update({
      where: { id: p.id },
      data: { status: 'NEW' },
    })
    console.log(`✓ NEW (հատուկ առաջարկ + լավագույն): ${p.name}`)
  }

  for (const p of classicSlice) {
    await prisma.product.update({
      where: { id: p.id },
      data: { status: 'CLASSIC' },
    })
    console.log(`✓ CLASSIC (միայն լավագույն): ${p.name}`)
  }

  console.log(
    `\nՊատրաստ է։ Ընդամենը ${promoSlice.length} × NEW, ${classicSlice.length} × CLASSIC։`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
