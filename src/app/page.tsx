import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ProblemTable from '@/components/ProblemTable'
import EmailCapture from '@/components/EmailCapture'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { publicCompanies } from '@/data/public-companies'
import { ecosystem } from '@/data/ecosystem'
import { voices } from '@/data/voices'
import { countries } from '@/data/countries'
import { crypto } from '@/data/crypto'
import { founders } from '@/data/founders'

const atlasCards = [
  {
    href: '/companies',
    kicker: 'companies',
    n: publicCompanies.length,
    title: 'Public companies',
    desc: 'Top listed companies by market cap, via companiesmarketcap.com.',
    tone: 'cyan',
  },
  {
    href: '/founders',
    kicker: 'founders',
    n: founders.length,
    title: 'Billionaires',
    desc: 'The 2026 Forbes top 10, via Wikipedia. Net worth and source of wealth.',
    tone: 'amber',
  },
  {
    href: '/countries',
    kicker: 'countries',
    n: countries.length,
    title: 'Countries by GDP',
    desc: 'World Bank current-USD GDP, 2024. The economic weight map.',
    tone: 'green',
  },
  {
    href: '/crypto',
    kicker: 'crypto',
    n: crypto.length,
    title: 'Cryptocurrencies',
    desc: 'Top tokens by market cap via CoinMarketCap.',
    tone: 'violet',
  },
  {
    href: '/voices',
    kicker: 'voices',
    n: voices.length,
    title: 'Progress-studies thinkers',
    desc: "What Deutsch, Musk, Collison, Crawford, Cowen, and Stephens say matters.",
    tone: 'violet',
  },
  {
    href: '/ecosystem',
    kicker: 'ecosystem',
    n: ecosystem.length,
    title: 'Capital stack',
    desc: 'Grants, fellowships, studios, catalytic capital, deep-tech VC.',
    tone: 'green',
  },
] as const

const TONE: Record<'amber' | 'green' | 'violet' | 'cyan', string> = {
  amber: 'text-amber-300',
  green: 'text-terminal-green',
  violet: 'text-terminal-violet',
  cyan: 'text-terminal-cyan',
}

const shoulders = [
  { name: 'David Deutsch & Karl Popper', note: 'critical rationalism · the soluble-problem thesis' },
  { name: 'Trae Stephens & Markie Wagner', note: 'the Choose Good Quests framing' },
  { name: '80,000 Hours', note: 'ITN framework · importance × tractability × neglectedness' },
  { name: 'Copenhagen Consensus Center', note: 'benefit-cost analysis for welfare interventions' },
  { name: 'Jason Crawford & Roots of Progress', note: 'the progress-studies canon' },
  { name: 'Patrick Collison & Tyler Cowen', note: 'scientific productivity as a meta-cause' },
  { name: 'Conjecture Institute', note: 'applying critical rationalism to AI safety' },
  { name: 'The Rise Fund', note: 'Impact Multiple of Money methodology' },
]

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

        {/* Thesis / what-this-is */}
        <section className="border-b border-hair">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-6">
              The thesis
            </p>
            <blockquote className="font-serif text-2xl md:text-4xl leading-[1.15] text-ink-100 mb-4">
              <span className="text-ink-300">&ldquo;All problems are explainable.</span>
              <span className="block text-amber-300">All solutions are creatable.&rdquo;</span>
            </blockquote>
            <p className="font-mono text-[11px] text-ink-500 mb-10">
              David Deutsch &middot; via Karl Popper &middot; operationalized with data
            </p>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                  What this is
                </p>
                <p className="text-ink-300 leading-relaxed mb-4">
                  A ranked dashboard of humanity&rsquo;s most important problems, with the
                  companies, founders, and capital working on each one mapped directly to the
                  quest. Welfare, x-risk, and utility-delta scored separately so the
                  disagreements stay visible.
                </p>
                <p className="text-ink-300 leading-relaxed">
                  Targeted at two audiences:{' '}
                  <span className="text-ink-100">capital allocators</span> deciding where
                  dollars should move, and{' '}
                  <span className="text-ink-100">entrepreneurs</span> deciding what to work
                  on with the rest of their twenties, thirties, and forties.
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                  What it is not
                </p>
                <ul className="space-y-3 text-ink-300">
                  <li>
                    <span className="text-ink-100">Not a startup idea browser.</span> Not a
                    feed of reddit pain points to build SaaS for. These are hard problems,
                    mostly underfunded relative to their scale.
                  </li>
                  <li>
                    <span className="text-ink-100">Not a charity evaluator.</span> GiveWell
                    exists and is excellent. This sits upstream of where they work.
                  </li>
                  <li>
                    <span className="text-ink-100">Not for sale.</span> No company pays to
                    move up the rank. No advertising that looks like endorsement. The moment
                    that rule breaks, the dataset is worth nothing.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The atlas: 6 data cards */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                  The atlas
                </p>
                <h2 className="font-serif text-2xl text-ink-100">Six leaderboards, one thesis.</h2>
              </div>
              <span className="font-mono text-[11px] text-ink-500">
                every number has a source
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/50 border border-hair">
              {atlasCards.map((c) => (
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
          </div>
        </section>

        {/* Problem leaderboard */}
        <section className="px-6 py-14 max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                The main table
              </p>
              <h2 className="font-serif text-2xl text-ink-100">Problem leaderboard.</h2>
            </div>
            <span className="font-mono text-[11px] text-ink-500">
              {problems.length} ranked · sort, filter, click any row
            </span>
          </div>
          <ProblemTable problems={problems} />
        </section>

        {/* The third way: EA + e/acc synthesis */}
        <section className="border-t border-hair surface-paper">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-paper-copper mb-3">
              The third way
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-100 leading-tight mb-6">
              Between EA&rsquo;s safetyism and e/acc&rsquo;s cavalier speed.
            </h2>
            <p className="font-serif text-lg text-ink-200 leading-relaxed mb-4">
              There is a position Karl Popper and David Deutsch already named: critical
              rationalism. Problems are soluble. Safety is an engineering achievement of
              progress, not a brake on it. Every ranking here is a conjecture. Every
              conjecture is open to refutation.
            </p>
            <p className="font-serif text-lg text-ink-200 leading-relaxed">
              Trae Stephens closed his Founders Fund essay with one question: <em>are you
              on a good quest now?</em> This site is an attempt to answer that question with
              data.
            </p>

            <div className="mt-12">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-4">
                Shoulders we stand on
              </p>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                {shoulders.map((s) => (
                  <div key={s.name} className="flex flex-col">
                    <span className="font-sans text-sm font-medium text-ink-100">
                      {s.name}
                    </span>
                    <span className="font-mono text-[11px] text-ink-500">{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Email capture */}
        <EmailCapture />

        {/* Closer */}
        <section className="border-t border-hair">
          <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] text-ink-500">
                v0.1 &middot; shipping ledger &middot; solo-built &middot; refined weekly
              </p>
              <p className="font-mono text-[11px] text-ink-500 mt-1">
                criticism welcome. that is the deutschian engine working.
              </p>
            </div>
            <Link
              href="/methodology"
              className="inline-flex items-center font-mono text-[11px] uppercase tracking-wider text-amber-300 hover:text-amber-200 border border-amber-300/30 px-4 py-2 hover:bg-amber-300/[0.05] transition-colors self-start md:self-auto"
            >
              methodology →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
