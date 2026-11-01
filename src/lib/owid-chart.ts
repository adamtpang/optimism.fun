/**
 * Live OWID trend for a problem page.
 *
 * The chart response is cached for a day. Problem pages revalidate every few
 * minutes because the commitment board does; this cache keeps that refresh
 * from calling OWID again.
 */
import { unstable_cache } from 'next/cache'
import { owidChartFor } from '@/data/owid-charts'
import { fetchOwidChart, type OwidChart } from '@/lib/sources/owid'

const loadCachedChart = unstable_cache(
  async (slug: string, entityCode: string) => fetchOwidChart(slug, { entityCode, revalidateSeconds: 0 }),
  ['owid-chart'],
  { revalidate: 86400 },
)

export type ProblemOwidChart =
  | { state: 'unmapped' }
  | { state: 'unavailable' }
  | { state: 'ok'; chart: OwidChart }

export async function loadProblemOwidChart(problemSlug: string): Promise<ProblemOwidChart> {
  const mapping = owidChartFor(problemSlug)
  if (!mapping) return { state: 'unmapped' }
  const chart = await loadCachedChart(mapping.slug, mapping.entityCode)
  if (!chart || chart.series.length < 2) return { state: 'unavailable' }
  return { state: 'ok', chart }
}
