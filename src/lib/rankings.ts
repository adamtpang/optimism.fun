/**
 * The startup power rankings — a vS-Data-Reaper-style tier list of the
 * highest-demand companies that AREN'T being built yet.
 *
 * Altitude matters: we rank Requests for Startups (specific, buildable
 * companies = the leaf nodes), NOT the 12 coarse problems.
 *
 *   score = demand × quest-gap × readiness
 *
 *   demand    = the problem's triangulated demand composite (from the radar /
 *               demand map). Shared by sibling quests under one problem — that
 *               is correct; they serve the same underlying demand.
 *   quest-gap = 1 − questSupply, where questSupply blends the problem's overall
 *               supply with THIS quest's own crowding. This is the sibling
 *               differentiator: the residual, at the quest altitude.
 *   readiness = a confidence discount, so a ready frontier outranks a maybe.
 *
 * Raw demand is deliberately NOT the metric: supply chases demand, so the head
 * of the demand curve is the most contested. The opportunity is the gap.
 */
import type { CapitalMomentum, AllocationVerdict, Confidence, Crowding } from '@/data/types'
import { requestsForStartups } from '@/data/rfs'
import { getSourcedCrowding } from '@/data/quest-crowding'
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
  /** How contested THIS specific quest is (quest-level supply). */
  crowding: Crowding
  /** Whether crowding came from a live competitor count or an editorial prior. */
  crowdingSource: 'sourced' | 'editorial'
  /** Real companies found building this, when sourced. */
  competitorCount: number | null
  exampleCompetitors: string[]
  problemSlug: string
  problemName: string
  domainLabel: string | null
  /** Triangulated demand for the underlying problem, 0..100 (shared by siblings). */
  demand: number
  /** The problem's overall supply, 0..100 (shared by siblings). */
  supply: number
  /** Quest-level supply: problem supply blended with this quest's crowding, 0..100. */
  questSupply: number
  /** The quest-level undersupply — 100 − questSupply. Differentiates siblings. */
  gap: number
  /** Quest opportunity: demand × quest-gap, 0..100. */
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

// How much each crowding level counts as quest-level supply (0..1).
const CROWDING_SUPPLY: Record<Crowding, number> = { open: 0.2, contested: 0.5, crowded: 0.8 }

/**
 * Quest-level supply, 0..1. Blends the problem's overall supply with how
 * contested THIS specific approach is — crowding weighted higher (0.55) so
 * sibling quests under one problem actually separate. This is the whole point:
 * demand is shared by siblings; the differentiator is the quest's own gap.
 */
function questSupplyFrac(problemSupply: number, crowding: Crowding): number {
  return clamp(0.45 * (problemSupply / 100) + 0.55 * CROWDING_SUPPLY[crowding], 0, 1)
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
      // A live competitor count beats the editorial prior. Sourcing falsified
      // roughly half the priors, so where real data exists it wins.
      const sourced = getSourcedCrowding(rfs.slug)
      const crowding = sourced?.crowding ?? rfs.crowding ?? 'contested'
      const demand = p.demandComposite

      const supplyFrac = questSupplyFrac(p.supply, crowding)
      const questSupply = Math.round(supplyFrac * 100)
      const gap = Math.round((1 - supplyFrac) * 100)
      // Quest opportunity = demand × quest-gap — the residual at this altitude.
      const opportunity = Math.round(demand * (1 - supplyFrac))
      const score = Math.round(clamp(opportunity * CONFIDENCE_MULT[confidence], 0, 100))

      return {
        slug: rfs.slug,
        title: rfs.title,
        pitch: rfs.pitch,
        whyNow: rfs.whyNow,
        goodQuest: rfs.goodQuest,
        confidence,
        crowding,
        crowdingSource: sourced ? ('sourced' as const) : ('editorial' as const),
        competitorCount: sourced?.competitorCount ?? null,
        exampleCompetitors: sourced?.exampleCompetitors ?? [],
        problemSlug: rfs.problemSlug,
        problemName: p.name,
        domainLabel: p.domainLabel,
        demand,
        supply: p.supply,
        questSupply,
        gap,
        opportunity,
        prizeUsd: p.inLimitUsd,
        momentum: p.capitalMomentum,
        allocationVerdict: p.allocationVerdict,
        score,
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
