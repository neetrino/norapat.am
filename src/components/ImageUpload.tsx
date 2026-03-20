'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  onImageRemove?: () => void
  accept?: string
  maxSize?: number // в MB
  className?: string
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  onImageRemove,
  accept = 'image/*',
  maxSize = 5,
  className = ''
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError('')
    
    // Проверка размера файла
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Файл слишком большой. Максимальный размер: ${maxSize}MB`)
      return
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение')
      return
    }

    setIsUploading(true)

    try {
      // Создаем FormData для загрузки
      const formData = new FormData()
      formData.append('file', file)

      // Используем специальный API для логотипа
      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки файла')
      }

      const data = await response.json()
      onImageChange(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      setError('Ошибка загрузки файла. Попробуйте еще раз.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = () => {
    if (onImageRemove) {
      onImageRemove()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Текущее изображение */}
      {currentImage && (
        <div className="relative">
          <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={currentImage}
              alt="Current logo"
              fill
              sizes="128px"
              className="object-contain"
            />
          </div>
          {onImageRemove && (
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Область загрузки */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-300 hover:border-orange-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          {isUploading ? (
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : (
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isUploading ? 'Загрузка...' : 'Перетащите изображение сюда или нажмите для выбора'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF до {maxSize}MB
            </p>
          </div>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}

