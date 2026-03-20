'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Home, ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'

export default function AccountDeletedPage() {
  const router = useRouter()

  useEffect(() => {
    // Автоматическое перенаправление на главную через 10 секунд
    const timer = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Иконка успеха */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Аккаунт успешно удален
        </h1>

        {/* Описание */}
        <div className="text-gray-600 mb-8 space-y-3">
          <p>
            Ваш аккаунт был полностью удален из нашей системы.
          </p>
          <p>
            Все ваши персональные данные были анонимизированы, 
            а кэш браузера очищен.
          </p>
          <p className="text-sm text-gray-500">
            Вы будете автоматически перенаправлены на главную страницу через 10 секунд.
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Перейти на главную
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Если у вас есть вопросы, свяжитесь с нашей службой поддержки.
          </p>
        </div>
        </div>
      </div>
      
      {/* Hide Footer on Mobile and Tablet */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}
