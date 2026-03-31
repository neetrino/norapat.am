/**
 * Բոլոր ապրանքների image-ը դնում է pizza նկարով (R2 վերբեռնում + DB թարմացում)
 * Գործարկում: pnpm exec tsx scripts/set-all-product-image.ts
 */
import 'dotenv/config'
import { createPrismaClient } from '../src/lib/prisma'
import { readFileSync } from 'fs'
import { uploadToR2 } from '../src/lib/r2'

const prisma = createPrismaClient()

const IMAGE_SOURCE_PATH =
  'C:\\Users\\ROG\\.cursor\\projects\\c-Users-ROG-OneDrive-Desktop-norapat\\assets\\c__Users_ROG_AppData_Roaming_Cursor_User_workspaceStorage_864597b7046e9c4052ef62e4dbaa892c_images_23290-pizza-dough-iii-VAT-Beauty-4x3-06192801c8fa48fe8afaadfea28f532b-1bf1543a-7bcc-4798-94ed-228a72a72807.png'

const R2_KEY = 'images/pizza-margarita.png'

async function main() {
  console.log('📤 Բեռնում ենք նկարը R2-ում...')

  const buffer = readFileSync(IMAGE_SOURCE_PATH)
  const publicUrl = await uploadToR2(R2_KEY, buffer, 'image/png')

  console.log(`✅ Նկարը բեռնված է: ${publicUrl}`)
  console.log('🔄 Թարմացնում ենք բոլոր ապրանքների նկարը...')

  const result = await prisma.product.updateMany({
    data: {
      image: publicUrl,
      images: [publicUrl],
    },
  })

  console.log(`✅ Թարմացված է ${result.count} ապրանք։`)
}

main()
  .catch((e) => {
    console.error('❌ Սխալ:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
