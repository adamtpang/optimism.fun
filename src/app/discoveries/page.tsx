import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DiscoveryList from '@/components/DiscoveryList'
import { problems } from '@/data/problems'
import { existentialRisks } from '@/data/existential-risks'
import { listDiscoveries } from '@/data/discoveries'

export const metadata: Metadata = {
  title: 'Discoveries | optimism.fun',
  description:
    'Verified findings tagged to humanity\'s biggest problems. Newest first. Preprints are marked. Challenged results stay visible.',
}

const FILTER_LABEL: Record<string, string> = {
  biosecurity: 'biosecurity',
  'energy-abundance': 'energy',
  'housing-construction': 'housing',
  pedagogy: 'pedagogy',
  'infectious-disease': 'infectious',
  'scientific-productivity': 'science',
  longevity: 'longevity',
  'fertility-decline': 'fertility',
  loneliness: 'loneliness',
  'extreme-poverty': 'poverty',
  'climate-change': 'climate',
  'neglected-tropical-diseases': 'ntds',
  'newborn-survival': 'newborns',
  hypertension: 'hypertension',
  'ai-datacenter-power': 'datacenter power',
  'financial-infrastructure': 'finance',
  cancer: 'cancer',
  copd: 'copd',
  diabetes: 'diabetes',
}

function chip(active: boolean) {
  return active
    ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
    : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
}

export default async function DiscoveriesPage({
  searchParams,
}: {
  searchParams: Promise<{ problem?: string; risk?: string }>
}) {
  const { problem: problemFilter, risk: riskFilter } = await searchParams
  const problemKnown = !problemFilter || problems.some((p) => p.slug === problemFilter)
  const riskKnown = !riskFilter || existentialRisks.some((r) => r.slug === riskFilter)
  const activeProblem = problemFilter && problemKnown ? problemFilter : undefined
  const activeRisk = !problemFilter && riskFilter && riskKnown ? riskFilter : undefined
  const unknownFilter = Boolean(problemFilter && !problemKnown) || Boolean(!problemFilter && riskFilter && !riskKnown)

  const items = unknownFilter
    ? []
    : listDiscoveries({ problemSlug: activeProblem, riskSlug: activeRisk })

  const empty = problemFilter && !problemKnown
    ? 'No problem with that id.'
    : riskFilter && !problemFilter && !riskKnown
      ? 'No S-tier risk with that id.'
      : 'Nothing logged here yet.'

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              Discoveries
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-ink-100 leading-[1.05]">
              New science on the hard problems.
            </h1>
            <p className="text-ink-400 mt-4 text-lg max-w-2xl">
              Verified findings, newest first. Preprints are marked. Challenged results stay visible.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">
          <div className="mb-3">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
              Filter by problem
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Link
                href="/discoveries"
                className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${chip(!activeProblem && !activeRisk)}`}
              >
                all
              </Link>
              {problems.map((p) => (
                <Link
                  key={p.slug}
                  href={`/discoveries?problem=${p.slug}`}
                  title={p.name}
                  className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${chip(activeProblem === p.slug)}`}
                >
                  {FILTER_LABEL[p.slug] ?? p.slug}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
              S-tier
            </p>
            <div className="flex flex-wrap gap-1.5">
              {existentialRisks.map((r) => (
                <Link
                  key={r.slug}
                  href={`/discoveries?risk=${r.slug}`}
                  title={r.name}
                  className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                    activeRisk === r.slug
                      ? 'bg-terminal-rose/10 border-terminal-rose/60 text-terminal-rose'
                      : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
                  }`}
                >
                  {r.shortName.toLowerCase()}
                </Link>
              ))}
            </div>
          </div>

          <p className="font-mono text-[11px] text-ink-500 mb-3">
            {items.length} {items.length === 1 ? 'finding' : 'findings'}
          </p>

          {items.length === 0 ? (
            <p className="font-mono text-[12px] text-ink-500">{empty}</p>
          ) : (
            <DiscoveryList items={items} />
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
