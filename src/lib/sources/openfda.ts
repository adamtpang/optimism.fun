/**
 * openFDA Drug Shortages client — queues as a demand signal.
 * Free, no API key at low volume. https://api.fda.gov/drug/shortages.json
 *
 * An active FDA drug shortage is a named, dated record of demand the market
 * is failing to clear. IMPORTANT: the dataset holds one record per package
 * presentation/manufacturer, so meta.results.total inflates ~6x — we count
 * DISTINCT drugs instead via the count endpoint (one bucket per generic name)
 * and read the dataset's own last_updated for freshness.
 */

export type FdaShortageResult = {
  /** Therapeutic category filter applied, or null for all current shortages. */
  category: string | null
  /** Number of DISTINCT drugs (generic names) currently in shortage. */
  currentCount: number
  /** openFDA's own dataset refresh date (meta.last_updated). */
  sourceLastUpdated: string | null
}

const BASE = 'https://api.fda.gov/drug/shortages.json'

export async function fetchFdaShortages(
  opts: { category?: string; revalidateSeconds?: number } = {},
): Promise<FdaShortageResult | null> {
  const search = opts.category
    ? `status:%22Current%22+AND+therapeutic_category:%22${encodeURIComponent(opts.category)}%22`
    : 'status:%22Current%22'
  // count= returns one bucket per distinct generic name (no meta.results.total).
  const url = `${BASE}?search=${search}&count=generic_name.exact&limit=1000`

  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: opts.revalidateSeconds ?? 86400 },
    })
    if (!res.ok) return null

    const json = (await res.json()) as {
      meta?: { last_updated?: string }
      results?: Array<{ term?: string; count?: number }>
    }
    if (!Array.isArray(json.results)) return null

    return {
      category: opts.category ?? null,
      currentCount: json.results.length,
      sourceLastUpdated: json.meta?.last_updated ?? null,
    }
  } catch {
    return null
  }
}
