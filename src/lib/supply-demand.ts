/**
 * The supply-demand index — what is under-supplied, ranked.
 *
 * Method, borrowed from OnDeck Capital's local-business study (they divided
 * monthly Google searches by the number of businesses of that type, and found
 * car rental at 34 searches per business, the most under-supplied in America):
 * compare a thing's SHARE of demand against its SHARE of supply.
 *
 *   demandShare_i = importance_i / Σ importance
 *   supplyShare_i = supply_i     / Σ supply
 *   ratio_i       = supplyShare_i / demandShare_i
 *
 * Shares are unitless, which is the whole point. Dividing raw burden by raw
 * supply — "humans affected per paper" — looks more legible but is not
 * comparable across problems, because each problem defines its affected
 * population differently. Six of the eleven claim ~8 billion affected; ranking
 * on that rewards whichever problem describes itself most expansively. Shares
 * remove that, because a problem's demand share already accounts for how it
 * was scored relative to every other problem.
 *
 * DEMAND IS `importanceScore`, NOT the demand composite. The composite now
 * contains research and capital as classes, so using it here would put the
 * numerator inside the denominator. importanceScore is pure need — quantity of
 * humans × severity, gated by ability to pay — with no effort signal in it.
 * It is also what lib/allocation.ts already uses, so /radar and this agree.
 *
 * Verdict bands match allocation.ts deliberately: <0.5x underserved,
 * 0.5-2x balanced, >2x oversupplied. Blunt on purpose.
 */
import type { AllocationVerdict } from '@/data/types'
import { problems, DOMAIN_LABEL } from '@/data/problems'
import { importanceScore } from '@/lib/priority'
import { getCompaniesForProblem } from '@/data/companies'
import { verdictFor } from '@/lib/allocation'
import { computeDemandRows } from '@/lib/demand-live'

export type SupplyKind = 'research' | 'public-capital' | 'private-capital' | 'companies'

export type SupplySignal = {
  kind: SupplyKind
  label: string
  /** The raw count — papers, awards, raises, companies. */
  value: number
  unit: string
  /** This problem's share of the total across all problems. */
  share: number
  /** supplyShare / demandShare. 1.0 means proportional. */
  ratio: number
  verdict: AllocationVerdict
}

export type SupplyDemandRow = {
  slug: string
  name: string
  domainLabel: string | null
  /** Share of total measured demand (importance). */
  demandShare: number
  signals: SupplySignal[]
  /**
   * Geometric mean of the available ratios — the headline. Geometric rather
   * than arithmetic because these are ratios: a problem at 0.1x on one signal
   * and 10x on another is balanced, not 5x oversupplied.
   */
  meanRatio: number | null
  verdict: AllocationVerdict | null
}

const KIND_LABEL: Record<SupplyKind, { label: string; unit: string }> = {
  research: { label: 'Research', unit: 'papers' },
  'public-capital': { label: 'Public money', unit: 'federal awards' },
  'private-capital': { label: 'Private money', unit: 'new raises' },
  companies: { label: 'Companies', unit: 'on the index' },
}

/** Sum a map's values, never returning 0 (which would divide by zero). */
function totalOf(m: Map<string, number>): number {
  const t = [...m.values()].reduce((s, v) => s + v, 0)
  return t > 0 ? t : 1
}

export async function computeSupplyDemand(): Promise<SupplyDemandRow[]> {
  const live = await computeDemandRows()
  const liveBySlug = new Map(live.map((r) => [r.slug, r]))

  // Demand: pure need, no effort signal. Same basis as lib/allocation.ts.
  const demand = new Map(problems.map((p) => [p.slug, importanceScore(p)]))
  const totalDemand = totalOf(demand)

  // Gather each supply signal across all problems, so shares are computable.
  const supply: Record<SupplyKind, Map<string, number>> = {
    research: new Map(),
    'public-capital': new Map(),
    'private-capital': new Map(),
    companies: new Map(),
  }

  for (const p of problems) {
    const row = liveBySlug.get(p.slug)
    const comps = row?.components ?? []

    const research = comps.find((c) => c.class === 'research')?.live
    if (research && research.unit === 'papers') {
      supply.research.set(p.slug, research.value)
    }

    // The capital class carries either EDGAR (private) or USAspending (public),
    // distinguished by unit, so read whichever is present.
    const capital = comps.find((c) => c.class === 'capital')?.live
    if (capital?.unit === 'federal awards') {
      supply['public-capital'].set(p.slug, capital.value)
    } else if (capital && capital.unit.startsWith('new US private')) {
      supply['private-capital'].set(p.slug, capital.value)
    }

    const companies = getCompaniesForProblem(p.slug).length
    if (companies > 0) supply.companies.set(p.slug, companies)
  }

  const totals: Record<SupplyKind, number> = {
    research: totalOf(supply.research),
    'public-capital': totalOf(supply['public-capital']),
    'private-capital': totalOf(supply['private-capital']),
    companies: totalOf(supply.companies),
  }

  const rows: SupplyDemandRow[] = problems.map((p) => {
    const demandShare = (demand.get(p.slug) ?? 0) / totalDemand
    const signals: SupplySignal[] = []

    for (const kind of Object.keys(supply) as SupplyKind[]) {
      const value = supply[kind].get(p.slug)
      if (value == null || demandShare <= 0) continue
      const share = value / totals[kind]
      const ratio = share / demandShare
      signals.push({
        kind,
        label: KIND_LABEL[kind].label,
        value,
        unit: KIND_LABEL[kind].unit,
        share,
        ratio,
        verdict: verdictFor(ratio),
      })
    }

    // Geometric mean, so a 0.1x and a 10x cancel to 1x rather than averaging
    // to 5x. Zero ratios are dropped — log(0) is undefined and a genuine zero
    // is handled by the signal simply being absent.
    const positive = signals.map((s) => s.ratio).filter((r) => r > 0)
    const meanRatio =
      positive.length > 0
        ? Math.exp(positive.reduce((s, r) => s + Math.log(r), 0) / positive.length)
        : null

    return {
      slug: p.slug,
      name: p.name,
      domainLabel: p.domain ? DOMAIN_LABEL[p.domain] : null,
      demandShare,
      signals,
      meanRatio,
      verdict: meanRatio == null ? null : verdictFor(meanRatio),
    }
  })

  // Most under-supplied first — the whole point of the page.
  return rows.sort((a, b) => {
    if (a.meanRatio == null) return 1
    if (b.meanRatio == null) return -1
    return a.meanRatio - b.meanRatio
  })
}
