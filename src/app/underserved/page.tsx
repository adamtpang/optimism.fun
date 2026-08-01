import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import HeroFigure from '@/components/HeroFigure'
import SupplyDemandIndex from '@/components/SupplyDemandIndex'
import { computeSupplyDemand } from '@/lib/supply-demand'
import { fmtRatio } from '@/lib/allocation'

export const metadata: Metadata = {
  title: 'What is under-supplied | optimism.fun',
  description:
    "Every one of humanity's problems ranked by how far its share of the world's effort falls short of its share of the world's need. Research, capital, and companies, each compared against demand.",
}

export const revalidate = 86400

export default async function UnderservedPage() {
  const rows = await computeSupplyDemand()
  const worst = rows.find((r) => r.meanRatio != null)
  const best = [...rows].reverse().find((r) => r.meanRatio != null)

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-4xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The supply-demand index
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              What humanity needs,
              <span className="block text-amber-300">and nobody is working on.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              Every problem, ranked by how far its share of the world&apos;s effort falls short of
              its share of the world&apos;s need. A ratio of 1× means research, money, and
              companies are pointed at it in proportion to how much it matters. Below 1× means
              the world is under-attacking it — and that gap is the opportunity.
            </p>
          </div>
        </section>

        {worst && worst.meanRatio != null && (
          <section className="border-b border-hair bg-ink-900/30">
            <div className="max-w-4xl mx-auto px-6 py-10">
              <HeroFigure
                value={fmtRatio(worst.meanRatio)}
                label={`${worst.name} — its share of effort, against its share of need`}
                caption={`It is ${(worst.demandShare * 100).toFixed(
                  1,
                )}% of measured demand and a fraction of that in research, money, and companies. ${
                  best && best.meanRatio != null
                    ? `At the other end, ${best.name} runs at ${fmtRatio(best.meanRatio)}.`
                    : ''
                }`}
              />
            </div>
          </section>
        )}

        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <SupplyDemandIndex rows={rows} />
          </div>
        </section>

        {/* method */}
        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              How it is computed
            </p>
            <div className="space-y-4 font-mono text-[11px] leading-relaxed text-ink-400 max-w-3xl">
              <p>
                <span className="text-ink-100">Shares, not raw ratios.</span> For each problem we
                take its share of total demand and its share of each supply signal, then divide.
                The method is borrowed from OnDeck Capital, who divided monthly searches by the
                number of businesses to find the most under-supplied local business in America.
              </p>
              <p>
                <span className="text-ink-100">Why shares and not “people per researcher”.</span>{' '}
                That is more legible but not comparable: each problem defines its affected
                population differently, and six of eleven claim roughly eight billion. Ranking on
                that rewards whichever problem describes itself most expansively. Shares remove the
                distortion.
              </p>
              <p>
                <span className="text-ink-100">Demand here is need, not the composite.</span> The{' '}
                <Link href="/demand" className="text-amber-300 hover:underline">
                  demand composite
                </Link>{' '}
                contains research and capital as signal classes, so using it would put the
                numerator inside the denominator. This uses quantity of humans × severity, gated by
                ability to pay — the same basis as the capital verdicts on{' '}
                <Link href="/radar" className="text-amber-300 hover:underline">
                  the radar
                </Link>
                .
              </p>
              <p>
                <span className="text-ink-100">Supply is live and sourced.</span> Research from
                OpenAlex, public money from USAspending, private money from SEC Form D filings,
                companies from the index. The headline is a geometric mean across whichever
                signals exist, so a 0.1× and a 10× cancel to parity instead of averaging to 5×.
              </p>
              <p className="text-ink-600">
                Bands are deliberately blunt — under 0.5× is under-supplied, over 2× is
                over-supplied — so only real disproportion gets a label. A problem with no live
                supply signal is left out rather than scored as zero.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-2">
              Found the gap? Now find the company.
            </h2>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                href="/rankings"
                className="px-4 py-2 border border-amber-300/40 text-amber-300 font-mono text-[12px] hover:bg-amber-300/[0.06] transition-colors"
              >
                What to build → the Power Rankings
              </Link>
              <Link
                href="/capital"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                Who funds it → the Capital Map
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
