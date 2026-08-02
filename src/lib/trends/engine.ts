/**
 * The trend engine — orchestration.
 *
 * Fans every watched term across every source adapter, scores the results, and
 * returns a ranked board. Degrades the same way the rest of this codebase does:
 * a failed source returns null and is simply absent, never a zero, because a
 * zero would be a claim about the world rather than about the fetch.
 *
 * Runs with NO database and NO API keys. Persistence (scripts/db/0003_trends.sql)
 * adds history and snapshots when DATABASE_URL is present; nothing here requires
 * it, so the board works on a cold clone.
 */
import { watchedTerms } from '@/data/watched-terms'
import type { ScoredTrend, TrendObservation, WatchedTerm } from './types'
import { rankTrends, scoreTrend, underpricedFirst } from './scoring'
import { fetchHackerNewsTrend } from '@/lib/sources/hackernews'
import { fetchGithubTrend } from '@/lib/sources/github'
import { fetchWikipediaPageviews } from '@/lib/sources/wikipedia'

/**
 * Wikipedia is already wired for the demand model; reuse it here as the third,
 * least-gameable source. It has no natural "prior window" in the pageviews
 * client, so compare the most recent month against the mean of the rest — a
 * spike against a term's own baseline.
 */
async function wikipediaObservation(term: string): Promise<TrendObservation | null> {
  const article = term.replace(/\s+/g, '_')
  const r = await fetchWikipediaPageviews(article)
  if (!r || r.months < 2) return null
  // monthlyAverage is the baseline; total minus baseline*(n-1) approximates the
  // latest month without a second request.
  const baseline = r.monthlyAverage
  const latest = Math.max(0, r.totalViews - baseline * (r.months - 1))
  return {
    source: 'wikipedia',
    term,
    current: Math.round(latest),
    prior: Math.round(baseline),
    windowDays: 30,
    evidence: [
      {
        title: `Wikipedia: ${article.replace(/_/g, ' ')}`,
        url: r.url,
        engagement: r.monthlyAverage,
      },
    ],
    url: r.url,
  }
}

async function observeTerm(t: WatchedTerm): Promise<ScoredTrend> {
  const results = await Promise.all([
    fetchHackerNewsTrend(t.term),
    fetchGithubTrend(t.term),
    wikipediaObservation(t.term),
  ])
  const observations = results.filter((o): o is TrendObservation => o !== null)
  return scoreTrend(t.term, t.category, observations)
}

export type TrendBoard = {
  ranked: ScoredTrend[]
  underpriced: ScoredTrend[]
  generatedAt: string
  /** Terms attempted vs terms that returned at least one live source. */
  attempted: number
  resolved: number
}

/**
 * Compute the whole board. Terms are processed in sequence rather than a single
 * huge fan-out because GitHub's unauthenticated search limit is ~10/min and the
 * adapters each hold their own polite queue; parallelising here would just
 * queue behind those anyway while making failures harder to attribute.
 */
export async function computeTrendBoard(
  opts: { limit?: number } = {},
): Promise<TrendBoard> {
  const terms = opts.limit ? watchedTerms.slice(0, opts.limit) : watchedTerms

  const scored: ScoredTrend[] = []
  for (const t of terms) {
    try {
      scored.push(await observeTerm(t))
    } catch {
      // A term that throws is skipped, not zeroed.
    }
  }

  const resolved = scored.filter((s) => s.sourceCount > 0).length

  return {
    ranked: rankTrends(scored),
    underpriced: underpricedFirst(scored).slice(0, 8),
    generatedAt: new Date().toISOString(),
    attempted: terms.length,
    resolved,
  }
}
