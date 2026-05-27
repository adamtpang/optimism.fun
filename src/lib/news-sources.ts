/**
 * Recent-signal fetchers for the daily problem-sourcing cron.
 *
 * Currently wired to GNews (gnews.io — free tier supports keyword search).
 * Swap in any other provider (NewsAPI, Exa, etc.) by adding a sibling fetcher
 * here and routing from fetchRecentSignal().
 */

export type SignalItem = {
  title: string
  url: string
  description?: string
  source: string
  publishedAt: string // ISO 8601
}

export function isNewsConfigured(): boolean {
  return Boolean(process.env.GNEWS_API_KEY)
}

/** Topical queries we run daily. Tuned around the existing tier mix. */
export const DEFAULT_QUERIES: string[] = [
  'global health intervention',
  'pandemic preparedness',
  'fusion energy breakthrough',
  'housing construction productivity',
  'AI alignment research',
  'longevity clinical trial',
  'fertility rate decline',
  'loneliness epidemic',
]

export async function fetchRecentSignal(
  queries: string[] = DEFAULT_QUERIES,
  perQuery = 5,
): Promise<SignalItem[]> {
  if (!isNewsConfigured()) return []
  const key = process.env.GNEWS_API_KEY!
  const out: SignalItem[] = []
  // Run sequentially — gnews free tier is rate-limited and we'd rather be
  // polite than parallel here. Daily cron, not interactive.
  for (const q of queries) {
    try {
      const url = new URL('https://gnews.io/api/v4/search')
      url.searchParams.set('q', q)
      url.searchParams.set('max', String(perQuery))
      url.searchParams.set('lang', 'en')
      url.searchParams.set('apikey', key)
      const res = await fetch(url.toString(), { cache: 'no-store' })
      if (!res.ok) continue
      const json = (await res.json()) as {
        articles?: Array<{
          title: string
          description?: string
          url: string
          publishedAt: string
          source?: { name?: string }
        }>
      }
      for (const a of json.articles ?? []) {
        out.push({
          title: a.title,
          url: a.url,
          description: a.description,
          source: a.source?.name ?? 'gnews',
          publishedAt: a.publishedAt,
        })
      }
    } catch {
      // Skip this query — log to runtime so we can see partial failures.
      console.warn(JSON.stringify({ event: 'news:fetch-failed', query: q }))
    }
  }
  return out
}
