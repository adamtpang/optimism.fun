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
