import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import RadarClient from '@/components/RadarClient'
import DataFreshness from '@/components/DataFreshness'
import AllocationQuadrant from '@/components/AllocationQuadrant'
import { computeRadarRows } from '@/lib/radar'

export const metadata: Metadata = {
  title: 'The Radar | optimism.fun',
  description:
    'Where demand is high and supply is low. Humanity’s problems ranked by opportunity, with the capital actually flowing at each one — and a verdict on what is over- and underallocated.',
}

export default function RadarPage() {
  const rows = computeRadarRows()

  const quadrantPoints = rows
    .filter((r) => r.capitalUsd != null && r.capitalUsd > 0)
    .map((r) => ({
      slug: r.slug,
      name: r.name,
      demand: r.demand,
      capitalUsd: r.capitalUsd as number,
      verdict: r.allocationVerdict,
      momentum: r.capitalMomentum,
    }))

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The radar
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              Where demand is high
              <span className="block text-amber-300">and supply is low.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              Every problem, ranked by opportunity: how badly the world needs a solution,
              divided by how well-served it already is. The biggest gaps are the best places
              to start. This is step zero.
            </p>
            <DataFreshness className="mt-5" />
          </div>
        </section>

        {/* The Allocation Quadrant — demand vs the capital actually flowing */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-4">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
                The allocation quadrant
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                Demand, against the capital actually flowing.
              </h2>
              <p className="mt-2 text-ink-400 max-w-2xl text-sm leading-relaxed">
                Each problem plotted by how much it matters (demand) against the dollars per year
                pointed at it (sourced estimates, log scale). The top-left quadrant is the
                product: high demand, thin capital. That is where the next great company is
                hiding.
              </p>
            </div>
            <AllocationQuadrant points={quadrantPoints} />
          </div>
        </section>

        <section className="px-6 py-8 max-w-7xl mx-auto">
          <RadarClient rows={rows} />
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
