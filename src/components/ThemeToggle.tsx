'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="inline-flex items-center justify-center h-11 w-11 text-small text-ink-500"
      >
        ◐
      </button>
    )
  }

  const current = theme === 'system' ? resolvedTheme : theme
  const next = current === 'dark' ? 'light' : 'dark'

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="inline-flex items-center justify-center h-11 w-11 text-small text-ink-300 hover:text-primary transition-colors"
    >
      {current === 'dark' ? '◐' : '◑'}
    </button>
  )
}
