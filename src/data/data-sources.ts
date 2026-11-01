/**
 * Registry of live data sources feeding the index. Two jobs:
 *   1. Tell the refresh cron which indicators to pull for which problems.
 *   2. Power the "data last updated" freshness display on the site.
 *
 * The World Bank last-published date is not stored here. It is read from
 * `meta.lastupdated` at request time (`fetchWdiLastUpdated`).
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
  indicators: LiveIndicator[]
}

export const liveSources: LiveSource[] = [
  {
    id: 'worldbank-wdi',
    name: 'World Bank · World Development Indicators',
    url: 'https://data.worldbank.org',
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

