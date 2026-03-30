'use client'

import { PhoneCall } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { companyInfo } from '@/constants/company'

function normalizeTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits ? `tel:+${digits}` : '#'
}

export default function FloatingCallWidget() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const phones = companyInfo.callNowPhones
  const primaryPhone = phones[0] ?? companyInfo.phone

  return (
    <div className="pointer-events-none fixed bottom-24 right-3 z-[120] sm:bottom-28 sm:right-4 lg:bottom-7 lg:right-6">
      <div className="group flex items-center gap-1.5">
        <div className="pointer-events-auto origin-right translate-x-2 scale-95 rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(74,10,10,0.96),rgba(139,20,20,0.94))] px-2 py-1.5 opacity-0 shadow-[0_14px_34px_rgba(74,10,10,0.3)] ring-1 ring-[#ffb703]/15 backdrop-blur-md transition-all duration-250 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:scale-100 group-focus-within:opacity-100">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-1.5">
            {phones.map((phone) => (
              <a
                key={phone}
                href={normalizeTelHref(phone)}
                aria-label={`Call ${phone}`}
                className="rounded-full border border-white/12 bg-white/6 px-2.5 py-1 text-[10px] font-semibold tracking-[0.02em] text-white/95 transition-all duration-200 hover:border-[#ffb703]/60 hover:bg-white/12 hover:text-white focus-visible:border-[#ffb703]/60 focus-visible:bg-white/12 focus-visible:text-white focus-visible:outline-none"
              >
                {phone}
              </a>
            ))}
          </div>
        </div>

        <a
          href={normalizeTelHref(primaryPhone)}
          aria-label={`Call now ${primaryPhone}`}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#ffb703]/80 bg-[radial-gradient(circle_at_30%_30%,#c43c3c_0%,#a02828_52%,#8b1414_100%)] text-white shadow-[0_12px_28px_rgba(160,40,40,0.34)] ring-1 ring-white/12 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_16px_34px_rgba(160,40,40,0.4)] focus-visible:-translate-y-0.5 focus-visible:scale-[1.03] focus-visible:outline-none sm:h-12 sm:w-12"
        >
          <PhoneCall className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2.4} />
        </a>
      </div>
    </div>
  )
}
