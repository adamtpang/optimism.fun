/**
 * Problem → Our World in Data Grapher chart.
 *
 * Every slug below was checked on 2026-11-01 against
 * `/grapher/{slug}.csv?csvType=filtered&tab=chart&country=OWID_WRL&time=earliest..latest`
 * and `/grapher/{slug}.metadata.json`. Each returned a World (`OWID_WRL`)
 * series of at least two years and a citation. Charts that 404, return
 * HTTP 403 (non-redistributable), or have fewer than two World points are
 * not listed. The page shows "unavailable" for a mapped chart that later
 * fails, and nothing live for a problem that is absent here.
 *
 * Left unmapped, and why:
 * - biosecurity — no chart of biosecurity. COVID excess-death charts measure
 *   one pandemic, not the problem.
 * - loneliness — no World time series in the OWID catalog.
 * - cancer — incidence and death charts return HTTP 403.
 * - copd — chronic-respiratory death charts return HTTP 403. The solid-fuel
 *   cooking chart is not COPD and ends in 2010.
 *
 * Judgment calls that did map:
 * - infectious-disease uses malaria deaths, the same burden the demand feed
 *   already cites. The chart title stays OWID's, so it is not labeled as
 *   all infectious disease.
 * - diabetes uses the WHO adult prevalence series (raised fasting glucose,
 *   1980–2014). The IDF chart's filtered World series is a single year.
 * - hypertension uses the both-sexes death rate from hypertensive heart
 *   disease. The both-sexes prevalence chart is a single year (2019).
 * - housing-construction uses the urban-slum series, which is the global
 *   inadequate-housing count this problem's headline already cites.
 */

export type OwidChartMapping = {
  /** Grapher slug. https://ourworldindata.org/grapher/{slug} */
  slug: string
  /** Verified entity. World aggregate. */
  entityCode: 'OWID_WRL'
  /** Date the CSV and metadata were confirmed to return data. */
  verifiedOn: '2026-11-01'
}

export const owidCharts: Record<string, OwidChartMapping> = {
  'energy-abundance': {
    slug: 'per-capita-energy-use',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  pedagogy: {
    slug: 'learning-outcomes',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'infectious-disease': {
    slug: 'number-of-deaths-from-malaria-who',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'scientific-productivity': {
    slug: 'scientific-publications-per-million',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  longevity: {
    slug: 'life-expectancy',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'fertility-decline': {
    slug: 'children-born-per-woman',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'extreme-poverty': {
    slug: 'share-of-population-in-extreme-poverty',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'climate-change': {
    slug: 'annual-co2-emissions',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'neglected-tropical-diseases': {
    slug: 'interventions-ntds-sdgs',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'newborn-survival': {
    slug: 'neonatal-mortality-wdi',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  hypertension: {
    slug: 'death-rate-from-hypertensive-heart-disease-who-ghe-age-standardized',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'ai-datacenter-power': {
    slug: 'data-centers-share-electricity-demand',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'financial-infrastructure': {
    slug: 'account-at-financial-institution',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  diabetes: {
    slug: 'diabetes-prevalence-who-gho',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
  'housing-construction': {
    slug: 'share-of-urban-population-living-in-slums',
    entityCode: 'OWID_WRL',
    verifiedOn: '2026-11-01',
  },
}

export function owidChartFor(problemSlug: string): OwidChartMapping | null {
  return owidCharts[problemSlug] ?? null
}
