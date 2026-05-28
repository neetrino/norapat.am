'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MapPin, Plus, Save, Trash2, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeliveryRate {
  city: string
  fee: number
}

interface DeliveryResponse {
  rates: DeliveryRate[]
}

export default function AdminDeliveryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rates, setRates] = useState<DeliveryRate[]>([])
  const [city, setCity] = useState('')
  const [fee, setFee] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    void fetchRates()
  }, [session, status, router])

  const sortedRates = useMemo(
    () => [...rates].sort((a, b) => a.city.localeCompare(b.city, 'hy-AM')),
    [rates]
  )

  async function fetchRates() {
    try {
      const response = await fetch('/api/admin/delivery')
      if (!response.ok) {
        throw new Error('Failed to fetch delivery rates')
      }
      const data = (await response.json()) as DeliveryResponse
      setRates(data.rates ?? [])
    } catch {
      setMessage('Չհաջողվեց բեռնել առաքման տվյալները։')
    } finally {
      setIsLoading(false)
    }
  }

  function handleAddRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedCity = city.trim()
    const numericFee = Number(fee)
    if (!normalizedCity || Number.isNaN(numericFee) || numericFee < 0) {
      setMessage('Լրացրեք քաղաքը և նշեք ճիշտ գումար։')
      return
    }

    const duplicate = rates.some(
      (item) => item.city.toLocaleLowerCase('hy-AM') === normalizedCity.toLocaleLowerCase('hy-AM')
    )
    if (duplicate) {
      setMessage('Այս քաղաքն արդեն ավելացված է։')
      return
    }

    setRates((prev) => [...prev, { city: normalizedCity, fee: Math.round(numericFee) }])
    setCity('')
    setFee('')
    setMessage('')
  }

  function handleRemoveRate(targetCity: string) {
    setRates((prev) => prev.filter((item) => item.city !== targetCity))
    setMessage('')
  }

  async function handleSave() {
    setIsSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/delivery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rates }),
      })
      if (!response.ok) {
        throw new Error('Failed to save delivery rates')
      }
      setMessage('Առաքման տվյալները պահպանված են։')
    } catch {
      setMessage('Չհաջողվեց պահպանել։ Փորձեք կրկին։')
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <Truck className="h-7 w-7 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Առաքում</h1>
          <p className="text-sm text-gray-600">Կառավարեք քաղաքներն ու առաքման արժեքը</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleAddRate} className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
              Քաղաք
            </label>
            <input
              id="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Օր․ Արմավիր"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div>
            <label htmlFor="fee" className="mb-1 block text-sm font-medium text-gray-700">
              Առաքման գումար (֏)
            </label>
            <input
              id="fee"
              type="number"
              min={0}
              step={1}
              value={fee}
              onChange={(event) => setFee(event.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 sm:w-auto">
              <Plus className="mr-1.5 h-4 w-4" />
              Ավելացնել
            </Button>
          </div>
        </form>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Քաղաք</th>
                <th className="px-4 py-3">Առաքման արժեք</th>
                <th className="px-4 py-3 text-right">Գործողություն</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedRates.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    Առայժմ քաղաքներ չկան
                  </td>
                </tr>
              ) : (
                sortedRates.map((item) => (
                  <tr key={item.city}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        {item.city}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.fee.toLocaleString()} ֏</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveRate(item.city)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Հեռացնել
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Checkout էջում հաճախորդը կընտրի քաղաքը այս ցուցակից։
          </p>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? 'Պահպանվում է...' : 'Պահպանել փոփոխությունները'}
          </Button>
        </div>

        {message && (
          <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  )
}
