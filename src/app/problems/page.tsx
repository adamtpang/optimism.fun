import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getDb } from '@/lib/db'
import type { ProblemWithCategory } from '@/lib/db/types'
import Link from 'next/link'
import { formatBigNum, formatPop } from '@/lib/format'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Problems | optimism.fun',
  description: 'Every problem humanity faces, ranked by severity, opportunity, and solvability. Each one is an opportunity for meaningful work.',
}

export default async function ProblemsPage() {
  let problems: ProblemWithCategory[] = []

  try {
    const sql = getDb()
    problems = await sql`
      SELECT p.*, cat.name as category_name, cat.slug as category_slug,
             cat.icon as category_icon, cat.color as category_color
      FROM problems p
      LEFT JOIN categories cat ON cat.id = p.category_id
      ORDER BY p.composite_score DESC
    ` as unknown as ProblemWithCategory[]
  } catch {
    // DB unavailable
  }

  const totalEconomicValue = problems.reduce((sum, p) => sum + (Number(p.economic_value_usd) || 0), 0)
  const totalAffected = problems.reduce((sum, p) => sum + (Number(p.affected_population_count) || 0), 0)

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10 sm:mb-14">
            <p className="text-gold font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-4">
              Quest Index
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-4">
              Problems Worth Solving
            </h1>
            <p className="text-warm text-sm sm:text-base max-w-xl mb-8">
              Ranked by composite score  - severity, market opportunity, and solvability.
              Every problem is an opportunity for meaningful work.
            </p>

            {/* Aggregate stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card-space rounded-xl p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-cream">{problems.length}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Quests</div>
              </div>
              <div className="card-space rounded-xl p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-gold">{formatBigNum(totalEconomicValue)}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Economic Value</div>
              </div>
              <div className="card-space rounded-xl p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-cream">{formatPop(totalAffected)}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Humans Affected</div>
              </div>
            </div>
          </div>

          {/* Problem list */}
          <div className="space-y-3">
            {problems.map((problem, i) => {
              const tenTenAvg = (
                (Number(problem.problem_score) +
                  Number(problem.team_score) +
                  Number(problem.solution_score) +
                  Number(problem.lead_score) +
                  Number(problem.offer_score)) / 5
              ).toFixed(1)

              return (
                <Link
                  key={problem.id}
                  href={`/problems/${problem.slug}`}
                  className="group block rounded-xl card-space hover:border-gold/30 transition-colors"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Rank + category */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-mono text-warm">#{i + 1}</span>
                          {problem.category_icon && (
                            <span className="text-sm">{problem.category_icon}</span>
                          )}
                          <span className="text-xs text-muted">{problem.category_name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted">
                            {tenTenAvg}/10 avg
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-display text-base sm:text-lg font-semibold text-cream group-hover:text-gold transition-colors mb-1.5">
                          {problem.title}
                        </h2>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-muted mb-2 line-clamp-2">
                          {problem.description}
                        </p>

                        {/* Who has this problem */}
                        {problem.who_has_problem && (
                          <p className="text-xs text-gold/80 line-clamp-1 mb-2">
                            {problem.who_has_problem}
                          </p>
                        )}

                        {/* Stats row - humans first */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                          {Number(problem.affected_population_count) > 0 && (
                            <span className="font-medium text-cream">
                              {formatPop(Number(problem.affected_population_count))} humans affected
                            </span>
                          )}
                          {Number(problem.annual_deaths) > 0 && (
                            <span className="text-red-400">
                              {formatPop(Number(problem.annual_deaths))} deaths/yr
                            </span>
                          )}
                          {Number(problem.economic_value_usd) > 0 && (
                            <span className="text-muted">
                              {formatBigNum(Number(problem.economic_value_usd))} market
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Composite score */}
                      <div className="flex-shrink-0 text-right">
                        <div className="font-display text-2xl font-bold text-gold">
                          {Number(problem.composite_score).toFixed(1)}
                        </div>
                        <div className="text-[10px] text-warm">score</div>
                      </div>
                    </div>

                    {/* Score bars (desktop) */}
                    <div className="mt-4 pt-4 border-t border-white/5 hidden sm:flex items-center gap-4">
                      {[
                        { label: 'Problem', score: Number(problem.problem_score) },
                        { label: 'Team', score: Number(problem.team_score) },
                        { label: 'Solution', score: Number(problem.solution_score) },
                        { label: 'Lead', score: Number(problem.lead_score) },
                        { label: 'Offer', score: Number(problem.offer_score) },
                      ].map((s) => (
                        <div key={s.label} className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] text-warm">{s.label}</span>
                            <span className="text-[9px] text-muted font-mono">{s.score}</span>
                          </div>
                          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gold"
                              style={{ width: `${s.score * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Quote */}
          <div className="mt-16 text-center">
            <p className="text-sm text-warm italic max-w-lg mx-auto">
              &ldquo;Problems are inevitable. Problems are soluble.&rdquo;
              <span className="block mt-1 not-italic text-muted"> - David Deutsch</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
