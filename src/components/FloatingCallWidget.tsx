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
      className="pointer-events-none fixed bottom-16 right-3 z-[120] sm:bottom-36 sm:right-12 lg:bottom-24 lg:right-14"
    >
      <div className="relative pointer-events-auto">
        <button
          type="button"
          aria-label={`Call now — ${primaryPhone}`}
          aria-expanded={isOpen}
          aria-controls={isOpen ? panelId : undefined}
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f7a29c]/70 bg-[radial-gradient(circle_at_30%_30%,#ff7469_0%,#ee3124_48%,#a81f16_100%)] text-white shadow-[0_10px_22px_rgba(238,49,36,0.32)] ring-1 ring-white/12 transition-[box-shadow] duration-200 hover:shadow-[0_14px_28px_rgba(238,49,36,0.38)] focus-visible:outline-none sm:h-11 sm:w-11"
        >
          <PhoneCall className="h-4 w-4 sm:h-[17px] sm:w-[17px]" strokeWidth={2.3} />
        </button>

        {isOpen && (
          <div
            id={panelId}
            className="animate-call-panel-in absolute z-[1] flex w-[min(calc(100vw-1.5rem),11.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#f19b93]/20 bg-[linear-gradient(145deg,rgba(92,16,13,0.98),rgba(168,31,22,0.97),rgba(124,22,17,0.98))] py-0 shadow-[0_14px_32px_rgba(95,18,14,0.42),0_0_0_1px_rgba(255,255,255,0.06)_inset] ring-1 ring-[#ee3124]/25 backdrop-blur-md max-sm:bottom-full max-sm:right-0 max-sm:mb-1.5 max-sm:top-auto sm:bottom-auto sm:right-[calc(100%+0.5rem)] sm:top-1/2 sm:mb-0 sm:w-max sm:max-w-[min(100vw-2rem,20rem)]"
            role="region"
            aria-label="Phone numbers"
          >
            <div className="border-b border-white/[0.08] bg-black/10 px-3 py-1">
              <p className="text-[9px] font-semibold uppercase leading-none tracking-[0.18em] text-[#ffb0a9]/95">
                Զանգել հիմա
              </p>
              <p className="mt-px text-[10px] font-medium leading-none text-white/50">
                Ընտրիր համարը՝ զանգի համար
              </p>
            </div>
            <ul className="list-none space-y-0 px-1.5 py-0.5">
              {phones.map((phone, index) => (
                <li key={phone}>
                  <a
                    href={normalizeTelHref(phone)}
                    aria-label={`Call ${phone}`}
                    className="group flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.06] px-2 py-1 transition-all duration-200 hover:border-[#f7a29c]/35 hover:bg-white/[0.1] hover:shadow-[0_0_16px_rgba(238,49,36,0.16)] focus-visible:border-[#f7a29c]/50 focus-visible:bg-white/[0.12] focus-visible:outline-none"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/12 to-white/[0.04] text-[#ffb0a9] shadow-inner ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-105 group-hover:ring-[#ee3124]/30">
                      <Phone className="h-3 w-3" strokeWidth={2.1} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 text-left leading-none">
                      <span className="block text-[8px] font-medium uppercase tracking-[0.1em] text-white/45">
                        {index === 0 ? 'Հիմնական' : 'Լրացուցիչ'}
                      </span>
                      <span className="mt-px block whitespace-nowrap text-[14px] font-semibold leading-none tracking-wide text-white tabular-nums sm:text-[15px]">
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
