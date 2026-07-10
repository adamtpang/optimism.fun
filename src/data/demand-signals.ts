/**
 * Registry mapping problems → live demand-signal feeds. The demand-detection
 * doctrine: a demand signal's credibility is proportional to the cost of
 * emitting it (words < clicks < time < wages < money < migration), so every
 * feed here is a COSTLY, mostly-ungameable signal from a statistical agency —
 * never a survey, never social exhaust.
 *
 * Three live classes today (each endpoint verified against the real API):
 *   burden   — WHO GHO OData + Our World in Data grapher (world aggregates)
 *   research — NIH RePORTER v2 funded-project counts (frontier intensity)
 *   queues   — openFDA current drug shortages (demand markets fail to clear)
 *
 * Sparse on purpose: a problem with no defensible feed gets nothing, and the
 * demand composite renormalizes (lib/demand.ts). Wrong-instrument mappings
 * (e.g. NIH for AI safety) are deliberately omitted — a biomedical funder is
 * not a truthful research-intensity proxy for a non-biomedical problem.
 */

export type BurdenFeed =
  | { kind: 'gho'; code: string; label: string; unit: string }
  | { kind: 'owid'; slug: string; extraParams?: string; label: string; unit: string }
  // World Bank WDI, via the existing lib/sources/worldbank.ts client. Used
  // where OWID publishes no OWID_WRL (World) aggregate for the metric.
  | { kind: 'wdi'; indicator: string; label: string; unit: string }

export type DemandSignalFeeds = {
  burden?: BurdenFeed
  /** NIH RePORTER advanced text search (research intensity). */
  nihSearch?: string
  /** openFDA therapeutic_category for current-shortage counts (queues). */
  fdaCategory?: string
}

export const demandSignalRegistry: Record<string, DemandSignalFeeds> = {
  'extreme-poverty': {
    burden: {
      kind: 'wdi',
      indicator: 'SI.POV.DDAY',
      label: 'Extreme poverty headcount ratio',
      unit: '% of population',
    },
  },
  'climate-change': {
    burden: {
      kind: 'owid',
      slug: 'annual-co2-emissions',
      label: 'Annual CO₂ emissions',
      unit: 't',
    },
    nihSearch: 'climate change health',
  },
  'fertility-decline': {
    burden: {
      kind: 'wdi',
      indicator: 'SP.DYN.TFRT.IN',
      label: 'Total fertility rate',
      unit: 'births/woman',
    },
    nihSearch: 'infertility',
  },
  pedagogy: {
    burden: {
      kind: 'wdi',
      indicator: 'SE.ADT.LITR.ZS',
      label: 'Adult literacy rate',
      unit: '%',
    },
  },
  longevity: {
    burden: {
      kind: 'gho',
      code: 'WHOSIS_000001',
      label: 'Life expectancy at birth',
      unit: 'years',
    },
    nihSearch: 'aging longevity',
    fdaCategory: 'Oncology',
  },
  'infectious-disease': {
    burden: {
      kind: 'gho',
      code: 'MALARIA_EST_DEATHS',
      label: 'Estimated malaria deaths',
      unit: 'deaths/yr',
    },
    nihSearch: 'infectious disease',
    fdaCategory: 'Anti-Infective',
  },
  biosecurity: {
    nihSearch: 'pandemic preparedness',
  },
  loneliness: {
    nihSearch: 'loneliness',
  },
}

/** Source metadata for the /demand page's "where the numbers come from" strip. */
export const demandSignalSources = [
  {
    id: 'who-gho',
    name: 'WHO Global Health Observatory',
    url: 'https://www.who.int/data/gho',
    feeds: 'burden',
    access: 'Open OData API, no key',
    cadence: 'rolling, per indicator',
  },
  {
    id: 'owid',
    name: 'Our World in Data',
    url: 'https://ourworldindata.org',
    feeds: 'burden',
    access: 'Open chart-data API, no key (CC BY 4.0)',
    cadence: 'continuous, tracks upstream sources',
  },
  {
    id: 'nih-reporter',
    name: 'NIH RePORTER',
    url: 'https://reporter.nih.gov',
    feeds: 'research',
    access: 'Open API, no key',
    cadence: 'weekly',
  },
  {
    id: 'openfda-shortages',
    name: 'openFDA Drug Shortages',
    url: 'https://open.fda.gov/apis/drug/drugshortages/',
    feeds: 'queues',
    access: 'Open API, no key',
    cadence: 'daily',
  },
  {
    id: 'worldbank-wdi',
    name: 'World Bank WDI',
    url: 'https://data.worldbank.org',
    feeds: 'scale series (problem pages)',
    access: 'Open API, no key',
    cadence: 'quarterly',
  },
] as const

/** Classes with a live feed wired today; the rest are seeded/awaiting feeds. */
export const LIVE_CLASSES = ['burden', 'research', 'queues'] as const
