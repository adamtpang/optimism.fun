/**
 * Supply and demand score. Separate from opportunityScore in lib/priority.ts.
 * It does not read or write the priority rank.
 *
 * Demand indicators (same unit within a column, so a percentile is meaningful):
 *   related deaths per year (existing burden display figure)
 *   OpenAlex work count
 *   NIH RePORTER project count
 *   Federal Register document count
 *   USAspending award count
 *   SEC EDGAR Form D filing count
 *   openFDA current shortage count (distinct drugs)
 *
 * A live burden feed (poverty rate, fertility rate, tonnes of CO2, life
 * expectancy) is shown as a raw reading and is not ranked across problems,
 * because those series do not share a unit.
 * Wikipedia pageviews are stored and shown as attention. They are not demand.
 *
 * Supply indicators:
 *   sourced companies on this problem (a count of rows, including zero)
 *   sourced founders with a disclosed bet on this problem
 *   sourced funders on this problem
 *   annual capital USD, only when a capital-flow figure is stored
 *
 * Formula, for each indicator separately:
 *   Among problems where that indicator is a finite number, sort ascending.
 *   Ties share the midpoint of their positions.
 *   percentile = position / (n - 1), so the lowest value is 0 and the highest is 1.
 *   If fewer than two problems have the indicator, it has no percentile.
 *   A missing value is left out of that column. It is not filled with 0,
 *   with the mean, or with any other number.
 *
 *   demand score = round(100 * mean of that problem's demand percentiles)
 *   supply score = round(100 * mean of that problem's supply percentiles)
 *   gap = demand score - supply score
 *   If a side has no percentiles, that score is "not yet sourced" and the gap is too.
 *
 * Omitting a missing indicator from the mean is not imputation. A stored count
 * of zero is a real zero and does enter its column.
 */
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { founders } from '@/data/founders'
import { ecosystem } from '@/data/ecosystem'
import { getCapitalFlow } from '@/data/capital-flows'
import { displayDeaths, displayDeathCitation } from '@/lib/burden'
import { rankBySlug } from '@/lib/open-data'
import { NOT_SOURCED } from '@/lib/quest-types'
import { demandSnapshot, type SnapshotReading } from '@/lib/demand-snapshot'

export type ScoreInput = {
  label: string
  /** Raw stored figure, or null when the input was not sourced. */
  value: number | null
  display: string
  unit: string
  sourceUrl: string | null
  /** True when this input is allowed into the percentile mean. */
  inScore: boolean
}

export type BalanceRow = {
  slug: string
  name: string
  rank: number
  demandScore: number | null
  supplyScore: number | null
  gap: number | null
  demandLabel: string
  supplyLabel: string
  gapLabel: string
  burdenLabel: string
  burdenValue: number | null
  companyCount: number
  openQuest: boolean
  inputs: ScoreInput[]
}

const DEMAND_FEEDS = new Set(['openalex', 'nih', 'federal-register', 'usaspending', 'edgar', 'openfda'])

export function percentileHigh(values: (number | null)[]): (number | null)[] {
  const present = values
    .map((value, index) => ({ value, index }))
    .filter((row): row is { value: number; index: number } => typeof row.value === 'number' && Number.isFinite(row.value))
  const n = present.length
  const out: (number | null)[] = values.map(() => null)
  if (n < 2) return out
  const sorted = [...present].sort((a, b) => a.value - b.value)
  let cursor = 0
  while (cursor < sorted.length) {
    let end = cursor
    while (end + 1 < sorted.length && sorted[end + 1].value === sorted[cursor].value) end += 1
    const mid = (cursor + end) / 2
    const percentile = mid / (n - 1)
    for (let k = cursor; k <= end; k += 1) out[sorted[k].index] = percentile
    cursor = end + 1
  }
  return out
}

/** Mean of the numbers that exist. Null when none exist. Does not treat null as zero. */
export function meanPresent(values: (number | null)[]): number | null {
  const nums = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
  if (nums.length === 0) return null
  return nums.reduce((sum, value) => sum + value, 0) / nums.length
}

export function formatScore(score: number | null): string {
  if (score == null) return NOT_SOURCED
  return String(Math.round(score * 100))
}

export function formatGap(demand: number | null, supply: number | null): { value: number | null; label: string } {
  if (demand == null || supply == null) return { value: null, label: NOT_SOURCED }
  const value = Math.round(demand * 100) - Math.round(supply * 100)
  return { value, label: String(value) }
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}

function readingInput(reading: SnapshotReading, inScore: boolean): ScoreInput {
  if (reading.status !== 'ok' || reading.value == null) {
    return {
      label: reading.label,
      value: null,
      display: NOT_SOURCED,
      unit: reading.unit,
      sourceUrl: reading.sourceUrl,
      inScore: false,
    }
  }
  return {
    label: reading.label,
    value: reading.value,
    display: formatNumber(reading.value),
    unit: reading.unit,
    sourceUrl: reading.sourceUrl,
    inScore,
  }
}

export function sourcedCompanyCount(slug: string): number {
  return companies.filter((company) => company.problemSlugs.includes(slug)).length
}

export function sourcedFounderCount(slug: string): number {
  return founders.filter((founder) => (founder.frontierBets ?? []).some((bet) => bet.problemSlug === slug)).length
}

export function sourcedFunderCount(slug: string): number {
  return ecosystem.filter((entry) => entry.problemSlugs.includes(slug)).length
}

export function sourcedCapitalUsd(slug: string): number | null {
  const flow = getCapitalFlow(slug)
  if (!flow || typeof flow.usdPerYear.value !== 'number') return null
  return flow.usdPerYear.value
}

type Draft = {
  slug: string
  name: string
  rank: number
  deaths: number | null
  deathUrl: string | null
  demandFeeds: SnapshotReading[]
  shownFeeds: SnapshotReading[]
  companies: number
  founders: number
  funders: number
  capital: number | null
  capitalUrl: string | null
}

function drafts(): Draft[] {
  const ranks = rankBySlug()
  return problems.map((problem) => {
    const readings = demandSnapshot.problems[problem.slug] ?? []
    const citation = displayDeathCitation(problem.slug)
    const flow = getCapitalFlow(problem.slug)
    return {
      slug: problem.slug,
      name: problem.name,
      rank: ranks.get(problem.slug) ?? problems.length,
      deaths: displayDeaths(problem.slug),
      deathUrl: citation?.sourceUrl ?? null,
      demandFeeds: readings.filter((reading) => DEMAND_FEEDS.has(reading.feed)),
      shownFeeds: readings,
      companies: sourcedCompanyCount(problem.slug),
      founders: sourcedFounderCount(problem.slug),
      funders: sourcedFunderCount(problem.slug),
      capital: sourcedCapitalUsd(problem.slug),
      capitalUrl: flow?.usdPerYear.sourceUrl ?? null,
    }
  })
}

export function balanceRows(): BalanceRow[] {
  const rows = drafts()
  const deathPct = percentileHigh(rows.map((row) => row.deaths))
  const companyPct = percentileHigh(rows.map((row) => row.companies))
  const founderPct = percentileHigh(rows.map((row) => row.founders))
  const funderPct = percentileHigh(rows.map((row) => row.funders))
  const capitalPct = percentileHigh(rows.map((row) => row.capital))

  const feedIds = [...DEMAND_FEEDS]
  const feedPct = new Map<string, (number | null)[]>()
  for (const feed of feedIds) {
    feedPct.set(
      feed,
      percentileHigh(
        rows.map((row) => {
          const reading = row.demandFeeds.find((item) => item.feed === feed && item.status === 'ok')
          return reading?.value ?? null
        }),
      ),
    )
  }

  return rows
    .map((row, index) => {
      const demandParts: (number | null)[] = [deathPct[index]]
      for (const feed of feedIds) demandParts.push(feedPct.get(feed)?.[index] ?? null)
      const supplyParts: (number | null)[] = [companyPct[index], founderPct[index], funderPct[index], capitalPct[index]]
      const demand = meanPresent(demandParts)
      const supply = meanPresent(supplyParts)
      const gap = formatGap(demand, supply)
      const inputs: ScoreInput[] = []
      inputs.push({
        label: 'Related deaths / yr',
        value: row.deaths,
        display: row.deaths == null ? NOT_SOURCED : formatNumber(row.deaths),
        unit: 'deaths/yr',
        sourceUrl: row.deathUrl,
        inScore: row.deaths != null && deathPct[index] != null,
      })
      for (const reading of row.shownFeeds) {
        const pct = feedPct.get(reading.feed)?.[index]
        inputs.push(readingInput(reading, DEMAND_FEEDS.has(reading.feed) && reading.status === 'ok' && pct != null))
      }
      inputs.push({
        label: 'Sourced companies',
        value: row.companies,
        display: formatNumber(row.companies),
        unit: 'companies',
        sourceUrl: null,
        inScore: companyPct[index] != null,
      })
      inputs.push({
        label: 'Sourced founders',
        value: row.founders,
        display: formatNumber(row.founders),
        unit: 'founders',
        sourceUrl: null,
        inScore: founderPct[index] != null,
      })
      inputs.push({
        label: 'Sourced funders',
        value: row.funders,
        display: formatNumber(row.funders),
        unit: 'funders',
        sourceUrl: null,
        inScore: funderPct[index] != null,
      })
      inputs.push({
        label: 'Annual capital',
        value: row.capital,
        display: row.capital == null ? NOT_SOURCED : formatNumber(row.capital),
        unit: 'USD/yr',
        sourceUrl: row.capitalUrl,
        inScore: row.capital != null && capitalPct[index] != null,
      })
      return {
        slug: row.slug,
        name: row.name,
        rank: row.rank,
        demandScore: demand,
        supplyScore: supply,
        gap: gap.value,
        demandLabel: formatScore(demand),
        supplyLabel: formatScore(supply),
        gapLabel: gap.label,
        burdenLabel: row.deaths == null ? NOT_SOURCED : formatNumber(row.deaths),
        burdenValue: row.deaths,
        companyCount: row.companies,
        openQuest: row.companies === 0,
        inputs,
      }
    })
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
}

export function balanceBySlug(): Map<string, BalanceRow> {
  return new Map(balanceRows().map((row) => [row.slug, row]))
}
