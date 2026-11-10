/**
 * Read the committed problem index. Pages do not fetch.
 * Scores are computed here from the snapshot, on this list only.
 */
import snapshotFile from '@/data/problem-index/snapshot.json'
import packFile from '@/data/problem-index/starter-packs.json'
import {
  scoreProblemIndex,
  type IndexDraft,
  type ScoredIndexRow,
} from '@/lib/problem-index-score'
import type { IndexTableRow } from '@/components/ProblemIndexTable'

export type IndexMetric = {
  label: string
  value: number
  unit: string
  year: string
  source: string
  sourceUrl: string
  pageUrl?: string | null
  retrievedOn: string
  scoreKey: string | null
  kind: string
  derived: boolean
  formula: string | null
  publishedValue: number | null
  intervalLow: number | null
  intervalHigh: number | null
}

export type IndexSensorReading = {
  feed: string
  status: 'ok' | 'unavailable'
  label: string
  value: number | null
  unit: string
  query: string | null
  sourceUrl: string | null
  retrievedOn: string
  reason: string | null
  names?: { name: string; url?: string; count?: number; placeholder?: boolean }[]
  capped?: boolean
}

export type StoredProblem = IndexDraft & {
  headline: IndexMetric
  metrics: IndexMetric[]
  sensors: {
    openalex: IndexSensorReading | null
    nih: IndexSensorReading | null
    trials: IndexSensorReading | null
    companies: IndexSensorReading | null
    sponsors: IndexSensorReading | null
  }
}

export type IndexPack = {
  placeholder: true
  name: string
  marketCap: null
  valuation: null
  revenue: null
  label: string
  concept: string
  customer: string
  wedge: string
  metricsToMove: { label: string; value: number; unit: string; year: string; sourceUrl: string }[]
  papers: { title: string; year: number | null; citedBy: number | null; url: string; doi?: string | null }[]
  datasets: { name: string; url: string }[]
  funders: { name: string; url: string; note: string }[]
  comparables: { name: string; url?: string; count?: number; source?: string }[]
}

type SnapshotFile = {
  retrievedOn: string
  note: string
  floors: Record<string, number>
  rateFloor: string
  counts: Record<string, number>
  sources: { name: string; url: string }[]
  problems: StoredProblem[]
}

type PackFile = {
  retrievedOn: string
  label: string
  packs: Record<string, IndexPack>
}

export const problemSnapshot = snapshotFile as SnapshotFile
export const starterPackFile = packFile as PackFile

const scored = scoreProblemIndex(problemSnapshot.problems)
const scoredBySlug = new Map(scored.map((row) => [row.slug, row]))
const problemBySlug = new Map(problemSnapshot.problems.map((problem) => [problem.slug, problem]))

export function formatIndexNumber(value: number): string {
  if (!Number.isFinite(value)) return ''
  if (Math.abs(value) >= 100) return Math.round(value).toLocaleString('en-US')
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export function indexProblems(): StoredProblem[] {
  return problemSnapshot.problems
}

export function indexScore(slug: string): ScoredIndexRow | undefined {
  return scoredBySlug.get(slug)
}

export function indexProblem(slug: string): StoredProblem | undefined {
  return problemBySlug.get(slug)
}

export function indexPack(slug: string): IndexPack | undefined {
  return starterPackFile.packs[slug]
}

export function indexCategories(): string[] {
  return [...new Set(problemSnapshot.problems.map((problem) => problem.category))].sort((a, b) => a.localeCompare(b))
}

function companyLabel(problem: StoredProblem, row: ScoredIndexRow): string {
  if (row.openQuest) return '0'
  if (problem.sensors.companies?.capped) {
    const named = problem.sensors.companies.names?.length || 0
    return named ? `${named}+ capped` : 'capped'
  }
  if (row.companyCount == null) return 'not yet sourced'
  return row.companyCount.toLocaleString('en-US')
}

function hasNamedCompany(problem: StoredProblem, row: ScoredIndexRow): boolean {
  const named = (problem.sensors.companies?.names?.length || 0) + (problem.sensors.sponsors?.names?.length || 0)
  return named > 0 || (row.companyCount != null && row.companyCount > 0)
}

export function indexTableRows(): IndexTableRow[] {
  return problemSnapshot.problems.map((problem) => {
    const score = scoredBySlug.get(problem.slug)
    if (!score) throw new Error(`Missing score for ${problem.slug}`)
    return {
      slug: problem.slug,
      name: problem.name,
      category: problem.category,
      rank: score.rank,
      headlineValue: formatIndexNumber(problem.headline.value),
      headlineUnit: problem.headline.unit,
      headlineYear: problem.headline.year,
      headlineUrl: problem.headline.sourceUrl,
      demandLabel: score.demandLabel,
      supplyLabel: score.supplyLabel,
      gapLabel: score.gapLabel,
      companyLabel: companyLabel(problem, score),
      openQuest: score.openQuest,
      hasNamedCompany: hasNamedCompany(problem, score),
      demandScore: score.demandScore,
      supplyScore: score.supplyScore,
      gap: score.gap,
      companyCount: score.companyCount,
    }
  })
}

/** Top of the default gap ranking, prerendered. The rest render on demand. */
export function prerenderIndexSlugs(limit = 24): string[] {
  return [...indexTableRows()]
    .sort((a, b) => {
      if (a.rank == null && b.rank == null) return a.name.localeCompare(b.name)
      if (a.rank == null) return 1
      if (b.rank == null) return -1
      return a.rank - b.rank
    })
    .slice(0, limit)
    .map((row) => row.slug)
}

export function indexSummary() {
  const rows = indexTableRows()
  return {
    problems: rows.length,
    ranked: rows.filter((row) => row.rank != null).length,
    openQuests: rows.filter((row) => row.openQuest).length,
    retrievedOn: problemSnapshot.retrievedOn,
    note: problemSnapshot.note,
    sources: problemSnapshot.sources,
  }
}
