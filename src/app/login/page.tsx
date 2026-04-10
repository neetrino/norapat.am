'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn, getSession } from 'next-auth/react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Footer from '@/components/Footer'
import { useI18n } from '@/i18n/I18nContext'

export default function LoginPage() {
  const { t } = useI18n()
  const a = t.auth
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(a.invalidCredentials)
      } else {
        const session = await getSession()
        if (session?.user?.role === 'ADMIN') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/'
        }
      }
    } catch {
      setError(a.loginError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Отступ для fixed хедера */}
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />
      
      <div className="mx-auto w-full max-w-lg px-4 pt-8 pb-14 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8 lg:pt-12 lg:pb-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
          <div className="text-center mb-7 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{a.loginTitle}</h1>
            <p className="text-gray-600">{a.loginSubtitle}</p>
          </div>

          {error && (
            <div ref={errorRef} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                {a.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-800 bg-white"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                {a.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-800 bg-white"
                  placeholder={a.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? a.signingIn : a.login}
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-gray-600">
              {a.noAccount}{' '}
              <Link href="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
                {a.registerLink}
              </Link>
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
