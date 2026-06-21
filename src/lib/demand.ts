/**
 * Demand detection — composing "humanity's market research" into one score.
 *
 * Demand for a problem's solution is what the world is ALREADY paying — in
 * suffering, money, capital, research, and policy — to make it go away. We
 * triangulate revealed-preference signal classes (types.ts → DemandClass), so
 * no single noisy signal can move the ranking on its own.
 *
 * Principles, enforced here:
 *   1. Revealed > stated. Burden, willingness-to-pay, and capital outweigh
 *      softer priors. `attention` is computed elsewhere as crowding, never as
 *      demand — the best opportunities are high demand with LOW attention.
 *   2. Normalize then log-scale, against named ceilings (same idea as
 *      priority.ts's logNorm).
 *   3. Corroboration gate. A problem's demand isn't trusted until ≥2
 *      independent signal classes agree; a lone signal is discounted.
 *   4. Degrade gracefully. A class with no credible source yet returns null and
 *      is dropped from the blend — never a silent zero. Weights renormalize
 *      across the classes actually present.
 *
 * Seeded today from data already in the repo (burden, willingness-to-pay,
 * capital flux, expert priors). `research` and `policy` are wired into the
 * shape but await their live feeds (OpenAlex / NIH RePORTER, legislation).
 */
import type { Problem, CapitalMomentum, DemandClass } from '@/data/types'
import { quantityScore, severityScore, abilityToPayScore } from '@/lib/priority'
import { getCapitalFlow } from '@/data/capital-flows'
import { expertPriorStrength } from '@/data/expert-priors'

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

/** log-normalize a positive magnitude against a reference ceiling. */
function logNorm(value: number | undefined | null, ceiling: number): number | null {
  if (value == null || value <= 0) return null
  return clamp01(Math.log10(value) / Math.log10(ceiling))
}

/**
 * Demand-class weights. Revealed-preference classes dominate; the expert prior
 * is a smaller corroborating vote. `attention` carries no demand weight by
 * design. Weights are renormalized over whichever classes have a live signal.
 */
const WEIGHTS: Record<Exclude<DemandClass, 'attention'>, number> = {
  burden: 0.28,
  wtp: 0.24,
  capital: 0.2,
  research: 0.12,
  policy: 0.06,
  expert: 0.1,
}

const CLASS_LABEL: Record<DemandClass, string> = {
  burden: 'Burden',
  wtp: 'Willingness to pay',
  capital: 'Capital flux',
  research: 'Research intensity',
  policy: 'Policy demand',
  expert: 'Expert priors',
  attention: 'Attention (crowding)',
}

export type DemandComponent = {
  class: DemandClass
  label: string
  /** 0..1 normalized strength, or null when no credible signal exists yet. */
  strength: number | null
  /** Weight this class carries toward the composite (0 for attention). */
  weight: number
  /** Where the number comes from, for display + auditing. */
  source: string | null
}

export type DemandReadout = {
  problemSlug: string
  /** 0..100 composite demand, after the corroboration gate. */
  score: number
  /** How many demand classes have a live, credible signal. */
  corroboration: number
  /** How many demand classes the model considers (excludes attention). */
  considered: number
  /** Capital momentum, surfaced from the capital class when present. */
  momentum: CapitalMomentum | null
  components: DemandComponent[]
}

/** Build the per-class signals for a problem from the data we have today. */
function components(p: Problem): DemandComponent[] {
  // Burden: magnitude of affected humans, weighted by per-capita severity.
  // Always present — every ranked problem has an affected population.
  const burden = clamp01(0.6 * quantityScore(p) + 0.4 * severityScore(p))

  // Willingness to pay: the addressable market the world already spends.
  const wtp = p.marketSize?.value ? abilityToPayScore(p) : null

  // Capital flux: estimated $/yr flowing at the problem (PitchBook/NVCA-style),
  // log-scaled to $1T. Momentum rides along.
  const flow = getCapitalFlow(p.slug)
  const capital = flow ? logNorm(flow.usdPerYear.value, 1_000_000_000_000) : null

  // Expert priors: convergence of credible prioritizers.
  const expert = expertPriorStrength(p.slug)

  return [
    {
      class: 'burden',
      label: CLASS_LABEL.burden,
      strength: burden,
      weight: WEIGHTS.burden,
      source: p.humansAffected?.source ?? null,
    },
    {
      class: 'wtp',
      label: CLASS_LABEL.wtp,
      strength: wtp,
      weight: WEIGHTS.wtp,
      source: wtp != null ? (p.marketSize?.source ?? null) : null,
    },
    {
      class: 'capital',
      label: CLASS_LABEL.capital,
      strength: capital,
      weight: WEIGHTS.capital,
      source: capital != null ? (flow?.usdPerYear.source ?? null) : null,
    },
    {
      class: 'research',
      label: CLASS_LABEL.research,
      strength: null, // awaiting OpenAlex / NIH RePORTER feed
      weight: WEIGHTS.research,
      source: null,
    },
    {
      class: 'policy',
      label: CLASS_LABEL.policy,
      strength: null, // awaiting legislation / procurement feed
      weight: WEIGHTS.policy,
      source: null,
    },
    {
      class: 'expert',
      label: CLASS_LABEL.expert,
      strength: expert,
      weight: WEIGHTS.expert,
      source: expert != null ? 'cause-prioritization registry' : null,
    },
  ]
}

/**
 * Compose the demand classes into a single 0..100 score. Weights renormalize
 * over present classes; a sub-2-class signal is discounted (corroboration
 * gate) so a problem can't rank on one number alone.
 */
export function demandScore(p: Problem): DemandReadout {
  const comps = components(p)
  const present = comps.filter((c) => c.strength != null)
  const totalWeight = present.reduce((s, c) => s + c.weight, 0)

  const blend =
    totalWeight > 0
      ? present.reduce((s, c) => s + (c.strength as number) * c.weight, 0) / totalWeight
      : 0

  // Corroboration gate: one lone signal is weak evidence of real demand.
  const gate = present.length >= 2 ? 1 : 0.6

  const flow = getCapitalFlow(p.slug)

  return {
    problemSlug: p.slug,
    score: Math.round(clamp01(blend * gate) * 100),
    corroboration: present.length,
    considered: comps.length,
    momentum: flow?.momentum ?? null,
    components: comps,
  }
}
