'use client'

import { Phone, PhoneCall } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { companyInfo } from '@/constants/company'

/** Narrow no-break space for elegant phone grouping (U+202F). */
const PHONE_GROUP_SPACE = '\u202f'

function normalizeTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits ? `tel:+${digits}` : '#'
}

/**
 * Formats Armenian +374 numbers with thin spacing for display.
 */
function formatPhoneDisplay(phone: string): string {
  const trimmed = phone.trim()
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (digitsOnly.length === 11 && digitsOnly.startsWith('374')) {
    const cc = digitsOnly.slice(0, 3)
    const part1 = digitsOnly.slice(3, 5)
    const part2 = digitsOnly.slice(5, 8)
    const part3 = digitsOnly.slice(8, 11)
    return [`+${cc}`, part1, part2, part3].join(PHONE_GROUP_SPACE)
  }
  return trimmed
}

export default function FloatingCallWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onDocPointerDown = (e: PointerEvent) => {
      const el = rootRef.current
      if (el && !el.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', onDocPointerDown)
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [isOpen])

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const phones = companyInfo.callNowPhones
  const primaryPhone = phones[0] ?? companyInfo.phone

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-32 right-10 z-[120] sm:bottom-36 sm:right-12 lg:bottom-24 lg:right-14"
    >
      <div className="relative pointer-events-auto">
        <button
          type="button"
          aria-label={`Call now — ${primaryPhone}`}
          aria-expanded={isOpen}
          aria-controls={isOpen ? panelId : undefined}
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ffb703]/80 bg-[radial-gradient(circle_at_30%_30%,#c43c3c_0%,#a02828_52%,#8b1414_100%)] text-white shadow-[0_12px_28px_rgba(160,40,40,0.34)] ring-1 ring-white/12 transition-[box-shadow] duration-200 hover:shadow-[0_16px_34px_rgba(160,40,40,0.4)] focus-visible:outline-none sm:h-12 sm:w-12"
        >
          <PhoneCall className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2.4} />
        </button>

        {isOpen && (
          <div
            id={panelId}
            className="animate-call-panel-in absolute right-[calc(100%+0.5rem)] top-1/2 z-[1] flex w-max max-w-[min(100vw-2rem,20rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(145deg,rgba(58,8,8,0.98),rgba(120,18,18,0.96),rgba(90,12,12,0.98))] py-1 shadow-[0_18px_40px_rgba(40,6,6,0.45),0_0_0_1px_rgba(255,183,3,0.12)_inset] ring-1 ring-[#ffb703]/25 backdrop-blur-md"
            role="region"
            aria-label="Phone numbers"
          >
            <div className="border-b border-white/[0.08] bg-black/15 px-3.5 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ffb703]/95">
                Զանգել հիմա
              </p>
              <p className="mt-0.5 text-xs font-medium leading-snug text-white/55">
                Ընտրիր համարը՝ զանգի համար
              </p>
            </div>
            <ul className="list-none space-y-1 p-1.5">
              {phones.map((phone, index) => (
                <li key={phone}>
                  <a
                    href={normalizeTelHref(phone)}
                    aria-label={`Call ${phone}`}
                    className="group flex items-center gap-3 rounded-xl border border-transparent bg-white/[0.03] px-2.5 py-2 transition-all duration-200 hover:border-[#ffb703]/35 hover:bg-[#ffb703]/[0.08] hover:shadow-[0_0_20px_rgba(255,183,3,0.12)] focus-visible:border-[#ffb703]/50 focus-visible:bg-[#ffb703]/[0.1] focus-visible:outline-none"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/12 to-white/[0.04] text-[#ffb703] shadow-inner ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-105 group-hover:ring-[#ffb703]/30">
                      <Phone className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
                        {index === 0 ? 'Հիմնական' : 'Լրացուցիչ'}
                      </span>
                      <span className="mt-0.5 block text-[15px] font-semibold leading-tight tracking-wide text-white tabular-nums sm:text-base">
                        {formatPhoneDisplay(phone)}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
