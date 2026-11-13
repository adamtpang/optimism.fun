/**
 * Gap score for the open problem index.
 * Same percentile method as src/lib/sourced-balance.ts, computed on this index
 * only. It does not read the curated 19 and does not change their ranks.
 *
 * A demand score is published only when at least 3 demand inputs have a
 * percentile. A supply score needs one sourced supply number. A stored zero
 * counts. A missing or capped reading stays out. Placeholder companies are
 * removed before the supply count.
 */
import { MIN_DEMAND_INPUTS, MIN_SUPPLY_INPUTS, coveredMean, formatGap, percentileHigh } from '@/lib/sourced-balance'

export const INSUFFICIENT = 'insufficient data'
export { MIN_DEMAND_INPUTS, MIN_SUPPLY_INPUTS }

export type NamedParty = {
  name: string
  url?: string
  count?: number
  placeholder?: boolean
}

export type IndexSensor = {
  status: 'ok' | 'unavailable'
  value: number | null
  capped?: boolean
  names?: NamedParty[]
} | null

export type IndexDraft = {
  slug: string
  name: string
  category: string
  clinical: boolean
  slots: {
    deaths: number | null
    dalys: number | null
    people: number | null
    cases: number | null
  }
  sensors: {
    openalex: IndexSensor
    nih: IndexSensor
    trials: IndexSensor
    companies: IndexSensor
    sponsors: IndexSensor
  }
}

export type ScoredIndexRow = {
  slug: string
  name: string
  category: string
  clinical: boolean
  rank: number | null
  demandScore: number | null
  supplyScore: number | null
  gap: number | null
  demandLabel: string
  supplyLabel: string
  gapLabel: string
  demandInputs: number
  supplyInputs: number
  companyCount: number | null
  openQuest: boolean
  companyNote: string | null
}

export function countsAsRealCompany(name: string): boolean {
  return !/not a real company/i.test(name) && !/\(open quest/i.test(name)
}

export function isPlaceholderParty(party: NamedParty): boolean {
  return party.placeholder === true || !countsAsRealCompany(party.name)
}

/** Reported count minus any placeholder that was mixed into the named list. */
export function realSupplyCount(sensor: IndexSensor): number | null {
  if (!sensor || sensor.status !== 'ok' || sensor.capped) return null
  if (typeof sensor.value !== 'number' || !Number.isFinite(sensor.value)) return null
  const placeholders = (sensor.names || []).filter(isPlaceholderParty).length
  return Math.max(0, sensor.value - placeholders)
}

export function sensorNumber(sensor: IndexSensor): number | null {
  if (!sensor || sensor.status !== 'ok' || sensor.capped) return null
  if (typeof sensor.value !== 'number' || !Number.isFinite(sensor.value)) return null
  return sensor.value
}

function formatScore(score: number | null, inputs: number, minimum: number): string {
  if (inputs < minimum || score == null) return INSUFFICIENT
  return String(Math.round(score * 100))
}

function demandVector(row: IndexDraft): (number | null)[] {
  return [
    finite(row.slots.deaths),
    finite(row.slots.dalys),
    finite(row.slots.people),
    finite(row.slots.cases),
    sensorNumber(row.sensors.openalex),
    sensorNumber(row.sensors.nih),
    sensorNumber(row.sensors.trials),
  ]
}

function finite(value: number | null): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export function knownCompanyCount(companies: number | null, sponsors: number | null, clinical: boolean): number | null {
  if (companies == null) return null
  if (!clinical) return companies
  if (sponsors == null) return companies > 0 ? companies : null
  return companies + sponsors
}

export function openQuestStatus(companies: number | null, sponsors: number | null, clinical: boolean): boolean {
  if (companies == null || companies > 0) return false
  if (!clinical) return true
  return sponsors === 0
}

export function scoreProblemIndex(rows: IndexDraft[]): ScoredIndexRow[] {
  const demand = rows.map(demandVector)
  const companies = rows.map((row) => realSupplyCount(row.sensors.companies))
  const sponsors = rows.map((row) => realSupplyCount(row.sensors.sponsors))
  const demandPct = demand[0].map((_, column) => percentileHigh(demand.map((vector) => vector[column])))
  const companyPct = percentileHigh(companies)
  const sponsorPct = percentileHigh(sponsors)

  const scored = rows.map((row, index) => {
    const demandParts = demandPct.map((column) => column[index])
    const supplyParts = [companyPct[index], sponsorPct[index]]
    const demandInputs = demandParts.filter((value) => value != null).length
    const supplyInputs = supplyParts.filter((value) => value != null).length
    const demandMean = coveredMean(demandParts, MIN_DEMAND_INPUTS)
    const supplyMean = coveredMean(supplyParts, MIN_SUPPLY_INPUTS)
    const gap = formatGap(demandMean, supplyMean)
    const companyCount = knownCompanyCount(companies[index], sponsors[index], row.clinical)
    const openQuest = openQuestStatus(companies[index], sponsors[index], row.clinical)
    const notes: string[] = []
    if (row.sensors.companies?.capped) notes.push('OpenAlex company list is capped')
    if (row.clinical && row.sensors.sponsors?.capped) notes.push('Industry sponsor list was too large to count')
    if (companyCount != null && (companies[index] == null || (row.clinical && sponsors[index] == null))) {
      notes.push('Company count is only the lists that resolved')
    }
    return {
      slug: row.slug,
      name: row.name,
      category: row.category,
      clinical: row.clinical,
      rank: null as number | null,
      demandScore: demandMean,
      supplyScore: supplyMean,
      gap: gap.value,
      demandLabel: formatScore(demandMean, demandInputs, MIN_DEMAND_INPUTS),
      supplyLabel: formatScore(supplyMean, supplyInputs, MIN_SUPPLY_INPUTS),
      gapLabel: gap.value == null ? INSUFFICIENT : gap.label,
      demandInputs,
      supplyInputs,
      companyCount: openQuest ? 0 : companyCount,
      openQuest,
      companyNote: notes.length ? notes.join('. ') : null,
    }
  })

  const ranked = scored
    .filter((row) => row.gap != null)
    .sort((a, b) => (b.gap as number) - (a.gap as number) || (b.demandScore ?? -1) - (a.demandScore ?? -1) || a.name.localeCompare(b.name))
  ranked.forEach((row, index) => {
    row.rank = index + 1
  })
  return scored
}
