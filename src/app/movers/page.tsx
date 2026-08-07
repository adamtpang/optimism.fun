import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { publicCompanies } from '@/data/public-companies'
import { formatUSD } from '@/lib/format'

export const metadata = {
  title: 'The fastest-growing companies on earth | optimism.fun',
  description:
    "Not who's biggest — who's rising fastest. Real 3-year market-cap growth, computed from two dated snapshots, not a guess.",
}

const withGrowth = publicCompanies
  .filter((c) => c.growth3yr)
  .sort((a, b) => b.growth3yr!.value - a.growth3yr!.value)

const withoutGrowth = publicCompanies.filter((c) => !c.growth3yr)

export default function MoversPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · fastest growers"
          title="Not who's biggest. Who's rising."
          lede="/companies ranks by level — who has the most market cap right now. This ranks by slope: which of today's biggest companies grew fastest over the last 3 years, computed from two real dated snapshots (Aug 2023 vs today), not a guess. A company can be enormous and still be flat, or mid-sized and accelerating — level and slope are different questions."
          rightStats={[
            { label: 'quantified', value: withGrowth.length, tone: 'amber' },
            {
              label: 'top grower',
              value: withGrowth[0] ? `+${withGrowth[0].growth3yr!.value}%` : '—',
              tone: 'cyan',
            },
          ]}
        />

        <section className="px-6 py-10 max-w-7xl mx-auto">
          <div className="overflow-x-auto border border-hair">
            <table className="min-w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-hair-strong bg-ink-800/40 text-left text-[10px] uppercase tracking-ultra-wide text-ink-400">
                  <th className="px-3 py-2.5 font-medium w-10">#</th>
                  <th className="px-3 py-2.5 font-medium">company</th>
                  <th className="px-3 py-2.5 font-medium text-right">market cap now</th>
                  <th className="px-3 py-2.5 font-medium text-right">3yr growth</th>
                  <th className="px-3 py-2.5 font-medium text-right">rank by size</th>
                </tr>
              </thead>
              <tbody>
                {withGrowth.map((c, i) => {
                  const g = c.growth3yr!.value
                  return (
                    <tr
                      key={c.ticker}
                      className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-ink-600 tabular-nums">
                        {(i + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-3 py-2.5 text-ink-100 font-sans text-sm">
                        {c.name}
                        <span className="text-ink-500 ml-2">{c.ticker}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-ink-300">
                        {formatUSD(c.marketCap.value)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-right tabular-nums ${
                          g >= 0 ? 'text-amber-300' : 'text-terminal-rose'
                        }`}
                      >
                        {g >= 0 ? '+' : ''}
                        {g}%
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-ink-600">
                        #{c.rank}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-500">
            <span className="text-ink-600">source:</span>{' '}
            <a
              href="https://companiesmarketcap.com/time-machine/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
            >
              companiesmarketcap.com Time Machine
            </a>
            {' · '}
            <span className="text-ink-600">Aug 7 2023 vs</span> {publicCompanies[0]?.asOf}
          </p>
        </section>

        {withoutGrowth.length > 0 && (
          <section className="border-t border-hair bg-ink-900/30">
            <div className="max-w-4xl mx-auto px-6 py-10">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
                Probably bigger risers, left unquantified
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-3">
                What&apos;s missing is the interesting part.
              </h2>
              <p className="text-ink-400 leading-relaxed max-w-2xl mb-5 text-sm">
                These {withoutGrowth.length} companies are in today&apos;s top 50 by market cap but
                weren&apos;t in the top ~66 as of Aug 2023 — meaning their real 3-year growth is
                larger than anything in the table above, just not quantified this pass. Several
                (Palantir, Micron, SK Hynix, CXMT) are well-documented AI/chip-cycle stories; rather
                than estimate, each is left blank until a per-company historical lookup confirms a
                real number.
              </p>
              <div className="flex flex-wrap gap-2">
                {withoutGrowth.map((c) => (
                  <span
                    key={c.ticker}
                    className="font-mono text-[11px] text-ink-300 border border-hair rounded px-2 py-1"
                  >
                    {c.name} <span className="text-ink-600">#{c.rank}</span>
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/companies"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                Rank by size instead →
              </Link>
              <Link
                href="/frontier"
                className="px-4 py-2 border border-amber-300/40 text-amber-300 font-mono text-[12px] hover:bg-amber-300/[0.06] transition-colors"
              >
                The people behind the capital →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
