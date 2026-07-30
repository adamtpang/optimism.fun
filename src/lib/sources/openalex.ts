/**
 * OpenAlex client — research intensity across EVERY field.
 * Free, no API key. https://api.openalex.org
 *
 * Why this exists: the research demand class previously had only NIH RePORTER,
 * which is biomedical. That scored disease problems high and gave energy,
 * housing, and pedagogy a research signal of exactly zero — not because they
 * are unresearched, but because the one sensor could not see them. OpenAlex
 * indexes ~250M works across all disciplines, so counts are comparable
 * problem-to-problem, which is the only way a cross-domain index can be honest.
 *
 * We ask for a count only (`per_page=1`, read `meta.count`), so the response is
 * tiny regardless of how large the result set is.
 *
 * The `mailto` parameter is OpenAlex's requested courtesy — it puts callers in
 * the polite pool with better rate limits. Not authentication.
 */

export type OpenAlexResult = {
  search: string
  /** Works published since `fromDate` whose title or abstract matches. */
  workCount: number
  fromDate: string
  /** Deep link to the same query on openalex.org, for auditing. */
  url: string
}

const BASE = 'https://api.openalex.org/works'

function contact(): string {
  return process.env.OPENALEX_CONTACT ?? 'adamtpang@gmail.com'
}

export async function fetchOpenAlexCount(
  search: string,
  opts: { fromDate?: string; revalidateSeconds?: number } = {},
): Promise<OpenAlexResult | null> {
  // A trailing window rather than a calendar year, so the number does not
  // collapse every January.
  const fromDate = opts.fromDate ?? '2024-01-01'
  const filter = `title_and_abstract.search:${search},from_publication_date:${fromDate}`
  const url =
    `${BASE}?filter=${encodeURIComponent(filter)}` +
    `&per_page=1&mailto=${encodeURIComponent(contact())}`

  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: opts.revalidateSeconds ?? 86400 },
    })
    if (!res.ok) return null

    const json = (await res.json()) as { meta?: { count?: number } }
    const count = json.meta?.count
    if (typeof count !== 'number' || !Number.isFinite(count)) return null

    return {
      search,
      workCount: count,
      fromDate,
      url: `https://openalex.org/works?filter=${encodeURIComponent(filter)}`,
    }
  } catch {
    return null
  }
}
