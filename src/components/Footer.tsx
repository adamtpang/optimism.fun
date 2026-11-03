'use client'

import Link from 'next/link'
import { FeedbackButton } from './FeedbackWidget'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-background mt-16 md:mt-24">
      <div className="site-shell py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 h-11 text-body font-semibold text-ink-100">
              <img src="/brand/optimism-mark.svg" alt="" width={28} height={28} />
              optimism.fun
            </Link>
            <p className="text-small text-neutral-600 mt-3 max-w-sm leading-relaxed">
              Humanity&rsquo;s hardest problems. Bring money or work.
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-small font-medium text-neutral-600 mb-3">HUMANITY&rsquo;S BOUNTY BOARD</div>
            <div className="flex flex-col text-small">
              <Link href="/" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                problems
              </Link>
              <Link href="/voices" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                explanations
              </Link>
              <Link href="/companies" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                solutions
              </Link>
              <Link href="/founders" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                people
              </Link>
              <Link href="/progress" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                progress
              </Link>
              <Link href="/discoveries" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                discoveries
              </Link>
              <Link href="/research" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                research
              </Link>
            </div>
          </div>
          <div>
            <div className="text-small font-medium text-neutral-600 mb-3">CONTEXT</div>
            <div className="flex flex-col text-small">
              <Link href="/countries" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                countries
              </Link>
              <Link href="/crypto" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                crypto
              </Link>
              <Link href="/ecosystem" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                capital stack
              </Link>
            </div>
          </div>
          <div>
            <div className="text-small font-medium text-neutral-600 mb-3">META</div>
            <div className="flex flex-col text-small">
              <Link href="/methodology" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                methodology
              </Link>
              <Link href="/manifesto" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                manifesto
              </Link>
              <Link href="/about" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                about
              </Link>
              <Link href="/contact" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                contact
              </Link>
              <Link href="/privacy" className="inline-flex items-center h-11 text-neutral-800 hover:text-primary">
                privacy
              </Link>
              <a
                href="https://github.com/adamtpang/optimism.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center h-11 text-neutral-800 hover:text-primary"
              >
                github
              </a>
              <FeedbackButton className="h-11 justify-start px-0 py-0 font-sans text-neutral-800" />
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-200 pt-5 flex flex-col gap-3 text-small text-neutral-600">
          <span>
            v0.1 &middot; shipping ledger &middot; built with data from the World Bank,
            CoinMarketCap, companiesmarketcap.com, 80,000 Hours, and Our World in Data
          </span>
          <span className="text-primary">◆ Infinite problems. Infinite solutions.</span>
          <span>
            Built by{' '}
            <a href="https://adampang.com" className="underline underline-offset-2">
              Adam Pangelinan
            </a>
            {' · '}
            <a href="https://anchormarianas.com" className="underline underline-offset-2">
              Anchor Marianas LLC
            </a>
            {' · '}
            <a href="https://sellsniper.com" className="underline underline-offset-2">
              More projects
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
