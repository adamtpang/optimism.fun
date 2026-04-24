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
        className="font-mono text-[11px] text-ink-500 px-2 py-1"
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
      className="font-mono text-[12px] text-ink-300 hover:text-amber-300 px-2 py-1 transition-colors"
    >
      {current === 'dark' ? '◐' : '◑'}
    </button>
  )
}
