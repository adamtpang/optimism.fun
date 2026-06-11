/**
 * Capital flows — the PitchBook/NVCA-style layer: estimated annual capital
 * deployed at each problem, so demand (the index) can be compared against
 * where the money actually goes (allocation).
 *
 * Honesty rules (same covenant as the rest of the site):
 *   - Every number is an order-of-magnitude estimate from a NAMED public
 *     source, confidence-tagged, with an as-of date. No silent guessing.
 *   - `scope` states exactly what is counted and excluded, so each number is
 *     falsifiable and improvable by PR.
 *   - Flows overlap where the world overlaps (climate finance contains much of
 *     the clean-energy build-out). Scope notes flag this; allocation ratios
 *     treat each flow independently.
 *
 * v1 is hand-seeded from flagship public reports (IEA, CPI, OECD, IHME,
 * HolonIQ, Open Philanthropy, NIA). The live version of this file is the next
 * data feed: quarterly refresh from the same sources via the cron.
 */
import type { CapitalFlow } from './types'

export const capitalFlows: CapitalFlow[] = [
  {
    problemSlug: 'energy-abundance',
    usdPerYear: {
      value: 2_200_000_000_000,
      unit: 'USD/yr',
      source: 'IEA — World Energy Investment 2025 (clean energy investment)',
      sourceUrl: 'https://www.iea.org/reports/world-energy-investment-2025',
      confidence: 'med',
      asOf: '2025-06-01',
    },
    momentum: 'rising',
    scope:
      'Global clean-energy investment: renewables, grids, storage, nuclear, efficiency. Excludes fossil supply (~$1.1T/yr). Overlaps the mitigation slice of climate finance.',
    series: [
      { year: 2020, usd: 1_100_000_000_000 },
      { year: 2022, usd: 1_500_000_000_000 },
      { year: 2024, usd: 2_000_000_000_000 },
      { year: 2025, usd: 2_200_000_000_000 },
    ],
  },
  {
    problemSlug: 'climate-change',
    usdPerYear: {
      value: 1_500_000_000_000,
      unit: 'USD/yr',
      source: 'Climate Policy Initiative — Global Landscape of Climate Finance 2024',
      sourceUrl:
        'https://www.climatepolicyinitiative.org/publication/global-landscape-of-climate-finance-2024/',
      confidence: 'med',
      asOf: '2024-10-31',
    },
    momentum: 'rising',
    scope:
      'All tracked climate finance, public + private, mitigation + adaptation. Adaptation is only ~5% of it. Substantially overlaps clean-energy investment counted under energy abundance.',
    series: [
      { year: 2019, usd: 650_000_000_000 },
      { year: 2021, usd: 900_000_000_000 },
      { year: 2022, usd: 1_460_000_000_000 },
    ],
  },
  {
    problemSlug: 'extreme-poverty',
    usdPerYear: {
      value: 212_000_000_000,
      unit: 'USD/yr',
      source: 'OECD DAC — official development assistance (2024 preliminary)',
      sourceUrl: 'https://www.oecd.org/en/topics/sub-issues/oda-trends-and-statistics.html',
      confidence: 'med',
      asOf: '2025-04-15',
    },
    momentum: 'falling',
    scope:
      'Total ODA as the proxy for anti-poverty capital; only a slice is direct cash transfers or growth-oriented investment. 2025 donor budget cuts (US, UK, others) turned the trend down.',
    series: [
      { year: 2021, usd: 186_000_000_000 },
      { year: 2023, usd: 223_000_000_000 },
      { year: 2024, usd: 212_000_000_000 },
    ],
  },
  {
    problemSlug: 'infectious-disease',
    usdPerYear: {
      value: 25_000_000_000,
      unit: 'USD/yr',
      source: 'IHME — Financing Global Health (infectious-disease slice of DAH)',
      sourceUrl: 'https://www.healthdata.org/research-analysis/health-by-topic/financing-global-health',
      confidence: 'med',
      asOf: '2024-12-01',
    },
    momentum: 'falling',
    scope:
      'Development assistance for health aimed at HIV, TB, malaria and immunization (Global Fund, Gavi, PEPFAR, Gates). Excludes domestic health budgets. COVID-era peak has unwound and aid cuts bite.',
    series: [
      { year: 2019, usd: 22_000_000_000 },
      { year: 2021, usd: 35_000_000_000 },
      { year: 2023, usd: 25_000_000_000 },
    ],
  },
  {
    problemSlug: 'ai-safety',
    usdPerYear: {
      value: 600_000_000,
      unit: 'USD/yr',
      source: 'Open Philanthropy grants database + public AI-safety-institute budgets (estimate)',
      sourceUrl: 'https://www.openphilanthropy.org/grants/',
      confidence: 'low',
      asOf: '2025-12-01',
    },
    momentum: 'rising',
    scope:
      'Dedicated alignment/safety research: philanthropy, safety institutes, disclosed lab safety teams. Excludes undisclosed internal lab spend. For contrast, AI capability investment exceeds $200B/yr — a ~300:1 asymmetry.',
    series: [
      { year: 2020, usd: 80_000_000 },
      { year: 2022, usd: 300_000_000 },
      { year: 2024, usd: 600_000_000 },
    ],
  },
  {
    problemSlug: 'biosecurity',
    usdPerYear: {
      value: 4_000_000_000,
      unit: 'USD/yr',
      source: 'US ASPR/BARDA budgets + Open Philanthropy biosecurity grants (estimate)',
      sourceUrl: 'https://aspr.hhs.gov',
      confidence: 'low',
      asOf: '2025-10-01',
    },
    momentum: 'falling',
    scope:
      'Dedicated pandemic-preparedness R&D and philanthropy (BARDA, CEPI, Open Phil biosecurity). Excludes routine public-health systems. Post-COVID supplemental funding has wound down — preparedness is being defunded while risk grows.',
    series: [
      { year: 2021, usd: 15_000_000_000 },
      { year: 2023, usd: 6_000_000_000 },
      { year: 2025, usd: 4_000_000_000 },
    ],
  },
  {
    problemSlug: 'longevity',
    usdPerYear: {
      value: 8_000_000_000,
      unit: 'USD/yr',
      source: 'NIA budget (~$4.4B) + longevity-biotech venture funding (Longevity.Technology tracking)',
      sourceUrl: 'https://www.nia.nih.gov/about/budget',
      confidence: 'low',
      asOf: '2025-09-30',
    },
    momentum: 'flat',
    scope:
      'Aging-biology research plus dedicated longevity biotech (Altos, Retro, NewLimit and peers, annualized). Excludes general pharma R&D on age-related diseases (~$300B/yr industry-wide).',
  },
  {
    problemSlug: 'scientific-productivity',
    usdPerYear: {
      value: 400_000_000,
      unit: 'USD/yr',
      source: 'Metascience & FRO funder commitments — Convergent Research, Astera, Renaissance Philanthropy (public figures, estimate)',
      sourceUrl: 'https://www.convergentresearch.org',
      confidence: 'low',
      asOf: '2025-12-01',
    },
    momentum: 'rising',
    scope:
      'Capital aimed at improving how science itself works: FROs, metascience, research tooling, funding-mechanism experiments. Excludes ordinary global R&D (~$2.5T/yr) — the meta-layer steering that ocean is ~0.02% of it.',
    series: [
      { year: 2020, usd: 100_000_000 },
      { year: 2023, usd: 300_000_000 },
      { year: 2025, usd: 400_000_000 },
    ],
  },
  {
    problemSlug: 'pedagogy',
    usdPerYear: {
      value: 3_000_000_000,
      unit: 'USD/yr',
      source: 'HolonIQ — global edtech venture funding',
      sourceUrl: 'https://www.holoniq.com',
      confidence: 'med',
      asOf: '2025-01-31',
    },
    momentum: 'falling',
    scope:
      'Edtech venture funding worldwide. Excludes public education budgets (~$5T/yr, overwhelmingly status-quo delivery). Post-2021 crash: the boom peaked at ~$21B and innovation capital has fled.',
    series: [
      { year: 2021, usd: 20_800_000_000 },
      { year: 2023, usd: 6_000_000_000 },
      { year: 2024, usd: 3_000_000_000 },
    ],
  },
  {
    problemSlug: 'housing-construction',
    usdPerYear: {
      value: 10_000_000_000,
      unit: 'USD/yr',
      source: 'Construction & property tech venture funding (CREtech / industry trackers, estimate)',
      sourceUrl: 'https://www.cretech.com',
      confidence: 'low',
      asOf: '2025-01-31',
    },
    momentum: 'falling',
    scope:
      'Technology capital aimed at building cheaper and faster (contech, modular, robotics, proptech). Excludes ordinary real-estate development capital, which finances the status quo rather than changing its cost curve.',
    series: [
      { year: 2021, usd: 24_000_000_000 },
      { year: 2023, usd: 12_000_000_000 },
      { year: 2024, usd: 10_000_000_000 },
    ],
  },
  {
    problemSlug: 'fertility-decline',
    usdPerYear: {
      value: 1_000_000_000,
      unit: 'USD/yr',
      source: 'Fertility-tech / femtech venture tracking (PitchBook, FemHealth Insights; estimate)',
      sourceUrl: 'https://www.pitchbook.com',
      confidence: 'low',
      asOf: '2025-06-30',
    },
    momentum: 'flat',
    scope:
      'Fertility-tech VC (IVF access, egg freezing, reproductive health) plus nascent pronatal-policy philanthropy. Excludes national family-benefit transfers — large, but compensating the problem rather than solving its cost structure.',
  },
  {
    problemSlug: 'loneliness',
    usdPerYear: {
      value: 300_000_000,
      unit: 'USD/yr',
      source: 'Social-connection slice of mental-health venture funding (Crunchbase categories; estimate)',
      sourceUrl: 'https://www.crunchbase.com',
      confidence: 'low',
      asOf: '2025-06-30',
    },
    momentum: 'flat',
    scope:
      'Products and programs explicitly targeting social connection and community. Excludes the broader ~$3B/yr mental-health tech VC and excludes social media (capital optimizing engagement, arguably the problem itself).',
  },
]

export const getCapitalFlow = (problemSlug: string): CapitalFlow | undefined =>
  capitalFlows.find((c) => c.problemSlug === problemSlug)
