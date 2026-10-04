/**
 * Where the world's money is moving, and what got expensive or cheap.
 *
 * A price is a message about scarcity: it rises when supply cannot keep up
 * and falls when supply floods in. Each row keeps its own date and source.
 * `confidence` is about the source, not the trend: company guidance and IEA
 * or WHO data are high or medium; market-research forecasts are low.
 *
 * Gathered 2026-10-04. Update in place; do not let a stale row stand as now.
 */

export type Confidence = 'high' | 'medium' | 'low'

export type Move = {
  label: string
  value: string
  detail: string
  confidence: Confidence
  asOf: string
  source: { label: string; url: string }
  /** The problem on the index this move bears on, when there is one. */
  problemSlug?: string
}

export const capitalMoves: Move[] = [
  {
    label: 'AI infrastructure',
    value: '~$725B in 2026',
    detail: 'Amazon, Microsoft, Alphabet and Meta combined capex plans, up 77% from $410B. Banks model over $1T in 2027.',
    confidence: 'medium',
    asOf: '2026',
    source: { label: 'Company guidance via Yahoo Finance', url: 'https://finance.yahoo.com/sectors/technology/articles/hyperscalers-hit-700-billion-2026-111243744.html' },
    problemSlug: 'ai-datacenter-power',
  },
  {
    label: 'Energy investment',
    value: '$3.3T in 2025',
    detail: '$2.2T into clean technology, grids and storage; $1.1T into oil, gas and coal.',
    confidence: 'high',
    asOf: '2025',
    source: { label: 'IEA World Energy Investment 2025', url: 'https://www.iea.org/news/global-energy-investment-set-to-rise-to-3-3-trillion-in-2025-amid-economic-uncertainty-and-energy-security-concerns' },
    problemSlug: 'energy-abundance',
  },
  {
    label: 'Data center electricity',
    value: '+17% in 2025',
    detail: 'Five times the growth of all electricity demand. IEA expects it to double by 2030.',
    confidence: 'high',
    asOf: '2025',
    source: { label: 'IEA via Bloomberg Law', url: 'https://news.bloomberglaw.com/environment-and-energy/global-2025-power-demand-rose-as-ev-data-centers-grew-iea-says' },
    problemSlug: 'ai-datacenter-power',
  },
  {
    label: 'Health spending',
    value: '$9.8T in 2022',
    detail: 'About 10% of world GDP, the largest single category of spending humanity has.',
    confidence: 'high',
    asOf: '2022',
    source: { label: 'WHO global health expenditure', url: 'https://www.who.int/news/item/11-12-2023-who-calls-on-governments-for-urgent-action-to-invest-in-universal-health-coverage' },
  },
  {
    label: 'GLP-1 drugs',
    value: '~$63B in 2025',
    detail: 'Forecasts range from 7% to 17% a year depending on the firm. Treat as a direction, not a number.',
    confidence: 'low',
    asOf: '2025',
    source: { label: 'DelveInsight market estimate', url: 'https://www.delveinsight.com/report-store/glp-1-therapies-market' },
    problemSlug: 'diabetes',
  },
]

export const gotExpensive: Move[] = [
  {
    label: 'Memory chips (DRAM)',
    value: '+171% y/y',
    detail: 'A 32GB kit went from about $100 to $300 to $500. AI servers absorb memory faster than factories can expand.',
    confidence: 'medium',
    asOf: 'Q3 2025 to Q1 2026',
    source: { label: 'Guru3D', url: 'https://www.guru3d.com/story/dram-prices-surge-roughly-as-global-memory-shortage-deepens/' },
    problemSlug: 'ai-datacenter-power',
  },
  {
    label: 'Frontier AI models',
    value: '+36% y/y',
    detail: 'The best models got pricier over the year to July 2026, while mid-tier models fell.',
    confidence: 'medium',
    asOf: 'July 2026',
    source: { label: 'BenchLM Token Price Index', url: 'https://www.benchlm.ai/token-price-index' },
  },
  {
    label: 'Gold',
    value: '$5,502 peak',
    detail: 'Record in January 2026, down about 27% by June, around $4,300 to $4,600 since.',
    confidence: 'medium',
    asOf: 'Sep 2026',
    source: { label: 'SD Bullion', url: 'https://sdbullion.com/gold-prices-2026' },
  },
]

export const gotCheap: Move[] = [
  {
    label: 'AI output',
    value: '-88% since 2023',
    detail: 'Frontier token prices versus March 2023. Mid-tier models fell 36% in the last year alone.',
    confidence: 'medium',
    asOf: 'July 2026',
    source: { label: 'BenchLM Token Price Index', url: 'https://www.benchlm.ai/token-price-index' },
  },
  {
    label: 'Solar panels',
    value: '$0.09 to $0.11/W',
    detail: 'Chinese modules near historic lows, edging up after China moved to end the price war.',
    confidence: 'medium',
    asOf: 'Apr 2026',
    source: { label: 'GreenTechLead', url: 'https://greentechlead.com/solar/solar-panel-prices-2026-china-at-0-11-w-vs-india-at-0-14-0-25-w-and-us-at-0-30-w-55213' },
    problemSlug: 'energy-abundance',
  },
  {
    label: 'Eggs',
    value: '$6.23 to $2.50',
    detail: 'US dozen, March 2025 to February 2026, as the bird-flu shortage ended.',
    confidence: 'medium',
    asOf: 'Feb 2026',
    source: { label: 'Yahoo Finance', url: 'https://finance.yahoo.com/markets/commodities/articles/egg-stra-special-easter-egg-200052110.html' },
  },
  {
    label: 'Cocoa',
    value: '-70% from peak',
    detail: 'Down from late-2024 highs, volatile again on a weak Ghana crop forecast.',
    confidence: 'low',
    asOf: 'Aug 2026',
    source: { label: 'Procurement Resource', url: 'https://pr.procurementresource.com/resource-center/cocoa-price-trends' },
  },
]
