import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const folder: string = data.get('folder') as string || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Создаем уникальное имя файла
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // Путь к папке public
    const uploadDir = join(process.cwd(), 'public', folder)
    
    // Создаем папку если не существует
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Папка уже существует
    }

    // Путь к файлу
    const filepath = join(uploadDir, filename)
    
    // Сохраняем файл
    await writeFile(filepath, buffer)

    // Возвращаем URL файла
    const fileUrl = `/${folder}/${filename}`

    return NextResponse.json({ 
      url: fileUrl,
      filename: filename,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
