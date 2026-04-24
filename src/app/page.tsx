import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ProblemTable from '@/components/ProblemTable'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { publicCompanies } from '@/data/public-companies'
import { ecosystem } from '@/data/ecosystem'
import { voices } from '@/data/voices'
import { countries } from '@/data/countries'
import { crypto } from '@/data/crypto'
import { founders } from '@/data/founders'

const navCards = [
  {
    href: '/companies',
    kicker: 'companies',
    n: `${publicCompanies.length}`,
    title: 'Public companies',
    desc: 'Top public companies ranked by market cap, via companiesmarketcap.com.',
    tone: 'amber',
  },
  {
    href: '/founders',
    kicker: 'founders',
    n: `${founders.length}`,
    title: 'Billionaires',
    desc: 'The 2026 Forbes list, via Wikipedia. Individuals ranked by net worth.',
    tone: 'amber',
  },
  {
    href: '/countries',
    kicker: 'countries',
    n: `${countries.length}`,
    title: 'Countries by GDP',
    desc: 'World Bank current-USD GDP, 2024. The economic weight map.',
    tone: 'green',
  },
  {
    href: '/crypto',
    kicker: 'crypto',
    n: `${crypto.length}`,
    title: 'Cryptocurrencies',
    desc: 'Top tokens by market cap via CoinMarketCap.',
    tone: 'violet',
  },
  {
    href: '/voices',
    kicker: 'voices',
    n: `${voices.length}`,
    title: 'Progress-studies thinkers',
    desc: 'What Deutsch, Musk, Collison, Crawford, Cowen, and Stephens say matters.',
    tone: 'violet',
  },
  {
    href: '/ecosystem',
    kicker: 'ecosystem',
    n: `${ecosystem.length}`,
    title: 'Capital stack',
    desc: 'Grants, fellowships, studios, catalytic capital, deep-tech VC.',
    tone: 'cyan',
  },
] as const

const TONE: Record<'amber' | 'green' | 'violet' | 'cyan', string> = {
  amber: 'text-amber-300',
  green: 'text-terminal-green',
  violet: 'text-terminal-violet',
  cyan: 'text-terminal-cyan',
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="Humanity's quest log · v0.1"
          title="Infinite problems. Infinite solutions."
          lede="A ranked dashboard of humanity's most important problems, scored on welfare (Copenhagen BCR), x-risk (80,000 Hours ITN), and utility delta (state-of-the-art vs physics). Companies, founders, countries, crypto, and capital mapped to the quest they serve. Built for allocators and entrepreneurs who want to choose good quests, with data."
          rightStats={[
            { label: 'problems', value: problems.length, tone: 'amber' },
            { label: 'voices', value: voices.length, tone: 'violet' },
            { label: 'companies', value: companies.length + publicCompanies.length, tone: 'cyan' },
            { label: 'capital', value: ecosystem.length, tone: 'green' },
          ]}
        />

        <section className="px-6 py-10 max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-serif text-2xl text-ink-100">Problem leaderboard</h2>
            <span className="font-mono text-[11px] text-ink-500">
              {problems.length} ranked · sort and filter to taste
            </span>
          </div>
          <ProblemTable problems={problems} />
        </section>

        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-serif text-2xl text-ink-100">The atlas</h2>
            <span className="font-mono text-[11px] text-ink-500">
              six leaderboards, one thesis
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/50 border border-hair">
            {navCards.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6"
              >
                <div className="flex items-baseline justify-between mb-4">
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                    {c.kicker}
                  </p>
                  <span className={`font-mono tabular-nums text-2xl ${TONE[c.tone]}`}>
                    {c.n}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-ink-100 mb-2 group-hover:text-amber-300 transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">{c.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-6 py-10 max-w-4xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
            The thesis
          </p>
          <p className="font-serif text-2xl md:text-3xl text-ink-100 leading-snug">
            &ldquo;All problems are explainable.
            <br />
            <span className="text-amber-300">All solutions are creatable.&rdquo;</span>
          </p>
          <p className="mt-4 text-sm text-ink-400">
            David Deutsch &middot; via Karl Popper &middot; operationalized with data
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/methodology"
              className="px-4 py-2 border border-amber-300/40 text-amber-300 font-mono text-xs uppercase tracking-wider hover:bg-amber-300/10 transition-colors"
            >
              methodology
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 border border-hair text-ink-200 font-mono text-xs uppercase tracking-wider hover:border-hair-strong transition-colors"
            >
              about
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
