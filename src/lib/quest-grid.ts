/**
 * The good x hard grid, after Trae Stephens and Markie Wagner's "Choose Good
 * Quests" (Founders Fund, 2023): every pursuit plots on two axes, good versus
 * bad and hard versus easy.
 *
 * Every quest on this site cleared "good" (see /methodology) before it was
 * ranked, so nothing here plots in "bad" territory. That side of the grid is
 * real, just empty by construction.
 *
 *   good = every quest here sits in the good half, 50..100, because it passed
 *          the filter. Its place inside that half is its opportunity (demand
 *          x quest gap, from lib/rankings.ts): 50 + opportunity / 2. The left
 *          half is for bad quests, which this site does not track, and for
 *          a visitor's own honest answer about their current work.
 *   hard = how hard the underlying problem is, from three fields each problem
 *          already carries: tractability (1..10, inverted), years to impact,
 *          and capital required. Whichever of the three exist are averaged.
 *          The quest's own confidence then nudges it: a low-confidence quest
 *          has less of a playbook, so it sits a little higher.
 *
 * There is no per-quest random offset. Two quests under one problem with the
 * same confidence share a hard value, because we know nothing that separates
 * them. The inputs are estimates, and the detail panel shows them.
 */
import type { RankedQuest } from './rankings'
import type { Domain, Problem } from '@/data/types'
import { getProblemBySlug } from '@/data/problems'

export type PlottedQuest = {
  slug: string
  title: string
  pitch: string
  problemName: string
  problemSlug: string
  domain: Domain | null
  band: RankedQuest['band']
  score: number
  good: number // 50-100, x-axis
  /** The 0..100 opportunity score that sets the position inside the good half. */
  opportunity: number
  hard: number // 0-100, y-axis
  /** The inputs behind `hard`, in words, for display. */
  hardWhy: string
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))

const CONFIDENCE_NUDGE: Record<RankedQuest['confidence'], number> = { high: -8, med: 0, low: 8 }

function usd(v: number): string {
  if (v >= 1e12) return `$${+(v / 1e12).toFixed(1)}T`
  if (v >= 1e9) return `$${+(v / 1e9).toFixed(1)}B`
  return `$${+(v / 1e6).toFixed(0)}M`
}

/** Problem-level hardness, 0..100, plus the inputs it came from. Null when the problem carries none. */
export function problemHardness(p: Pick<Problem, 'tractability' | 'timeToImpact' | 'capitalRequired'>): {
  value: number
  why: string
} | null {
  const parts: number[] = []
  const why: string[] = []
  const t = p.tractability?.score
  if (t != null) {
    parts.push(clamp((10 - t) / 9, 0, 1))
    why.push(`tractability ${t}/10`)
  }
  const years = p.timeToImpact?.value
  if (years != null && years > 0) {
    parts.push(clamp(years / 30, 0, 1))
    why.push(`about ${years} years to impact`)
  }
  const capital = p.capitalRequired?.value
  if (capital != null && capital > 0) {
    // $10M reads as easy, $1T as the ceiling, on a log scale.
    parts.push(clamp((Math.log10(capital) - 7) / 5, 0, 1))
    why.push(`about ${usd(capital)} of capital`)
  }
  if (parts.length === 0) return null
  const mean = parts.reduce((a, b) => a + b, 0) / parts.length
  return { value: Math.round(mean * 100), why: why.join(', ') }
}

export function placeOnQuestGrid(quests: RankedQuest[]): PlottedQuest[] {
  return quests.map((q) => {
    const problem = getProblemBySlug(q.problemSlug)
    const base = problem ? problemHardness(problem) : null
    const nudge = CONFIDENCE_NUDGE[q.confidence]
    return {
      slug: q.slug,
      title: q.title,
      pitch: q.pitch,
      problemName: q.problemName,
      problemSlug: q.problemSlug,
      domain: problem?.domain ?? null,
      band: q.band,
      score: q.score,
      good: 50 + Math.round(q.opportunity / 2),
      opportunity: q.opportunity,
      hard: clamp((base?.value ?? 50) + nudge, 3, 97),
      hardWhy: base
        ? `${base.why}; quest confidence ${q.confidence}`
        : `no hardness inputs on the problem yet; quest confidence ${q.confidence}`,
    }
  })
}

/** Where a self-described current quest lands, in the essay's own four boxes. */
export function quadrant(good: number, hard: number): { name: string; verdict: string } {
  if (good >= 50 && hard >= 50)
    return { name: 'hard and good', verdict: 'This is the box the essay asks capable people to be in.' }
  if (good >= 50)
    return { name: 'easy and good', verdict: 'Worth doing. The open question is whether you could carry something harder.' }
  if (hard >= 50)
    return { name: 'hard and not good', verdict: 'High effort for little gain to the world.' }
  return { name: 'easy and not good', verdict: 'The essay calls this a bad quest. The quests on this grid are the alternative.' }
}
