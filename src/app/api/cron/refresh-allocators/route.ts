/**
 * GET/POST /api/cron/refresh-allocators
 *
 * Profiles every allocator in data/ecosystem.ts with a live Exa run: typical
 * cheque size, what they say they are funding right now, whether applications
 * are open, the next deadline, and the realistic contact path.
 *
 * Static files go stale on exactly these fields, which is why they are sourced
 * rather than hand-written. Output doubles as a fundraising target list.
 *
 * Unscheduled (Hobby cron limit) — run on demand. Stub-safe: returns the
 * targets with mode:"stub" when EXA_API_KEY is unset.
 *
 * Auth: Bearer CRON_SECRET, same contract as the other cron routes.
 */
import { NextResponse } from 'next/server'
import { ecosystem } from '@/data/ecosystem'
import { isExaConfigured, sourceAllocatorProfiles } from '@/lib/sources/exa'

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

  const targets = ecosystem.map((e) => ({ slug: e.slug, name: e.name, url: e.url }))
  const exaOn = isExaConfigured()
  const profiles = exaOn ? await sourceAllocatorProfiles(targets) : []

  const openNow = profiles.filter((p) => p.applicationsOpen === true)

  const payload = {
    ok: true,
    ranAt: new Date().toISOString(),
    mode: exaOn ? 'live' : 'stub',
    allocatorsConsidered: targets.length,
    profiled: profiles.length,
    applicationsOpenNow: openNow.map((p) => p.slug),
    profiles,
    nextSteps: exaOn
      ? ['Surface cheque size, open status, and contact path on /ecosystem']
      : ['Wire EXA_API_KEY to profile allocators live (cheque size, priorities, deadlines)'],
  }

  console.info(
    JSON.stringify({
      event: 'cron:refresh-allocators',
      mode: payload.mode,
      profiled: profiles.length,
    }),
  )

  return NextResponse.json(payload)
}
