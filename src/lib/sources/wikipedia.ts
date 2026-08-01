/**
 * Wikimedia Pageviews API — attention, as CROWDING rather than demand.
 * Free, no API key, CC0. https://wikimedia.org/api/rest_v1/
 *
 * This is deliberately not a demand signal. lib/demand.ts gives `attention` a
 * weight of zero and says why: the best opportunities are high demand with LOW
 * attention, so counting eyeballs as demand would invert the thesis. It is used
 * here as the saturation axis — a problem the world is already staring at is
 * more contested, whatever its burden.
 *
 * Chosen over Google Trends on three counts, all of which matter:
 *   - Trends has no free official API; the official one is application-gated
 *     and scrapers break constantly and breach terms.
 *   - Trends returns RELATIVE 0-100 values, re-normalised per request, so two
 *     terms fetched separately cannot honestly be compared. Pageviews are
 *     absolute counts.
 *   - Pageviews are CC0 and republishable, which Trends data is not.
 *
 * `agent=user` strips bots and spiders, which is the difference between a real
 * attention number and a crawler artefact.
 *
 * GOTCHA, verified 2026-07-20: the API 404s on some canonical titles while
 * serving their redirects. Climate_change, Loneliness and Replication_crisis
 * all 404 consistently, while Global_warming, Social_isolation and Metascience
 * return full series. Every title in the registry was checked against the live
 * API for this reason — a wrong title fails silently as "no attention".
 */

export type WikipediaResult = {
  article: string
  /** Total human pageviews across the window. */
  totalViews: number
  /** Mean views per month, easier to reason about than a window total. */
  monthlyAverage: number
  months: number
  fromDate: string
  url: string
}

const BASE = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article'

function userAgent(): string {
  return process.env.SEC_USER_AGENT ?? 'optimism.fun research adamtpang@gmail.com'
}

// One call per problem on a page render; Wikimedia asks callers to be polite.
let queue: Promise<unknown> = Promise.resolve()
const GAP_MS = 100

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const result = queue.then(job)
  queue = result.catch(() => undefined).then(() => new Promise((r) => setTimeout(r, GAP_MS)))
  return result
}

export function fetchWikipediaPageviews(
  article: string,
  opts: { fromDate?: string; toDate?: string; revalidateSeconds?: number } = {},
): Promise<WikipediaResult | null> {
  return enqueue(() => fetchNow(article, opts))
}

/** YYYYMMDD, the format the pageviews endpoint expects. */
function stamp(iso: string): string {
  return iso.replace(/-/g, '')
}

async function fetchNow(
  article: string,
  opts: { fromDate?: string; toDate?: string; revalidateSeconds?: number } = {},
): Promise<WikipediaResult | null> {
  const fromDate = opts.fromDate ?? '2025-01-01'
  const toDate = opts.toDate ?? new Date().toISOString().slice(0, 10)

  const url =
    `${BASE}/en.wikipedia/all-access/user/${encodeURIComponent(article)}` +
    `/monthly/${stamp(fromDate)}/${stamp(toDate)}`

  try {
    const res = await fetch(url, {
      headers: { 'user-agent': userAgent(), accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: opts.revalidateSeconds ?? 86400 },
    })
    if (!res.ok) return null

    const json = (await res.json()) as { items?: { views?: number }[] }
    const items = json.items ?? []
    if (items.length === 0) return null

    const totalViews = items.reduce((s, i) => s + (i.views ?? 0), 0)
    if (totalViews <= 0) return null

    return {
      article,
      totalViews,
      monthlyAverage: Math.round(totalViews / items.length),
      months: items.length,
      fromDate,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(article)}`,
    }
  } catch {
    return null
  }
}
