// Progress milestones: the historical record of human problem-solving.
// Sources are public, citable, and prefer Our World in Data + UN + World
// Bank long-run series. Numbers are best-available estimates rounded for
// readability; precise series live at the linked sources.

import type { ProgressMilestone } from './types'

const TODAY = '2026-04-24'

export const progress: ProgressMilestone[] = [
  {
    slug: 'extreme-poverty',
    name: 'Extreme poverty rate',
    description:
      'Share of humans living on less than ~$2.15/day (2017 PPP). For most of human history, the answer was "almost everyone." Then, around 1820, the curve broke.',
    unit: 'share of humans',
    format: 'percent',
    baseline: { year: 1820, value: 0.9 },
    latest: { year: 2022, value: 0.085 },
    direction: 'down',
    source: 'Our World in Data — Roser & Ortiz-Ospina (World Bank)',
    sourceUrl: 'https://ourworldindata.org/extreme-poverty',
    confidence: 'high',
    asOf: TODAY,
  },
  {
    slug: 'child-mortality',
    name: 'Child mortality (under 5)',
    description:
      'Share of children who die before their fifth birthday. The single starkest measure of whether a society works.',
    unit: 'share of children',
    format: 'percent',
    baseline: { year: 1800, value: 0.43 },
    latest: { year: 2022, value: 0.037 },
    direction: 'down',
    source: 'Our World in Data — UN IGME',
    sourceUrl: 'https://ourworldindata.org/child-mortality',
    confidence: 'high',
    asOf: TODAY,
  },
  {
    slug: 'literacy',
    name: 'Adult literacy',
    description:
      'Share of adults who can read and write. Compounds across generations — every literate parent makes the next round of literacy easier.',
    unit: 'share of adults',
    format: 'percent',
    baseline: { year: 1820, value: 0.12 },
    latest: { year: 2022, value: 0.87 },
    direction: 'up',
    source: 'Our World in Data — Roser & Ortiz-Ospina',
    sourceUrl: 'https://ourworldindata.org/literacy',
    confidence: 'high',
    asOf: TODAY,
  },
  {
    slug: 'life-expectancy',
    name: 'Life expectancy at birth',
    description:
      'Years a newborn can expect to live. Historically driven by child-mortality reductions; now also by adult-disease control and chronic-disease management.',
    unit: 'years',
    format: 'years',
    baseline: { year: 1800, value: 30 },
    latest: { year: 2023, value: 73 },
    direction: 'up',
    source: 'Our World in Data — UN World Population Prospects',
    sourceUrl: 'https://ourworldindata.org/life-expectancy',
    confidence: 'high',
    asOf: TODAY,
  },
  {
    slug: 'gdp-per-capita',
    name: 'Real GDP per capita (global)',
    description:
      'Inflation-adjusted economic output per person. The quiet engine behind nearly every other metric on this page.',
    unit: 'USD, 2017 PPP',
    format: 'usd',
    baseline: { year: 1820, value: 1200 },
    latest: { year: 2022, value: 16700 },
    direction: 'up',
    source: 'Maddison Project Database 2023 + World Bank',
    sourceUrl: 'https://ourworldindata.org/grapher/gdp-per-capita-worldbank-maddison',
    confidence: 'high',
    asOf: TODAY,
  },
  {
    slug: 'electricity-access',
    name: 'Electricity access',
    description:
      'Share of humans with reliable access to electric power. Underwrites everything else: refrigeration, lighting at night, the internet, modern hospitals.',
    unit: 'share of humans',
    format: 'percent',
    baseline: { year: 1900, value: 0.03 },
    latest: { year: 2022, value: 0.91 },
    direction: 'up',
    source: 'World Bank · IEA — SDG 7 tracking',
    sourceUrl: 'https://ourworldindata.org/energy-access',
    confidence: 'high',
    asOf: TODAY,
  },
  {
    slug: 'internet-users',
    name: 'Internet users',
    description:
      'Share of humans connected to the internet. The substrate of most coordination today and most of what optimism.fun is built on.',
    unit: 'share of humans',
    format: 'percent',
    baseline: { year: 1995, value: 0.008 },
    latest: { year: 2024, value: 0.67 },
    direction: 'up',
    source: 'ITU — World Telecommunication/ICT Indicators',
    sourceUrl: 'https://ourworldindata.org/internet',
    confidence: 'high',
    asOf: TODAY,
  },
  // Civilizational-scale milestones — added 2026-08-06 to close a gap: every
  // metric above is a welfare/development curve. None of them measure the
  // frontier bets tracked on /frontier (energy capture, space, longevity).
  // Two swaps from the original proposal, for honesty: "days since last Mars
  // milestone" isn't a real trend metric, so cost-to-orbit stands in as the
  // actual enabling curve for Mars colonization. "Rejuvenation therapies in
  // Phase 2+ trials" has no verifiable current aggregate count — Lifespan.io's
  // roadmap renders client-side with no citable snapshot number — so healthy
  // life expectancy (HALE) stands in: a real, WHO-sourced measure of whether
  // humanity is compressing morbidity, not just delaying death.
  {
    slug: 'kardashev-scale',
    name: 'Kardashev scale (energy civilization type)',
    description:
      'How much of a star’s available energy a civilization has learned to harness, on Kardashev’s Type 0-to-3 scale. Type 1 is full use of everything a home planet receives. This is the closest thing to a single number for "how advanced is humanity," and by design it does not care about GDP or population — only energy captured and put to use.',
    unit: 'Kardashev type (1.0 = full planetary energy capture)',
    format: 'absolute',
    baseline: { year: 1973, value: 0.7 },
    latest: { year: 2026, value: 0.7276 },
    direction: 'up',
    source: 'Carl Sagan’s 1973 estimate; Kardashev1.com live tracker',
    sourceUrl: 'https://www.kardashev1.com/',
    confidence: 'low',
    asOf: '2026-08-06',
  },
  {
    slug: 'cost-to-orbit',
    name: 'Cost to reach orbit',
    description:
      'USD per kilogram to low Earth orbit. This is the actual enabling metric behind Mars colonization — not a countdown or a mission tracker, but the cost curve that has to keep collapsing before Mars is anything other than a demonstration flight. Reusability is the whole story: the Space Shuttle was marketed as reusable and was still more expensive per kilogram than the expendable Saturn V that preceded it.',
    unit: 'USD per kg to low Earth orbit',
    format: 'usd',
    baseline: { year: 1981, value: 60_000 },
    latest: { year: 2026, value: 2_720 },
    direction: 'down',
    source: 'Space Launch Cost Comparison 2026 (nexi.fund); NASA Space Shuttle program cost history',
    sourceUrl: 'https://nexi.fund/space-launch-cost-comparison-2026/',
    confidence: 'med',
    asOf: '2026-08-06',
  },
  {
    slug: 'healthy-life-expectancy',
    name: 'Healthy life expectancy (HALE)',
    description:
      'Years a newborn can expect to live in good health — distinct from life expectancy above, which counts every year alive regardless of health. This is the real longevity-progress metric: adding years to a life is easy to overstate as progress if most of those years are spent sick. HALE only rises when disease and disability compress, not just when death is delayed.',
    unit: 'years lived in good health',
    format: 'years',
    baseline: { year: 2000, value: 58.6 },
    latest: { year: 2019, value: 63.5 },
    direction: 'up',
    source: 'WHO · Global Burden of Disease Study 2019',
    sourceUrl: 'https://www.who.int/data/gho/indicator-metadata-registry/imr-details/7752',
    confidence: 'high',
    asOf: '2026-08-06',
  },
]

export const getProgressBySlug = (slug: string) =>
  progress.find((p) => p.slug === slug)
