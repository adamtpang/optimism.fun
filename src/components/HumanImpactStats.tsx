import { getDb } from '@/lib/db'
import { formatBigNum, formatPop } from '@/lib/format'

export default async function HumanImpactStats() {
  let problemCount = 0
  let totalAffected = 0
  let totalEconomicValue = 0

  try {
    const sql = getDb()
    const result = await sql`
      SELECT
        COUNT(*)::int as problem_count,
        COALESCE(SUM(affected_population_count), 0)::bigint as total_affected,
        COALESCE(SUM(economic_value_usd), 0)::bigint as total_economic_value
      FROM problems
      WHERE status = 'active'
    `
    const stats = result[0]
    problemCount = Number(stats.problem_count) || 0
    totalAffected = Number(stats.total_affected) || 0
    totalEconomicValue = Number(stats.total_economic_value) || 0
  } catch {
    // Fallback if DB unavailable
  }

  if (problemCount === 0) return null

  const stats = [
    {
      value: formatPop(totalAffected),
      label: 'Humans Affected',
      sublabel: 'people who need solutions',
    },
    {
      value: formatBigNum(totalEconomicValue),
      label: 'Economic Opportunity',
      sublabel: 'market value of solutions',
      highlight: true,
    },
    {
      value: String(problemCount),
      label: 'Active Quests',
      sublabel: 'problems being tracked',
    },
  ]

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="card-space rounded-2xl p-8 sm:p-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className={`font-display text-2xl sm:text-4xl font-bold mb-1 ${
                  stat.highlight ? 'text-gold' : 'text-cream'
                }`}>
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-warm uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted mt-0.5 hidden sm:block">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
