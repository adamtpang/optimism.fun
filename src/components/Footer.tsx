import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-hair bg-[#08080a] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <Link
              href="/"
              className="font-mono text-sm text-ink-100 hover:text-amber-300 transition-colors"
            >
              <span className="text-amber-300">◆</span>{' '}
              <span className="font-semibold">optimism.fun</span>
            </Link>
            <p className="text-xs text-ink-400 mt-3 max-w-sm leading-relaxed">
              Humanity&rsquo;s quest log. All problems are explainable, all solutions are
              creatable.
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
              Data
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <Link href="/" className="text-ink-300 hover:text-amber-300 transition-colors">
                problems
              </Link>
              <Link href="/companies" className="text-ink-300 hover:text-amber-300 transition-colors">
                companies
              </Link>
              <Link href="/founders" className="text-ink-300 hover:text-amber-300 transition-colors">
                founders
              </Link>
              <Link href="/countries" className="text-ink-300 hover:text-amber-300 transition-colors">
                countries
              </Link>
              <Link href="/crypto" className="text-ink-300 hover:text-amber-300 transition-colors">
                crypto
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
              Context
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <Link href="/voices" className="text-ink-300 hover:text-amber-300 transition-colors">
                voices
              </Link>
              <Link href="/ecosystem" className="text-ink-300 hover:text-amber-300 transition-colors">
                ecosystem
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
              Meta
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <Link href="/methodology" className="text-ink-300 hover:text-amber-300 transition-colors">
                methodology
              </Link>
              <Link href="/about" className="text-ink-300 hover:text-amber-300 transition-colors">
                about
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-hair pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[11px] text-ink-500">
          <span>
            v0.1 &middot; shipping ledger &middot; built with data from the World Bank,
            CoinMarketCap, companiesmarketcap.com, 80,000 Hours, and Our World in Data
          </span>
          <span className="font-mono text-amber-300/70">◆ Infinite problems. Infinite solutions.</span>
        </div>
      </div>
    </footer>
  )
}
