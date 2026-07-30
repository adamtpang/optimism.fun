/**
 * How wrong were the editorial priors?
 *
 * Each quest in rfs.ts carries a hand-set `crowding` guess. quest-crowding.ts
 * carries the count Exa actually found. This compares them, which is the site
 * auditing its own judgment — computed from both sources rather than recorded,
 * so it stays true as either side changes.
 *
 * The finding worth publishing: the errors are not random. Every wrong prior
 * was wrong in the SAME direction — the field was more contested than guessed.
 * That is a systematic optimism bias, and naming it is worth more than hiding it.
 */
import type { Crowding } from '@/data/types'
import { requestsForStartups } from '@/data/rfs'
import { sourcedCrowding } from '@/data/quest-crowding'

/** Ordinal position of each band — the dumbbell's x scale. */
export const CROWDING_ORDER: Crowding[] = ['open', 'contested', 'crowded']

export type PriorComparison = {
  slug: string
  title: string
  prior: Crowding
  sourced: Crowding
  competitorCount: number
  /** Signed shift along the ordinal scale. Positive = reality more contested. */
  shift: number
  correct: boolean
}

export type PriorAccuracy = {
  rows: PriorComparison[]
  compared: number
  wrong: number
  correct: number
  /** Wrong in the direction of "emptier than reality" — optimism bias. */
  tooOptimistic: number
  /** Wrong in the direction of "more crowded than reality". */
  tooPessimistic: number
  /** True when every error points the same way, i.e. bias not noise. */
  errorsAllOneDirection: boolean
}

export function computePriorAccuracy(): PriorAccuracy {
  const sourcedBySlug = new Map(sourcedCrowding.map((c) => [c.questSlug, c]))

  const rows: PriorComparison[] = []
  for (const rfs of requestsForStartups) {
    const s = sourcedBySlug.get(rfs.slug)
    if (!s || !rfs.crowding) continue
    const shift = CROWDING_ORDER.indexOf(s.crowding) - CROWDING_ORDER.indexOf(rfs.crowding)
    rows.push({
      slug: rfs.slug,
      title: rfs.title,
      prior: rfs.crowding,
      sourced: s.crowding,
      competitorCount: s.competitorCount,
      shift,
      correct: shift === 0,
    })
  }

  // Biggest error first, so the direction of the bias reads immediately.
  rows.sort((a, b) => Math.abs(b.shift) - Math.abs(a.shift) || b.competitorCount - a.competitorCount)

  const wrong = rows.filter((r) => !r.correct)
  const tooOptimistic = wrong.filter((r) => r.shift > 0).length
  const tooPessimistic = wrong.filter((r) => r.shift < 0).length

  return {
    rows,
    compared: rows.length,
    wrong: wrong.length,
    correct: rows.length - wrong.length,
    tooOptimistic,
    tooPessimistic,
    errorsAllOneDirection:
      wrong.length > 0 && (tooOptimistic === 0 || tooPessimistic === 0),
  }
}
