// NORAPAT brand palette (logo: red #EE3124, black #000000, gray #333333, white #FFFFFF)
export const colors = {
  primary: {
    50: '#fef2f2',
    100: '#fde8e7',
    200: '#fccfcd',
    300: '#f9a5a1',
    400: '#f56d66',
    500: '#EE3124', // NORAPAT red (logo)
    600: '#d92b1f',
    700: '#b32319',
    800: '#8c1b13',
    900: '#66140e',
  },

  accent: {
    50: '#fef2f2',
    100: '#fde8e7',
    200: '#fccfcd',
    300: '#f9a5a1',
    400: '#f56d66',
    500: '#EE3124',
    600: '#d92b1f',
    700: '#b32319',
    800: '#8c1b13',
    900: '#66140e',
  },

  neutral: {
    50: '#F8F9FA',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#333333', // NORAPAT secondary text (tagline)
  },

  white: '#FFFFFF',
  black: '#000000', // NORAPAT main text

  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const

export const colorClasses = {
  primary: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    border: 'border-orange-500',
    hover: 'hover:bg-orange-600',
  },
  accent: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    border: 'border-red-500',
    hover: 'hover:bg-red-600',
  },
  neutral: {
    bg: 'bg-gray-50',
    text: 'text-gray-900',
    border: 'border-gray-300',
  },
} as const
