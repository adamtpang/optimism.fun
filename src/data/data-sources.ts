/**
 * Registry of live data sources feeding the index. Two jobs:
 *   1. Tell the refresh cron which indicators to pull for which problems.
 *   2. Power the "data last updated" freshness display on the site.
 *
 * `lastUpdated` is each source's own published refresh date (from its API
 * metadata), so the freshness we show is the source's truth, not ours.
 */

export type LiveIndicator = {
  /** World Bank WDI indicator code. */
  indicator: string
  /** Which problem's scale series this refreshes. */
  problemSlug: string
  /** Human label for the indicator. */
  label: string
  /** ISO3 country/aggregate code; WLD = world. */
  countryIso3: string
}

export type LiveSource = {
  id: string
  name: string
  url: string
  /** The source's own last-published date (e.g. World Bank meta.lastupdated). */
  lastUpdated: string
  indicators: LiveIndicator[]
}

export const liveSources: LiveSource[] = [
  {
    id: 'worldbank-wdi',
    name: 'World Bank · World Development Indicators',
    url: 'https://data.worldbank.org',
    // World Bank meta.lastupdated, verified live via the API.
    lastUpdated: '2026-04-08',
    indicators: [
      {
        indicator: 'SI.POV.DDAY',
        problemSlug: 'extreme-poverty',
        label: 'Extreme poverty headcount ratio ($2.15/day, % of population)',
        countryIso3: 'WLD',
      },
      {
        indicator: 'EG.ELC.ACCS.ZS',
        problemSlug: 'energy-abundance',
        label: 'Access to electricity (% of population)',
        countryIso3: 'WLD',
      },
      {
        indicator: 'SP.DYN.LE00.IN',
        problemSlug: 'longevity',
        label: 'Life expectancy at birth (years)',
        countryIso3: 'WLD',
      },
      {
        indicator: 'SP.DYN.TFRT.IN',
        problemSlug: 'fertility-decline',
        label: 'Total fertility rate (births per woman)',
        countryIso3: 'WLD',
      },
    ],
  },
]

/** All indicator fetch requests, flattened, for the refresh cron. */
export const allLiveIndicators = liveSources.flatMap((s) =>
  s.indicators.map((i) => ({ ...i, sourceId: s.id })),
)

/** The most recent source-published date across all live sources (for the badge). */
export function latestSourceUpdate(): string {
  return liveSources
    .map((s) => s.lastUpdated)
    .sort()
    .reverse()[0]
}
