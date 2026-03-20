// Цветовая палитра Pideh Armenia
export const colors = {
  // Основные цвета
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#FF6B35', // Основной оранжевый (хачапури)
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // Акцентный красный (томаты)
  accent: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#E63946', // Красный акцент
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Нейтральные цвета
  neutral: {
    50: '#F8F9FA', // Светло-серый (фон)
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#2D3436', // Темно-серый (текст)
  },
  
  // Белый
  white: '#FFFFFF',
  
  // Статусы
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const

// Tailwind CSS классы для быстрого использования
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
