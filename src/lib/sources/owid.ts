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
function splitCsvLine(line: string): string[] {
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
    const lines = text.split('\n').filter((l) => l.trim())
    if (lines.length < 2) return null

    const header = splitCsvLine(lines[0])
    if (header.length < 4) return null
    const valueLabel = header[3]

    const series: OwidPoint[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = splitCsvLine(lines[i])
      if (cols.length < 4) continue
      if (cols[1] !== entity) continue // re-filter: redirects can drop the server filter
      const year = Number(cols[2])
      const value = Number(cols[3])
      if (Number.isFinite(year) && Number.isFinite(value)) series.push({ year, value })
    }
    series.sort((a, b) => a.year - b.year)

    if (series.length === 0) return null

    return { slug, valueLabel, series, latest: series[series.length - 1] }
  } catch {
    return null
  }
}
