import type { Problem } from '@/data/types'

/**
 * Adam's ranking formula, made computable.
 *
 *   priority = importance x urgency
 *
 *   importance = (quantity of humans affected) x (severity to them),
 *                gated by ability to pay for a fair solution (market size).
 *   urgency    = direction of travel (worsening = urgent) blended with
 *                the solution gap (no good solution yet = urgent).
 *
 * Every input is optional in the schema, so each term degrades gracefully:
 * a missing field falls back to a neutral midpoint rather than zeroing the score.
 * All terms are normalized to 0..1; the exported score is 0..100 for display.
 */

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

/** log-normalize a positive magnitude against a reference ceiling. */
function logNorm(value: number | undefined, ceiling: number): number {
  if (!value || value <= 0) return 0
  return clamp01(Math.log10(value) / Math.log10(ceiling))
}

/** Quantity of humans affected, log-scaled against all of humanity (~8.2B). */
export function quantityScore(p: Problem): number {
  return logNorm(p.humansAffected?.value, 8_200_000_000)
}

/** Per-capita severity. The schema stores this 0..1 already (share of wealth/wellbeing). */
export function severityScore(p: Problem): number {
  const v = p.severity?.value
  if (v == null) return 0.5
  // Some entries use 0..1, a few use larger proxies; clamp to be safe.
  return clamp01(v > 1 ? v / 10 : v)
}

/** Ability to pay: is there a real market for a fair-priced solution? log-scaled to $10T. */
export function abilityToPayScore(p: Problem): number {
  if (!p.marketSize?.value) return 0.5 // unknown market: neutral, do not punish
  return logNorm(p.marketSize.value, 10_000_000_000_000)
}

/** importance = quantity x severity, gated (not zeroed) by ability to pay. */
export function importanceScore(p: Problem): number {
  const base = quantityScore(p) * severityScore(p)
  const gate = 0.5 + 0.5 * abilityToPayScore(p) // market scales importance 0.5x..1x
  return clamp01(base * gate)
}

const TREND_URGENCY = { worsening: 1, flat: 0.5, improving: 0.25 } as const

/** How good are today's solutions? Low quality = high opportunity = more urgent. */
function solutionGap(p: Problem): number {
  const q = p.currentSolutionQuality?.value
  if (q == null) return 0.5
  return clamp01(1 - (q > 1 ? q / 10 : q))
}

/** urgency = direction of travel blended with the solution gap. */
export function urgencyScore(p: Problem): number {
  const trend = p.scale?.trend ? TREND_URGENCY[p.scale.trend] : 0.5
  return clamp01(0.6 * trend + 0.4 * solutionGap(p))
}

/** The headline 0..100 priority score: importance x urgency. */
export function priorityScore(p: Problem): number {
  return Math.round(importanceScore(p) * urgencyScore(p) * 100)
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
   Supply = how well-served the problem already is (companies on it, capital
   deployed, and the quality of existing solutions).
   Opportunity = high demand AND low supply. That gap is the "step 0" for a
   founder choosing what to build. ─────────────────────────────────────────── */

/** Counts of who is already working on a problem. Pass from the data layer. */
export type SupplyInputs = {
  /** Number of companies tagged to this problem. */
  companies: number
  /** Number of capital allocators (grants, funds, studios) tagged to it. */
  capital: number
}

/**
 * 0..1 of how well-served a problem already is. Higher = more crowded = less
 * opportunity. Blends the quality of existing solutions with how many companies
 * and allocators are on it (log-scaled, since a few well-funded entries already
 * change the picture).
 */
export function supplyScore(p: Problem, s: SupplyInputs): number {
  const quality = p.currentSolutionQuality?.value
  const qualityNorm = quality == null ? 0.4 : clamp01(quality > 1 ? quality / 10 : quality)
  const companyNorm = clamp01(Math.log10(1 + s.companies) / Math.log10(1 + 20)) // ~20 cos = saturated
  const capitalNorm = clamp01(Math.log10(1 + s.capital) / Math.log10(1 + 12)) // ~12 funds = saturated
  // Quality of solutions matters most; headcount of supply is secondary.
  return clamp01(0.5 * qualityNorm + 0.35 * companyNorm + 0.15 * capitalNorm)
}

/**
 * 0..100 opportunity score: high demand, low supply. This is the radar's
 * ranking metric. A big, urgent, badly-served problem scores highest.
 */
export function opportunityScore(p: Problem, s: SupplyInputs): number {
  const demand = importanceScore(p)
  const supply = supplyScore(p, s)
  // Urgency nudges it: a worsening, unsolved problem is a sharper opportunity.
  const urgency = 0.7 + 0.3 * urgencyScore(p)
  return Math.round(demand * (1 - supply) * urgency * 100)
}
