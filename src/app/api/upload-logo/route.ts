import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { isR2Configured, uploadToR2 } from '@/lib/r2'

const LOGO_MAX_BYTES = 2 * 1024 * 1024

const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
}

const ALLOWED_LOGO_MIME = new Set(Object.keys(MIME_TO_EXT))

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'R2 storage is not configured' },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!ALLOWED_LOGO_MIME.has(file.type)) {
      return NextResponse.json(
        { error: 'Допустимы только PNG, JPG или GIF' },
        { status: 400 }
      )
    }

    if (file.size > LOGO_MAX_BYTES) {
      return NextResponse.json(
        { error: 'Размер файла должен быть меньше 2 МБ' },
        { status: 400 }
      )
    }

    const ext = MIME_TO_EXT[file.type] ?? 'png'
    const key = `images/logo.${ext}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fullUrl = await uploadToR2(key, buffer, file.type)

    return NextResponse.json({
      success: true,
      message: 'Logo updated successfully',
      url: fullUrl
    })
  } catch (error) {
    console.error('Logo upload error:', error)
    return NextResponse.json(
      { error: 'Failed to update logo' },
      { status: 500 }
    )
  }
}
