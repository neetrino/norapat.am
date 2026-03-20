'use client'

import { useState, useEffect } from 'react'

/**
 * Хук для проверки, что компонент гидратирован на клиенте
 * Помогает избежать ошибок гидратации React
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}
