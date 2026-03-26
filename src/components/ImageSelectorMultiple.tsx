'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X, Image as ImageIcon, Check, Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface ImageSelectorMultipleProps {
  value: string[]
  onChange: (imagePaths: string[]) => void
  className?: string
}

interface ImageFile {
  name: string
  path: string
  category?: string
}

export default function ImageSelectorMultiple({
  value,
  onChange,
  className = ''
}: ImageSelectorMultipleProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | null>(null)
  const [images, setImages] = useState<ImageFile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loadingGallery, setLoadingGallery] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = async () => {
    if (images.length > 0) return
    setLoadingGallery(true)
    try {
      const response = await fetch('/api/images')
      if (response.ok) {
        const imageList = await response.json()
        setImages(imageList)
      }
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoadingGallery(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'gallery') loadImages()
  }, [activeTab])

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return
    setUploading(true)
    const uploadedPaths: string[] = []
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) continue
        if (file.size > 5 * 1024 * 1024) continue
        const formData = new FormData()
        formData.append('image', file)
        const response = await fetch('/api/upload-image', { method: 'POST', body: formData })
        if (response.ok) {
          const result = await response.json()
          setImages((prev) => [...prev, { name: file.name, path: result.path }])
          uploadedPaths.push(result.path)
        }
      }
      if (uploadedPaths.length > 0) {
        onChange([...value, ...uploadedPaths])
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const selectImage = (imagePath: string) => {
    if (value.includes(imagePath)) return
    onChange([...value, imagePath])
  }

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newValue = [...value]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= value.length) return
    ;[newValue[index], newValue[targetIndex]] = [newValue[targetIndex], newValue[index]]
    onChange(newValue)
  }

  return (
    <div className={className}>
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Նկարներ ({value.length})
          </p>
          <div className="flex flex-wrap gap-2 min-h-[5rem] p-3 bg-gray-50 rounded-lg border border-gray-200">
            {value.length === 0 ? (
              <div className="flex items-center justify-center w-full h-20 text-gray-400">
                <ImageIcon className="h-8 w-8 mr-2" />
                <span className="text-sm">Նկարներ ընտրելու համար ավելացրեք</span>
              </div>
            ) : (
              value.map((path, index) => (
                <div
                  key={`${path}-${index}`}
                  className="relative group w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 flex items-center"
                >
                  <Image
                    src={path}
                    alt={`Նկար ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-0.5 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-l">
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="p-0.5 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Տեղափոխել վերև"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === value.length - 1}
                      className="p-0.5 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Տեղափոխել ներքև"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-0.5">
                    {index + 1}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant={activeTab === 'gallery' ? 'default' : 'outline'}
            size="default"
            onClick={() => setActiveTab(activeTab === 'gallery' ? null : 'gallery')}
            className="w-32"
          >
            Գալերեա
          </Button>
          <Button
            type="button"
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            size="default"
            onClick={() => setActiveTab(activeTab === 'upload' ? null : 'upload')}
            className="w-32"
          >
            Բեռնել
          </Button>
        </div>
      </div>

      {activeTab === 'gallery' && (
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Փնտրել..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {loadingGallery ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
              {filteredImages.map((image) => (
                <button
                  key={image.path}
                  type="button"
                  onClick={() => selectImage(image.path)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    value.includes(image.path) ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'
                  }`}
                >
                  <Image src={image.path} alt={image.name} fill sizes="80px" className="object-cover" />
                  {value.includes(image.path) && (
                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                      <Check className="h-6 w-6 text-orange-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="mt-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files) }}
          >
            <p className="mb-4">Քաշեք նկարներ այստեղ</p>
            <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ընտրել'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  )
}
