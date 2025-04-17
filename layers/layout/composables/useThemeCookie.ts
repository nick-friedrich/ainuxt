// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { useState, useCookie, computed } from '#imports'

export const useThemeCookie = () => {
  // Unique key for useState
  const themeStateKey = 'theme_preference'
  // Cookie name
  const themeCookieName = 'theme'

  // Use useState to manage theme state across components and SSR/client
  // Default to 'light' if no cookie exists initially
  const theme = useState<string>(themeStateKey, () => useCookie(themeCookieName).value || 'light')

  // Get the cookie ref
  const themeCookie = useCookie<string>(themeCookieName, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    // secure: true, // Recommended for production if using HTTPS
    // path: '/', // Default path
  })

  // Function to toggle the theme
  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    theme.value = newTheme // Update state
    themeCookie.value = newTheme // Update cookie
  }

  // Computed property for easier checking
  const isDark = computed(() => theme.value === 'dark')

  return {
    theme, // The reactive theme value ('light' or 'dark')
    isDark, // Computed boolean for dark mode
    toggleTheme, // Function to switch the theme
  }
} 