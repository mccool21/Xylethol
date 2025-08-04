import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-50 bg-github-bg-secondary dark:bg-github-dark-bg-secondary border border-github-border dark:border-github-dark-border rounded-full px-4 py-2 shadow-github dark:shadow-github-dark hover:shadow-github-hover dark:hover:shadow-github-dark-hover transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary"
      aria-label="Toggle dark mode"
    >
      <span className="text-base">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
      <span className="hidden sm:inline">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}