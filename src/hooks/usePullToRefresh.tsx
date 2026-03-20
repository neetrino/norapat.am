'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface PullToRefreshOptions {
  threshold?: number // Минимальное расстояние для срабатывания (px)
  resistance?: number // Сопротивление при перетаскивании (0-1)
  maxPullDistance?: number // Максимальное расстояние перетаскивания (px)
  refreshTimeout?: number // Таймаут для завершения обновления (ms)
  onRefresh?: () => Promise<void> | void // Функция обновления
}

interface PullToRefreshState {
  isPulling: boolean
  isRefreshing: boolean
  pullDistance: number
  canRefresh: boolean
}

export function usePullToRefresh(options: PullToRefreshOptions = {}) {
  const {
    threshold = 80,
    resistance = 0.5,
    maxPullDistance = 120,
    refreshTimeout = 2000,
    onRefresh
  } = options

  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    canRefresh: false
  })

  const startY = useRef<number>(0)
  const currentY = useRef<number>(0)
  const isAtTop = useRef<boolean>(true)

  // Проверяем, находимся ли мы в верхней части страницы
  const checkIfAtTop = useCallback(() => {
    return window.scrollY === 0
  }, [])

  // Обработчик начала касания
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (state.isRefreshing) return
    
    isAtTop.current = checkIfAtTop()
    if (!isAtTop.current) return

    startY.current = e.touches[0].clientY
    currentY.current = e.touches[0].clientY

    setState(prev => ({
      ...prev,
      isPulling: true
    }))
  }, [state.isRefreshing, checkIfAtTop])

  // Обработчик движения касания
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!state.isPulling || state.isRefreshing) return

    currentY.current = e.touches[0].clientY
    const deltaY = currentY.current - startY.current

    if (deltaY > 0) {
      // Применяем сопротивление
      const resistanceFactor = Math.min(deltaY / (maxPullDistance / resistance), 1)
      const pullDistance = deltaY * resistance * resistanceFactor

      setState(prev => ({
        ...prev,
        pullDistance: Math.min(pullDistance, maxPullDistance),
        canRefresh: pullDistance >= threshold
      }))

      // Предотвращаем скролл страницы при перетаскивании
      if (pullDistance > 10) {
        e.preventDefault()
      }
    }
  }, [state.isPulling, state.isRefreshing, threshold, resistance, maxPullDistance])

  // Обработчик окончания касания
  const handleTouchEnd = useCallback(async () => {
    if (!state.isPulling || state.isRefreshing) return

    setState(prev => ({
      ...prev,
      isPulling: false
    }))

    if (state.canRefresh) {
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        pullDistance: 0
      }))

      try {
        // Выполняем обновление
        if (onRefresh) {
          await onRefresh()
        } else {
          // Стандартное обновление страницы
          window.location.reload()
        }
      } catch (error) {
        console.error('Ошибка при обновлении:', error)
      } finally {
        // Сбрасываем состояние после таймаута
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            isRefreshing: false,
            canRefresh: false
          }))
        }, refreshTimeout)
      }
    } else {
      // Анимация возврата в исходное положение
      setState(prev => ({
        ...prev,
        pullDistance: 0,
        canRefresh: false
      }))
    }
  }, [state.isPulling, state.isRefreshing, state.canRefresh, onRefresh, refreshTimeout])

  // Умная логика обновления для разных страниц
  const getSmartRefreshAction = useCallback(() => {
    const pathname = window.location.pathname
    
    switch (pathname) {
      case '/':
        // Главная страница - обновляем продукты и баннеры
        return () => {
          // Очищаем кэш и перезагружаем
          localStorage.removeItem('products-cache')
          localStorage.removeItem('banner-cache')
          window.location.reload()
        }
      
      case '/products':
        // Страница продуктов - обновляем категории и продукты
        return () => {
          localStorage.removeItem('products-cache')
          localStorage.removeItem('categories-cache')
          window.location.reload()
        }
      
      case '/cart':
        // Корзина - обновляем корзину
        return () => {
          localStorage.removeItem('cart-cache')
          window.location.reload()
        }
      
      case '/profile':
        // Профиль - обновляем данные пользователя
        return () => {
          localStorage.removeItem('user-profile-cache')
          window.location.reload()
        }
      
      default:
        // Остальные страницы - стандартное обновление
        return () => window.location.reload()
    }
  }, [])

  // Устанавливаем обработчики событий
  useEffect(() => {
    const element = document.documentElement

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  // Функция для программного запуска обновления
  const triggerRefresh = useCallback(async () => {
    if (state.isRefreshing) return

    setState(prev => ({
      ...prev,
      isRefreshing: true
    }))

    try {
      const refreshAction = getSmartRefreshAction()
      await refreshAction()
    } catch (error) {
      console.error('Ошибка при программном обновлении:', error)
    } finally {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isRefreshing: false
        }))
      }, refreshTimeout)
    }
  }, [state.isRefreshing, getSmartRefreshAction, refreshTimeout])

  return {
    ...state,
    triggerRefresh
  }
}
