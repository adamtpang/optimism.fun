/**
 * USAspending API — federal awards as public capital.
 * Free, no API key, public domain. https://api.usaspending.gov
 *
 * The counterpart to EDGAR in the `capital` class. EDGAR sees new US PRIVATE
 * raises and, because the SEC's taxonomy has no category for most social
 * problems, only maps to 5 of 11. USAspending sees PUBLIC money — grants and
 * contracts — and covers all 11, so together they cover the class.
 *
 * demand.ts defines `capital` as "smart money flowing in — VC / grant / R&D",
 * which names grants explicitly, so federal awards belong here rather than in
 * the policy class.
 *
 * Honest limits: keyword matching runs against award descriptions, so it is
 * noisier than a taxonomy lookup, and an award COUNT is not dollars — a $5k
 * grant and a $500M contract each count once. US federal only, and the API
 * itself caps the searchable window at 2007-10-01.
 */

export type UsaSpendingResult = {
  term: string
  /** Grants + contracts + loans + other, in the window. */
  awardCount: number
  grants: number
  contracts: number
  fromDate: string
  toDate: string
  /** Human-facing search URL, so any number can be reproduced. */
  url: string
}

const BASE = 'https://api.usaspending.gov/api/v2/search/spending_by_award_count/'

let queue: Promise<unknown> = Promise.resolve()
const GAP_MS = 150

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const result = queue.then(job)
  queue = result.catch(() => undefined).then(() => new Promise((r) => setTimeout(r, GAP_MS)))
  return result
}

export function fetchUsaSpendingAwards(
  term: string,
  opts: { fromDate?: string; toDate?: string; revalidateSeconds?: number } = {},
): Promise<UsaSpendingResult | null> {
  return enqueue(() => fetchNow(term, opts))
}

async function fetchNow(
  term: string,
  opts: { fromDate?: string; toDate?: string; revalidateSeconds?: number } = {},
): Promise<UsaSpendingResult | null> {
  const fromDate = opts.fromDate ?? '2025-01-01'
  const toDate = opts.toDate ?? new Date().toISOString().slice(0, 10)

  try {
    const res = await fetch(BASE, {
      method: 'POST',
      // A declared User-Agent is required: without one the connection is
      // refused outright (Node reports it as a bare "fetch failed", not an
      // HTTP status), which is easy to mistake for the API being down.
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'user-agent': process.env.SEC_USER_AGENT ?? 'optimism.fun research adamtpang@gmail.com',
      },
      body: JSON.stringify({
        filters: {
          keywords: [term],
          time_period: [{ start_date: fromDate, end_date: toDate }],
        },
      }),
      signal: AbortSignal.timeout(15_000),
      // POST is not cached by Next's data cache; the page's own ISR bounds it.
      cache: 'no-store',
    })
    if (!res.ok) return null

    const json = (await res.json()) as {
      results?: Record<string, number>
    }
    const r = json.results
    if (!r || typeof r !== 'object') return null

    const nums = Object.values(r).filter((v): v is number => typeof v === 'number')
    if (nums.length === 0) return null
    const awardCount = nums.reduce((s, v) => s + v, 0)

    return {
      term,
      awardCount,
      grants: typeof r.grants === 'number' ? r.grants : 0,
      contracts: typeof r.contracts === 'number' ? r.contracts : 0,
      fromDate,
      toDate,
      url: `https://www.usaspending.gov/search?hash=&keywords=${encodeURIComponent(term)}`,
    }
  } catch {
    return null
  }
}
