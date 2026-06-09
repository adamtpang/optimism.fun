/**
 * GET/POST /api/cron/refresh-indicators
 *
 * Pulls the live World Bank indicators mapped in src/data/data-sources.ts and
 * returns the freshest series for each, plus the source's own last-updated date
 * and our fetchedAt timestamp. Triggered by Vercel Cron (see vercel.json).
 *
 * Auth: Bearer CRON_SECRET (same pattern as the other crons). In dev with no
 * secret set, it runs open so you can hit it locally.
 *
 * Degrades gracefully: the World Bank client returns null for any indicator it
 * cannot fetch, so a bad code or a network blip skips that one rather than
 * failing the whole run. Persistence to Neon is best-effort and a no-op when
 * the DB is not configured; the live values it returns are always real.
 */
import { NextResponse } from 'next/server'
import { fetchWdi } from '@/lib/sources/worldbank'
import { allLiveIndicators } from '@/data/data-sources'
import { isDbConfigured } from '@/lib/db'
import { persistSeries } from '@/lib/indicators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

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

async function run(req: Request) {
  const auth = authorize(req)
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })

  const fetchedAt = new Date().toISOString()
  const dbOn = isDbConfigured()

  const results = await Promise.all(
    allLiveIndicators.map(async (ind) => {
      const wdi = await fetchWdi(ind.countryIso3, ind.indicator, { revalidateSeconds: 0 })

      // Persist the full series (one row per year, upserted) when the DB is on.
      // Best-effort: a write failure for one indicator must not fail the run.
      let written = 0
      if (dbOn && wdi) {
        try {
          written = await persistSeries(
            {
              sourceId: ind.sourceId,
              indicator: ind.indicator,
              problemSlug: ind.problemSlug,
              countryIso3: ind.countryIso3,
              sourceLastUpdated: wdi.sourceLastUpdated,
            },
            wdi,
          )
        } catch {
          written = 0
        }
      }

      return {
        problemSlug: ind.problemSlug,
        indicator: ind.indicator,
        label: ind.label,
        sourceId: ind.sourceId,
        ok: Boolean(wdi),
        latest: wdi?.latest ?? null,
        sourceLastUpdated: wdi?.sourceLastUpdated ?? null,
        points: wdi?.series.length ?? 0,
        rowsWritten: written,
      }
    }),
  )

  const fetched = results.filter((r) => r.ok).length
  const rowsWritten = results.reduce((sum, r) => sum + r.rowsWritten, 0)
  return NextResponse.json({
    ok: true,
    fetchedAt,
    source: 'worldbank-wdi',
    fetched,
    total: results.length,
    persisted: dbOn && rowsWritten > 0,
    rowsWritten,
    dbConfigured: dbOn,
    results,
  })
}

export async function GET(req: Request) {
  return run(req)
}
export async function POST(req: Request) {
  return run(req)
}
