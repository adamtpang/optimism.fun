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
 *   A demand score is published only when at least 3 demand inputs have a
 *   percentile. Fewer than that is "not enough data", including a score that
 *   would otherwise come from a single death figure.
 *   A supply score is published only when at least one supply input is a
 *   sourced number, and a stored zero counts. Capital with no figure does not.
 *   demand score = round(100 * mean of that problem's demand percentiles)
 *   supply score = round(100 * mean of that problem's supply percentiles)
 *   gap = demand score - supply score
 *   If either side is not published, the gap is "not enough data".
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

export const NOT_ENOUGH = 'not enough data'
export const MIN_DEMAND_INPUTS = 3
export const MIN_SUPPLY_INPUTS = 1
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
  role: 'demand' | 'supply' | 'shown'
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
  companyNote: string | null
  inputs: ScoreInput[]
}

const DEMAND_FEEDS = new Set(['openalex', 'nih', 'clinicaltrials', 'federal-register', 'usaspending', 'edgar', 'openfda'])
const SUPPLY_FEEDS = new Set(['clinicaltrials-sponsors', 'openalex-companies'])

export function coveredMean(values: (number | null)[], minimum: number): number | null {
  const present = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
  if (present.length < minimum) return null
  return present.reduce((sum, value) => sum + value, 0) / present.length
}

export function formatCovered(score: number | null, inputCount: number, minimum: number): string {
  if (inputCount < minimum || score == null) return NOT_ENOUGH
  return String(Math.round(score * 100))
}

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
  if (demand == null || supply == null) return { value: null, label: NOT_ENOUGH }
  const value = Math.round(demand * 100) - Math.round(supply * 100)
  return { value, label: String(value) }
}

function deathOrDaly(unit: string): boolean {
  return /death|daly/i.test(unit)
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}

function readingInput(reading: SnapshotReading, inScore: boolean, role: ScoreInput['role']): ScoreInput {
  if (reading.status !== 'ok' || reading.value == null) {
    return {
      label: reading.label,
      value: null,
      display: reading.capped ? 'count capped' : NOT_SOURCED,
      unit: reading.unit,
      sourceUrl: reading.sourceUrl,
      inScore: false,
      role,
    }
  }
  return {
    label: reading.label,
    value: reading.value,
    display: formatNumber(reading.value),
    unit: reading.unit,
    sourceUrl: reading.sourceUrl,
    inScore,
    role,
  }
}

export function hasNamedExternalCompany(slug: string): boolean {
  const readings = demandSnapshot.problems[slug] ?? []
  return readings.some((reading) => {
    if (reading.feed === 'clinicaltrials-sponsors' && reading.status === 'ok' && (reading.value ?? 0) > 0) return true
    if (reading.feed === 'openalex-companies' && ((reading.value ?? 0) > 0 || (reading.names?.length ?? 0) > 0)) return true
    return false
  })
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

  const feedIds = [...DEMAND_FEEDS, ...SUPPLY_FEEDS, 'burden']
  const feedPct = new Map<string, (number | null)[]>()
  for (const feed of feedIds) {
    feedPct.set(
      feed,
      percentileHigh(
        rows.map((row) => {
          const reading = row.shownFeeds.find((item) => item.feed === feed && item.status === 'ok' && !item.capped)
          if (!reading || reading.value == null) return null
          if (feed === 'burden' && !deathOrDaly(reading.unit)) return null
          return reading.value
        }),
      ),
    )
  }

  return rows
    .map((row, index) => {
      const demandParts: (number | null)[] = [deathPct[index]]
      for (const feed of DEMAND_FEEDS) demandParts.push(feedPct.get(feed)?.[index] ?? null)
      const burdenPct = feedPct.get('burden')?.[index] ?? null
      if (burdenPct != null) demandParts.push(burdenPct)
      const sponsorPct = feedPct.get('clinicaltrials-sponsors')?.[index] ?? null
      const paperPct = feedPct.get('openalex-companies')?.[index] ?? null
      const supplyParts: (number | null)[] = [companyPct[index], founderPct[index], funderPct[index], capitalPct[index], sponsorPct, paperPct]
      const demandInputs = demandParts.filter((value) => value != null).length
      const supplyInputs = supplyParts.filter((value) => value != null).length
      const demand = coveredMean(demandParts, MIN_DEMAND_INPUTS)
      const supply = coveredMean(supplyParts, MIN_SUPPLY_INPUTS)
      const gap = formatGap(demand, supply)
      const named = hasNamedExternalCompany(row.slug)
      const oa = row.shownFeeds.find((item) => item.feed === 'openalex-companies')
      const sponsors = row.shownFeeds.find((item) => item.feed === 'clinicaltrials-sponsors' && item.status === 'ok')
      const exactExternal = (sponsors?.value ?? 0) + (oa?.status === 'ok' ? oa.value ?? 0 : 0)
      const inputs: ScoreInput[] = []
      inputs.push({
        label: 'Related deaths / yr',
        value: row.deaths,
        display: row.deaths == null ? NOT_SOURCED : formatNumber(row.deaths),
        unit: 'deaths/yr',
        sourceUrl: row.deathUrl,
        inScore: row.deaths != null && deathPct[index] != null,
        role: 'demand',
      })
      for (const reading of row.shownFeeds) {
        const pct = feedPct.get(reading.feed)?.[index] ?? null
        const burdenOk = reading.feed === 'burden' && reading.status === 'ok' && deathOrDaly(reading.unit) && pct != null
        const demandOk = DEMAND_FEEDS.has(reading.feed) && reading.status === 'ok' && pct != null
        const supplyOk = SUPPLY_FEEDS.has(reading.feed) && reading.status === 'ok' && !reading.capped && pct != null
        const role: ScoreInput['role'] = SUPPLY_FEEDS.has(reading.feed) ? 'supply' : demandOk || burdenOk ? 'demand' : 'shown'
        inputs.push(readingInput(reading, demandOk || burdenOk || supplyOk, role))
      }
      inputs.push({
        label: 'Sourced companies on file',
        value: row.companies,
        display: formatNumber(row.companies),
        unit: 'companies',
        sourceUrl: null,
        inScore: companyPct[index] != null,
        role: 'supply',
      })
      inputs.push({
        label: 'Sourced founders',
        value: row.founders,
        display: formatNumber(row.founders),
        unit: 'founders',
        sourceUrl: null,
        inScore: founderPct[index] != null,
        role: 'supply',
      })
      inputs.push({
        label: 'Sourced funders',
        value: row.funders,
        display: formatNumber(row.funders),
        unit: 'funders',
        sourceUrl: null,
        inScore: funderPct[index] != null,
        role: 'supply',
      })
      inputs.push({
        label: 'Annual capital',
        value: row.capital,
        display: row.capital == null ? NOT_SOURCED : formatNumber(row.capital),
        unit: 'USD/yr',
        sourceUrl: row.capitalUrl,
        inScore: row.capital != null && capitalPct[index] != null,
        role: 'supply',
      })
      return {
        slug: row.slug,
        name: row.name,
        rank: row.rank,
        demandScore: demand,
        supplyScore: supply,
        gap: gap.value,
        demandLabel: formatCovered(demand, demandInputs, MIN_DEMAND_INPUTS),
        supplyLabel: formatCovered(supply, supplyInputs, MIN_SUPPLY_INPUTS),
        gapLabel: gap.label,
        burdenLabel: row.deaths == null ? NOT_SOURCED : formatNumber(row.deaths),
        burdenValue: row.deaths,
        companyCount: row.companies + exactExternal,
        openQuest: row.companies === 0 && !named,
        companyNote: oa?.capped ? 'OpenAlex company list is capped' : null,
        inputs,
      }
    })
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
}

export function balanceBySlug(): Map<string, BalanceRow> {
  return new Map(balanceRows().map((row) => [row.slug, row]))
}
