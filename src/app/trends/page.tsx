import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import TrendBoard from '@/components/TrendBoard'
import { computeTrendBoard } from '@/lib/trends/engine'
import { SOURCES } from '@/lib/trends/scoring'

export const metadata: Metadata = {
  title: 'The Trend Radar | optimism.fun',
  description:
    'What is rising on the internet, scored by momentum, novelty and cross-source spread — and specifically what is rising that nobody has priced yet.',
}

// Hourly. The underlying windows are 7 and 30 days, so anything faster would
// just re-fetch the same numbers.
export const revalidate = 3600

export default async function TrendsPage() {
  const board = await computeTrendBoard()
  const rising = board.ranked.filter((t) => t.state === 'rising').length

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-4xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The trend radar
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              What is rising,
              <span className="block text-amber-300">before it is obvious.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              Every term is polled across independent sources over two comparable windows, because
              a level tells you nothing about whether something is moving. Momentum leads the
              score; a term shouting on one platform and silent everywhere else is discounted 40%,
              so a thread cannot masquerade as a trend.
            </p>
            <p className="mt-4 font-mono text-[11px] text-ink-500">
              {board.resolved} of {board.attempted} terms returned live signal · {rising} rising ·
              refreshed hourly
            </p>
          </div>
        </section>

        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <TrendBoard ranked={board.ranked} underpriced={board.underpriced} />
          </div>
        </section>

        {/* what each source actually measures */}
        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              What each source actually measures
            </p>
            <div className="space-y-2 max-w-3xl">
              {Object.values(SOURCES).map((s) => (
                <p key={s.id} className="font-mono text-[11px] text-ink-400 leading-relaxed">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-200 hover:text-amber-300"
                  >
                    {s.name}
                  </a>
                  <span className="text-ink-600"> · weight {s.quality}</span> — {s.measures}
                </p>
              ))}
            </div>
            <p className="mt-4 font-mono text-[10px] text-ink-600 max-w-3xl leading-relaxed">
              No source here measures &ldquo;the internet&rdquo;, and pretending otherwise is the
              standard failure of trend dashboards. Hacker News is a few hundred thousand
              technical people. GitHub search matches loosely across name, description and README,
              so treat it as directional. Wikipedia is the least gameable of the three and is
              weighted highest for that reason. Adding a source means one adapter file and one row
              in the weights table.
            </p>
          </div>
        </section>

        {/* how this connects to the rest */}
        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-2">
              Attention is crowding, not demand.
            </h2>
            <p className="text-ink-400 max-w-2xl text-sm leading-relaxed mb-5">
              A trend board that treated virality as importance would invert this site&apos;s
              thesis, which is that the best opportunities are high demand with LOW attention. So
              this sits on the supply side. Cross it with the demand map and the useful question
              appears: which of humanity&apos;s real problems is attention finally arriving at, and
              which is it still ignoring?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/underserved"
                className="px-4 py-2 border border-amber-300/40 text-amber-300 font-mono text-[12px] hover:bg-amber-300/[0.06] transition-colors"
              >
                What is under-supplied →
              </Link>
              <Link
                href="/demand"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                The demand map →
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
