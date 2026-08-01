/**
 * Registry mapping problems → live demand-signal feeds. The demand-detection
 * doctrine: a demand signal's credibility is proportional to the cost of
 * emitting it (words < clicks < time < wages < money < migration), so every
 * feed here is a COSTLY, mostly-ungameable signal from a statistical agency —
 * never a survey, never social exhaust.
 *
 * Three live classes today (each endpoint verified against the real API):
 *   burden   — WHO GHO OData, Our World in Data, World Bank WDI (world aggregates)
 *   research — OpenAlex work counts across every discipline, with NIH RePORTER
 *              funded-project counts as a biomedical corroboration
 *   queues   — openFDA current drug shortages (demand markets fail to clear)
 *
 * A problem with no defensible feed gets nothing and the composite renormalizes
 * (lib/demand.ts) — never a silent zero. The instrument has to be truthful for
 * the domain: NIH alone scored disease problems high and gave energy, housing,
 * and pedagogy a research signal of zero, which measured the sensor rather than
 * the world. OpenAlex is the cross-domain fix, so every problem carries one.
 */

export type BurdenFeed =
  | { kind: 'gho'; code: string; label: string; unit: string }
  | { kind: 'owid'; slug: string; extraParams?: string; label: string; unit: string }
  // World Bank WDI, via the existing lib/sources/worldbank.ts client. Used
  // where OWID publishes no OWID_WRL (World) aggregate for the metric.
  | { kind: 'wdi'; indicator: string; label: string; unit: string }

export type DemandSignalFeeds = {
  burden?: BurdenFeed
  /**
   * OpenAlex title/abstract search — the PRIMARY research-intensity signal,
   * because it covers every discipline and so is comparable across problems.
   * Every problem should have one.
   */
  openAlexSearch?: string
  /**
   * NIH RePORTER advanced text search. Biomedical only, so it is a corroborating
   * dollar-weighted signal rather than the cross-domain one; used as a fallback
   * where OpenAlex is absent.
   */
  nihSearch?: string
  /** openFDA therapeutic_category for current-shortage counts (queues). */
  fdaCategory?: string
  /**
   * SEC EDGAR Form D query — live US private capital formation, attached to the
   * `capital` class as an OBSERVATION, never as its strength.
   *
   * Deliberately sparse. Verified 2026-07-20 over 2025-01-01 onward, the SEC's
   * taxonomy simply cannot see most social problems: biosecurity 0, loneliness
   * 0, tutoring 0, metascience 0, poverty 1. Those get no mapping at all,
   * because a zero here would measure the instrument rather than the world —
   * exactly the bias that NIH-only research had before OpenAlex.
   */
  edgar?: { q: string; kind: 'industry-group' | 'keyword' }
  /**
   * Federal Register search term — the `policy` class. Regulatory attention as
   * institutional demand. Covers all 11 problems, because the Federal Register
   * regulates everything, which is exactly what EDGAR's taxonomy could not do.
   */
  federalRegisterTerm?: string
  /**
   * USAspending keyword — PUBLIC capital (federal grants + contracts), the
   * counterpart to EDGAR's private raises in the `capital` class. Covers the
   * 6 problems EDGAR cannot see.
   */
  usaSpendingTerm?: string
}

export const demandSignalRegistry: Record<string, DemandSignalFeeds> = {
  'extreme-poverty': {
    federalRegisterTerm: 'poverty', // FR 194
    usaSpendingTerm: 'poverty', // US 5,185 awards
    openAlexSearch: 'extreme poverty', // 3,344
    burden: {
      kind: 'wdi',
      indicator: 'SI.POV.DDAY',
      label: 'Extreme poverty headcount ratio',
      unit: '% of population',
    },
  },
  'climate-change': {
    federalRegisterTerm: 'climate adaptation', // FR 31
    usaSpendingTerm: 'climate adaptation', // US 323 awards
    openAlexSearch: 'climate adaptation', // 62,972
    edgar: { q: 'climate', kind: 'keyword' }, // 180 filings
    burden: {
      kind: 'owid',
      slug: 'annual-co2-emissions',
      label: 'Annual CO₂ emissions',
      unit: 't',
    },
    nihSearch: 'climate change health',
  },
  'fertility-decline': {
    federalRegisterTerm: 'fertility', // FR 43
    usaSpendingTerm: 'fertility', // US 673 awards
    openAlexSearch: 'fertility decline', // 8,092
    edgar: { q: 'fertility', kind: 'keyword' }, // 5 filings
    burden: {
      kind: 'wdi',
      indicator: 'SP.DYN.TFRT.IN',
      label: 'Total fertility rate',
      unit: 'births/woman',
    },
    nihSearch: 'infertility',
  },
  pedagogy: {
    federalRegisterTerm: 'tutoring', // FR 25
    usaSpendingTerm: 'tutoring', // US 571 awards
    openAlexSearch: 'tutoring', // 25,046 — 'pedagogy' alone is 237k, too broad
    burden: {
      kind: 'wdi',
      indicator: 'SE.ADT.LITR.ZS',
      label: 'Adult literacy rate',
      unit: '%',
    },
  },
  longevity: {
    federalRegisterTerm: 'longevity', // FR 63 — 'aging' returns 1,847 and matches
    //                                  "aging infrastructure"/"aging aircraft", not the problem
    usaSpendingTerm: 'aging research', // US 374 awards
    openAlexSearch: 'longevity|healthspan', // 45,631
    edgar: { q: 'longevity', kind: 'keyword' }, // 31 filings
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
    federalRegisterTerm: 'tuberculosis', // FR 44
    usaSpendingTerm: 'malaria', // US 1,299 awards
    openAlexSearch: 'malaria|tuberculosis', // 85,516
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
    federalRegisterTerm: 'biosecurity', // FR 33
    usaSpendingTerm: 'pandemic preparedness', // US 132 awards
    openAlexSearch: 'biosecurity', // 7,530
    nihSearch: 'pandemic preparedness',
  },
  loneliness: {
    federalRegisterTerm: 'loneliness', // FR 15
    usaSpendingTerm: 'loneliness', // US 193 awards
    openAlexSearch: 'loneliness', // 26,374
    nihSearch: 'loneliness',
  },
  'energy-abundance': {
    federalRegisterTerm: 'geothermal', // FR 114
    usaSpendingTerm: 'geothermal', // US 241 awards
    openAlexSearch: 'decarbonization', // 31,890 — 'energy transition' at 193k is too broad
    edgar: { q: '"Other Energy"', kind: 'industry-group' }, // 389 filings
  },
  'housing-construction': {
    federalRegisterTerm: 'housing affordability', // FR 316
    usaSpendingTerm: 'housing affordability', // US 23 awards
    openAlexSearch: 'housing affordability', // 9,050
    edgar: { q: '"Construction"', kind: 'industry-group' }, // 317 filings
  },
  'scientific-productivity': {
    federalRegisterTerm: 'scientific integrity', // FR 258
    usaSpendingTerm: 'research infrastructure', // US 995 awards
    openAlexSearch: 'metascience', // 378 — genuinely a tiny field, which is the signal
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
    id: 'openalex',
    name: 'OpenAlex',
    url: 'https://openalex.org',
    feeds: 'research (all disciplines)',
    access: 'Open API, no key (CC0)',
    cadence: 'continuous',
  },
  {
    id: 'nih-reporter',
    name: 'NIH RePORTER',
    url: 'https://reporter.nih.gov',
    feeds: 'research (biomedical $)',
    access: 'Open API, no key',
    cadence: 'weekly',
  },
  {
    id: 'sec-edgar',
    name: 'SEC EDGAR · Form D',
    url: 'https://www.sec.gov/edgar/search/',
    feeds: 'capital (new US private raises)',
    access: 'Open full-text search, no key (public domain)',
    cadence: 'continuous, ~15 days after first sale',
  },
  {
    id: 'federal-register',
    name: 'Federal Register',
    url: 'https://www.federalregister.gov',
    feeds: 'policy (US rulemaking)',
    access: 'Open API, no key (public domain)',
    cadence: 'daily',
  },
  {
    id: 'usaspending',
    name: 'USAspending',
    url: 'https://www.usaspending.gov',
    feeds: 'capital (federal awards)',
    access: 'Open API, no key (public domain)',
    cadence: 'daily',
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
export const LIVE_CLASSES = ['burden', 'research', 'queues', 'capital', 'policy'] as const
