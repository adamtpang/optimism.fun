import type { Problem } from '@/data/types'

/**
 * The homepage order is opportunity. The pieces, in plain language:
 *
 *   scale        = how many people (log, vs 8.2 billion)
 *                  × how bad it is per person (severity, 0..1)
 *   importance   = scale, pulled toward half when nobody can pay
 *   itn          = importance × neglectedness × tractability
 *   supply       = how well-served it already is
 *   opportunity  = itn × (1 − supply) × a small urgency nudge
 *
 * Neglectedness and tractability are the 1–10 judgments on each problem,
 * divided by 10. That is scale × neglectedness × tractability: a large
 * problem that is ignored and still movable outranks a large problem that
 * is crowded or stuck. A missing judgment scores as one half.
 *
 * Severity is one scale for every problem. See severityFromDeathRate and
 * the methodology page. A value outside 0..1 is a bug and throws. There is
 * no silent "divide by 10" conversion.
 *
 * Catastrophic risks (tier x-risk) use the loss if the catastrophe happens,
 * not this year's deaths. A sourced single probability would multiply that
 * stake. A range with no midpoint does not: we do not invent the center.
 * Tagged companies are not treated as proof the tail is covered; supply
 * for an x-risk falls back to the neglectedness judgment.
 *
 * Zero tagged companies and zero tagged funders is missing data, not an
 * empty field. That part of supply uses the neglectedness judgment too.
 */

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

/**
 * Ends of the death-rate scale. One death per 10,000 affected people per
 * year scores 0. Certain death this year scores 1. The scale is logarithmic,
 * so a tenfold deadlier rate scores 0.25 higher.
 */
export const DEATH_RATE_FLOOR = 1e-4

/** log-normalize a positive magnitude against a reference ceiling. */
function logNorm(value: number | undefined, ceiling: number): number {
  if (!value || value <= 0) return 0
  return clamp01(Math.log10(value) / Math.log10(ceiling))
}

/**
 * Log-normalize an annual death rate (deaths ÷ people affected) onto 0..1.
 * Rates at or below the floor score 0. Rates at or above 1 score 1.
 * The clamp is those two ends, not a unit conversion.
 */
export function severityFromDeathRate(deaths: number, affected: number): number {
  if (!(deaths > 0) || !(affected > 0)) {
    throw new Error(`severityFromDeathRate needs positive deaths and affected, got ${deaths} / ${affected}`)
  }
  const rate = deaths / affected
  const span = Math.log10(1) - Math.log10(DEATH_RATE_FLOOR)
  return clamp01((Math.log10(rate) - Math.log10(DEATH_RATE_FLOOR)) / span)
}

function assertUnitInterval(slug: string, field: string, value: number): number {
  if (value < 0 || value > 1 || Number.isNaN(value)) {
    throw new Error(`${slug} ${field} is ${value}, outside 0..1`)
  }
  return value
}

/** Quantity of humans affected, log-scaled against all of humanity (~8.2B). */
export function quantityScore(p: Problem): number {
  return logNorm(p.humansAffected?.value, 8_200_000_000)
}

/**
 * Per-person severity, 0..1. Missing severity is unknown and scores one half,
 * so a gap in the sources neither rewards nor zeroes a problem.
 */
export function severityScore(p: Problem): number {
  const v = p.severity?.value
  if (v == null) return 0.5
  return assertUnitInterval(p.slug, 'severity', v)
}

/** 1–10 judgment as a 0..1 factor. Missing scores one half. */
export function judgmentFactor(score: number | undefined): number {
  if (score == null) return 0.5
  if (score < 0 || score > 10 || Number.isNaN(score)) {
    throw new Error(`judgment ${score} is outside 0..10`)
  }
  return score / 10
}

/**
 * Expected-value weight for a catastrophic risk.
 *
 * Severity on an x-risk is the share of humanity lost if the bad outcome
 * happens. Multiplying by a probability is the expected-value step. We do
 * that only when the source states a single probability. A range, or a
 * lower bound written as "greater than", has no midpoint on the page, and
 * we do not invent one. The weight stays 1 and the range stays on the row.
 */
export function existentialWeight(p: Problem): number {
  const c = p.catastropheProbability
  if (p.tier !== 'x-risk' || !c) return 1
  if (c.lowIsExclusive || c.low !== c.high) return 1
  return assertUnitInterval(p.slug, 'catastropheProbability', c.low)
}

/** Ability to pay: is there a real market for a fair-priced solution? log-scaled to $10T. */
export function abilityToPayScore(p: Problem): number {
  if (!p.marketSize?.value) return 0.5 // unknown market: neutral, do not punish
  return logNorm(p.marketSize.value, 10_000_000_000_000)
}

/** importance = quantity × severity, gated (not zeroed) by ability to pay. */
export function importanceScore(p: Problem): number {
  const base = quantityScore(p) * severityScore(p)
  const gate = 0.5 + 0.5 * abilityToPayScore(p) // market scales importance 0.5x..1x
  return clamp01(base * gate)
}

/**
 * Scale × neglectedness × tractability, times the x-risk weight.
 * This is what the homepage multiplies by the supply gap.
 */
export function itnScore(p: Problem): number {
  return (
    importanceScore(p) *
    judgmentFactor(p.neglectedness?.score) *
    judgmentFactor(p.tractability?.score) *
    existentialWeight(p)
  )
}

const TREND_URGENCY = { worsening: 1, flat: 0.5, improving: 0.25 } as const

/** 0..1 solution quality. Null when the problem has none. Throws outside 0..1. */
export function solutionQualityScore(p: Problem): number | null {
  const q = p.currentSolutionQuality?.value
  if (q == null) return null
  return assertUnitInterval(p.slug, 'currentSolutionQuality', q)
}

/** How good are today's solutions? Low quality = high opportunity = more urgent. */
function solutionGap(p: Problem): number {
  const q = solutionQualityScore(p)
  if (q == null) return 0.5
  return clamp01(1 - q)
}

/** urgency = direction of travel blended with the solution gap. */
export function urgencyScore(p: Problem): number {
  const trend = p.scale?.trend ? TREND_URGENCY[p.scale.trend] : 0.5
  return clamp01(0.6 * trend + 0.4 * solutionGap(p))
}

/** Headline 0..100 priority: ITN × urgency. No supply discount. */
export function priorityScore(p: Problem): number {
  return Math.round(itnScore(p) * urgencyScore(p) * 100)
}

/** A "rising" problem is one whose headline number is getting worse. */
export function isRising(p: Problem): boolean {
  return p.scale?.trend === 'worsening'
}

/** Sort a copy of the list by priority, descending. */
export function byPriority(problems: Problem[]): Problem[] {
  return [...problems].sort((a, b) => priorityScore(b) - priorityScore(a))
}

/* ── The demand radar: supply, and the opportunity gap ─────────────────────
   Demand = importance (how badly the world needs a solution).
   The homepage rank multiplies that by neglectedness and tractability, then
   by how thin the supply is.
   Opportunity = high ITN AND low supply. ─────────────────────────────────── */

/** Counts of who is already working on a problem. Pass from the data layer. */
export type SupplyInputs = {
  /** Number of companies tagged to this problem. */
  companies: number
  /** Number of capital allocators (grants, funds, studios) tagged to it. */
  capital: number
}

/**
 * Headcount half of supply, 0..1. Higher = more crowded.
 * No tags, or an x-risk: use neglectedness. A 2/10 neglected cause is treated
 * as crowded. An 8/10 neglected cause is treated as thin. Tagged companies
 * on an ordinary problem use the log counts (about 20 companies or 12 funds
 * is saturated).
 */
export function supplyHeadcount(p: Problem, s: SupplyInputs): number {
  const tagged = s.companies + s.capital
  if (tagged === 0 || p.tier === 'x-risk') {
    return 1 - judgmentFactor(p.neglectedness?.score)
  }
  const companyNorm = clamp01(Math.log10(1 + s.companies) / Math.log10(1 + 20))
  const capitalNorm = clamp01(Math.log10(1 + s.capital) / Math.log10(1 + 12))
  return clamp01((0.35 * companyNorm + 0.15 * capitalNorm) / 0.5)
}

/**
 * 0..1 of how well-served a problem already is. Higher = more crowded = less
 * opportunity. Half solution quality, half headcount. Unknown quality is 0.4,
 * not zero.
 */
export function supplyScore(p: Problem, s: SupplyInputs): number {
  const quality = solutionQualityScore(p)
  const qualityNorm = quality == null ? 0.4 : quality
  return clamp01(0.5 * qualityNorm + 0.5 * supplyHeadcount(p, s))
}

/**
 * 0..100 opportunity score: high ITN, low supply. The homepage sorts on this.
 */
export function opportunityScore(p: Problem, s: SupplyInputs): number {
  const supply = supplyScore(p, s)
  const urgency = 0.7 + 0.3 * urgencyScore(p)
  return Math.round(itnScore(p) * (1 - supply) * urgency * 100)
}
