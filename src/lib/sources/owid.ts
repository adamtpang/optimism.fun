/**
 * Our World in Data — Grapher chart-data client.
 * Free, no API key, CC BY 4.0. https://ourworldindata.org/grapher/{slug}.csv
 *
 * We request the filtered CSV for the World aggregate, but some legacy slugs
 * 302-redirect to a renamed chart and drop the query string — so we ALWAYS
 * re-filter rows by entity code ourselves and never trust the server filter.
 *
 * CSV shape: Entity,Code,Year,<value>[,extra columns]. We read column 3 as the
 * value and normalize to the same ascending series contract as worldbank.ts.
 */

export type OwidPoint = { year: number; value: number }

export type OwidResult = {
  slug: string
  /** The value column's header, e.g. "Life expectancy". */
  valueLabel: string
  series: OwidPoint[] // ascending by year, nulls dropped
  latest: OwidPoint | null
}

/** Minimal CSV line splitter that respects double-quoted fields. */
export function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

/**
 * World rows only. Column 3 is the chart's value; later columns (population,
 * bounds, original year) are not a second series. Non-World entities are
 * dropped even when a redirect ignores the server-side country filter.
 */
export function parseOwidCsv(
  text: string,
  entityCode = 'OWID_WRL',
): { valueLabel: string; series: OwidPoint[] } | null {
  const lines = text.split('\n').filter((line) => line.trim())
  if (lines.length < 2) return null
  const header = splitCsvLine(lines[0])
  if (header.length < 4) return null
  const valueLabel = header[3]
  const series: OwidPoint[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i])
    if (cols.length < 4) continue
    if (cols[1] !== entityCode) continue
    const year = Number(cols[2])
    const value = Number(cols[3])
    if (Number.isFinite(year) && Number.isFinite(value)) series.push({ year, value })
  }
  series.sort((a, b) => a.year - b.year)
  if (series.length === 0) return null
  return { valueLabel, series }
}

export type OwidChart = {
  slug: string
  title: string
  unit: string
  /** OWID's own citation string from the chart metadata. */
  citation: string
  url: string
  asOf: string
  series: OwidPoint[]
}

type OwidMetadata = {
  chart?: { title?: string; citation?: string; originalChartUrl?: string }
  columns?: Record<
    string,
    { unit?: string; shortUnit?: string; citationShort?: string; citationLong?: string; lastUpdated?: string }
  >
  dateDownloaded?: string
}

export function readOwidChart(
  slug: string,
  csv: string,
  metadata: OwidMetadata,
  entityCode = 'OWID_WRL',
): OwidChart | null {
  const parsed = parseOwidCsv(csv, entityCode)
  if (!parsed || parsed.series.length < 2) return null
  const columns = metadata.columns ? Object.values(metadata.columns) : []
  const column =
    columns.find((entry) => entry.citationShort || entry.citationLong) ?? columns[0]
  const citation = column?.citationShort || column?.citationLong || metadata.chart?.citation || ''
  if (!citation.trim()) return null
  const asOfRaw = column?.lastUpdated || metadata.dateDownloaded || ''
  const asOf = /^\d{4}-\d{2}-\d{2}/.test(asOfRaw) ? asOfRaw.slice(0, 10) : asOfRaw.slice(0, 10)
  return {
    slug,
    title: metadata.chart?.title || parsed.valueLabel,
    unit: column?.unit || column?.shortUnit || parsed.valueLabel,
    citation: citation.trim(),
    url: metadata.chart?.originalChartUrl || `https://ourworldindata.org/grapher/${slug}`,
    asOf: asOf || 'unknown',
    series: parsed.series,
  }
}

export async function fetchOwid(
  slug: string,
  opts: { entityCode?: string; extraParams?: string; revalidateSeconds?: number } = {},
): Promise<OwidResult | null> {
  const entity = opts.entityCode ?? 'OWID_WRL'
  const params = `csvType=filtered&country=${encodeURIComponent(entity)}${
    opts.extraParams ? `&${opts.extraParams}` : ''
  }`
  const url = `https://ourworldindata.org/grapher/${slug}.csv?${params}`

  try {
    const res = await fetch(url, {
      headers: { accept: 'text/csv' },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: opts.revalidateSeconds ?? 86400 },
    })
    if (!res.ok) return null

    const text = await res.text()
    const parsed = parseOwidCsv(text, entity)
    if (!parsed) return null
    return { slug, valueLabel: parsed.valueLabel, series: parsed.series, latest: parsed.series[parsed.series.length - 1] }
  } catch {
    return null
  }
}

/**
 * Full World trend for one Grapher chart, plus OWID's citation.
 * `tab=chart` plus `time=earliest..latest` asks for the line, not the map's
 * single year. The caller caches this; a chart with no citation or fewer
 * than two World points is null.
 */
export async function fetchOwidChart(
  slug: string,
  opts: { entityCode?: string; revalidateSeconds?: number } = {},
): Promise<OwidChart | null> {
  const entity = opts.entityCode ?? 'OWID_WRL'
  const revalidate = opts.revalidateSeconds ?? 86400
  const params = new URLSearchParams({
    csvType: 'filtered',
    tab: 'chart',
    country: entity,
    time: 'earliest..latest',
  })
  const csvUrl = `https://ourworldindata.org/grapher/${encodeURIComponent(slug)}.csv?${params}`
  const metaUrl = `https://ourworldindata.org/grapher/${encodeURIComponent(slug)}.metadata.json`
  try {
    const [csvRes, metaRes] = await Promise.all([
      fetch(csvUrl, {
        headers: { accept: 'text/csv' },
        signal: AbortSignal.timeout(12_000),
        next: { revalidate },
      }),
      fetch(metaUrl, {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(12_000),
        next: { revalidate },
      }),
    ])
    if (!csvRes.ok || !metaRes.ok) return null
    const [csv, metadata] = await Promise.all([csvRes.text(), metaRes.json() as Promise<OwidMetadata>])
    return readOwidChart(slug, csv, metadata, entity)
  } catch {
    return null
  }
}
