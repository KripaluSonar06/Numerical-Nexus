import { createContext, useState, useCallback } from 'react'
import { themeConfig } from '../config/theme.config.js'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const [theme, setTheme] = useState(themeConfig)

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  const updateTheme = useCallback((newTheme) => {
    setTheme(prev => ({ ...prev, ...newTheme }))
  }, [])

  const value = {
    isDark,
    theme,
    toggleTheme,
    updateTheme,
    colors: theme.colors,
    spacing: theme.spacing
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
