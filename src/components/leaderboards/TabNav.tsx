'use client'

import { useState, useEffect } from 'react'

const TABS = [
  { id: 'problems', label: 'Problems' },
  { id: 'companies', label: 'Companies' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'people', label: 'People' },
  { id: 'founders', label: 'Founders' },
  { id: 'countries', label: 'Countries' },
]

export default function TabNav() {
  const [active, setActive] = useState('problems')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    TABS.forEach(tab => {
      const el = document.getElementById(tab.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="sticky top-16 z-40 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/5 -mx-4 sm:-mx-6 px-4 sm:px-6 mb-8">
      <div className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => scrollTo(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              active === tab.id
                ? 'bg-gold/10 text-gold font-medium'
                : 'text-muted hover:text-cream'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
