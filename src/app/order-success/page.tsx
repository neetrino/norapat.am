'use client'

import Link from 'next/link'
import { CheckCircle, Clock, Phone, ArrowRight } from 'lucide-react'
import Footer from '@/components/Footer'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Отступ для fixed хедера */}
      <div className="h-header-spacer-mobile lg:h-header-spacer-desktop" aria-hidden />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          
          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Պատվերը հաջողությամբ ձևակերպվեց
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Շնորհակալություն պատվերի համար։ Մենք կստանանք ձեր հայտը և շուտով կկապ հաստատենք։
          </p>
          
          {/* Order Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ի՞նչ է հաջորդը</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">Պատվերի հաստատում</h3>
                  <p className="text-gray-600">5 րոպեի ընթացքում ձեզ կզանգահարենք պատվերի մանրամասները հաստատելու համար</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">Պատրաստում</h3>
                  <p className="text-gray-600">Ձեր պատվերը կպատրաստվի 15-20 րոպեում</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">Առաքում</h3>
                  <p className="text-gray-600">Առաքիչը կհասցնի պատվերը նշված հասցեին ընտրված ժամին</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="bg-orange-50 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Օգնության կարի՞ք ունեք</h3>
            <p className="text-gray-600 mb-4">
              Եթե պատվերի վերաբերյալ հարցեր ունեք, զանգահարեք մեզ.
            </p>
            <a 
              href="tel:+37495044888"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              +374 95-044-888
            </a>
          </div>
          
          {/* Action Buttons */}
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
      
      {/* Hide Footer on Mobile and Tablet */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}
