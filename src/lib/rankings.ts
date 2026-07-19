/**
 * The startup power rankings — a vS-Data-Reaper-style tier list of the
 * highest-demand companies that AREN'T being built yet.
 *
 * Altitude matters: we rank Requests for Startups (specific, buildable
 * companies = the leaf nodes), NOT the 12 coarse problems. Each RFS inherits
 * its problem's demand-gap metrics from the radar, then is scored and tiered.
 *
 * The ranking metric is the opportunity spine — demand × (1 − supply) × urgency
 * (lib/priority.ts) — the literal "high demand, undersupplied" quantity, blended
 * with the triangulated demand composite and gated by how ready-to-build the
 * quest is (confidence). Raw demand is deliberately NOT the metric: supply
 * chases demand, so the head of the demand curve is the MOST contested. The
 * opportunity is the residual — the gap.
 */
import type { CapitalMomentum, AllocationVerdict, Confidence } from '@/data/types'
import { requestsForStartups } from '@/data/rfs'
import { computeRadarRows } from '@/lib/radar'

export type QuestTier = 'S' | 'A' | 'B' | 'C'

export type RankedQuest = {
  rank: number // 1-indexed overall
  tier: QuestTier
  score: number // 0..100 composite ranking score
  slug: string
  title: string
  pitch: string
  whyNow: string
  goodQuest: string
  confidence: Confidence
  problemSlug: string
  problemName: string
  domainLabel: string | null
  /** Triangulated demand for the underlying problem, 0..100. */
  demand: number
  /** How well-served the problem already is, 0..100. */
  supply: number
  /** The undersupply — 100 − supply. Higher = more unbuilt. */
  gap: number
  /** Radar opportunity: demand × (1 − supply) × urgency, 0..100. */
  opportunity: number
  /** In-the-limit market cap ceiling (the prize), USD. */
  prizeUsd: number | null
  /** Capital momentum on the problem — a coarse "why now" proxy. */
  momentum: CapitalMomentum | null
  /** Whether capital is under/over-allocated vs demand. */
  allocationVerdict: AllocationVerdict | null
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))

// Readiness gate: a lower-confidence quest is discounted, never zeroed.
const CONFIDENCE_MULT: Record<Confidence, number> = { high: 1, med: 0.93, low: 0.84 }

/**
 * Compose one quest's ranking score. Opportunity is the spine; the triangulated
 * demand composite is a secondary vote; confidence gates readiness.
 */
function questScore(opportunity: number, demandComposite: number, confidence: Confidence): number {
  const raw = 0.72 * opportunity + 0.28 * demandComposite
  return Math.round(clamp(raw * CONFIDENCE_MULT[confidence], 0, 100))
}

/**
 * Position-based tiers so the board always reads as a clean power ranking
 * (a tier list has tiers). Thresholds are shares of the field, not absolute
 * cutoffs — S ≈ top 15%, A ≈ next 23%, B ≈ next 31%, C ≈ the tail.
 */
function tierFor(index: number, total: number): QuestTier {
  const p = (index + 1) / total
  if (p <= 0.15) return 'S'
  if (p <= 0.38) return 'A'
  if (p <= 0.69) return 'B'
  return 'C'
}

export function computeQuestRankings(): RankedQuest[] {
  const radar = computeRadarRows()
  const byProblem = new Map(radar.map((r) => [r.slug, r]))

  const scored = requestsForStartups
    .map((rfs) => {
      const p = byProblem.get(rfs.problemSlug)
      if (!p) return null
      const confidence = rfs.confidence ?? 'low'
      const demand = p.demandComposite
      const supply = p.supply
      return {
        slug: rfs.slug,
        title: rfs.title,
        pitch: rfs.pitch,
        whyNow: rfs.whyNow,
        goodQuest: rfs.goodQuest,
        confidence,
        problemSlug: rfs.problemSlug,
        problemName: p.name,
        domainLabel: p.domainLabel,
        demand,
        supply,
        gap: clamp(100 - supply, 0, 100),
        opportunity: p.opportunity,
        prizeUsd: p.inLimitUsd,
        momentum: p.capitalMomentum,
        allocationVerdict: p.allocationVerdict,
        score: questScore(p.opportunity, demand, confidence),
      }
    })
    .filter((q): q is NonNullable<typeof q> => q !== null)
    // Rank: score desc, then bigger prize, then the underdog (less-supplied) first.
    .sort((a, b) => b.score - a.score || (b.prizeUsd ?? 0) - (a.prizeUsd ?? 0) || b.gap - a.gap)

  const total = scored.length
  return scored.map((q, i) => ({
    ...q,
    rank: i + 1,
    tier: tierFor(i, total),
  }))
}

/** Group ranked quests by tier, preserving order, for the tier-band UI. */
export function groupByTier(quests: RankedQuest[]): { tier: QuestTier; quests: RankedQuest[] }[] {
  const order: QuestTier[] = ['S', 'A', 'B', 'C']
  return order
    .map((tier) => ({ tier, quests: quests.filter((q) => q.tier === tier) }))
    .filter((band) => band.quests.length > 0)
}
