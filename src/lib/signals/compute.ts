import { fetchWdi } from '@/lib/sources/worldbank'
import { SIGNAL_CATEGORIES, type SignalCategory } from './categories'

export type ScoredSignal = {
  category: SignalCategory
  baseline: { year: number; value: number }
  latest: { year: number; value: number }
  /** Total % growth, baseline -> latest. Shown for context, never sorted on. */
  totalGrowthPct: number
  /** Annualized (CAGR) growth rate. This is what ranks the table. */
  cagrPct: number
  years: number
  sourceLastUpdated: string | null
}

/**
 * Growth over the longest available window per indicator (up to 25y, capped
 * by whatever World Bank actually has null-free). Baseline is the earliest
 * point in that window, not a fixed year -- indicators have different
 * histories and different reporting lags, so a fixed baseline year would
 * silently drop indicators that simply report late (renewable energy lags
 * ~5 years behind internet adoption, for instance).
 *
 * Ranked by CAGR (annualized), not total window growth. A first pass ranked
 * on total growth and put mobile subscriptions on top at +4361% over 29
 * years -- true, but only because its window happened to be 9-12 years
 * longer than every other indicator's, not because it's actually the
 * fastest-compounding category. Total growth over unequal windows isn't
 * comparable; CAGR is the standard fix.
 */
export async function computeSignals(): Promise<ScoredSignal[]> {
  const results = await Promise.all(
    SIGNAL_CATEGORIES.map(async (category) => {
      const wdi = await fetchWdi('WLD', category.indicator, { mrv: 25 })
      if (!wdi || wdi.series.length < 2) return null

      const baseline = wdi.series[0]
      const latest = wdi.series[wdi.series.length - 1]
      const years = latest.year - baseline.year
      if (years <= 0 || baseline.value <= 0) return null

      const totalGrowthPct = ((latest.value - baseline.value) / baseline.value) * 100
      const cagrPct = (Math.pow(latest.value / baseline.value, 1 / years) - 1) * 100

      const scored: ScoredSignal = {
        category,
        baseline,
        latest,
        totalGrowthPct,
        cagrPct,
        years,
        sourceLastUpdated: wdi.sourceLastUpdated,
      }
      return scored
    }),
  )

  return results
    .filter((r): r is ScoredSignal => r !== null)
    .sort((a, b) => b.cagrPct - a.cagrPct)
}
