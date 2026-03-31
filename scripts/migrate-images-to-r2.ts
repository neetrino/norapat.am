/**
 * Միգրացիա: PostgreSQL-ում պահված image paths → R2 վերբեռնում, DB թարմացում
 *
 * 1. Վերցնում է Product.image, Product.images[], Campaign.image paths-ը
 * 2. Յուրաքանչյուր unique path-ի համար — ֆայլը public/ կամ URL-ից, վերբեռնում R2
 * 3. Թարմացնում է DB-ն R2 URL-ներով
 * 4. (Անհրաժեշտության դեպքում) ջնջում է լոկալ ֆայլերը
 *
 * Գործարկում:
 *   pnpm exec tsx scripts/migrate-images-to-r2.ts
 *
 * ENV:
 *   MIGRATION_SOURCE_URL — եթե նկարները դեռ հասանելի են URL-ով (օր. https://yoursite.com)
 *   Կամ public/images/ թղթապանակում պետք է լինեն ֆայլերը
 */
import 'dotenv/config'
import { createPrismaClient } from '../src/lib/prisma'
import { existsSync, readFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { uploadToR2, isR2Configured } from '../src/lib/r2'

const prisma = createPrismaClient()

const SOURCE_URL = process.env.MIGRATION_SOURCE_URL ?? process.env.NEXTAUTH_URL ?? ''

function isFullUrl(path: string): boolean {
  return path.startsWith('http://') || path.startsWith('https://')
}

function getLocalPath(relativePath: string): string {
  const clean = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath
  return join(process.cwd(), 'public', clean)
}

async function getImageBuffer(path: string): Promise<Buffer | null> {
  if (isFullUrl(path)) return null

  const localPath = getLocalPath(path)
  if (existsSync(localPath)) {
    return readFileSync(localPath)
  }

  if (SOURCE_URL) {
    try {
      const url = `${SOURCE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
      const res = await fetch(url)
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer()
        return Buffer.from(arrayBuffer)
      }
    } catch {
      // ignore
    }
  }

  return null
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp'
  }
  return map[ext ?? ''] ?? 'image/png'
}

async function main() {
  console.log('🔄 Միգրացիա: image paths → R2\n')

  if (!isR2Configured()) {
    console.error('❌ R2-ը կարգավորված չէ (.env-ում R2_*)')
    process.exit(1)
  }

  const pathsToMigrate = new Set<string>()

  const products = await prisma.product.findMany({
    select: { image: true, images: true }
  })
  for (const p of products) {
    if (p.image && !isFullUrl(p.image)) pathsToMigrate.add(p.image)
    for (const img of p.images ?? []) {
      if (img && !isFullUrl(img)) pathsToMigrate.add(img)
    }
  }

  const campaigns = await prisma.campaign.findMany({
    select: { image: true }
  })
  for (const c of campaigns) {
    if (c.image && !isFullUrl(c.image)) pathsToMigrate.add(c.image)
  }

  const paths = Array.from(pathsToMigrate)
  console.log(`📋 Գտնվել է ${paths.length} unique path (արդեն R2 URL-ներով — skip)\n`)

  if (paths.length === 0) {
    console.log('✅ Բոլոր paths-ը արդեն R2 URL-ներ են, միգրացիա չի պետք.')
    return
  }

  const pathToR2Url: Record<string, string> = {}
  let uploaded = 0
  let skipped = 0

  for (const path of paths) {
    const buffer = await getImageBuffer(path)
    if (!buffer) {
      console.log(`   ⚠️ Skip (ֆայլ չկա): ${path}`)
      skipped++
      continue
    }

    const filename = path.split('/').pop() ?? `image-${Date.now()}.png`
    const key = `images/${filename}`
    const contentType = getContentType(filename)

    try {
      const r2Url = await uploadToR2(key, buffer, contentType)
      pathToR2Url[path] = r2Url
      console.log(`   ✅ ${path} → ${r2Url}`)
      uploaded++

      const localPath = getLocalPath(path)
      if (existsSync(localPath)) {
        try {
          unlinkSync(localPath)
          console.log(`      🗑️ Ջնջված լոկալ: ${localPath}`)
        } catch {
          // ignore
        }
      }
    } catch (e) {
      console.error(`   ❌ Upload error ${path}:`, e)
    }
  }

  if (Object.keys(pathToR2Url).length === 0) {
    console.log('\n⚠️ Ոչ մի path չթարմացվեց (ֆայլեր չեն գտնվել)')
    return
  }

  console.log('\n📝 DB թարմացում...')

  const productsFull = await prisma.product.findMany({ select: { id: true, name: true, image: true, images: true } })
  let productsUpdated = 0
  for (const p of productsFull) {
    const newImage = p.image && pathToR2Url[p.image] ? pathToR2Url[p.image] : p.image
    const newImages = p.images?.map((img) => pathToR2Url[img] ?? img) ?? []
    if (newImage !== p.image || JSON.stringify(newImages) !== JSON.stringify(p.images)) {
      await prisma.product.update({
        where: { id: p.id },
        data: { image: newImage ?? p.image, images: newImages }
      })
      productsUpdated++
    }
  }
  console.log(`   Products updated: ${productsUpdated}`)

  const campaignsFull = await prisma.campaign.findMany({ select: { id: true, image: true } })
  for (const c of campaignsFull) {
    if (c.image && pathToR2Url[c.image]) {
      await prisma.campaign.update({
        where: { id: c.id },
        data: { image: pathToR2Url[c.image] }
      })
      console.log(`   Campaign ${c.id} updated`)
    }
  }

  console.log(`\n🎉 Պատրաստ է. Վերբեռնվել է R2: ${uploaded}, skip: ${skipped}`)
}

main()
  .catch((e) => {
    console.error('❌ Սխալ:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
