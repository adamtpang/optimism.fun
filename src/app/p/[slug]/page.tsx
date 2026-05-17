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
import { ECOSYSTEM_TYPE_LABEL } from '@/data/types'
import { formatHumans, formatUSD, formatPercent } from '@/lib/format'

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
              <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                humans affected:
              </span>
              <SourceBadge
                confidence={problem.humansAffected.confidence}
                source={problem.humansAffected.source}
                asOf={problem.asOf}
              />
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] text-ink-100 mb-5">
              {problem.name}
            </h1>
            <p className="text-lg md:text-xl text-ink-300 leading-relaxed max-w-3xl">
              {problem.tagline}
            </p>
          </div>
        </section>

        <section className="px-6 py-10 max-w-5xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-6">
            Whitepaper · v0.1 · open to refutation
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
          </div>

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
