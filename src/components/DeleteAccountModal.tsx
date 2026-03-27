'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

const CONFIRM_TEXT = 'ՋՆՋԵԼ'

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, isLoading = false }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleClose = useCallback(() => {
    if (isLoading) return
    setConfirmText('')
    setError('')
    onClose()
  }, [isLoading, onClose])

  useEffect(() => {
    if (!isOpen || !isMounted) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClose, isMounted, isOpen])

  const handleConfirm = async () => {
    if (confirmText !== CONFIRM_TEXT) {
      setError(`Հաստատելու համար մուտքագրեք «${CONFIRM_TEXT}»`)
      return
    }

    setError('')

    try {
      await onConfirm()
    } catch (caughtError) {
      setError('Սխալ տեղի ունեցավ հաշիվը ջնջելիս։ Փորձեք կրկին։')
      console.error('Delete account error:', caughtError)
    }
  }

  if (!isOpen || !isMounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={handleClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Հաշվի ջնջում</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <h3 className="mb-2 font-semibold text-red-800">Ուշադրություն. այս գործողությունը անդառնալի է</h3>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>Քո հաշիվը կջնջվի ընդմիշտ</li>
                  <li>Պատվերների պատմությունը կմնա համակարգում անանուն տեսքով</li>
                  <li>Հաշիվը հնարավոր չի լինի վերականգնել</li>
                  <li>Անձնական տվյալները կհեռացվեն</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-700">
              Եթե համոզված ես, որ ցանկանում ես ջնջել հաշիվը, մուտքագրիր <strong>«{CONFIRM_TEXT}»</strong> ներքևի դաշտում։
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={`Մուտքագրիր ${CONFIRM_TEXT}`}
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 p-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-xl bg-gray-100 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Չեղարկել
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading || confirmText !== CONFIRM_TEXT}
            className="flex items-center space-x-2 rounded-xl bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Ջնջվում...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Ջնջել հաշիվը</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
