'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Footer from '@/components/Footer'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white">
      <div className="h-16 lg:h-24"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Վճարումը հաջողությամբ կատարվեց
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Շնորհակալություն։ Ձեր պատվերը հաստատված է։ Մենք կապ կհաստատենք ձեզ հետ շուտով։
          </p>

          {orderId && (
            <p className="text-gray-500 mb-8">
              Պատվերի #<span className="font-mono">{orderId.slice(-8)}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-lg"
            >
              Պատվիրել նորից
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

      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}
