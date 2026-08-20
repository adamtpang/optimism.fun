'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { FeedbackButton } from './FeedbackWidget'

export type NavTab = {
  name: string
  href: string
  count: number
  tone: 'amber' | 'cyan' | 'green' | 'violet'
}

const TONE: Record<NavTab['tone'], string> = {
  amber: 'text-amber-300',
  cyan: 'text-terminal-cyan',
  green: 'text-terminal-green',
  violet: 'text-terminal-violet',
}

export default function NavbarClient({ tabs }: { tabs: NavTab[] }) {
  const [scrolled, setScrolled] = useState(false)
  const ticking = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        ticking.current = false
      })
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-ink/90 backdrop-blur-md border-b border-hair'
          : 'bg-ink border-b border-hair'
      }`}
    >
      {/* Row 1: brand + meta */}
      <div className="border-b border-hair">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-[13px] text-ink-100 hover:text-amber-300 transition-colors"
          >
            <span className="text-amber-300">◆</span>{' '}
            <span className="font-semibold">optimism.fun</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px]">
            <span className="hidden md:inline text-ink-500">
              v0.1
            </span>
            <Link
              href="/manifesto"
              className={`transition-colors ${
                isActive('/manifesto') ? 'text-amber-300' : 'text-ink-300 hover:text-ink-100'
              }`}
            >
              manifesto
            </Link>
            <Link
              href="/methodology"
              className={`hidden sm:inline transition-colors ${
                isActive('/methodology') ? 'text-amber-300' : 'text-ink-300 hover:text-ink-100'
              }`}
            >
              methodology
            </Link>
            <FeedbackButton />
            <a
              href="https://github.com/adamtpang/optimism.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline text-ink-300 hover:text-ink-100 transition-colors"
            >
              github
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Row 2: data tabs, scrollable on mobile, always visible */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-stretch gap-px whitespace-nowrap">
          {tabs.map((tab) => {
            const active = isActive(tab.href)
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 px-3 transition-colors border-b-2 ${
                  active
                    ? 'border-amber-300 text-ink-100 bg-amber-300/[0.04]'
                    : 'border-transparent text-ink-400 hover:text-ink-100 hover:bg-ink-800/40'
                }`}
              >
                <span className="font-sans text-[13px] font-medium">{tab.name}</span>
                <span
                  className={`font-mono text-[10px] tabular-nums ${
                    active ? TONE[tab.tone] : 'text-ink-600'
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
