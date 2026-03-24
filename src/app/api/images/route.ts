import { NextResponse } from 'next/server'
import { isR2Configured, listR2Objects } from '@/lib/r2'

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']

function getImageCategory(filename: string): string {
  const name = filename.toLowerCase()

  if (name.includes('pide') || name.includes('пиде')) return 'Пиде'
  if (name.includes('kombo') || name.includes('комбо')) return 'Комбо'
  if (name.includes('sauce') || name.includes('соус')) return 'Соусы'
  if (
    name.includes('drink') ||
    name.includes('напиток') ||
    name.includes('cola') ||
    name.includes('juice')
  )
    return 'Напитки'
  if (
    name.includes('snack') ||
    name.includes('снэк') ||
    name.includes('popcorn') ||
    name.includes('fries')
  )
    return 'Снэк'

  return 'Другое'
}

export async function GET() {
  try {
    if (!isR2Configured()) {
      return NextResponse.json([])
    }

    const objects = await listR2Objects('images/')
    const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') ?? ''

    const imageFiles = objects
      .filter((obj) => {
        if (!obj.Key) return false
        const name = obj.Key.split('/').pop() ?? ''
        const ext = name.toLowerCase().split('.').pop()
        return (
          !obj.Key.endsWith('/') &&
          ext &&
          ALLOWED_EXTENSIONS.includes(ext)
        )
      })
      .map((obj) => {
        const key = obj.Key ?? ''
        const name = key.split('/').pop() ?? ''
        const fullPath = `${baseUrl}/${key}`
        return {
          name,
          path: fullPath,
          category: getImageCategory(name)
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(imageFiles)
  } catch (error) {
    console.error('Error listing images from R2:', error)
    return NextResponse.json(
      { error: 'Failed to load images' },
      { status: 500 }
    )
  }
}
