/**
 * POST /api/cron/media-ingest
 *
 * Hourly poll of the curated media sources (substacks via RSS, YouTube
 * channels via Atom feed, X handles via the polling worker).
 *
 * Pipeline (when fully wired):
 *   1. For each MediaSource with a feedUrl, fetch the RSS/Atom feed.
 *   2. Diff against what's already in DB (or in src/data/media.ts seed).
 *   3. For each new item, call Anthropic to auto-tag against problem +
 *      sector slugs from the existing taxonomy.
 *   4. Insert into media_items with status='draft' so editor reviews
 *      before items go live on /p/[slug] / /sector/[slug] / /media.
 *
 * Auth: Bearer CRON_SECRET.
 *
 * Today this route reports source health (which feeds are reachable) and
 * lists what the pipeline *would* do. Live ingest lands once Neon +
 * ANTHROPIC_API_KEY are wired and a media_items table is created
 * (mirrors problem_candidates pattern from #10).
 */
import { NextResponse } from 'next/server'
import { mediaSources } from '@/data/media-sources'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

function authorize(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, status: 500, error: 'CRON_SECRET not configured on this deployment' }
    }
    return { ok: true }
  }
  const header = req.headers.get('authorization') ?? ''
  const presented = header.startsWith('Bearer ') ? header.slice(7) : header
  if (presented !== expected) {
    return { ok: false, status: 401, error: 'invalid or missing CRON_SECRET' }
  }
  return { ok: true }
}

type FeedHealth = {
  sourceId: string
  feedUrl: string
  status: number
  ok: boolean
  itemCountEstimate: number | null
}

/** Tiny regex-only RSS/Atom item counter — no XML parser dep. Good enough
 * to verify a feed is reachable and not empty; the full ingestor swaps in
 * a real parser. */
function estimateItemCount(xml: string): number {
  const rss = (xml.match(/<item\b/gi) ?? []).length
  if (rss > 0) return rss
  const atom = (xml.match(/<entry\b/gi) ?? []).length
  return atom
}

async function probeFeed(sourceId: string, feedUrl: string): Promise<FeedHealth> {
  try {
    const res = await fetch(feedUrl, {
      headers: { 'user-agent': 'optimism.fun-media-ingest/0.1 (+https://optimism.fun)' },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      return { sourceId, feedUrl, status: res.status, ok: false, itemCountEstimate: null }
    }
    const body = await res.text()
    return {
      sourceId,
      feedUrl,
      status: res.status,
      ok: true,
      itemCountEstimate: estimateItemCount(body),
    }
  } catch {
    return { sourceId, feedUrl, status: 0, ok: false, itemCountEstimate: null }
  }
}

export async function GET(req: Request) {
  return POST(req)
}

export async function POST(req: Request) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  const anthropicOn = Boolean(process.env.ANTHROPIC_API_KEY)
  const dbOn = Boolean(process.env.DATABASE_URL)
  const fullyConfigured = anthropicOn && dbOn

  // Health-probe every source with a feed URL. Cheap, useful, no writes.
  const feedSources = mediaSources.filter((s) => s.feedUrl)
  const health = await Promise.all(
    feedSources.map((s) => probeFeed(s.id, s.feedUrl!)),
  )
  const reachable = health.filter((h) => h.ok).length

  const envStatus = {
    required: { CRON_SECRET: Boolean(process.env.CRON_SECRET) },
    optional: {
      ANTHROPIC_API_KEY: anthropicOn,
      DATABASE_URL: dbOn,
    },
    fullyConfigured,
  }

  const payload = {
    ok: true,
    ranAt: new Date().toISOString(),
    env: envStatus,
    result: {
      mode: fullyConfigured ? ('probe-only' as const) : ('stub' as const),
      sourcesPolled: feedSources.length,
      sourcesReachable: reachable,
      feedHealth: health,
      ingested: 0,
      notes: [
        'this route currently only probes feed health.',
        'live ingest lands once Neon + ANTHROPIC_API_KEY are wired and a media_items table is created (mirrors problem_candidates from #10).',
      ],
    },
    nextSteps: fullyConfigured
      ? [
          'Add a media_items table (mirror scripts/db/0001_problem_candidates.sql).',
          'Wire fetch -> parse -> Anthropic-tag -> upsert into the live pipeline.',
        ]
      : ([
          dbOn ? null : 'Wire DATABASE_URL (Neon) and create media_items table',
          anthropicOn ? null : 'Wire ANTHROPIC_API_KEY for auto-tagging',
        ].filter(Boolean) as string[]),
  }

  console.info(JSON.stringify({ event: 'cron:media-ingest', ...payload }))
  return NextResponse.json(payload)
}
