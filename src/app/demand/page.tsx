import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import DemandPowerLaw from '@/components/DemandPowerLaw'
import DemandMatrix from '@/components/DemandMatrix'
import { computeDemandRows } from '@/lib/demand-live'
import { demandSignalSources } from '@/data/demand-signals'

export const metadata: Metadata = {
  title: 'The Demand Map | optimism.fun',
  description:
    "Humanity's demand, measured — every problem scored by triangulating costly, revealed-preference signals: burden, willingness to pay, capital, research, policy, expert priors, and queues. Live from open statistical APIs.",
}

// Re-fetch the live signals daily; every source degrades gracefully.
export const revalidate = 86400

export default async function DemandPage() {
  const rows = await computeDemandRows()

  const liveCells = rows.reduce(
    (n, r) => n + r.components.filter((c) => c.live).length,
    0,
  )

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The demand map
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              Humanity&apos;s demand,
              <span className="block text-amber-300">measured.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              Capitalism is a demand-and-supply matching system — so before making what
              people want, detect what they want. You can&apos;t ask (stated preference lies),
              but every real want leaks a costly signal: money spent, money bet, wages
              offered, queues joined, suffering endured. We triangulate those signals per
              problem; no single number can move the ranking alone.
            </p>
            <p className="mt-4 font-mono text-[11px] text-ink-500">
              <span className="text-terminal-green">●</span>{' '}
              {liveCells} signals live from open statistical APIs · refreshed daily · every
              cell cites its source
            </p>
          </div>
        </section>

        {/* The power law */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
                The power law of demand
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                Demand is not uniform. It falls off a cliff.
              </h2>
              <p className="mt-2 text-ink-400 max-w-2xl text-sm leading-relaxed">
                Every problem&apos;s composite demand score, ranked. The head of this curve is
                where the market&apos;s pull is strongest — match supply there and the market
                does the rest of the work for you.
              </p>
            </div>
            <DemandPowerLaw
              rows={rows.map((r) => ({
                slug: r.slug,
                name: r.name,
                score: r.score,
                corroboration: r.corroboration,
                considered: r.considered,
              }))}
            />
          </div>
        </section>

        {/* The matrix */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
                The demand matrix
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                Seven currencies of demand, one problem at a time.
              </h2>
              <p className="mt-2 text-ink-400 max-w-2xl text-sm leading-relaxed">
                A demand signal&apos;s credibility is proportional to the cost of emitting it —
                so we read burden, willingness to pay, capital, research, policy, expert
                priors, and queues, and require at least two independent classes to agree.
                Attention is deliberately excluded: it measures crowding, not demand.
              </p>
            </div>
            <DemandMatrix rows={rows} />
          </div>
        </section>

        {/* Where the numbers come from */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              Where the numbers come from
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-hair border border-hair">
              {demandSignalSources.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-ink p-4 hover:bg-ink-800/40 transition-colors"
                >
                  <p className="font-sans text-[13px] font-medium text-ink-100">{s.name} ↗</p>
                  <p className="mt-1 font-mono text-[10px] text-ink-500">
                    feeds: <span className="text-ink-300">{s.feeds}</span> · {s.access} ·{' '}
                    {s.cadence}
                  </p>
                </a>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] text-ink-500 max-w-3xl leading-relaxed">
              Coming online next: IHME GBD burden (bulk load), SEC EDGAR Form D + NIH award
              dollars (capital &amp; research $), USAspending (policy), and Exa Agent extraction
              of queue signals with no API — grid interconnection backlogs, housing vacancy,
              transplant waitlists.
            </p>
          </div>
        </section>

        {/* Step zero → step one */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-2">
              Demand is step zero. Matching is the business.
            </h2>
            <p className="text-ink-400 max-w-2xl text-sm leading-relaxed mb-5">
              Once you can see the power law, the play is to find the gap — high demand, thin
              supply — and put yourself in the middle of the match.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/radar"
                className="px-4 py-2 border border-amber-300/40 text-amber-300 font-mono text-[12px] hover:bg-amber-300/[0.06] transition-colors"
              >
                Find the gap → the Radar
              </Link>
              <Link
                href="/fit"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                Match yourself to it → Your Fit
              </Link>
              <Link
                href="/rfs"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                Build or fund it → Requests
              </Link>
            </div>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
