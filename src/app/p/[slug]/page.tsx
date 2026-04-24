import { notFound } from 'next/navigation'
import Link from 'next/link'
import StarField from '@/components/StarField'
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
      <StarField />
      <Navbar />
      <main>
        <section className="pt-28 pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
            >
              <span>←</span> all problems
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <TierPill tier={problem.tier} />
              <SourceBadge
                confidence={problem.humansAffected.confidence}
                source={problem.humansAffected.source}
                asOf={problem.asOf}
              />
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] mb-6">
              {problem.name}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mb-10">
              {problem.tagline}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Humans affected
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-bold text-slate-100 tabular-nums">
                    {formatHumans(problem.humansAffected.value)}
                  </span>
                  <span className="text-sm text-slate-500">
                    {problem.humansAffected.unit}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  source: {problem.humansAffected.source}
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Severity (WTP / wealth)
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-bold text-slate-100 tabular-nums">
                    {formatPercent(problem.severity.value)}
                  </span>
                  <SourceBadge
                    confidence={problem.severity.confidence}
                    source={problem.severity.source}
                    asOf={problem.severity.asOf}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  share of affected person&rsquo;s wealth they would pay for a solution
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8 mb-12">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-5">
                Three-lens scoring
              </p>
              <div className="space-y-2">
                <ScoreBar
                  label="welfare, copenhagen BCR"
                  score={problem.scores.welfareBCR}
                  max={50}
                  color="amber"
                  format={(n) => `${n.toFixed(1)}× per $`}
                />
                <ScoreBar
                  label="x-risk, 80k hours ITN"
                  score={problem.scores.xriskITN}
                  max={10}
                  color="rose"
                  format={(n) => `${n.toFixed(1)} / 10`}
                />
                <ScoreBar
                  label="utility delta, state-of-art vs physics"
                  score={problem.scores.utilityDelta}
                  max={1}
                  color="indigo"
                  format={(n) => `${(n * 100).toFixed(0)}%`}
                />
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-16">
              <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                {problem.description}
              </p>
            </div>

            {problemPositions.length > 0 && (
              <section className="mb-16">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold">
                    Voices on this quest
                  </h2>
                  <span className="text-sm text-slate-500">
                    {problemPositions.length}{' '}
                    {problemPositions.length === 1 ? 'thinker' : 'thinkers'}
                  </span>
                </div>
                <div className="grid gap-3">
                  {problemPositions.map(({ voice, position }) => (
                    <div
                      key={voice.slug}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-purple-500/20 transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <div>
                          <Link
                            href={`/voices/${voice.slug}`}
                            className="font-display font-semibold text-slate-100 hover:text-purple-300 transition-colors"
                          >
                            {voice.name}
                          </Link>
                          <span className="ml-2 text-xs text-slate-500">
                            {voice.role}
                            {voice.org ? ` · ${voice.org}` : ''}
                          </span>
                        </div>
                      </div>
                      {position.quote && (
                        <blockquote className="border-l-2 border-purple-500/40 pl-4 my-3 text-slate-300 italic leading-relaxed">
                          &ldquo;{position.quote}&rdquo;
                        </blockquote>
                      )}
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {position.stance}
                      </p>
                      <p className="mt-3 text-xs text-slate-500">
                        {position.sourceUrl ? (
                          <a
                            href={position.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-300 underline underline-offset-2"
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
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">
                  Companies on this quest
                </h2>
                <span className="text-sm text-slate-500">
                  {problemCompanies.length} mapped
                </span>
              </div>
              {problemCompanies.length === 0 ? (
                <p className="text-slate-500">
                  No companies mapped yet. This is a known gap. File a suggestion.
                </p>
              ) : (
                <div className="grid gap-3">
                  {problemCompanies.map((c) => {
                    const cap = c.marketCap ?? c.valuation
                    return (
                      <div
                        key={c.slug}
                        className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.12] transition-colors md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            {c.url ? (
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-display font-semibold text-slate-100 hover:text-indigo-300 transition-colors"
                              >
                                {c.name}
                              </a>
                            ) : (
                              <span className="font-display font-semibold text-slate-100">
                                {c.name}
                              </span>
                            )}
                            <span className="text-[10px] uppercase tracking-wider text-slate-600 rounded-full border border-white/[0.06] px-2 py-0.5">
                              {c.stage}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {c.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {cap ? (
                            <>
                              <span className="font-display text-lg font-semibold text-slate-200 tabular-nums">
                                {formatUSD(cap.value)}
                              </span>
                              <SourceBadge
                                confidence={cap.confidence}
                                source={cap.source}
                                asOf={cap.asOf}
                              />
                            </>
                          ) : (
                            <span className="text-xs text-slate-600">
                              private / no disclosed cap
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
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">
                  Capital funding this quest
                </h2>
                <span className="text-sm text-slate-500">
                  {problemEcosystem.length} allocators
                </span>
              </div>
              {problemEcosystem.length === 0 ? (
                <p className="text-slate-500">
                  No ecosystem entities mapped yet. Gap.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {problemEcosystem.map((e) => (
                    <a
                      key={e.slug}
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-amber-500/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-display font-semibold text-slate-100">
                          {e.name}
                        </h3>
                        <span className="text-[10px] uppercase tracking-wider text-amber-400 rounded-full border border-amber-500/20 bg-amber-500/5 px-2 py-0.5">
                          {ECOSYSTEM_TYPE_LABEL[e.type]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mb-2">
                        {e.thesis}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="text-slate-600">best for:</span> {e.bestFor}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display text-xl font-bold mb-4">Sources</h2>
              <ul className="space-y-2">
                {problem.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
