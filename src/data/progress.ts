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
]

export const getProgressBySlug = (slug: string) =>
  progress.find((p) => p.slug === slug)
