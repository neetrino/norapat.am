'use client'

import { useState, useEffect } from 'react'
import { DEFAULT_PUBLIC_LOGO_URL } from '@/lib/siteSettings.constants'

export interface PublicSiteSettingsState {
  logo: string | null
  siteName: string | null
  contactPhone: string | null
  contactEmail: string | null
  address: string | null
  isLoading: boolean
}

type BrandingData = Pick<
  PublicSiteSettingsState,
  'logo' | 'siteName' | 'contactPhone' | 'contactEmail' | 'address'
>

let shared: BrandingData | null = null
let inflight: Promise<BrandingData> | null = null

function fetchBrandingOnce(): Promise<BrandingData> {
  if (shared) {
    return Promise.resolve(shared)
  }
  if (inflight) {
    return inflight
  }
  inflight = fetch('/api/site-settings')
    .then((res) => (res.ok ? res.json() : {}))
    .then((data: { logo?: string; siteName?: string; contactPhone?: string; contactEmail?: string; address?: string }) => {
      const logo =
        typeof data.logo === 'string'
          ? data.logo.trim()
          : DEFAULT_PUBLIC_LOGO_URL
      const siteName =
        typeof data.siteName === 'string' && data.siteName.trim()
          ? data.siteName.trim()
          : null
      const contactPhone =
        typeof data.contactPhone === 'string' && data.contactPhone.trim()
          ? data.contactPhone.trim()
          : null
      const contactEmail =
        typeof data.contactEmail === 'string' && data.contactEmail.trim()
          ? data.contactEmail.trim()
          : null
      const address =
        typeof data.address === 'string' && data.address.trim()
          ? data.address.trim()
          : null
      const result: BrandingData = {
        logo,
        siteName,
        contactPhone,
        contactEmail,
        address,
      }
      shared = result
      return result
    })
    .catch(() => {
      const result: BrandingData = {
        logo: DEFAULT_PUBLIC_LOGO_URL,
        siteName: null,
        contactPhone: null,
        contactEmail: null,
        address: null,
      }
      shared = result
      return result
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

export function usePublicSiteSettings(): PublicSiteSettingsState {
  const [state, setState] = useState<PublicSiteSettingsState>(() => ({
    logo: shared?.logo ?? null,
    siteName: shared?.siteName ?? null,
    contactPhone: shared?.contactPhone ?? null,
    contactEmail: shared?.contactEmail ?? null,
    address: shared?.address ?? null,
    isLoading: shared === null,
  }))

  useEffect(() => {
    if (shared) {
      setState({ ...shared, isLoading: false })
      return
    }
    fetchBrandingOnce().then((data) => setState({ ...data, isLoading: false }))
  }, [])

  return state
}
