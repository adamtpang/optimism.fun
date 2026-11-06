/**
 * The trend engine — orchestration.
 *
 * Scores captured trend observations from the render snapshot. A source that
 * was unavailable at capture is absent, never a zero, because a zero would be
 * a claim about the world rather than about the fetch.
 *
 * Runs with NO database and NO API keys. Persistence (scripts/db/0003_trends.sql)
 * adds history and snapshots when DATABASE_URL is present; nothing here requires
 * it, so the board works on a cold clone.
 */
import { watchedTerms } from '@/data/watched-terms'
import type { ScoredTrend, TrendObservation } from './types'
import { rankTrends, scoreTrend, underpricedFirst } from './scoring'
import { trendCaptures } from '@/lib/render-snapshot'

/**
 * Wikipedia is already wired for the demand model; reuse it here as the third,
 * least-gameable source. It has no natural "prior window" in the pageviews
 * client, so compare the most recent month against the mean of the rest — a
 * spike against a term's own baseline.
 */
export type TrendBoard = {
  ranked: ScoredTrend[]
  underpriced: ScoredTrend[]
  generatedAt: string
  /** Terms attempted vs terms that returned at least one live source. */
  attempted: number
  resolved: number
}

/**
 * Score the captured observations. A source listed as unavailable is absent.
 * It is not inserted as a zero.
 */
export async function computeTrendBoard(
  opts: { limit?: number } = {},
): Promise<TrendBoard> {
  const terms = opts.limit ? watchedTerms.slice(0, opts.limit) : watchedTerms
  const captures = trendCaptures()

  const scored: ScoredTrend[] = terms.map((t) => {
    const row = captures.find((item) => item.term === t.term)
    const detail = row?.status === 'ok' && row.detail && typeof row.detail === 'object'
      ? (row.detail as { observations?: TrendObservation[] })
      : null
    const observations = (detail?.observations ?? []).filter(
      (o) => o && typeof o.current === 'number' && typeof o.prior === 'number',
    )
    return scoreTrend(t.term, t.category, observations)
  })

  const resolved = scored.filter((s) => s.sourceCount > 0).length
  const times = captures.map((row) => row.retrievedAtUtc).filter(Boolean).sort()

  return {
    ranked: rankTrends(scored),
    underpriced: underpricedFirst(scored).slice(0, 8),
    generatedAt: times.at(-1) ?? '2026-11-06',
    attempted: terms.length,
    resolved,
  }
}
