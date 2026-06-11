/**
 * Allocation — does the capital pointed at a problem match its demand?
 *
 * The BCG-matrix move, made transparent:
 *   demandShare_i  = importance_i / Σ importance        (our index)
 *   capitalShare_i = capital_i   / Σ capital            (the world's money)
 *   ratio_i        = capitalShare_i / demandShare_i
 *
 * ratio 1.0 = capital is proportional to demand. Verdicts are deliberately
 * blunt, with wide bands so only real disproportion gets a label:
 *   < 0.5  → underallocated   (the gaps — where founders and funds should look)
 *   0.5–2  → balanced
 *   > 2    → overallocated    (consensus capital has piled in)
 *
 * Ratios compare each flow to the index's own demand scores — they are claims
 * about proportionality, not absolute sufficiency, and they are exactly as
 * good as the sourced estimates in capital-flows.ts.
 */
import { problems } from '@/data/problems'
import { importanceScore } from '@/lib/priority'
import { capitalFlows } from '@/data/capital-flows'
import type { AllocationVerdict, CapitalMomentum } from '@/data/types'

export type Allocation = {
  problemSlug: string
  capitalUsd: number | null
  momentum: CapitalMomentum | null
  demandShare: number
  capitalShare: number | null
  ratio: number | null
  verdict: AllocationVerdict | null
}

export function verdictFor(ratio: number): AllocationVerdict {
  if (ratio < 0.5) return 'underallocated'
  if (ratio > 2) return 'overallocated'
  return 'balanced'
}

/** Compute allocation for every problem. Problems with no flow estimate get nulls. */
export function computeAllocations(): Map<string, Allocation> {
  const demand = new Map(problems.map((p) => [p.slug, importanceScore(p)]))
  const totalDemand = [...demand.values()].reduce((s, v) => s + v, 0) || 1
  const totalCapital = capitalFlows.reduce((s, c) => s + c.usdPerYear.value, 0) || 1

  const out = new Map<string, Allocation>()
  for (const p of problems) {
    const flow = capitalFlows.find((c) => c.problemSlug === p.slug) ?? null
    const demandShare = (demand.get(p.slug) ?? 0) / totalDemand
    const capitalShare = flow ? flow.usdPerYear.value / totalCapital : null
    const ratio =
      capitalShare != null && demandShare > 0 ? capitalShare / demandShare : null
    out.set(p.slug, {
      problemSlug: p.slug,
      capitalUsd: flow?.usdPerYear.value ?? null,
      momentum: flow?.momentum ?? null,
      demandShare,
      capitalShare,
      ratio,
      verdict: ratio == null ? null : verdictFor(ratio),
    })
  }
  return out
}

/**
 * Format an allocation ratio for display. Tiny ratios are the headline
 * ("0.002× fair share" = 1/500th), so keep significant figures instead of
 * flattening to 0.0×.
 */
export function fmtRatio(ratio: number): string {
  if (ratio >= 10) return `${Math.round(ratio)}×`
  if (ratio >= 0.1) return `${ratio.toFixed(1)}×`
  return `${ratio.toPrecision(1)}×`
}

/** $2.2T, $600M, $25B — compact money for chips and labels. */
export function fmtUsdCompact(v: number): string {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(1).replace(/\.0$/, '')}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(0)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`
  return `$${Math.round(v)}`
}
