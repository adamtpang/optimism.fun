/**
 * GET /api/indicators
 *
 * Latest World Bank points from the frozen render snapshot. This route does
 * not read the database and does not call the World Bank at request time.
 */
import { NextResponse } from 'next/server'
import { allLiveIndicators } from '@/data/data-sources'
import { RENDER_SNAPSHOT_ID, renderSnapshot, wdiSeriesFromSnapshot } from '@/lib/render-snapshot'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

export function GET() {
  const observations = allLiveIndicators.flatMap((indicator) => {
    const row = wdiSeriesFromSnapshot(indicator.indicator)
    if (!row || row.status !== 'ok' || !row.latest) return []
    return [
      {
        problemSlug: indicator.problemSlug,
        indicator: indicator.indicator,
        countryIso3: indicator.countryIso3,
        year: row.latest.year,
        value: row.latest.value,
        sourceLastUpdated: RENDER_SNAPSHOT_ID,
        fetchedAt: row.retrievedAt ?? renderSnapshot.retrievedAt,
        label: indicator.label,
      },
    ]
  })
  const missing = allLiveIndicators
    .filter((indicator) => !observations.some((row) => row.indicator === indicator.indicator))
    .map((indicator) => indicator.indicator)

  return NextResponse.json(
    {
      ok: true,
      source: 'render-snapshot',
      snapshot: RENDER_SNAPSHOT_ID,
      dbConfigured: false,
      sourceLastUpdated: RENDER_SNAPSHOT_ID,
      dbFetchedAt: null,
      count: observations.length,
      missing,
      observations,
    },
    { headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
  )
}
