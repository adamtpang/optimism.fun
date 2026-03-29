import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PeopleSection from '@/components/problem/PeopleSection'
import WorkSection from '@/components/problem/WorkSection'
import LearnSection from '@/components/problem/LearnSection'
import { getDb } from '@/lib/db'
import type { ProblemWithCategory, CompanyWithCategory } from '@/lib/db/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatBigNum, formatPop } from '@/lib/format'
import type { Metadata } from 'next'

export const revalidate = 300

function ScoreBar({ label, score, description }: { label: string; score: number; description: string }) {
  return (
    <div className="rounded-xl card-space p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-100">{label}</span>
        <span className="font-display text-xl font-bold text-amber-400">{score}/10</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-500"
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500">{description}</p>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const sql = getDb()
  const result = await sql`SELECT title, description FROM problems WHERE slug = ${slug} LIMIT 1`
  if (result.length === 0) return { title: 'Problem Not Found' }
  return {
    title: `${result[0].title} | optimism.fun`,
    description: result[0].description,
  }
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sql = getDb()

  const result = await sql`
    SELECT p.*, cat.name as category_name, cat.slug as category_slug,
           cat.icon as category_icon, cat.color as category_color
    FROM problems p
    LEFT JOIN categories cat ON cat.id = p.category_id
    WHERE p.slug = ${slug}
    LIMIT 1
  `

  if (result.length === 0) notFound()

  const problem = result[0] as unknown as ProblemWithCategory

  const companies = await sql`
    SELECT c.*, cat.name as category_name, cat.icon as category_icon, cat.color as category_color
    FROM companies c
    LEFT JOIN categories cat ON cat.id = c.category_id
    WHERE c.category_id = ${problem.category_id}
    ORDER BY c.market_cap_usd DESC NULLS LAST
  ` as unknown as CompanyWithCategory[]

  const related = await sql`
    SELECT p.*, cat.name as category_name, cat.icon as category_icon
    FROM problems p
    LEFT JOIN categories cat ON cat.id = p.category_id
    WHERE p.category_id = ${problem.category_id} AND p.id != ${problem.id}
    ORDER BY p.composite_score DESC
    LIMIT 3
  ` as unknown as ProblemWithCategory[]

  const economicValue = Number(problem.economic_value_usd) || 0
  const capitalDeployed = Number(problem.capital_deployed_usd) || 0
  const capitalNeeded = Number(problem.capital_needed_usd) || 0
  const capitalGap = capitalNeeded - capitalDeployed
  const fundingPercent = capitalNeeded > 0 ? Math.round((capitalDeployed / capitalNeeded) * 100) : 0

  const tenTenAvg = (
    (Number(problem.problem_score) + Number(problem.team_score) +
     Number(problem.solution_score) + Number(problem.lead_score) +
     Number(problem.offer_score)) / 5
  ).toFixed(1)

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/problems" className="hover:text-zinc-100 transition-colors">Problems</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-400 truncate">{problem.title}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {problem.category_icon && <span className="text-xl">{problem.category_icon}</span>}
              <span className="text-sm text-zinc-500">{problem.category_name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                problem.status === 'active'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-white/5 text-zinc-500 border-zinc-700'
              }`}>
                {problem.status}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
              {problem.title}
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* THE HUMANS - front and center */}
          <div className="rounded-xl card-space border-amber-500/30 p-6 sm:p-8 mb-8">
            <h2 className="text-sm font-medium text-amber-400 uppercase tracking-wider mb-4 text-center">
              The Humans
            </h2>
            {Number(problem.affected_population_count) > 0 && (
              <div className="text-center mb-4">
                <div className="font-display text-4xl sm:text-5xl font-bold text-zinc-100">
                  {formatPop(Number(problem.affected_population_count))}
                </div>
                <div className="text-sm text-zinc-500 mt-1">people affected</div>
              </div>
            )}
            {problem.who_has_problem && (
              <p className="text-zinc-300 text-base leading-relaxed text-center max-w-lg mx-auto mb-4">
                {problem.who_has_problem}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {Number(problem.annual_deaths) > 0 && (
                <div className="text-center">
                  <div className="font-display text-xl font-bold text-red-400">
                    {formatPop(Number(problem.annual_deaths))}
                  </div>
                  <div className="text-xs text-zinc-500">deaths per year</div>
                </div>
              )}
              {economicValue > 0 && (
                <div className="text-center">
                  <div className="font-display text-xl font-bold text-amber-400">
                    {formatBigNum(economicValue)}
                  </div>
                  <div className="text-xs text-zinc-500">economic value at stake</div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Segments */}
          {problem.customer_segments && problem.customer_segments.length > 0 && (
            <div className="rounded-xl card-space p-6 mb-8">
              <h3 className="text-sm font-medium text-zinc-100 uppercase tracking-wider mb-4">
                Customer Segments
              </h3>
              <div className="space-y-3">
                {problem.customer_segments.map((segment, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs font-mono text-zinc-400 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-zinc-400">{segment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Economic Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="rounded-xl card-space p-3 sm:p-4">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Economic Value</div>
              <div className="font-display text-lg font-bold text-zinc-100">{formatBigNum(economicValue)}</div>
            </div>
            <div className="rounded-xl card-space p-3 sm:p-4">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Capital Deployed</div>
              <div className="font-display text-lg font-bold text-amber-400">{formatBigNum(capitalDeployed)}</div>
            </div>
            <div className="rounded-xl card-space p-3 sm:p-4">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Funding Gap</div>
              <div className="font-display text-lg font-bold text-zinc-300">{formatBigNum(capitalGap)}</div>
            </div>
            <div className="rounded-xl card-space p-3 sm:p-4">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Existing Solutions</div>
              <div className="font-display text-lg font-bold text-zinc-100">{Number(problem.existing_solutions) || 0}</div>
            </div>
          </div>

          {/* Capital Progress */}
          <div className="rounded-xl card-space p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-zinc-100">Capital Progress</h3>
              <span className="text-xs text-zinc-500">{fundingPercent}% funded</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-3">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(fundingPercent, 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{formatBigNum(capitalDeployed)} deployed</span>
              <span>{formatBigNum(capitalNeeded)} needed</span>
            </div>
          </div>

          {/* 10/10 Framework */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-100 uppercase tracking-wider">
                10/10 Framework
              </h3>
              <span className="font-display text-lg font-bold text-amber-400">
                {tenTenAvg}/10 avg
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ScoreBar label="Problem" score={Number(problem.problem_score)} description="Severity × scale × urgency." />
              <ScoreBar label="Team" score={Number(problem.team_score)} description="Quality and quantity of teams working on it." />
              <ScoreBar label="Solution" score={Number(problem.solution_score)} description="How close we are to viable solutions." />
              <ScoreBar label="Lead" score={Number(problem.lead_score)} description="Market demand and customer pull." />
              <ScoreBar label="Offer" score={Number(problem.offer_score)} description="Business model viability." />
            </div>
          </div>

          {/* Severity/Opportunity/Solvability */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Severity', score: Number(problem.severity_score) },
              { label: 'Opportunity', score: Number(problem.opportunity_score) },
              { label: 'Solvability', score: Number(problem.solvability_score) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl card-space p-4 text-center">
                <div className="font-display text-2xl font-bold text-amber-400">{s.score}/10</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Organizations Working on This */}
          {companies.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-zinc-100 uppercase tracking-wider mb-4">
                Organizations Working on This ({companies.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {companies.map((company) => (
                  <div key={company.id} className="rounded-xl card-space p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-semibold text-zinc-100 text-sm">{company.name}</span>
                      {company.ticker && <span className="text-[10px] text-zinc-400 font-mono">{company.ticker}</span>}
                    </div>
                    {company.problem_solving && (
                      <p className="text-xs text-zinc-500 italic mb-2">{company.problem_solving}</p>
                    )}
                    {Number(company.market_cap_usd) > 0 && (
                      <span className="text-xs text-amber-400 font-mono">
                        {formatBigNum(Number(company.market_cap_usd))} market cap
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* People Solving This */}
          <PeopleSection categoryId={problem.category_id} />

          {/* Meaningful Work */}
          <WorkSection categoryId={problem.category_id} />

          {/* Related Problems */}
          {related.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-zinc-100 uppercase tracking-wider mb-4">
                Related Problems
              </h3>
              <div className="space-y-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/problems/${r.slug}`}
                    className="block rounded-xl card-space p-4 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {r.category_icon && <span className="text-sm">{r.category_icon}</span>}
                        <span className="text-sm text-zinc-100">{r.title}</span>
                      </div>
                      <span className="text-sm font-mono text-amber-400">{Number(r.composite_score).toFixed(1)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Learn From the Best */}
          <LearnSection categorySlug={problem.category_slug} />

          {/* CTA */}
          <div className="rounded-xl card-space border-amber-500/20 p-8 text-center">
            <h3 className="font-display text-xl font-bold text-zinc-100 mb-2">
              Want to Work on This Problem?
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Discover how your passions and talents match this problem.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/discover"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black glow-amber font-medium transition-colors"
              >
                Find Your Path
              </Link>
              <Link
                href="/problems"
                className="px-6 py-3 rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-medium transition-colors"
              >
                All Problems
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
