'use client'

import { useState, useEffect } from 'react'

export default function StarField() {
  const [shadows, setShadows] = useState<string>('')

  useEffect(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    const stars = Array.from({ length: 300 }, () => {
      const x = Math.random() * w
      const y = Math.random() * h
      const blur = Math.random() < 0.7 ? 0 : Math.random() < 0.9 ? 1 : 2
      const opacity =
        blur === 0 ? Math.random() * 0.5 + 0.2 : Math.random() * 0.5 + 0.5
      return `${x}px ${y}px ${blur}px rgba(255,255,255,${opacity})`
    }).join(', ')
    setShadows(stars)
  }, [])

  if (!shadows) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute top-0 left-0 w-px h-px"
        style={{ boxShadow: shadows }}
      />
    </div>
  )
}
