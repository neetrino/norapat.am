import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images')
    
    // Получаем список всех файлов в папке images
    const files = await readdir(imagesDir, { withFileTypes: true })
    
    // Фильтруем только изображения
    const imageFiles = files
      .filter(file => {
        if (!file.isFile()) return false
        const ext = file.name.toLowerCase().split('.').pop()
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')
      })
      .map(file => ({
        name: file.name,
        path: `/images/${file.name}`,
        category: getImageCategory(file.name)
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(imageFiles)
  } catch (error) {
    console.error('Error reading images directory:', error)
    return NextResponse.json(
      { error: 'Failed to load images' },
      { status: 500 }
    )
  }
}

/**
 * Определяет категорию изображения по названию
 */
function getImageCategory(filename: string): string {
  const name = filename.toLowerCase()
  
  if (name.includes('pide') || name.includes('пиде')) return 'Пиде'
  if (name.includes('kombo') || name.includes('комбо')) return 'Комбо'
  if (name.includes('sauce') || name.includes('соус')) return 'Соусы'
  if (name.includes('drink') || name.includes('напиток') || name.includes('cola') || name.includes('juice')) return 'Напитки'
  if (name.includes('snack') || name.includes('снэк') || name.includes('popcorn') || name.includes('fries')) return 'Снэк'
  
  return 'Другое'
}
