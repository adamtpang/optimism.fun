import { getDb } from '@/lib/db'
import { formatPop } from '@/lib/format'
import Link from 'next/link'

interface FeaturedProblem {
  slug: string
  title: string
  description: string
  composite_score: number
  category_name: string | null
  category_icon: string | null
  affected_population_count: number | null
  who_has_problem: string | null
}

export default async function FeaturedProblems() {
  let problems: FeaturedProblem[] = []

  try {
    const sql = getDb()
    problems = await sql`
      SELECT p.slug, p.title, p.description, p.composite_score,
             p.affected_population_count, p.who_has_problem,
             c.name as category_name, c.icon as category_icon
      FROM problems p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
      ORDER BY p.composite_score DESC
      LIMIT 6
    ` as unknown as FeaturedProblem[]
  } catch {
    return null
  }

  if (problems.length === 0) return null

  return (
    <section className="py-24 sm:py-36 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-gold font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-4">
          Active Quests
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-4">
          The Biggest Problems Right Now
        </h2>
        <p className="text-warm text-sm sm:text-base mb-12 max-w-xl">
          Every problem is a quest waiting for the right team. Ranked by severity,
          economic opportunity, and solvability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((problem) => (
            <Link
              key={problem.slug}
              href={`/problems/${problem.slug}`}
              className="group card-space rounded-2xl p-5 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                {problem.category_icon && (
                  <span className="text-base">{problem.category_icon}</span>
                )}
                <span className="text-xs text-muted">{problem.category_name}</span>
                <span className="ml-auto text-sm font-display font-bold text-gold">
                  {Number(problem.composite_score).toFixed(1)}
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-cream group-hover:text-gold transition-colors mb-1">
                {problem.title}
              </h3>
              {Number(problem.affected_population_count) > 0 && (
                <div className="text-xs text-violet mb-2">
                  {formatPop(Number(problem.affected_population_count))} humans affected
                </div>
              )}
              <p className="text-xs text-muted leading-relaxed line-clamp-2">
                {problem.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-bright font-medium transition-colors"
          >
            View all quests
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
