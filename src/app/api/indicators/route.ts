/**
 * GET /api/indicators
 *
 * DB-backed read of the latest live indicator values (World Bank WDI today),
 * one per problem, plus the freshness signal (when our cron last wrote and the
 * source's own last-published date). Public, dynamic, cached for a minute.
 *
 * Returns an empty observation list (not an error) when DATABASE_URL is not
 * configured, so the front end can fall back to seed data cleanly.
 */
import { NextResponse } from 'next/server'
import { getLatestObservations, getLatestFetchedAt } from '@/lib/indicators'
import { allLiveIndicators, latestSourceUpdate } from '@/data/data-sources'
import { isDbConfigured } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const labelFor = new Map(allLiveIndicators.map((i) => [i.indicator, i.label]))

  const [observations, dbFetchedAt] = await Promise.all([
    getLatestObservations(),
    getLatestFetchedAt(),
  ])

  return NextResponse.json(
    {
      ok: true,
      source: 'worldbank-wdi',
      dbConfigured: isDbConfigured(),
      sourceLastUpdated: latestSourceUpdate(),
      dbFetchedAt,
      count: observations.length,
      observations: observations.map((o) => ({
        ...o,
        label: labelFor.get(o.indicator) ?? o.indicator,
      })),
    },
    { headers: { 'cache-control': 'public, max-age=60, s-maxage=60' } },
  )
}
