'use client'

import { useEffect } from 'react'

const isDevelopment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

export default function ServiceWorkerProvider() {
  useEffect(() => {
    if (isDevelopment) {
      // В development не регистрируем SW — избегаем кэширования и 404 на _next/static
      return
    }
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope)
          
          // Проверяем обновления
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Новый Service Worker установлен, можно обновить страницу
                  console.log('New Service Worker available. Refresh to update.')
                }
              })
            }
          })
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })

      // Обработка сообщений от Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from Service Worker:', event.data)
      })

      // Проверяем статус Service Worker
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker is ready:', registration)
      })
    }
  }, [])

  return null
}
