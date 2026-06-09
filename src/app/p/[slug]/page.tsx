import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScoreBar from '@/components/ScoreBar'
import SourceBadge from '@/components/SourceBadge'
import TierPill from '@/components/TierPill'
import { problems, getProblemBySlug } from '@/data/problems'
import { getCompaniesForProblem } from '@/data/companies'
import { getEcosystemForProblem } from '@/data/ecosystem'
import { getPositionsForProblem } from '@/data/voices'
import { getSectorsForProblem, getSectorBySlug } from '@/data/sectors'
import { ECOSYSTEM_TYPE_LABEL } from '@/data/types'
import { formatHumans, formatUSD, formatPercent, formatYears } from '@/lib/format'
import Sparkline from '@/components/Sparkline'
import TrendBadge from '@/components/TrendBadge'
import { priorityScore, importanceScore, urgencyScore } from '@/lib/priority'

const WAY_LABEL: Record<string, string> = {
  build: 'Build',
  fund: 'Fund',
  research: 'Research',
  donate: 'Donate',
  career: 'Career',
  policy: 'Policy',
}

function compactScale(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  if (n <= 1 && n > 0) return `${(n * 100).toFixed(0)}%`
  return n.toLocaleString()
}

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const problem = getProblemBySlug(slug)
  if (!problem) return {}
  return {
    title: `${problem.name} | optimism.fun`,
    description: problem.tagline,
  }
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const problem = getProblemBySlug(slug)
  if (!problem) notFound()

  const problemCompanies = getCompaniesForProblem(slug)
  const problemEcosystem = getEcosystemForProblem(slug)
  const problemPositions = getPositionsForProblem(slug)
  const problemSectors = getSectorsForProblem(slug)
    .map((s) => getSectorBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="max-w-5xl mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-ultra-wide text-ink-500 hover:text-amber-300 transition-colors mb-8"
            >
              <span>←</span> all problems
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <TierPill tier={problem.tier} />
              {problemSectors.map((s) => (
                <Link
                  key={s.slug}
                  href={`/sector/${s.slug}`}
                  className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-300 border border-hair hover:border-amber-300/60 hover:text-amber-300 px-2 py-0.5 transition-colors"
                >
                  {s.name}
                </Link>
              ))}
              <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                humans affected:
              </span>
              <SourceBadge
                confidence={problem.humansAffected.confidence}
                source={problem.humansAffected.source}
                asOf={problem.asOf}
              />
              {problem.lastUpdated && (
                <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                  · updated {problem.lastUpdated}
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] text-ink-100 mb-5">
              {problem.name}
            </h1>
            <p className="text-lg md:text-xl text-ink-300 leading-relaxed max-w-3xl">
              {problem.tagline}
            </p>
          </div>
        </section>

        {/* Scale + trend — the Our-World-in-Data style headline measure */}
        {problem.scale && (
          <section className="border-b border-hair">
            <div className="max-w-5xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  The scale of it
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-4xl md:text-5xl tabular-nums text-ink-100">
                    {compactScale(problem.scale.value)}
                  </span>
                  <TrendBadge trend={problem.scale.trend} />
                </div>
                <p className="text-sm text-ink-400 mt-1 max-w-md">{problem.scale.unit}</p>
              </div>
              {problem.scale.series && problem.scale.series.length >= 2 && (
                <div className="flex flex-col items-end gap-1">
                  <Sparkline
                    series={problem.scale.series}
                    trend={problem.scale.trend}
                    width={220}
                    height={56}
                    strokeWidth={2}
                  />
                  <span className="font-mono text-[10px] text-ink-500 tabular-nums">
                    {problem.scale.series[0].year} – {problem.scale.series[problem.scale.series.length - 1].year}
                  </span>
                </div>
              )}
            </div>
            <div className="max-w-5xl mx-auto px-6 pb-6">
              <p className="font-mono text-[11px] text-ink-500">
                <span className="text-ink-600">source:</span>{' '}
                {problem.scale.sourceUrl ? (
                  <a
                    href={problem.scale.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                  >
                    {problem.scale.source}
                  </a>
                ) : (
                  problem.scale.source
                )}
              </p>
            </div>
          </section>
        )}

        <section className="px-6 py-10 max-w-5xl mx-auto">
          <Link
            href={`/p/${problem.slug}/whitepaper`}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-amber-300/40 text-amber-300 hover:bg-amber-300/[0.08] transition-colors font-mono text-[10px] uppercase tracking-ultra-wide group"
          >
            <span>Whitepaper · v0.1 · open to refutation</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
          <p className="font-mono text-[11px] text-ink-500 mb-6 max-w-2xl">
            The summary lives here. The{' '}
            <Link
              href={`/p/${problem.slug}/whitepaper`}
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
            >
              full whitepaper
            </Link>{' '}
            walks through the four-axis ranking, existing alternatives, proposed direction,
            cost &amp; scale, and suggested investors — in the spirit of <em>Hyperloop Alpha</em>.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-700/50 border border-hair mb-12">
            {/* Axis 1 — Quantity (humans affected) */}
            <div className="bg-ink-900 p-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                Quantity · humans affected
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-3xl tabular-nums text-amber-300">
                  {formatHumans(problem.humansAffected.value)}
                </span>
                <span className="text-sm text-ink-500">
                  {problem.humansAffected.unit}
                </span>
              </div>
              <p className="font-mono text-[11px] text-ink-500">
                <span className="text-ink-600">source:</span>{' '}
                {problem.humansAffected.sourceUrl ? (
                  <a
                    href={problem.humansAffected.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                  >
                    {problem.humansAffected.source}
                  </a>
                ) : (
                  problem.humansAffected.source
                )}
              </p>
            </div>

            {/* Axis 2 — Severity */}
            <div className="bg-ink-900 p-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                Severity · WTP / wealth
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-3xl tabular-nums text-terminal-rose">
                  {formatPercent(problem.severity.value)}
                </span>
                <SourceBadge
                  confidence={problem.severity.confidence}
                  source={problem.severity.source}
                  asOf={problem.severity.asOf}
                />
              </div>
              <p className="font-mono text-[11px] text-ink-500 leading-relaxed">
                share of affected person&rsquo;s wealth they would pay for a solution
              </p>
            </div>

            {/* Axis 3 — Current solution quality (low = high opportunity) */}
            {problem.currentSolutionQuality && (
              <div className="bg-ink-900 p-6">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                  Current solutions
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-3xl tabular-nums text-terminal-violet">
                    {(problem.currentSolutionQuality.value * 10).toFixed(1)}
                  </span>
                  <span className="text-sm text-ink-500">/ 10</span>
                  <SourceBadge
                    confidence={problem.currentSolutionQuality.confidence}
                    source={problem.currentSolutionQuality.source}
                    asOf={problem.currentSolutionQuality.asOf}
                  />
                </div>
                <p className="font-mono text-[11px] text-ink-500 leading-relaxed">
                  quality of existing solutions — low score = high opportunity
                </p>
              </div>
            )}

            {/* Axis 4 — Market size (TAM proxy) */}
            {problem.marketSize && (
              <div className="bg-ink-900 p-6">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                  Market size · TAM
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-3xl tabular-nums text-terminal-cyan">
                    {formatUSD(problem.marketSize.value)}
                  </span>
                  <SourceBadge
                    confidence={problem.marketSize.confidence}
                    source={problem.marketSize.source}
                    asOf={problem.marketSize.asOf}
                  />
                </div>
                <p className="font-mono text-[11px] text-ink-500 leading-relaxed">
                  {problem.marketSize.unit ?? 'addressable market'} the world is already paying
                </p>
              </div>
            )}

            {/* Axis 5 — Time to impact (OOM estimate) */}
            {problem.timeToImpact && (
              <div className="bg-ink-900 p-6">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                  Time · OOM to impact
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-3xl tabular-nums text-ink-100">
                    {formatYears(problem.timeToImpact.value)}
                  </span>
                  <SourceBadge
                    confidence={problem.timeToImpact.confidence}
                    source={problem.timeToImpact.source}
                    asOf={problem.timeToImpact.asOf}
                  />
                </div>
                <p className="font-mono text-[11px] text-ink-500 leading-relaxed">
                  order-of-magnitude horizon to civilizational-scale impact
                </p>
              </div>
            )}

            {/* Axis 6 — Capital required (OOM estimate) */}
            {problem.capitalRequired && (
              <div className="bg-ink-900 p-6">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                  Capital · OOM to solve
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-3xl tabular-nums text-ink-100">
                    {formatUSD(problem.capitalRequired.value)}
                  </span>
                  <SourceBadge
                    confidence={problem.capitalRequired.confidence}
                    source={problem.capitalRequired.source}
                    asOf={problem.capitalRequired.asOf}
                  />
                </div>
                <p className="font-mono text-[11px] text-ink-500 leading-relaxed">
                  cumulative R&amp;D + deployment + supply chain across the arc
                </p>
              </div>
            )}
          </div>

          {/* Priority = importance x urgency (the optimism.fun formula) */}
          <div className="grid sm:grid-cols-3 gap-px bg-ink-700/50 border border-hair mb-12">
            <div className="bg-ink-900 p-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
                Priority score
              </p>
              <p className="font-mono text-4xl tabular-nums text-ink-100">{priorityScore(problem)}</p>
              <p className="font-mono text-[11px] text-ink-500 mt-1">importance × urgency, 0–100</p>
            </div>
            <div className="bg-ink-900 p-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                Importance
              </p>
              <p className="font-mono text-2xl tabular-nums text-ink-200">
                {(importanceScore(problem) * 100).toFixed(0)}
              </p>
              <p className="font-mono text-[11px] text-ink-500 mt-1">
                humans affected × severity, gated by market
              </p>
            </div>
            <div className="bg-ink-900 p-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                Urgency
              </p>
              <p className="font-mono text-2xl tabular-nums text-ink-200">
                {(urgencyScore(problem) * 100).toFixed(0)}
              </p>
              <p className="font-mono text-[11px] text-ink-500 mt-1">
                direction of travel + solution gap
              </p>
            </div>
          </div>

          {/* Neglectedness + tractability (the 80,000 Hours lenses, made explicit) */}
          {(problem.neglectedness || problem.tractability) && (
            <div className="grid md:grid-cols-2 gap-px bg-ink-700/50 border border-hair mb-12">
              {problem.neglectedness && (
                <div className="bg-ink-900 p-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                      Neglectedness
                    </p>
                    <span className="font-mono text-lg tabular-nums text-terminal-violet">
                      {problem.neglectedness.score}/10
                    </span>
                  </div>
                  <div className="h-1 bg-ink-800 mb-3">
                    <div
                      className="h-1 bg-terminal-violet"
                      style={{ width: `${problem.neglectedness.score * 10}%` }}
                    />
                  </div>
                  <p className="text-sm text-ink-400 leading-relaxed mb-2">
                    {problem.neglectedness.rationale}
                  </p>
                  <SourceBadge
                    confidence={problem.neglectedness.confidence}
                    source={problem.neglectedness.source}
                    asOf={problem.neglectedness.asOf}
                  />
                </div>
              )}
              {problem.tractability && (
                <div className="bg-ink-900 p-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                      Tractability
                    </p>
                    <span className="font-mono text-lg tabular-nums text-terminal-green">
                      {problem.tractability.score}/10
                    </span>
                  </div>
                  <div className="h-1 bg-ink-800 mb-3">
                    <div
                      className="h-1 bg-terminal-green"
                      style={{ width: `${problem.tractability.score * 10}%` }}
                    />
                  </div>
                  <p className="text-sm text-ink-400 leading-relaxed mb-2">
                    {problem.tractability.rationale}
                  </p>
                  <SourceBadge
                    confidence={problem.tractability.confidence}
                    source={problem.tractability.source}
                    asOf={problem.tractability.asOf}
                  />
                </div>
              )}
            </div>
          )}

          {/* Ways to help — the call to action, for builders and non-builders */}
          {problem.waysToHelp && problem.waysToHelp.length > 0 && (
            <div className="mb-12">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-4">
                Ways to help
              </p>
              <div className="space-y-2">
                {problem.waysToHelp.map((w, i) => (
                  <div key={i} className="flex items-start gap-3 border border-hair p-4">
                    <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 whitespace-nowrap mt-0.5 w-16">
                      {WAY_LABEL[w.mode] ?? w.mode}
                    </span>
                    <p className="text-sm text-ink-300 leading-relaxed flex-1">
                      {w.url ? (
                        <a
                          href={w.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-amber-300 transition-colors"
                        >
                          {w.text} →
                        </a>
                      ) : (
                        w.text
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Who is working on it: organizations + people */}
          {((problem.organizations && problem.organizations.length > 0) ||
            (problem.people && problem.people.length > 0)) && (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {problem.organizations && problem.organizations.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                    Organizations
                  </p>
                  <ul className="space-y-2">
                    {problem.organizations.map((o) => (
                      <li key={o.name} className="flex items-baseline justify-between gap-3 border-b border-hair pb-2">
                        <a
                          href={o.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-ink-200 hover:text-amber-300 transition-colors"
                        >
                          {o.name}
                        </a>
                        <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 whitespace-nowrap">
                          {o.kind}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {problem.people && problem.people.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                    People to follow
                  </p>
                  <ul className="space-y-2">
                    {problem.people.map((person) => (
                      <li key={person.name} className="flex items-baseline justify-between gap-3 border-b border-hair pb-2">
                        {person.url ? (
                          <a
                            href={person.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-ink-200 hover:text-amber-300 transition-colors"
                          >
                            {person.name}
                          </a>
                        ) : (
                          <span className="text-sm text-ink-200">{person.name}</span>
                        )}
                        <span className="font-mono text-[10px] text-ink-500 text-right">
                          {person.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="border border-hair p-6 mb-12">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-4">
              Three-lens scoring
            </p>
            <div>
              <ScoreBar
                label="welfare · copenhagen BCR"
                score={problem.scores.welfareBCR}
                max={50}
                color="green"
                format={(n) => `${n.toFixed(1)}× per $`}
              />
              <ScoreBar
                label="x-risk · 80k hours ITN"
                score={problem.scores.xriskITN}
                max={10}
                color="rose"
                format={(n) => `${n.toFixed(1)} / 10`}
              />
              <ScoreBar
                label="utility delta · state-of-art vs physics"
                score={problem.scores.utilityDelta}
                max={1}
                color="amber"
                format={(n) => `${(n * 100).toFixed(0)}%`}
              />
            </div>
          </div>

          <div className="max-w-none mb-16">
            <p className="font-serif text-lg text-ink-200 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {/* Transformation — the success vision. If we solve this, here is the world we get. */}
          {problem.transformation && (
            <section className="mb-16">
              <div className="flex items-baseline justify-between mb-5 border-b border-hair pb-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                    The success vision · {problem.transformation.horizon} horizon
                  </p>
                  <h2 className="font-serif text-2xl text-ink-100">
                    If we solve this, here is the world we get.
                  </h2>
                </div>
                <SourceBadge
                  confidence={problem.transformation.confidence}
                  source={problem.transformation.source ?? 'editorial — open to refutation'}
                  asOf={problem.transformation.asOf}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-px bg-ink-700/50 border border-hair">
                <div className="bg-ink-900 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-rose mb-3">
                    Before · today
                  </p>
                  <p className="font-serif text-lg text-ink-200 leading-relaxed">
                    {problem.transformation.before}
                  </p>
                </div>
                <div className="bg-ink-900 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green mb-3">
                    After · {problem.transformation.horizon}
                  </p>
                  <p className="font-serif text-lg text-ink-200 leading-relaxed">
                    {problem.transformation.after}
                  </p>
                </div>
              </div>
            </section>
          )}

          {problemPositions.length > 0 && (
            <section className="mb-16">
              <div className="flex items-baseline justify-between mb-5 border-b border-hair pb-3">
                <h2 className="font-serif text-2xl text-ink-100">
                  Voices on this quest
                </h2>
                <span className="font-mono text-[11px] text-ink-500">
                  {problemPositions.length}{' '}
                  {problemPositions.length === 1 ? 'thinker' : 'thinkers'}
                </span>
              </div>
              <div className="grid gap-px bg-ink-700/50 border border-hair">
                {problemPositions.map(({ voice, position }) => (
                  <div
                    key={voice.slug}
                    className="bg-ink-900 p-5 hover:bg-ink-800/50 transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <div>
                        <Link
                          href={`/voices/${voice.slug}`}
                          className="font-sans text-base font-medium text-ink-100 hover:text-terminal-violet transition-colors"
                        >
                          {voice.name}
                        </Link>
                        <span className="ml-2 font-mono text-[11px] text-ink-500">
                          {voice.role}
                          {voice.org ? ` · ${voice.org}` : ''}
                        </span>
                      </div>
                    </div>
                    {position.quote && (
                      <blockquote className="border-l-2 border-terminal-violet/50 pl-4 my-3 font-serif text-ink-200 italic leading-relaxed">
                        &ldquo;{position.quote}&rdquo;
                      </blockquote>
                    )}
                    <p className="text-sm text-ink-300 leading-relaxed">
                      {position.stance}
                    </p>
                    <p className="mt-3 font-mono text-[11px] text-ink-500">
                      {position.sourceUrl ? (
                        <a
                          href={position.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-400 hover:text-amber-300 underline decoration-dotted underline-offset-2"
                        >
                          {position.source}
                        </a>
                      ) : (
                        position.source
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mb-16">
            <div className="flex items-baseline justify-between mb-5 border-b border-hair pb-3">
              <h2 className="font-serif text-2xl text-ink-100">
                Companies on this quest
              </h2>
              <span className="font-mono text-[11px] text-ink-500">
                {problemCompanies.length} mapped
              </span>
            </div>
            {problemCompanies.length === 0 ? (
              <p className="font-mono text-[11px] text-ink-500">
                No companies mapped yet. Known gap.
              </p>
            ) : (
              <div className="border border-hair">
                {problemCompanies.map((c) => {
                  const cap = c.marketCap ?? c.valuation
                  return (
                    <div
                      key={c.slug}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-hair last:border-b-0 bg-ink-900 hover:bg-ink-800/50 transition-colors p-5"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {c.url ? (
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-sans text-base font-medium text-ink-100 hover:text-amber-300 transition-colors"
                            >
                              {c.name}
                            </a>
                          ) : (
                            <span className="font-sans text-base font-medium text-ink-100">
                              {c.name}
                            </span>
                          )}
                          <span className="font-mono text-[9px] uppercase tracking-ultra-wide text-ink-500 border border-hair px-1.5 py-px">
                            {c.stage}
                          </span>
                        </div>
                        <p className="text-sm text-ink-400 leading-relaxed">
                          {c.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 font-mono">
                        {cap ? (
                          <>
                            <span className="text-lg tabular-nums text-amber-300">
                              {formatUSD(cap.value)}
                            </span>
                            <SourceBadge
                              confidence={cap.confidence}
                              source={cap.source}
                              asOf={cap.asOf}
                            />
                          </>
                        ) : (
                          <span className="text-[11px] text-ink-600">
                            private · no disclosed cap
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="mb-16">
            <div className="flex items-baseline justify-between mb-5 border-b border-hair pb-3">
              <h2 className="font-serif text-2xl text-ink-100">
                Capital funding this quest
              </h2>
              <span className="font-mono text-[11px] text-ink-500">
                {problemEcosystem.length} allocators
              </span>
            </div>
            {problemEcosystem.length === 0 ? (
              <p className="font-mono text-[11px] text-ink-500">
                No allocators mapped yet. Known gap.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-px bg-ink-700/50 border border-hair">
                {problemEcosystem.map((e) => (
                  <a
                    key={e.slug}
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-ink-900 p-5 hover:bg-ink-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-sans text-base font-medium text-ink-100">
                        {e.name}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-ultra-wide text-amber-300 border border-amber-300/30 px-1.5 py-px">
                        {ECOSYSTEM_TYPE_LABEL[e.type]}
                      </span>
                    </div>
                    <p className="text-sm text-ink-300 leading-relaxed mb-2">
                      {e.thesis}
                    </p>
                    <p className="font-mono text-[11px] text-ink-500">
                      <span className="text-ink-600">best for:</span> {e.bestFor}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </section>

          <section className="border-t border-hair pt-6">
            <h2 className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
              Sources
            </h2>
            <ul className="space-y-1">
              {problem.sources.map((s) => (
                <li key={s.url} className="font-mono text-sm">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
      <Footer />
    </>
  )
}
