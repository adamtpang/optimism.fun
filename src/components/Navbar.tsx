'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { name: 'Problems', href: '/' },
  { name: 'Companies', href: '/companies' },
  { name: 'Founders', href: '/founders' },
  { name: 'Countries', href: '/countries' },
  { name: 'Crypto', href: '/crypto' },
  { name: 'Voices', href: '/voices' },
  { name: 'Ecosystem', href: '/ecosystem' },
]

const metaLinks = [
  { name: 'Methodology', href: '/methodology' },
  { name: 'About', href: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#08080a]/85 backdrop-blur-md border-b border-hair'
          : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-mono text-[13px] tracking-tight text-ink-100 hover:text-amber-300 transition-colors"
        >
          <span className="text-amber-300">◆</span>{' '}
          <span className="font-semibold">optimism.fun</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-amber-300'
                  : 'text-ink-300 hover:text-ink-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <span className="mx-2 h-4 w-px bg-ink-600" />
          {metaLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-2.5 py-1 text-xs transition-colors ${
                isActive(link.href)
                  ? 'text-amber-300'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-ink-300 hover:text-ink-100 transition-colors p-2"
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="square"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="square"
                strokeWidth={1.5}
                d="M4 7h16M4 12h16M4 17h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-ink-900/95 backdrop-blur-md border-t border-hair">
          {[...navLinks, ...metaLinks].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm border-b border-hair last:border-b-0 transition-colors ${
                isActive(link.href)
                  ? 'text-amber-300'
                  : 'text-ink-300 hover:text-ink-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
