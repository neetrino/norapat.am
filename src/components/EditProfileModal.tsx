'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Loader2, Mail, MapPin, Phone, Save, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    name?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
  }
  onSave: (data: { name: string; phone: string; address: string }) => Promise<void>
}

export default function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({ name: user.name || '', phone: user.phone || '', address: user.address || '' })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    setFormData({ name: user.name || '', phone: user.phone || '', address: user.address || '' })
    setErrors({})
  }, [isOpen, user])

  useEffect(() => {
    if (!isOpen || !isMounted) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLoading, isMounted, isOpen, onClose])

  const validateForm = () => {
    const nextErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) nextErrors.name = 'Անունը պարտադիր է'
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) nextErrors.phone = 'Մուտքագրիր ճիշտ հեռախոսահամար'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  if (!isOpen || !isMounted) return null

  const fields = [
    { key: 'name', label: 'Անուն', placeholder: 'Մուտքագրիր քո անունը', icon: User, type: 'text', value: formData.name, error: errors.name, helper: 'Այս անունը կօգտագործվի պատվերի տվյալներում։' },
    { key: 'phone', label: 'Հեռախոս', placeholder: '+374 XX XXX XXX', icon: Phone, type: 'tel', value: formData.phone, error: errors.phone, helper: 'Օգտագործվում է առաքման հետ կապ հաստատելու համար։' },
    { key: 'address', label: 'Հասցե', placeholder: 'Մուտքագրիր առաքման հասցեն', icon: MapPin, type: 'text', value: formData.address, error: errors.address, helper: 'Կարող ես թողնել դատարկ և լրացնել պատվերի պահին։' },
  ] as const

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm" onClick={() => !isLoading && onClose()} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/60 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)]">
        <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_40%),linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Profile</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Խմբագրել պրոֆիլը</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">Թարմացրու հիմնական տվյալները մեկ հստակ ձևում, առանց էջից դուրս գալու։</p>
            </div>
            <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50" disabled={isLoading}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-slate-400" />
              Email
            </label>
            <Input type="email" value={user.email || ''} disabled className="border-slate-200 bg-white text-slate-500 disabled:opacity-100" />
            <p className="mt-2 text-xs text-slate-500">Email-ը չի խմբագրվում այս էջից։</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((field) => {
              const Icon = field.icon
              const spanClass = field.key === 'address' ? 'md:col-span-2' : ''
              return (
                <div key={field.key} className={spanClass}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Icon className="h-4 w-4 text-slate-400" />
                      {field.label}
                      {field.key === 'name' && <span className="text-rose-500">*</span>}
                    </label>
                    <Input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={field.error ? 'border-rose-300 focus-visible:ring-rose-400' : 'border-slate-200'}
                      disabled={isLoading}
                    />
                    <p className={`mt-2 text-xs ${field.error ? 'text-rose-500' : 'text-slate-500'}`}>{field.error || field.helper}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="h-11 rounded-full px-5" disabled={isLoading}>
              Փակել
            </Button>
            <Button type="submit" className="h-11 rounded-full px-5" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Պահպանվում է...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Պահպանել փոփոխությունները
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
