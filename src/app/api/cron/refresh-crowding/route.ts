/**
 * GET/POST /api/cron/refresh-crowding
 *
 * Refreshes the per-quest `crowding` prior in the startup power rankings with
 * a live Exa competitor count. Editorial priors bootstrap the ranking; this is
 * the path that turns them into real numbers ("N companies are building this").
 *
 * Unscheduled (Hobby cron limit) — run on demand. Stub-safe: returns the
 * would-be targets with mode:"stub" when EXA_API_KEY is unset. Persistence of
 * the sourced crowding back into the ranking lands with the signals table.
 *
 * Auth: Bearer CRON_SECRET, same contract as the other cron routes.
 */
import { NextResponse } from 'next/server'
import { requestsForStartups } from '@/data/rfs'
import { isExaConfigured, sourceQuestCrowding } from '@/lib/sources/exa'

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

  const quests = requestsForStartups.map((q) => ({ slug: q.slug, title: q.title, shape: q.shape }))
  const exaOn = isExaConfigured()
  const signals = exaOn ? await sourceQuestCrowding(quests) : []

  const payload = {
    ok: true,
    ranAt: new Date().toISOString(),
    mode: exaOn ? 'live' : 'stub',
    questsConsidered: quests.length,
    sourced: signals.length,
    signals,
    nextSteps: exaOn
      ? ['Persist sourced crowding to override editorial priors in the ranking']
      : ['Wire EXA_API_KEY to refresh editorial crowding priors into live competitor counts'],
  }

  console.info(
    JSON.stringify({ event: 'cron:refresh-crowding', mode: payload.mode, sourced: signals.length }),
  )

  return NextResponse.json(payload)
}
