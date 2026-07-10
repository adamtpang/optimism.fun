/**
 * NIH RePORTER v2 client — research intensity as a demand signal.
 * Free, no API key. https://api.reporter.nih.gov/v2/projects/search
 *
 * We only need the project COUNT matching a keyword bundle for a fiscal year
 * (meta.total with limit=1), which is a cheap, honest proxy for how hard the
 * research frontier is pushing on a problem. The $-weighted version (summing
 * award_amount) needs pagination and lands with DB persistence later.
 *
 * Note: this is a POST API, so Next's data cache does not apply — the page's
 * own ISR revalidation is what bounds request frequency.
 */

export type NihResult = {
  searchText: string
  fiscalYear: number
  /** Number of funded NIH projects matching the search in that fiscal year. */
  projectCount: number
  /** Deep link to the same search on reporter.nih.gov, for auditing. */
  url: string | null
}

const BASE = 'https://api.reporter.nih.gov/v2/projects/search'

// RePORTER allows ~1 request/second per IP; concurrent POSTs get dropped.
// Serialize all calls through one polite queue (a page render fires several).
// Callers resolve as soon as their own job finishes; the gap only delays the
// NEXT job, and is enforced after failures too. Fetch timeouts (below) bound
// how long a hung request can hold the queue.
let queue: Promise<unknown> = Promise.resolve()
const GAP_MS = 400

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const result = queue.then(job)
  queue = result.catch(() => undefined).then(() => new Promise((r) => setTimeout(r, GAP_MS)))
  return result
}

/** Most recent complete US federal fiscal year (FY N ends Sep 30 of year N). */
function latestCompleteFiscalYear(now = new Date()): number {
  const y = now.getUTCFullYear()
  return now.getUTCMonth() + 1 >= 10 ? y : y - 1
}

export function fetchNihProjectCount(
  searchText: string,
  opts: { fiscalYear?: number } = {},
): Promise<NihResult | null> {
  return enqueue(() => fetchNihProjectCountNow(searchText, opts))
}

async function fetchNihProjectCountNow(
  searchText: string,
  opts: { fiscalYear?: number } = {},
): Promise<NihResult | null> {
  const fiscalYear = opts.fiscalYear ?? latestCompleteFiscalYear()

  try {
    const res = await fetch(BASE, {
      method: 'POST',
      signal: AbortSignal.timeout(8_000),
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        criteria: {
          advanced_text_search: {
            operator: 'and',
            search_field: 'projecttitle,abstracttext,terms',
            search_text: searchText,
          },
          fiscal_years: [fiscalYear],
        },
        limit: 1,
      }),
      cache: 'no-store',
    })
    if (!res.ok) return null

    const json = (await res.json()) as {
      meta?: { total?: number; properties?: { URL?: string } }
    }
    const total = json.meta?.total
    if (typeof total !== 'number') return null

    return {
      searchText,
      fiscalYear,
      projectCount: total,
      url: json.meta?.properties?.URL ?? null,
    }
  } catch {
    return null
  }
}
