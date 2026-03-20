'use client'

import { useState, useEffect } from 'react'

interface SiteSettings {
  logo?: string
  siteName?: string
  siteDescription?: string
  contactPhone?: string
  contactEmail?: string
  address?: string
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { settings, isLoading, refetch: fetchSettings }
}

