'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Home, ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'

export default function AccountDeletedPage() {
  const router = useRouter()

  useEffect(() => {
    // Ավտոմատ վերահղում գլխավոր էջ 10 վայրկյանից
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
    <div className="min-h-screen bg-white">

      <div className="flex items-center justify-center pt-56 pb-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        {/* Հաջողության պատկեր */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Վերնագիր */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Հաշիվը հաջողությամբ ջնջվել է
        </h1>

        {/* Նկարագրություն */}
        <div className="text-gray-600 mb-8 space-y-3">
          <p>
            Ձեր հաշիվը ամբողջությամբ ջնջվել է մեր համակարգից։
          </p>
          <p>
            Ձեր բոլոր անձնական տվյալները անանունացվել են, 
            բրաուզերի քեշը մաքրվել է։
          </p>
          <p className="text-sm text-gray-500">
            Դուք ավտոմատ կվերահղվեք գլխավոր էջ 10 վայրկյանից։
          </p>
        </div>

        {/* Գործողությունների կոճակներ */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Գնալ գլխավոր էջ
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Հետ
          </button>
        </div>

        {/* Լրացուցիչ ինֆո */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Հարցեր ունե՞ք, կապվեք մեր աջակցության ծառայության հետ։
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
