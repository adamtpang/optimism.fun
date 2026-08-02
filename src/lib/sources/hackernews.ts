/**
 * Hacker News via the Algolia API — discussion velocity.
 * Free, no API key. https://hn.algolia.com/api
 *
 * Measures what a technical, US-skewed, early-adopter community is discussing.
 * Not "the internet" — stating that plainly matters, because the whole failure
 * mode of trend dashboards is treating one community's chatter as the world's.
 *
 * Two windows of equal length are fetched, because a level tells you nothing
 * about whether something is moving. `nbHits` is the count; hits from the
 * current window double as the evidence panel.
 *
 * Verified 2026-08-02: niche terms return genuine zeros here ("gene drive" 0,
 * "metascience" 0) while "AI agents" returned 249 last week against 307 the
 * week before — already decelerating. Zeros are real signal, not failure.
 */
import type { TrendEvidence, TrendObservation } from '@/lib/trends/types'

const BASE = 'https://hn.algolia.com/api/v1/search_by_date'

// Algolia is generous but a page render fans out one call per term.
let queue: Promise<unknown> = Promise.resolve()
const GAP_MS = 120

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const result = queue.then(job)
  queue = result.catch(() => undefined).then(() => new Promise((r) => setTimeout(r, GAP_MS)))
  return result
}

type HnHit = {
  title?: string
  story_title?: string
  objectID?: string
  points?: number
  num_comments?: number
  created_at?: string
}

async function countWindow(
  term: string,
  fromUnix: number,
  toUnix: number | null,
  withHits: boolean,
): Promise<{ count: number; hits: HnHit[] } | null> {
  const filters = toUnix
    ? `created_at_i>${fromUnix},created_at_i<${toUnix}`
    : `created_at_i>${fromUnix}`
  const params = new URLSearchParams({
    query: term,
    tags: 'story',
    numericFilters: filters,
    hitsPerPage: withHits ? '3' : '1',
  })
  try {
    const res = await fetch(`${BASE}?${params}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const json = (await res.json()) as { nbHits?: number; hits?: HnHit[] }
    if (typeof json.nbHits !== 'number') return null
    return { count: json.nbHits, hits: json.hits ?? [] }
  } catch {
    return null
  }
}

export function fetchHackerNewsTrend(
  term: string,
  opts: { windowDays?: number } = {},
): Promise<TrendObservation | null> {
  return enqueue(() => fetchNow(term, opts))
}

async function fetchNow(
  term: string,
  opts: { windowDays?: number } = {},
): Promise<TrendObservation | null> {
  const windowDays = opts.windowDays ?? 7
  const win = windowDays * 86400
  const now = Math.floor(Date.now() / 1000)

  const current = await countWindow(term, now - win, null, true)
  if (!current) return null
  const prior = await countWindow(term, now - 2 * win, now - win, false)
  if (!prior) return null

  const evidence: TrendEvidence[] = current.hits
    .map((h) => ({
      title: h.title ?? h.story_title ?? '(untitled)',
      url: h.objectID
        ? `https://news.ycombinator.com/item?id=${h.objectID}`
        : 'https://news.ycombinator.com',
      engagement: h.points,
      at: h.created_at,
    }))
    .slice(0, 3)

  return {
    source: 'hackernews',
    term,
    current: current.count,
    prior: prior.count,
    windowDays,
    evidence,
    url: `https://hn.algolia.com/?query=${encodeURIComponent(term)}&sort=byDate&type=story`,
  }
}
