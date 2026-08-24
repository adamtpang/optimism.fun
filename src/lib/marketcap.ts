/**
 * The problems market cap index.
 *
 * CoinMarketCap ranks assets by what the market has already priced. This ranks
 * problems by what the market COULD price if someone solved them, then shows how
 * much of that ceiling is already claimed by companies that exist today.
 *
 * The load-bearing column is `headroom`: ceiling minus claimed. A huge ceiling
 * that is already 80 percent claimed is a worse place to start a company than a
 * smaller ceiling nobody has touched. Headroom is the founder-facing number;
 * ceiling alone is the vanity number.
 *
 * Honesty rules, because every one of these figures can mislead:
 *  - `ceiling` is an in-limit CEILING at perfect execution, not a forecast. Every
 *    figure is confidence: low by construction and anchored to a named comparable.
 *  - `claimed` is a FLOOR, not a census. It sums only the companies this site
 *    tracks (see companies.ts), so the true claimed figure is higher, often much
 *    higher, on well-covered problems. Never present headroom as precise.
 *  - `ceilingPerPerson` deliberately divides money by people to expose the gap
 *    this whole site exists to argue about. A low number does not mean the
 *    problem matters less. It means the market cannot pay the people it would help.
 */
import { problems } from '@/data/problems'
import { inLimitCaps } from '@/data/in-limit'
import { companies } from '@/data/companies'
import type { Company, Problem, InLimitCap } from '@/data/types'

export type MarketCapRow = {
  rank: number
  problem: Problem
  cap: InLimitCap
  /** In-limit ceiling in USD, the prize at perfect execution. */
  ceiling: number
  /** Sum of tracked company value on this problem. A floor, not a census. */
  claimed: number
  /** ceiling - claimed, floored at zero. The unclaimed prize. */
  headroom: number
  /** claimed / ceiling, 0..1. Capped at 1 when tracked value exceeds the ceiling. */
  claimedPct: number
  /** Tracked companies on this problem, largest first. */
  holders: Company[]
  /**
   * Whether ANY company is tracked against this problem. False means claimed and
   * headroom are unmeasured, not zero and total. Without this flag the index
   * rewards the problems it knows least about, which is exactly backwards.
   */
  covered: boolean
  /** Largest tracked company, or null when nobody is tracked on it. */
  topHolder: Company | null
  /** Humans the problem affects today. */
  humansAffected: number
  /** Ceiling divided by humans affected: capturable dollars per person harmed. */
  ceilingPerPerson: number
}

/** Best available value for a company: public market cap, else private valuation. */
export const companyValue = (c: Company): number =>
  c.marketCap?.value ?? c.valuation?.value ?? 0

/**
 * Build the full index, ranked by ceiling descending.
 * Only problems with an in-limit cap appear, since ceiling is the ranking key.
 */
export function computeMarketCapIndex(): MarketCapRow[] {
  const rows = inLimitCaps
    .map((cap): Omit<MarketCapRow, 'rank'> | null => {
      const problem = problems.find((p) => p.slug === cap.problemSlug)
      if (!problem) return null

      const holders = companies
        .filter((c) => c.problemSlugs.includes(cap.problemSlug))
        .sort((a, b) => companyValue(b) - companyValue(a))

      const ceiling = cap.marketCap.value
      const claimed = holders.reduce((sum, c) => sum + companyValue(c), 0)
      const humansAffected = problem.humansAffected.value

      return {
        problem,
        cap,
        ceiling,
        claimed,
        headroom: Math.max(0, ceiling - claimed),
        claimedPct: ceiling > 0 ? Math.min(1, claimed / ceiling) : 0,
        holders,
        covered: holders.length > 0,
        topHolder: holders[0] ?? null,
        humansAffected,
        ceilingPerPerson: humansAffected > 0 ? ceiling / humansAffected : 0,
      }
    })
    .filter((r): r is Omit<MarketCapRow, 'rank'> => r !== null)
    .sort((a, b) => b.ceiling - a.ceiling)

  return rows.map((r, i) => ({ ...r, rank: i + 1 }))
}

/** Index-wide totals for the header ticker. */
export function indexTotals(rows: MarketCapRow[]) {
  const totalCeiling = rows.reduce((s, r) => s + r.ceiling, 0)
  const totalClaimed = rows.reduce((s, r) => s + r.claimed, 0)
  const covered = rows.filter((r) => r.covered)
  const coveredCeiling = covered.reduce((s, r) => s + r.ceiling, 0)
  return {
    totalCeiling,
    totalClaimed,
    totalHeadroom: Math.max(0, totalCeiling - totalClaimed),
    claimedPct: totalCeiling > 0 ? totalClaimed / totalCeiling : 0,
    trackedCompanies: rows.reduce((s, r) => s + r.holders.length, 0),
    /** Problems with no tracked company at all: unmeasured, not unclaimed. */
    uncovered: rows.length - covered.length,
    /**
     * Claimed share across only the problems we actually have company coverage
     * on. The honest headline rate, since the index-wide one is diluted by
     * problems whose claimed value is unmeasured.
     */
    coveredClaimedPct: coveredCeiling > 0 ? totalClaimed / coveredCeiling : 0,
  }
}

/**
 * The rows where the market is least able to pay the people harmed: cheapest
 * ceiling per person affected. These are the problems that need philanthropy or
 * policy rather than a cap table, and saying so is the point of the column.
 */
export function leastCapturable(rows: MarketCapRow[], n = 3): MarketCapRow[] {
  return [...rows]
    .filter((r) => r.ceilingPerPerson > 0)
    .sort((a, b) => a.ceilingPerPerson - b.ceilingPerPerson)
    .slice(0, n)
}
