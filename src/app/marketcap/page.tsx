import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import DataFreshness from '@/components/DataFreshness'
import { computeMarketCapIndex, indexTotals, leastCapturable } from '@/lib/marketcap'
import { formatUSD, formatHumans, formatPercent } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The Problems Market Cap Index | optimism.fun',
  description:
    "Humanity's problems ranked by the in-limit market cap of whoever solves them. CoinMarketCap ranks what the market has already priced. This ranks what it could price, and shows how much of each ceiling is still unclaimed.",
}

/** Dollars-per-person lands anywhere between cents and thousands depending on the row. */
const perPerson = (n: number): string =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : n >= 1 ? `$${n.toFixed(0)}` : `$${n.toFixed(2)}`

export default function MarketCapPage() {
  const rows = computeMarketCapIndex()
  const totals = indexTotals(rows)
  const uncapturable = leastCapturable(rows, 3)
  const top = rows[0]

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The problems market cap index
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              Every problem worth solving,
              <span className="block text-amber-300">priced at the limit.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              CoinMarketCap ranks assets by what the market has{' '}
              <span className="text-ink-200">already</span> priced. This ranks problems by what the
              market <span className="text-ink-200">could</span> price if someone actually solved
              them, then subtracts the value companies have already captured. What is left is the
              headroom: the part of the prize still sitting there unclaimed.
            </p>

            {/* Ticker */}
            <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-px bg-hair border border-hair">
              <div className="bg-ink-900/40 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                  Total ceiling
                </p>
                <p className="font-mono text-xl text-amber-300 tabular-nums">
                  {formatUSD(totals.totalCeiling)}
                </p>
              </div>
              <div className="bg-ink-900/40 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                  Claimed so far
                </p>
                <p className="font-mono text-xl text-terminal-violet tabular-nums">
                  {formatUSD(totals.totalClaimed)}
                </p>
              </div>
              <div className="bg-ink-900/40 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                  Headroom
                </p>
                <p className="font-mono text-xl text-terminal-green tabular-nums">
                  {formatUSD(totals.totalHeadroom)}
                </p>
              </div>
              <div className="bg-ink-900/40 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                  No company coverage
                </p>
                <p className="font-mono text-xl text-terminal-rose tabular-nums">
                  {totals.uncovered} of {rows.length}
                </p>
              </div>
            </div>

            {top && (
              <p className="mt-4 font-mono text-[11px] text-ink-500">
                <span className="text-amber-300">#1</span> {top.problem.name} ·{' '}
                {formatUSD(top.ceiling)} ceiling · {formatPercent(totals.coveredClaimedPct)} claimed
                across the problems we have coverage on, by {totals.trackedCompanies} tracked
                companies
              </p>
            )}
            <DataFreshness className="mt-5" />
          </div>
        </section>

        {/* The index */}
        <section className="px-6 py-10 max-w-7xl mx-auto">
          <div className="overflow-x-auto border border-hair">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-ink-900/50 border-b border-hair-strong">
                  <th className="text-left font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 px-4 py-3 w-10">
                    #
                  </th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 px-4 py-3">
                    Problem
                  </th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 px-4 py-3">
                    Ceiling
                  </th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 px-4 py-3">
                    Claimed
                  </th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 px-4 py-3">
                    Headroom
                  </th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 px-4 py-3 w-32">
                    Claimed %
                  </th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 px-4 py-3">
                    People
                  </th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 px-4 py-3">
                    $ / person
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.problem.slug}
                    className="border-b border-hair last:border-b-0 hover:bg-ink-900/30 transition-colors"
                  >
                    <td className="px-4 py-4 font-mono text-xs text-ink-500 tabular-nums align-top">
                      {r.rank}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={`/p/${r.problem.slug}`}
                        className="text-ink-100 text-sm font-medium hover:text-amber-300 transition-colors"
                      >
                        {r.problem.name}
                      </Link>
                      <p className="text-ink-500 text-[12px] leading-snug mt-1 max-w-md">
                        anchored to {r.cap.comparable}
                      </p>
                      {r.topHolder ? (
                        <p className="font-mono text-[10px] text-ink-600 mt-1.5">
                          biggest holder: {r.topHolder.name} · {r.holders.length} tracked
                        </p>
                      ) : (
                        <p className="font-mono text-[10px] text-terminal-rose mt-1.5">
                          no company tracked yet · claimed value unmeasured
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-amber-300 tabular-nums align-top">
                      {formatUSD(r.ceiling)}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-terminal-violet tabular-nums align-top">
                      {r.covered ? (
                        formatUSD(r.claimed)
                      ) : (
                        <span className="text-ink-600">unmeasured</span>
                      )}
                    </td>
                    <td
                      className={`px-4 py-4 text-right font-mono text-sm tabular-nums align-top ${
                        r.covered ? 'text-terminal-green' : 'text-ink-600'
                      }`}
                    >
                      {r.covered ? formatUSD(r.headroom) : `≤ ${formatUSD(r.ceiling)}`}
                    </td>
                    <td className="px-4 py-4 align-top">
                      {r.covered ? (
                        <>
                          <div className="h-1.5 w-full bg-ink-800 overflow-hidden">
                            <div
                              className="h-full bg-terminal-violet"
                              style={{ width: `${Math.max(r.claimedPct * 100, 1)}%` }}
                            />
                          </div>
                          <p className="font-mono text-[10px] text-ink-500 tabular-nums mt-1.5">
                            {formatPercent(r.claimedPct, 1)}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="h-1.5 w-full bg-ink-800 overflow-hidden border-t border-dashed border-terminal-rose/40" />
                          <p className="font-mono text-[10px] text-terminal-rose mt-1.5">
                            no coverage
                          </p>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-xs text-ink-400 tabular-nums align-top">
                      {formatHumans(r.humansAffected)}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-xs text-ink-300 tabular-nums align-top">
                      {perPerson(r.ceilingPerPerson)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-mono text-[10px] text-ink-600 mt-3">
            Scroll the table sideways on narrow screens. Every ceiling is an editorial estimate at
            low confidence, not a forecast.
          </p>
        </section>

        {/* The finding the index exists to surface */}
        <section className="border-y border-hair bg-ink-900/30">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              What the last column says
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 mb-4 max-w-3xl">
              A big prize and a lot of suffering are not the same measurement.
            </h2>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base mb-5">
              Dollars per person is the ceiling divided by the humans the problem affects: how much
              capturable equity value exists per person harmed. It is not a measure of how much a
              problem matters. It is a measure of whether anyone can get paid for fixing it. These
              are the three lowest rows in the index.
            </p>
            <p className="text-ink-500 leading-relaxed max-w-2xl text-[13px] mb-7">
              They are low for two different reasons, and the column cannot tell them apart, so read
              it with that in hand. Neglected tropical diseases is the real case: the cures cost
              cents, they work, and the ceiling is the smallest on the board because the patients
              cannot pay. Biosecurity and fertility decline are low for an arithmetic reason
              instead, since both are recorded as affecting most of humanity and any finite ceiling
              divided by billions of people goes small. A low figure here is a prompt to check which
              of the two is happening, not a verdict.
            </p>
            <div className="grid md:grid-cols-3 gap-px bg-hair border border-hair">
              {uncapturable.map((r) => (
                <div key={r.problem.slug} className="bg-ink-900/40 px-5 py-5">
                  <p className="font-mono text-[11px] text-terminal-rose mb-2 tabular-nums">
                    {perPerson(r.ceilingPerPerson)} per person affected
                  </p>
                  <Link
                    href={`/p/${r.problem.slug}`}
                    className="text-ink-100 text-sm font-medium hover:text-amber-300 transition-colors"
                  >
                    {r.problem.name}
                  </Link>
                  <p className="text-ink-400 text-[13px] leading-relaxed mt-2">
                    {formatUSD(r.ceiling)} ceiling against {formatHumans(r.humansAffected)} people
                    affected.
                  </p>
                </div>
              ))}
            </div>
            <p className="text-ink-500 text-[13px] leading-relaxed max-w-2xl mt-6">
              This is the argument for keeping philanthropy and policy on the board next to the cap
              tables. A ranked index of market caps, read alone, would quietly tell you to abandon
              the bottom of its own list. Read the{' '}
              <Link href="/underserved" className="text-amber-300 hover:underline">
                under-supplied board
              </Link>{' '}
              against this one.
            </p>
          </div>
        </section>

        {/* Methodology */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-4">
            How these numbers are made, and where they are weak
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <p className="text-ink-100 text-sm font-medium mb-2">Ceiling is a ceiling</p>
              <p className="text-ink-400 text-[13px] leading-relaxed">
                Each figure is the in-limit equity value of whoever wins the problem at perfect
                execution, anchored to a named public comparable so it can be argued down. Every one
                is marked low confidence on purpose. The point is the order of magnitude and the
                reasoning, not the digits. Full logic per problem lives in{' '}
                <span className="font-mono text-ink-300">in-limit.ts</span>.
              </p>
            </div>
            <div>
              <p className="text-ink-100 text-sm font-medium mb-2">
                Claimed is a floor, not a census
              </p>
              <p className="text-ink-400 text-[13px] leading-relaxed">
                Claimed sums only the {totals.trackedCompanies} companies this site tracks against
                these problems, using public market cap where it exists and last private valuation
                otherwise. Real claimed value is higher, and higher by more on the problems with the
                best coverage. Treat every headroom figure as generous.
              </p>
            </div>
            <div>
              <p className="text-ink-100 text-sm font-medium mb-2">
                {totals.uncovered} rows have no coverage at all
              </p>
              <p className="text-ink-400 text-[13px] leading-relaxed">
                Those problems are marked{' '}
                <span className="text-terminal-rose font-mono text-[11px]">no coverage</span> rather
                than shown at zero percent claimed, because nobody has tagged a company to them here
                yet. Climate change obviously has companies working on it. An index that scored
                those rows as pristine opportunities would rank the problems it knows least about
                the highest, which is exactly backwards, so their headroom is capped at the ceiling
                and left unclaimed as a to-do.
              </p>
            </div>
            <div>
              <p className="text-ink-100 text-sm font-medium mb-2">
                Ceiling is not the same as headroom
              </p>
              <p className="text-ink-400 text-[13px] leading-relaxed">
                The biggest ceiling is not automatically the best place to start. A $3T prize that
                is already dense with funded teams can be a worse founding decision than a $300B
                prize nobody has touched. That trade is what{' '}
                <Link href="/paths" className="text-amber-300 hover:underline">
                  start or join
                </Link>{' '}
                exists to settle, problem by problem.
              </p>
            </div>
            <div>
              <p className="text-ink-100 text-sm font-medium mb-2">Mixing stocks and flows</p>
              <p className="text-ink-400 text-[13px] leading-relaxed">
                Private valuations and public market caps are not strictly comparable, and a
                valuation set in a tender years ago is not a live price. Both are summed here
                anyway, because the alternative is dropping most private companies from the board
                entirely. It is the loosest joint in this table.
              </p>
            </div>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
