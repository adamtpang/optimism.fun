/**
 * "Most under-coordinated" — the homepage module that decides where to send a
 * visitor who has not chosen a problem yet.
 *
 * This is deliberately NOT the same question as "biggest problem" or "biggest
 * prize". Both of those already have answers elsewhere on the site, and both
 * send everyone to the same three rows. Under-coordination asks a third thing:
 * where is real need meeting thin effort AND an empty board?
 *
 * The commitment count is the term that makes this page change week to week.
 * Everything else here moves on the timescale of research; the board moves on
 * the timescale of people showing up.
 */
import { unstable_cache } from 'next/cache'
import { computeSupplyDemand } from '@/lib/supply-demand'
import { type ProblemCounts } from '@/lib/commitments'
import { cachedCountsByProblem, COMMITMENTS_TAG } from '@/lib/commitments-cache'
import { problems } from '@/data/problems'

export type UnderCoordinatedRow = {
  slug: string
  name: string
  /** Share of total measured demand. Higher is more needed. */
  demandShare: number
  /** Geometric mean of supply/demand ratios. Below 1 means under-supplied. */
  meanRatio: number | null
  counts: ProblemCounts | undefined
  liveCommitments: number
  /** Higher means more under-coordinated. Relative, not absolute. */
  score: number
  /** Plain-English reason, so the ranking is never a black box. */
  because: string
}

/**
 * demandShare divided by supply and by whoever has already shown up.
 *
 * A problem the world needs badly, that nobody funds, and that has an empty
 * board scores highest. One extra commitment moves it down, which is the
 * intended behaviour: the module exists to route the NEXT person, not to
 * permanently crown the same problem.
 */
export function underCoordinationScore(
  demandShare: number,
  meanRatio: number | null,
  liveCommitments: number,
): number {
  // A missing ratio is treated as neutral rather than as an opportunity, so a
  // problem cannot rise to the top purely because we failed to measure supply.
  const supply = meanRatio ?? 1
  return demandShare / (Math.max(supply, 0.05) * (1 + liveCommitments))
}

export async function computeUnderCoordinated(limit = 3): Promise<UnderCoordinatedRow[]> {
  const [rows, counts] = await Promise.all([computeSupplyDemand(), cachedCountsByProblem()])
  const nameBySlug = new Map(problems.map((p) => [p.slug, p.name]))

  const scored = rows.map((r): UnderCoordinatedRow => {
    const c = counts.get(r.slug)
    const live = c?.total ?? 0
    const score = underCoordinationScore(r.demandShare, r.meanRatio, live)

    const supplyPhrase =
      r.meanRatio === null
        ? 'supply is unmeasured'
        : r.meanRatio < 0.5
          ? `roughly ${(1 / r.meanRatio).toFixed(1)}x under-supplied against its share of need`
          : r.meanRatio < 1
            ? 'under-supplied against its share of need'
            : 'proportionally supplied'

    const boardPhrase =
      live === 0
        ? 'and nobody has committed here yet'
        : live === 1
          ? 'and exactly one person has committed'
          : `and only ${live} people have committed`

    return {
      slug: r.slug,
      name: nameBySlug.get(r.slug) ?? r.name,
      demandShare: r.demandShare,
      meanRatio: r.meanRatio,
      counts: c,
      liveCommitments: live,
      score,
      because: `${supplyPhrase}, ${boardPhrase}.`,
    }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, limit)
}

/**
 * Cached form, for the homepage.
 *
 * computeSupplyDemand reads live indicator data as well as the board, and
 * either uncached read is enough on its own to force the homepage to render per
 * request. Wrapping the whole computation keeps the site's most-visited page
 * prerendered. Tagged with the board, so approving a commitment refreshes the
 * under-coordinated list immediately rather than at the end of the window.
 */
export const cachedUnderCoordinated = (limit = 3): Promise<UnderCoordinatedRow[]> =>
  unstable_cache(
    () => computeUnderCoordinated(limit),
    ['coordination:under-coordinated', String(limit)],
    { revalidate: 300, tags: [COMMITMENTS_TAG] },
  )()
