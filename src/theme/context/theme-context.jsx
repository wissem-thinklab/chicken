import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Get initial theme from localStorage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) {
        return saved
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Apply theme to document
    console.log('Applying theme:', theme)
    console.log('Current root classes before:', root.className)
    
    // Force immediate DOM update
    if (theme === 'dark') {
      root.classList.add('dark')
      console.log('Added dark class to root')
      // Force update
      document.body.classList.add('dark')
      document.body.style.backgroundColor = '#0f0f0f'
    } else {
      root.classList.remove('dark')
      console.log('Removed dark class from root')
      // Force update
      document.body.classList.remove('dark')
      document.body.style.backgroundColor = '#ffffff'
    }
    
    console.log('Current root classes after:', root.className)
    console.log('Current body classes after:', document.body.className)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    console.log('toggleTheme called, current theme:', theme)
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('Setting new theme to:', newTheme)
    setTheme(newTheme)
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
