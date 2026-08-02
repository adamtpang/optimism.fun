/**
 * GET/POST /api/cron/ingest-trends
 *
 * Runs the trend engine across every watched term and returns the scored board.
 * Idempotent: it reads external APIs and computes, so a re-run is always safe
 * and never double-counts.
 *
 * Persistence is optional and additive. Without DATABASE_URL the route still
 * returns a complete board; with it, each run also writes observations and
 * snapshots so the dashboard can chart history instead of only "now".
 *
 * Auth: Bearer CRON_SECRET, same contract as every other cron route here.
 */
import { NextResponse } from 'next/server'
import { computeTrendBoard } from '@/lib/trends/engine'
import { isDbConfigured } from '@/lib/db'

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

export async function GET(req: Request) {
  return POST(req)
}

export async function POST(req: Request) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  const startedAt = Date.now()
  const board = await computeTrendBoard()
  const durationMs = Date.now() - startedAt

  const rising = board.ranked.filter((t) => t.state === 'rising')

  const payload = {
    ok: true,
    ranAt: new Date().toISOString(),
    durationMs,
    persistence: isDbConfigured() ? 'available' : 'off (set DATABASE_URL for history)',
    attempted: board.attempted,
    resolved: board.resolved,
    rising: rising.length,
    top: board.ranked.slice(0, 10).map((t) => ({
      term: t.term,
      category: t.category,
      trendScore: t.trendScore,
      momentum: t.momentumScore,
      state: t.state,
      sources: t.sourceCount,
      current: t.currentTotal,
      prior: t.priorTotal,
    })),
    underpriced: board.underpriced.map((t) => ({
      term: t.term,
      momentum: t.momentumScore,
      velocity: t.velocityScore,
    })),
    nextSteps: isDbConfigured()
      ? ['Run scripts/db/0003_trends.sql once to enable snapshot history']
      : ['Wire DATABASE_URL, then run scripts/db/0003_trends.sql for trend history'],
  }

  console.info(
    JSON.stringify({
      event: 'cron:ingest-trends',
      resolved: board.resolved,
      attempted: board.attempted,
      rising: rising.length,
      durationMs,
    }),
  )

  return NextResponse.json(payload)
}
