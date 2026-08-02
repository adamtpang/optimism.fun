/**
 * GitHub repository search — building velocity.
 * Free, no API key required for search, though the unauthenticated rate limit
 * is only ~10 requests/minute. https://docs.github.com/en/rest/search
 *
 * Measures what developers are actually BUILDING rather than merely discussing,
 * which is a costlier signal than a comment and therefore a better one. Repo
 * creation in a window, against the preceding window of equal length.
 *
 * ⚠️ Known weakness, verified 2026-08-02: GitHub's search matches loosely
 * across name, description and README, so a query like "biosecurity" returns
 * repos only tangentially related (94 hits, top results about refusal
 * benchmarks and livestock management). Treat this as a directional signal and
 * never as a precise count — it is weighted below Wikipedia in the scorer for
 * exactly this reason.
 *
 * Set GITHUB_TOKEN to raise the rate limit from ~10/min to 30/min. Optional;
 * everything works without it.
 */
import type { TrendEvidence, TrendObservation } from '@/lib/trends/types'

const BASE = 'https://api.github.com/search/repositories'

// The unauthenticated search limit is low, so serialise with a real gap.
let queue: Promise<unknown> = Promise.resolve()
const GAP_MS = 2200

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const result = queue.then(job)
  queue = result.catch(() => undefined).then(() => new Promise((r) => setTimeout(r, GAP_MS)))
  return result
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': process.env.SEC_USER_AGENT ?? 'optimism.fun research adamtpang@gmail.com',
  }
  const token = process.env.GITHUB_TOKEN
  if (token) h.authorization = `Bearer ${token}`
  return h
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10)
}

type Repo = {
  full_name?: string
  html_url?: string
  stargazers_count?: number
  created_at?: string
}

async function countCreated(
  term: string,
  fromIso: string,
  toIso: string | null,
  withItems: boolean,
): Promise<{ count: number; items: Repo[] } | null> {
  const range = toIso ? `created:${fromIso}..${toIso}` : `created:>${fromIso}`
  const q = `${term} ${range}`
  const url = `${BASE}?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${
    withItems ? 3 : 1
  }`
  try {
    const res = await fetch(url, {
      headers: headers(),
      signal: AbortSignal.timeout(12_000),
      next: { revalidate: 3600 },
    })
    // 403 here is the rate limit, not an auth failure. Degrade rather than throw.
    if (!res.ok) return null
    const json = (await res.json()) as { total_count?: number; items?: Repo[] }
    if (typeof json.total_count !== 'number') return null
    return { count: json.total_count, items: json.items ?? [] }
  } catch {
    return null
  }
}

export function fetchGithubTrend(
  term: string,
  opts: { windowDays?: number } = {},
): Promise<TrendObservation | null> {
  return enqueue(() => fetchNow(term, opts))
}

async function fetchNow(
  term: string,
  opts: { windowDays?: number } = {},
): Promise<TrendObservation | null> {
  const windowDays = opts.windowDays ?? 30
  const currentFrom = isoDaysAgo(windowDays)
  const priorFrom = isoDaysAgo(windowDays * 2)

  const current = await countCreated(term, currentFrom, null, true)
  if (!current) return null
  const prior = await countCreated(term, priorFrom, currentFrom, false)
  if (!prior) return null

  const evidence: TrendEvidence[] = current.items
    .map((r) => ({
      title: r.full_name ?? '(unnamed repo)',
      url: r.html_url ?? 'https://github.com',
      engagement: r.stargazers_count,
      at: r.created_at?.slice(0, 10),
    }))
    .slice(0, 3)

  return {
    source: 'github',
    term,
    current: current.count,
    prior: prior.count,
    windowDays,
    evidence,
    url: `https://github.com/search?q=${encodeURIComponent(term)}&type=repositories&s=stars`,
  }
}
