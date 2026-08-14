/**
 * The good×hard grid — gamifying Trae Stephens & Markie Wagner's "Choose
 * Good Quests" (Founders Fund, 2023): every pursuit plots on two axes, good
 * vs. bad and hard vs. easy, and the moral claim is that capable people owe
 * the world a quest in the hard+good quadrant.
 *
 * Every quest already on this site cleared "good" (see /methodology's
 * unambiguously-good filter) before it was ever ranked, so nothing here is
 * plotted in "bad" territory — that side of the grid is real, just empty by
 * construction. The two real axes we do have:
 *
 *   good = opportunity (demand × quest-gap, 0-100), already computed in
 *          lib/rankings.ts — how much the world is missing this.
 *   hard = inverse confidence (high → easier/more proven path, low → a real
 *          frontier with no playbook yet), spread with a deterministic
 *          per-slug offset so quests sharing a confidence tier don't stack
 *          on one point.
 */
import type { RankedQuest } from './rankings'

export type PlottedQuest = {
  slug: string
  title: string
  problemName: string
  problemSlug: string
  tier: RankedQuest['tier']
  score: number
  good: number // 0-100, x-axis
  hard: number // 0-100, y-axis
}

function slugSpread(slug: string, range: number): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h % range
}

const HARD_BASE: Record<RankedQuest['confidence'], number> = { high: 18, med: 48, low: 76 }

export function placeOnQuestGrid(quests: RankedQuest[]): PlottedQuest[] {
  return quests.map((q) => ({
    slug: q.slug,
    title: q.title,
    problemName: q.problemName,
    problemSlug: q.problemSlug,
    tier: q.tier,
    score: q.score,
    good: q.opportunity,
    hard: Math.min(97, HARD_BASE[q.confidence] + slugSpread(q.slug, 20)),
  }))
}
