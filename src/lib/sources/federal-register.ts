/**
 * Federal Register API — regulatory attention as institutional demand.
 * Free, no API key, public domain. https://www.federalregister.gov/developers/api/v1
 *
 * The `policy` demand class means "institutional demand: legislation,
 * procurement, prizes". This is the legislation half: how hard the US state is
 * actively rulemaking on a topic, counted as published documents in a window.
 *
 * Why this is the right instrument for a cross-domain index: the Federal
 * Register regulates EVERYTHING, so unlike the SEC's taxonomy it can see the
 * social problems. Verified 2026-07-20 since 2025-01-01: loneliness 15 and
 * tutoring 25, where EDGAR's Form D returned exactly zero for both. That
 * breadth is what makes counts comparable problem-to-problem.
 *
 * Honest limits: US federal only (no states, no other countries), and a
 * document is regulatory ATTENTION, not necessarily money or good policy. A
 * rescission and a new programme both count as one document.
 */

export type FederalRegisterResult = {
  term: string
  /** Documents published in the window whose full text matches the term. */
  documentCount: number
  /** Of those, how many are final rules or proposed rules rather than notices. */
  rulemakingCount: number | null
  fromDate: string
  /** Titles from the first page of hits, for display and spot-checking. */
  examples: string[]
  /** Human-facing search URL, so any number can be reproduced in one click. */
  url: string
}

const BASE = 'https://www.federalregister.gov/api/v1/documents.json'

// Be a polite client: a page render fans out one call per problem, and every
// other fetcher in this repo learned the same lesson under concurrent load.
let queue: Promise<unknown> = Promise.resolve()
const GAP_MS = 120

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const result = queue.then(job)
  queue = result.catch(() => undefined).then(() => new Promise((r) => setTimeout(r, GAP_MS)))
  return result
}

export function fetchFederalRegisterCount(
  term: string,
  opts: { fromDate?: string; revalidateSeconds?: number } = {},
): Promise<FederalRegisterResult | null> {
  return enqueue(() => fetchNow(term, opts))
}

function buildUrl(term: string, fromDate: string, ruleTypesOnly: boolean): string {
  const p = new URLSearchParams()
  p.set('conditions[term]', term)
  p.set('conditions[publication_date][gte]', fromDate)
  p.set('per_page', '5')
  if (ruleTypesOnly) {
    // Final rules and proposed rules — actual rulemaking, not notices.
    p.append('conditions[type][]', 'RULE')
    p.append('conditions[type][]', 'PRORULE')
  }
  return `${BASE}?${p.toString()}`
}

async function fetchNow(
  term: string,
  opts: { fromDate?: string; revalidateSeconds?: number } = {},
): Promise<FederalRegisterResult | null> {
  const fromDate = opts.fromDate ?? '2025-01-01'
  const revalidate = opts.revalidateSeconds ?? 86400

  try {
    const res = await fetch(buildUrl(term, fromDate, false), {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate },
    })
    if (!res.ok) return null

    const json = (await res.json()) as {
      count?: number
      results?: { title?: string }[]
    }
    const count = json.count
    if (typeof count !== 'number' || !Number.isFinite(count)) return null

    // Second call is a nice-to-have: if it fails, the primary count still stands.
    let rulemakingCount: number | null = null
    try {
      const r2 = await fetch(buildUrl(term, fromDate, true), {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
        next: { revalidate },
      })
      if (r2.ok) {
        const j2 = (await r2.json()) as { count?: number }
        if (typeof j2.count === 'number') rulemakingCount = j2.count
      }
    } catch {
      rulemakingCount = null
    }

    const examples = (json.results ?? [])
      .map((d) => d.title)
      .filter((t): t is string => Boolean(t))
      .slice(0, 3)

    return {
      term,
      documentCount: count,
      rulemakingCount,
      fromDate,
      examples,
      url: `https://www.federalregister.gov/documents/search?conditions%5Bterm%5D=${encodeURIComponent(
        term,
      )}&conditions%5Bpublication_date%5D%5Bgte%5D=${fromDate}`,
    }
  } catch {
    return null
  }
}
