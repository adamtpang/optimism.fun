'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FeedbackButton } from './FeedbackWidget'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

const NAV_TABS = [
  { name: 'Problems', href: '/' },
  { name: 'Where', href: '/where' },
  { name: 'Discoveries', href: '/discoveries' },
  { name: 'Capital', href: '/command#capital' },
  { name: 'Talent', href: '/command#talent' },
  { name: 'Markets', href: '/command#markets' },
]

export default function NavbarClient() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const onHero = pathname === '/' && !pastHero

  useEffect(() => {
    if (pathname !== '/') return
    const update = () => setPastHero(window.scrollY >= 560)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [pathname])

  const isActive = (href: string) => {
    const path = href.split('#')[0]
    return path === '/' ? pathname === '/' : pathname?.startsWith(path)
  }

  const itemClass = (active: boolean) =>
    `inline-flex items-center h-11 px-3 rounded-lg text-small font-medium ${
      onHero
        ? active
          ? 'text-primary bg-accent md:text-white md:bg-white/15'
          : 'text-ink-300 hover:bg-ink-800 md:text-white/90 md:hover:bg-white/10'
        : active
          ? 'text-primary bg-accent'
          : 'text-ink-300 hover:bg-ink-800'
    }`

  return (
    <header className={`fixed top-0 inset-x-0 z-50 ${onHero ? 'nav-on-hero' : 'glass'}`}>
      <div className="site-shell h-14 md:h-16 flex items-center gap-2 md:gap-6">
        <Link href="/" className={`inline-flex items-center gap-2 h-11 font-semibold text-body shrink-0 ${onHero ? 'text-ink-100 md:text-white' : 'text-ink-100'}`}>
          <img src="/brand/optimism-mark.svg" alt="" width={28} height={28} />
          optimism.fun
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV_TABS.map((tab) => (
            <Link key={tab.name} href={tab.href} className={itemClass(isActive(tab.href))}>
              {tab.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden lg:flex items-center gap-1">
          <Link href="/methodology" className={itemClass(isActive('/methodology'))}>
            Methodology
          </Link>
          <a
            href="https://github.com/adamtpang/optimism.fun"
            target="_blank"
            rel="noopener noreferrer"
            className={itemClass(false)}
          >
            GitHub
          </a>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={`lg:hidden ml-auto inline-flex items-center justify-center h-11 w-11 rounded-lg border border-border bg-background text-foreground ${
                onHero ? 'md:border-white/40 md:bg-transparent md:text-white' : ''
              }`}
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,320px)]">
            <SheetTitle className="text-body">optimism.fun</SheetTitle>
            <nav className="mt-6 flex flex-col" aria-label="Mobile">
              {NAV_TABS.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center h-12 text-body text-neutral-900 border-b border-neutral-100"
                >
                  {tab.name}
                </Link>
              ))}
              <Link href="/methodology" onClick={() => setOpen(false)} className="flex items-center h-12 text-body border-b border-neutral-100">
                Methodology
              </Link>
              <Link href="/manifesto" onClick={() => setOpen(false)} className="flex items-center h-12 text-body border-b border-neutral-100">
                manifesto
              </Link>
              <a
                href="https://github.com/adamtpang/optimism.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center h-12 text-body border-b border-neutral-100"
              >
                GitHub
              </a>
              <div className="flex items-center h-12">
                <FeedbackButton />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
