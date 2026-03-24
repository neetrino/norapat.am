'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error:', error.message, error.digest)
    }
  }, [error])

  return (
    <html lang="ru" suppressHydrationWarning>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fff' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111', marginBottom: 8 }}>
            Ինչ-որ բան սխալ է
          </h1>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: 24 }}>
            Լուրջ սխալ տեղի ունեցավ։ Թարմացրեք էջը։
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              background: '#EE3124',
              color: '#fff',
              border: 'none',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Թարմացնել էջը
          </button>
        </div>
      </body>
    </html>
  )
}
