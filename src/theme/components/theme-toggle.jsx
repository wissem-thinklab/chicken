import React from 'react'
import { useTheme } from '../context'
import { Icon } from '@iconify/react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={() => {
        console.log('Theme toggle clicked, current theme:', theme)
        toggleTheme()
      }}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Icon icon="mdi:weather-night" className="w-5 h-5" />
      ) : (
        <Icon icon="mdi:weather-sunny" className="w-5 h-5" />
      )}
    </button>
  )
}
