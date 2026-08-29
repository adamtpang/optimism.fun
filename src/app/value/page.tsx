import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { formatUSD } from '@/lib/format'
import { valueLedgers, type ValueLedger } from '@/data/value-atlas'

export const metadata: Metadata = {
  title: 'Why the world\'s most valuable things are valuable | optimism.fun',
  description:
    'The economic engines behind the largest companies, national balance sheets, cryptoassets, and personal fortunes.',
}

const valueFactors = [
  {
    n: '01',
    name: 'Usefulness',
    text: 'It solves an expensive problem, enables production, or satisfies demand people repeatedly reveal.',
  },
  {
    n: '02',
    name: 'Scarcity',
    text: 'The capability, asset, trust, permission, location, or supply is difficult to reproduce.',
  },
  {
    n: '03',
    name: 'Scale',
    text: 'One system, network, factory, institution, or brand can serve enormous demand at falling unit cost.',
  },
  {
    n: '04',
    name: 'Durability',
    text: 'Switching costs, institutions, accumulated capital, or network effects keep the advantage alive.',
  },
  {
    n: '05',
    name: 'Capture',
    text: 'An owner can retain part of the value as profit, rent, fees, tax capacity, or asset appreciation.',
  },
  {
    n: '06',
    name: 'Expectations',
    text: 'Today\'s price capitalizes a belief that the other five forces will persist or strengthen tomorrow.',
  },
]

const ledgerLinks: Record<ValueLedger['slug'], string> = {
  companies: '/companies',
  countries: '/countries',
  crypto: '/crypto',
  fortunes: '/founders',
}

const tones: Record<
  ValueLedger['slug'],
  { text: string; border: string; dot: string; wash: string }
> = {
  companies: {
    text: 'text-amber-300',
    border: 'border-amber-300/40',
    dot: 'bg-amber-300',
    wash: 'bg-amber-300/[0.035]',
  },
  countries: {
    text: 'text-terminal-green',
    border: 'border-terminal-green/40',
    dot: 'bg-terminal-green',
    wash: 'bg-terminal-green/[0.035]',
  },
  crypto: {
    text: 'text-terminal-violet',
    border: 'border-terminal-violet/40',
    dot: 'bg-terminal-violet',
    wash: 'bg-terminal-violet/[0.035]',
  },
  fortunes: {
    text: 'text-terminal-cyan',
    border: 'border-terminal-cyan/40',
    dot: 'bg-terminal-cyan',
    wash: 'bg-terminal-cyan/[0.035]',
  },
}

function MetricPrimer({ ledger }: { ledger: ValueLedger }) {
  const tone = tones[ledger.slug]
  return (
    <article className={`border-t-2 ${tone.border} pt-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`size-1.5 ${tone.dot}`} />
        <p className={`font-mono text-[10px] uppercase tracking-ultra-wide ${tone.text}`}>
          {ledger.title}
        </p>
      </div>
      <p className="text-ink-100 text-sm font-medium mb-1">{ledger.metric}</p>
      <p className="font-mono text-[11px] text-ink-300 mb-3">{ledger.formula}</p>
      <p className="text-ink-400 text-[13px] leading-relaxed mb-2">{ledger.meaning}</p>
      <p className="text-ink-500 text-[12px] leading-relaxed">Not: {ledger.warning.slice(4)}</p>
    </article>
  )
}

function LedgerSection({ ledger }: { ledger: ValueLedger }) {
  const tone = tones[ledger.slug]
  return (
    <section id={ledger.slug} className="border-b border-hair scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.46fr)] gap-8 mb-7 items-end">
          <div>
            <p className={`font-mono text-[10px] uppercase tracking-ultra-wide ${tone.text} mb-3`}>
              {ledger.eyebrow} · snapshot {ledger.asOf}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-100 leading-tight mb-3">
              Why the largest {ledger.title.toLowerCase()} are so valuable.
            </h2>
            <p className="text-ink-400 text-sm leading-relaxed max-w-3xl">
              Ranked by {ledger.metric.toLowerCase()}. The explanation names the compounding engine;
              the final column names what the price must be wrong about for that value to unwind.
            </p>
          </div>
          <div className={`border-l-2 ${tone.border} pl-4`}>
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
              How this ledger works
            </p>
            <p className="font-mono text-[12px] text-ink-200 mb-2">{ledger.formula}</p>
            <p className="text-[12px] text-ink-500 leading-relaxed">{ledger.warning}</p>
          </div>
        </div>

        <div className={`hidden md:block overflow-x-auto border border-hair ${tone.wash}`}>
          <table className="min-w-[72rem] w-full text-left">
            <thead>
              <tr className="border-b border-hair-strong bg-ink-800/40 font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                <th className="px-3 py-3 font-medium w-10">#</th>
                <th className="px-3 py-3 font-medium w-44">entity</th>
                <th className="px-3 py-3 font-medium text-right w-36">{ledger.valueLabel}</th>
                {ledger.secondaryLabel && (
                  <th className="px-3 py-3 font-medium text-right w-32">
                    {ledger.secondaryLabel}
                  </th>
                )}
                <th className="px-3 py-3 font-medium w-40">value engine</th>
                <th className="px-3 py-3 font-medium">why it compounds</th>
                <th className="px-3 py-3 font-medium">what breaks it</th>
              </tr>
            </thead>
            <tbody>
              {ledger.rows.map((row) => (
                <tr
                  key={`${ledger.slug}-${row.rank}`}
                  className="border-b border-hair last:border-b-0 align-top hover:bg-ink-800/30 transition-colors"
                >
                  <td className="px-3 py-4 font-mono text-xs text-ink-600 tabular-nums">
                    {row.rank.toString().padStart(2, '0')}
                  </td>
                  <td className="px-3 py-4">
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ink-100 hover:text-amber-300 transition-colors"
                    >
                      {row.name}
                    </a>
                    <p className="font-mono text-[10px] text-ink-500 mt-1">{row.code}</p>
                  </td>
                  <td className={`px-3 py-4 font-mono text-xs text-right tabular-nums ${tone.text}`}>
                    {formatUSD(row.value)}
                  </td>
                  {ledger.secondaryLabel && (
                    <td className="px-3 py-4 font-mono text-xs text-right tabular-nums text-ink-400">
                      {row.secondaryValue ? formatUSD(row.secondaryValue) : 'n/a'}
                    </td>
                  )}
                  <td className="px-3 py-4">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${tone.text}`}>
                      {row.engine}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-[13px] text-ink-300 leading-relaxed max-w-sm">
                    {row.why}
                  </td>
                  <td className="px-3 py-4 text-[12px] text-ink-500 leading-relaxed max-w-sm">
                    {row.fragility}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`md:hidden border border-hair ${tone.wash}`}>
          {ledger.rows.map((row) => (
            <article
              key={`${ledger.slug}-mobile-${row.rank}`}
              className="border-b border-hair last:border-b-0 p-4"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-ink-600 mb-1">
                    {row.rank.toString().padStart(2, '0')} · {row.code}
                  </p>
                  <a
                    href={row.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-100 hover:text-amber-300 transition-colors"
                  >
                    {row.name}
                  </a>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-mono text-xs tabular-nums ${tone.text}`}>
                    {formatUSD(row.value)}
                  </p>
                  {ledger.secondaryLabel && row.secondaryValue && (
                    <p className="font-mono text-[9px] text-ink-500 mt-1">
                      {formatUSD(row.secondaryValue)} GDP
                    </p>
                  )}
                </div>
              </div>
              <p className={`font-mono text-[9px] uppercase tracking-wider ${tone.text} mb-2`}>
                {row.engine}
              </p>
              <p className="text-[13px] text-ink-300 leading-relaxed mb-3">{row.why}</p>
              <div className="border-l border-terminal-rose/35 pl-3">
                <p className="font-mono text-[9px] uppercase tracking-wider text-terminal-rose mb-1">
                  What breaks it
                </p>
                <p className="text-[12px] text-ink-500 leading-relaxed">{row.fragility}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 font-mono text-[10px] text-ink-500">
          <p>
            source:{' '}
            <a
              href={ledger.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${tone.text} hover:underline underline-offset-2`}
            >
              {ledger.source}
            </a>{' '}
            · values move · explanations are optimism.fun editorial analysis
          </p>
          <Link href={ledgerLinks[ledger.slug]} className={`${tone.text} hover:underline underline-offset-2`}>
            open the full {ledger.title.toLowerCase()} ledger →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function ValuePage() {
  const leaderCount = valueLedgers.reduce((sum, ledger) => sum + ledger.rows.length, 0)

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · why value"
          title="Why is anything worth so much?"
          lede="Rankings show where economic value accumulated. This atlas explains the machinery underneath: what is useful, what is scarce, what scales, who can capture the surplus, how long the advantage can last, and what the price assumes about the future."
          rightStats={[
            { label: 'ledgers', value: valueLedgers.length, tone: 'cyan' },
            { label: 'leaders explained', value: leaderCount, tone: 'amber' },
            { label: 'causal factors', value: valueFactors.length, tone: 'green' },
          ]}
        />

        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
            <div className="flex flex-wrap gap-px bg-ink-700 border border-hair mb-10 max-w-3xl">
              {valueLedgers.map((ledger) => (
                <a
                  key={ledger.slug}
                  href={`#${ledger.slug}`}
                  className="flex-1 min-w-32 bg-[rgb(var(--bg))] px-4 py-3 font-mono text-[10px] uppercase tracking-ultra-wide text-center text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition-colors"
                >
                  {ledger.title}
                </a>
              ))}
            </div>

            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-rose mb-2">
                First: do not add these numbers together
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight max-w-3xl">
                Four leaderboards. Four different claims about value.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8">
              {valueLedgers.map((ledger) => (
                <MetricPrimer key={ledger.slug} ledger={ledger} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-hair bg-ink-900/20">
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The value equation
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight max-w-3xl mb-8">
              Economic value compounds when six forces reinforce one another.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-hair">
              {valueFactors.map((factor) => (
                <div key={factor.n} className="border-r border-b border-hair p-5 min-h-36">
                  <p className="font-mono text-[10px] text-ink-600 mb-3">{factor.n}</p>
                  <h3 className="text-sm font-medium text-ink-100 mb-2">{factor.name}</h3>
                  <p className="text-[13px] text-ink-400 leading-relaxed">{factor.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink-400 leading-relaxed max-w-4xl">
              Market value is descriptive, not moral. A monopoly, addictive product, scarce resource,
              or inherited stake can score highly on this equation without making humanity better.
              Optimism&rsquo;s separate question is where these same forces can be aimed at a good quest.
            </p>
          </div>
        </section>

        {valueLedgers.map((ledger) => (
          <LedgerSection key={ledger.slug} ledger={ledger} />
        ))}

        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid lg:grid-cols-[0.7fr_1.3fr] gap-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green mb-3">
                The founder lesson
              </p>
              <h2 className="font-serif text-3xl text-ink-100 leading-tight">
                Copy the engine, not the company.
              </h2>
            </div>
            <div className="space-y-4 text-sm text-ink-300 leading-relaxed max-w-3xl">
              <p>
                The recurring pattern is not &ldquo;start an AI company&rdquo; or &ldquo;issue a token.&rdquo;
                It is to find a large, repeated need; create an order-of-magnitude utility gain;
                build a scarce capability or distribution advantage; and retain enough of the
                resulting surplus to compound.
              </p>
              <p>
                For a missionary founder, the opportunity is to attach those economic engines to a
                problem worth solving. A good quest becomes a great company when moral importance and
                durable value capture stop fighting each other.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/good-quests"
                  className="font-mono text-[10px] uppercase tracking-ultra-wide text-paper bg-amber-300 hover:bg-amber-200 px-4 py-3 transition-colors"
                >
                  Find a good quest →
                </Link>
                <Link
                  href="/marketcap"
                  className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-300 border border-hair-strong hover:text-ink-100 hover:border-amber-300/50 px-4 py-3 transition-colors"
                >
                  See problem headroom →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-7xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-4">
              Methodology sources
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px]">
              <a
                href="https://www.investor.gov/introduction-investing/investing-basics/glossary/market-capitalization"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-400 hover:text-amber-300 underline decoration-dotted underline-offset-2"
              >
                Investor.gov · company market capitalization
              </a>
              <a
                href="https://countriesmarketcap.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-400 hover:text-terminal-green underline decoration-dotted underline-offset-2"
              >
                CountriesMarketCap · national wealth methodology
              </a>
              <a
                href="https://coinmarketcap.com/faq/?start=m1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-400 hover:text-terminal-violet underline decoration-dotted underline-offset-2"
              >
                CoinMarketCap · price, supply, and market cap
              </a>
              <a
                href="https://www.forbes.com/real-time-billionaires/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-400 hover:text-terminal-cyan underline decoration-dotted underline-offset-2"
              >
                Forbes · real-time net worth methodology
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

