'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { XCircle, ArrowRight } from 'lucide-react'
import Footer from '@/components/Footer'

export default function PaymentFailPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const reason = searchParams.get('reason')
  const isArcaPending = reason === 'arca_pending'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white">
      <div className="h-header-spacer-mobile lg:h-header-spacer-desktop" aria-hidden />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isArcaPending ? 'Վճարումը դեռ հաստատվում է' : 'Վճարումը չեղարկվեց'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {isArcaPending
              ? 'Եթե գումարը գանձվել է, պատվերի կարգավիճակը կթարմանա մի քանի րոպեում։ Հակառակ դեպքում կարող եք կրկին փորձել։'
              : 'Վճարումը չի ավարտվել։ Կարող եք փորձել նորից կամ ընտրել այլ վճարման եղանակ։'}
          </p>

          {orderId && (
            <p className="text-gray-500 mb-8">
              Պատվերի #<span className="font-mono">{orderId.slice(-8)}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-lg"
            >
              Վերադառնալ զամբյուղ
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition-colors text-lg"
            >
              Գլխավոր
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}