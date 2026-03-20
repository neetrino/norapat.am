'use client'

import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { RefreshCw, ArrowDown } from 'lucide-react'
import { useEffect } from 'react'

interface PullToRefreshProps {
  children: React.ReactNode
  className?: string
}

export default function PullToRefresh({ children, className = '' }: PullToRefreshProps) {
  const { isPulling, isRefreshing, pullDistance, canRefresh, triggerRefresh } = usePullToRefresh()

  // Анимация для индикатора
  const getIndicatorTransform = () => {
    if (isRefreshing) return 'scale(1.2) rotate(180deg)'
    if (isPulling) return `translateY(${Math.min(pullDistance * 0.5, 60)}px) scale(${Math.min(1 + pullDistance * 0.002, 1.2)})`
    return 'translateY(-100px) scale(0.8)'
  }

  const getIndicatorOpacity = () => {
    if (isRefreshing) return 1
    if (isPulling) return Math.min(pullDistance / 40, 1)
    return 0
  }

  const getBackgroundHeight = () => {
    if (isRefreshing) return '80px'
    if (isPulling) return `${Math.min(pullDistance * 0.3, 60)}px`
    return '0px'
  }

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Индикатор Pull-to-Refresh */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          height: getBackgroundHeight(),
          backgroundColor: canRefresh 
            ? 'rgba(249, 115, 22, 0.1)' 
            : 'rgba(59, 130, 246, 0.1)',
          backdropFilter: 'blur(10px)',
          transform: `translateY(${isRefreshing ? '0' : '-100%'})`,
          opacity: getIndicatorOpacity()
        }}
      >
        <div
          className="flex flex-col items-center justify-center space-y-2 transition-all duration-300 ease-out"
          style={{
            transform: getIndicatorTransform()
          }}
        >
          {/* Иконка */}
          <div className="relative">
            {isRefreshing ? (
              <RefreshCw 
                className={`w-6 h-6 text-orange-500 animate-spin`}
                style={{ animationDuration: '1s' }}
              />
            ) : (
              <ArrowDown 
                className={`w-6 h-6 transition-colors duration-200 ${
                  canRefresh ? 'text-orange-500' : 'text-blue-500'
                }`}
                style={{
                  transform: canRefresh ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease-out'
                }}
              />
            )}
          </div>

          {/* Текст */}
          <div className="text-center">
            <p className={`text-sm font-medium transition-colors duration-200 ${
              canRefresh ? 'text-orange-600' : 'text-blue-600'
            }`}>
              {isRefreshing 
                ? 'Обновляем...' 
                : canRefresh 
                  ? 'Отпустите для обновления' 
                  : 'Потяните для обновления'
              }
            </p>
            {isPulling && !isRefreshing && (
              <div className="w-24 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-200"
                  style={{
                    width: `${Math.min((pullDistance / 80) * 100, 100)}%`
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Контент */}
      <div 
        className="transition-transform duration-300 ease-out"
        style={{
          transform: isPulling ? `translateY(${Math.min(pullDistance * 0.3, 60)}px)` : 'translateY(0)'
        }}
      >
        {children}
      </div>

      {/* Overlay для блокировки взаимодействия во время обновления */}
      {isRefreshing && (
        <div className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm" />
      )}
    </div>
  )
}
