/**
 * SEC EDGAR full-text search — new US private capital formation, from Form D.
 * Free, no API key, public domain. https://efts.sec.gov/LATEST/search-index
 *
 * Every US private placement files a Form D within ~15 days of the first sale,
 * so this is the closest thing to a live, CITABLE, REPUBLISHABLE venture-funding
 * feed. That last property is why it is here and Crunchbase is not: Crunchbase's
 * licence forbids redistributing their data to third parties, which rules it out
 * for a public index. Form D is a government filing in the public domain.
 *
 * WHAT THIS MEASURES, precisely: the number of Form D filings whose text matches
 * a query in a date window. Two query kinds, and the UI must say which:
 *   - 'industry-group' — one of the official industry checkboxes on the form
 *     (Construction, Other Energy, Other Health Care...). A real SEC taxonomy.
 *   - 'keyword' — free text, which for Form D is mostly the issuer's NAME plus
 *     boilerplate. "31 filings mentioning longevity" is a fair claim;
 *     "all longevity funding" is not.
 *
 * WHAT IT CANNOT SEE: the form's taxonomy has no category for most social
 * problems. Verified 2026-07-20 over the window below: biosecurity 0,
 * loneliness 0, tutoring 0, metascience 0, poverty 1. Those problems get no
 * EDGAR mapping rather than a zero, because a zero here would measure the
 * instrument rather than the world — the same trap NIH-only research fell into.
 *
 * Caveats the callers should respect:
 *   - Totals are capped at 10,000 by EDGAR; `capped` flags when we hit it.
 *   - A filing is a raise ATTEMPT at a stated offering size, not money received.
 *   - US only, and Reg D only — it misses non-US rounds entirely.
 */

export type FormDQueryKind = 'industry-group' | 'keyword'

export type FormDResult = {
  query: string
  kind: FormDQueryKind
  /** Form D filings matching the query in the window. */
  filingCount: number
  /** True when EDGAR's 10,000 result ceiling was hit, so the count is a floor. */
  capped: boolean
  fromDate: string
  toDate: string
  /** Issuer names from the first page of hits, for display and spot-checking. */
  examples: string[]
  /** Human-facing EDGAR search URL, so any number can be audited in one click. */
  url: string
}

const BASE = 'https://efts.sec.gov/LATEST/search-index'
const EDGAR_CAP = 10_000

/**
 * The SEC requires a declared identity on automated requests and will block
 * traffic without one. https://www.sec.gov/os/webmaster-faq#developers
 */
function userAgent(): string {
  return process.env.SEC_USER_AGENT ?? 'optimism.fun research adamtpang@gmail.com'
}

// The SEC asks for <=10 requests/second, and bursts of concurrent queries were
// observed returning intermittent 500s. Serialise, same as nih.ts / openalex.ts.
let queue: Promise<unknown> = Promise.resolve()
const GAP_MS = 150

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const result = queue.then(job)
  queue = result.catch(() => undefined).then(() => new Promise((r) => setTimeout(r, GAP_MS)))
  return result
}

export function fetchFormDCount(
  query: string,
  opts: {
    kind?: FormDQueryKind
    fromDate?: string
    toDate?: string
    revalidateSeconds?: number
  } = {},
): Promise<FormDResult | null> {
  return enqueue(() => fetchFormDCountNow(query, opts))
}

async function fetchFormDCountNow(
  query: string,
  opts: {
    kind?: FormDQueryKind
    fromDate?: string
    toDate?: string
    revalidateSeconds?: number
  } = {},
): Promise<FormDResult | null> {
  const kind = opts.kind ?? 'keyword'
  const fromDate = opts.fromDate ?? '2025-01-01'
  const toDate = opts.toDate ?? new Date().toISOString().slice(0, 10)

  const params = new URLSearchParams({
    q: query,
    forms: 'D',
    dateRange: 'custom',
    startdt: fromDate,
    enddt: toDate,
  })
  const url = `${BASE}?${params.toString()}`

  // EDGAR returns intermittent 500s under load; a couple of spaced retries
  // turns a transient failure back into a real number instead of a null.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': userAgent(), accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
        next: { revalidate: opts.revalidateSeconds ?? 86400 },
      })

      if (res.status >= 500) {
        await new Promise((r) => setTimeout(r, 700 * (attempt + 1)))
        continue
      }
      if (!res.ok) return null

      const json = (await res.json()) as {
        hits?: {
          total?: { value?: number }
          hits?: { _source?: { display_names?: string[] } }[]
        }
      }
      const count = json.hits?.total?.value
      if (typeof count !== 'number' || !Number.isFinite(count)) return null

      const examples = (json.hits?.hits ?? [])
        .map((h) => h._source?.display_names?.[0])
        .filter((n): n is string => Boolean(n))
        // Strip the "(CIK 0001234567)" suffix EDGAR appends to every name.
        .map((n) => n.replace(/\s*\(CIK\s+\d+\)\s*$/, '').trim())
        .slice(0, 4)

      return {
        query,
        kind,
        filingCount: count,
        capped: count >= EDGAR_CAP,
        fromDate,
        toDate,
        examples,
        // The human-facing EDGAR full-text search, so a reader can reproduce
        // the exact count rather than take our word for it.
        url:
          `https://www.sec.gov/edgar/search/#/q=${encodeURIComponent(query)}` +
          `&forms=D&dateRange=custom&startdt=${fromDate}&enddt=${toDate}`,
      }
    } catch {
      if (attempt === 2) return null
      await new Promise((r) => setTimeout(r, 700 * (attempt + 1)))
    }
  }
  return null
}
