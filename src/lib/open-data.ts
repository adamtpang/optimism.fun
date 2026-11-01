/**
 * Public downloads. Every row is a field already stored in the repo, with
 * the citation that was stored next to it. Rank is the same order the
 * homepage already renders. Nothing here rescores a problem.
 */
import { problems, getProblemBySlug } from '@/data/problems'
import { discoveries } from '@/data/discoveries'
import { ctas } from '@/data/ctas'
import { burdenForProblem, displayDeaths } from '@/lib/burden'
import { computeRadarRows } from '@/lib/radar'

export const DATA_LICENSE = {
  id: 'CC-BY-4.0',
  name: 'Creative Commons Attribution 4.0 International',
  url: 'https://creativecommons.org/licenses/by/4.0/',
  cite: 'optimism.fun',
} as const

export type Metric = {
  id: string
  label: string
  value: number
  unit: string
  source: string
  sourceUrl: string | null
  asOf: string
  confidence: string
}

export type SeriesRow = {
  problem_slug: string
  year: number
  value: number
  unit: string
  source: string
  source_url: string
  as_of: string
  confidence: string
  license: string
}

const DATE = /^\d{4}-\d{2}-\d{2}$/

export function latestDate(dates: Array<string | undefined>): string {
  return dates.filter((d): d is string => Boolean(d && DATE.test(d))).sort().at(-1) ?? ''
}

export function toCsv(rows: Record<string, string | number | boolean | null | undefined>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const esc = (v: string | number | boolean | null | undefined) => {
    if (v == null) return ''
    const s = String(v)
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const lines = [headers.join(','), ...rows.map((row) => headers.map((h) => esc(row[h])).join(','))]
  return `${lines.join('\n')}\n`
}

export function datasetJson<T>(name: string, rows: T[], updated: string) {
  return {
    dataset: name,
    license: DATA_LICENSE,
    updated,
    count: rows.length,
    rows,
  }
}

export function rankBySlug(): Map<string, number> {
  return new Map(computeRadarRows().map((row, i) => [row.slug, i + 1]))
}

export function problemRows() {
  const rank = rankBySlug()
  return problems.map((p) => ({
    slug: p.slug,
    name: p.name,
    rank: rank.get(p.slug) ?? '',
    domain: p.domain ?? '',
    tier: p.tier,
    tagline: p.tagline,
    humans_affected: p.humansAffected?.value ?? '',
    humans_affected_unit: p.humansAffected?.unit ?? '',
    humans_affected_source: p.humansAffected?.source ?? '',
    humans_affected_source_url: p.humansAffected?.sourceUrl ?? '',
    humans_affected_as_of: p.humansAffected?.asOf ?? '',
    humans_affected_confidence: p.humansAffected?.confidence ?? '',
    scale_value: p.scale?.value ?? '',
    scale_unit: p.scale?.unit ?? '',
    scale_trend: p.scale?.trend ?? '',
    scale_source: p.scale?.source ?? '',
    scale_source_url: p.scale?.sourceUrl ?? '',
    scale_as_of: p.scale?.asOf ?? '',
    scale_confidence: p.scale?.confidence ?? '',
    neglectedness: p.neglectedness?.score ?? '',
    neglectedness_source: p.neglectedness?.source ?? '',
    neglectedness_source_url: p.neglectedness?.sourceUrl ?? '',
    neglectedness_as_of: p.neglectedness?.asOf ?? '',
    tractability: p.tractability?.score ?? '',
    tractability_source: p.tractability?.source ?? '',
    tractability_source_url: p.tractability?.sourceUrl ?? '',
    tractability_as_of: p.tractability?.asOf ?? '',
    last_updated: p.lastUpdated ?? p.asOf,
    license: DATA_LICENSE.id,
  }))
}

export function seriesRows(): SeriesRow[] {
  const rows: SeriesRow[] = []
  for (const p of problems) {
    if (!p.scale?.series?.length) continue
    for (const point of p.scale.series) {
      rows.push({
        problem_slug: p.slug,
        year: point.year,
        value: point.value,
        unit: p.scale.unit,
        source: p.scale.source,
        source_url: p.scale.sourceUrl ?? '',
        as_of: p.scale.asOf,
        confidence: p.scale.confidence,
        license: DATA_LICENSE.id,
      })
    }
  }
  return rows
}

function deathsMetric(slug: string): Metric | null {
  const value = displayDeaths(slug)
  const burden = burdenForProblem(slug)
  if (value == null || !burden) return null
  const aggregate = [...burden.aggregates].sort(
    (a, b) => (b.deaths.value ?? 0) - (a.deaths.value ?? 0),
  )[0]
  const useAggregate = aggregate != null && (aggregate.deaths.value ?? 0) >= burden.deaths
  const cited = useAggregate ? aggregate.deaths : burden.counted[0]?.deaths
  if (!cited) return null
  return {
    id: 'related_deaths',
    label: 'Related deaths per year',
    value,
    unit: 'deaths per year in causes this problem addresses. Shared causes are counted under each problem.',
    source: cited.source,
    sourceUrl: cited.sourceUrl,
    asOf: cited.asOf,
    confidence: cited.confidence,
  }
}

export function problemMetrics(slug: string): Metric[] {
  const p = getProblemBySlug(slug)
  if (!p) return []
  const metrics: Metric[] = []
  if (p.humansAffected) {
    metrics.push({
      id: 'humans_affected',
      label: 'People affected',
      value: p.humansAffected.value,
      unit: p.humansAffected.unit ?? '',
      source: p.humansAffected.source,
      sourceUrl: p.humansAffected.sourceUrl ?? null,
      asOf: p.humansAffected.asOf,
      confidence: p.humansAffected.confidence,
    })
  }
  if (p.scale) {
    metrics.push({
      id: 'scale',
      label: 'Headline measure',
      value: p.scale.value,
      unit: p.scale.unit,
      source: p.scale.source,
      sourceUrl: p.scale.sourceUrl ?? null,
      asOf: p.scale.asOf,
      confidence: p.scale.confidence,
    })
  }
  if (p.neglectedness) {
    metrics.push({
      id: 'neglectedness',
      label: 'Neglectedness',
      value: p.neglectedness.score,
      unit: 'score out of 10. Higher means more neglected.',
      source: p.neglectedness.source,
      sourceUrl: p.neglectedness.sourceUrl ?? null,
      asOf: p.neglectedness.asOf,
      confidence: p.neglectedness.confidence,
    })
  }
  if (p.tractability) {
    metrics.push({
      id: 'tractability',
      label: 'Tractability',
      value: p.tractability.score,
      unit: 'score out of 10. Higher means effort buys more progress.',
      source: p.tractability.source,
      sourceUrl: p.tractability.sourceUrl ?? null,
      asOf: p.tractability.asOf,
      confidence: p.tractability.confidence,
    })
  }
  const deaths = deathsMetric(slug)
  if (deaths) metrics.push(deaths)
  return metrics
}

export function problemDataset(slug: string) {
  const p = getProblemBySlug(slug)
  if (!p) return null
  const metrics = problemMetrics(slug)
  const series = (p.scale?.series ?? []).map((point) => ({
    year: point.year,
    value: point.value,
    unit: p.scale?.unit ?? '',
    source: p.scale?.source ?? '',
    sourceUrl: p.scale?.sourceUrl ?? null,
    asOf: p.scale?.asOf ?? '',
    confidence: p.scale?.confidence ?? '',
  }))
  return {
    dataset: 'problem',
    license: DATA_LICENSE,
    slug: p.slug,
    name: p.name,
    rank: rankBySlug().get(p.slug) ?? null,
    lastUpdated: p.lastUpdated ?? p.asOf,
    metrics,
    series,
    seriesNote: series.length >= 2 ? null : 'No time series is stored for this measure.',
  }
}

export function problemCsv(slug: string): string | null {
  const data = problemDataset(slug)
  if (!data) return null
  const metricRows = data.metrics.map((m) => ({
    record: 'metric',
    id: m.id,
    label: m.label,
    year: '',
    value: m.value,
    unit: m.unit,
    source: m.source,
    source_url: m.sourceUrl ?? '',
    as_of: m.asOf,
    confidence: m.confidence,
    license: DATA_LICENSE.id,
  }))
  const series = data.series.map((point) => ({
    record: 'series',
    id: 'scale',
    label: 'Headline measure',
    year: point.year,
    value: point.value,
    unit: point.unit,
    source: point.source,
    source_url: point.sourceUrl ?? '',
    as_of: point.asOf,
    confidence: point.confidence,
    license: DATA_LICENSE.id,
  }))
  return toCsv([...metricRows, ...series])
}

export function discoveryRows() {
  return discoveries.map((d) => ({
    id: d.id,
    title: d.title,
    published: d.published,
    added: d.added,
    source: d.source,
    doi: d.doi ?? '',
    url: d.url,
    problem_slugs: d.problemSlugs.join('|'),
    risk_slugs: (d.riskSlugs ?? []).join('|'),
    summary: d.summary,
    changes: d.changes,
    review: d.review,
    status: d.status ?? '',
    notice_note: d.notice?.note ?? '',
    notice_url: d.notice?.url ?? '',
    license: DATA_LICENSE.id,
  }))
}

export function ctaRows() {
  return ctas.map((c) => ({
    id: c.id,
    kind: c.kind,
    type: c.type,
    name: c.name,
    url: c.url,
    one_liner: c.oneLiner,
    problem_slugs: c.problemSlugs.join('|'),
    risk_slugs: (c.riskSlugs ?? []).join('|'),
    location: c.location ?? '',
    amount: c.amount?.text ?? '',
    amount_source_url: c.amount?.sourceUrl ?? '',
    checked_date: c.checkedDate,
    checked: c.checked ?? '',
    license: DATA_LICENSE.id,
  }))
}

export function problemsUpdated(): string {
  return latestDate(problems.map((p) => p.lastUpdated ?? p.asOf))
}

export function discoveriesUpdated(): string {
  return latestDate(discoveries.map((d) => d.added))
}

export function ctasUpdated(): string {
  return latestDate(ctas.map((c) => c.checkedDate))
}

export function seriesUpdated(): string {
  return latestDate(problems.map((p) => p.scale?.asOf))
}
