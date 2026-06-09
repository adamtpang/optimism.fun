import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import RadarClient, { type RadarRow } from '@/components/RadarClient'
import { problems, DOMAIN_LABEL } from '@/data/problems'
import { getCompaniesForProblem } from '@/data/companies'
import { getEcosystemForProblem } from '@/data/ecosystem'
import { opportunityScore, importanceScore, supplyScore } from '@/lib/priority'

export const metadata: Metadata = {
  title: 'The Radar | optimism.fun',
  description:
    'Where demand is high and supply is low. Humanity’s problems ranked by opportunity: big, urgent, badly-served problems are the step zero for choosing what to build.',
}

export default function RadarPage() {
  const rows: RadarRow[] = problems
    .map((p) => {
      const companies = getCompaniesForProblem(p.slug).length
      const capital = getEcosystemForProblem(p.slug).length
      const s = { companies, capital }
      return {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        domain: p.domain ?? null,
        domainLabel: p.domain ? DOMAIN_LABEL[p.domain] : null,
        trend: p.scale?.trend ?? null,
        series: p.scale?.series ?? null,
        companies,
        capital,
        demand: Math.round(importanceScore(p) * 100),
        supply: Math.round(supplyScore(p, s) * 100),
        opportunity: opportunityScore(p, s),
      }
    })
    .sort((a, b) => b.opportunity - a.opportunity)

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
