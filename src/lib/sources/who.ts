/**
 * WHO indicator client for the public xMart OData API.
 * Free, no key. https://xmart-api-public.who.int/GHO
 *
 * The previous host, https://ghoapi.azureedge.net/api, now returns HTTP 500.
 * WHO retired that OData service around the end of 2025. The same GHO
 * indicator codes are published from the GHO mart on xMart, which also feeds
 * https://data.who.int.
 *
 * Terms for reuse: https://data.who.int/about/data/terms-and-conditions
 *
 * A code that is absent from the indicator catalog, or that has no single
 * global both-sexes series, comes back as `unavailable`. A transport failure
 * comes back as null so the page can still render. Neither path invents a
 * number.
 */

export const WHO_API_BASE = 'https://xmart-api-public.who.int/GHO'
export const WHO_TERMS_URL = 'https://data.who.int/about/data/terms-and-conditions'
export const WHO_DATA_URL = 'https://data.who.int'

export type WhoPoint = { year: number; value: number }

export type WhoFactRow = {
  PERIOD_CODE?: string | number | null
  VALUE_NUMERIC?: number | null
  DIMENSION_1?: string | null
  DIMENSION_MEMBER_1?: string | null
  LAST_UPDATED?: string | null
}

export type WhoOk = {
  status: 'ok'
  indicator: string
  indicatorName: string
  series: WhoPoint[]
  latest: WhoPoint
  sourceLastUpdated: string | null
  url: string
}

export type WhoUnavailable = {
  status: 'unavailable'
  indicator: string
  reason: string
}

export type WhoResult = WhoOk | WhoUnavailable

const BOTH_SEXES = new Set(['BTSX', 'SEX_BTSX', 'TOTAL'])

/** Keep an undivided row, or the both-sexes row when sex is a dimension. */
export function isWhoAggregateRow(row: WhoFactRow): boolean {
  const dimension = row.DIMENSION_1 ?? null
  const member = row.DIMENSION_MEMBER_1 ?? null
  if (!dimension && !member) return true
  if (dimension === 'SEX') return member != null && BOTH_SEXES.has(member)
  return true
}

/**
 * Collapse global fact rows into one ascending series.
 * Duplicate years mean the rows are still split by a dimension we do not
 * know how to aggregate, so the result is unavailable rather than a guess.
 */
export function reduceWhoFacts(
  rows: WhoFactRow[],
): { status: 'ok'; series: WhoPoint[]; sourceLastUpdated: string | null } | { status: 'unavailable'; reason: string } {
  const kept = rows.filter(isWhoAggregateRow)
  const series: WhoPoint[] = []
  const dates: string[] = []
  for (const row of kept) {
    const year = Number(row.PERIOD_CODE)
    const value = row.VALUE_NUMERIC == null ? Number.NaN : Number(row.VALUE_NUMERIC)
    if (!Number.isFinite(year) || !Number.isFinite(value)) continue
    series.push({ year, value })
    if (row.LAST_UPDATED) dates.push(String(row.LAST_UPDATED).slice(0, 10))
  }
  series.sort((a, b) => a.year - b.year)
  if (series.length === 0) {
    return { status: 'unavailable', reason: 'No global aggregate is published for this indicator.' }
  }
  const years = new Set(series.map((point) => point.year))
  if (years.size !== series.length) {
    return {
      status: 'unavailable',
      reason: 'The global rows are still split by a dimension, so no single series is published.',
    }
  }
  const dated = dates.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)).sort()
  return {
    status: 'ok',
    series,
    sourceLastUpdated: dated.length ? dated[dated.length - 1] : null,
  }
}

type IndicatorRow = {
  INDICATOR_CODE?: string
  INDICATOR_NAME?: string
  INDICATOR_URL?: string | null
}

async function getJson(url: string, revalidateSeconds: number): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(12_000),
      next: { revalidate: revalidateSeconds },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchWho(
  indicator: string,
  opts: { revalidateSeconds?: number } = {},
): Promise<WhoResult | null> {
  if (!/^[A-Za-z0-9_]+$/.test(indicator)) {
    return { status: 'unavailable', indicator, reason: 'Indicator code is not a WHO code.' }
  }
  const revalidateSeconds = opts.revalidateSeconds ?? 86400
  const catalogFilter = `INDICATOR_CODE eq '${indicator}'`
  const catalogUrl = `${WHO_API_BASE}/REF_INDICATOR?$filter=${encodeURIComponent(catalogFilter)}&$select=INDICATOR_CODE,INDICATOR_NAME,INDICATOR_URL&$top=1`
  const catalog = await getJson(catalogUrl, revalidateSeconds)
  if (!catalog || typeof catalog !== 'object') return null
  const catalogRows = (catalog as { value?: unknown }).value
  if (!Array.isArray(catalogRows)) return null
  if (catalogRows.length === 0) {
    return {
      status: 'unavailable',
      indicator,
      reason: 'No equivalent indicator is published on data.who.int.',
    }
  }
  const meta = catalogRows[0] as IndicatorRow
  const factFilter = `INDICATOR_CODE eq '${indicator}' and LOCATION_CODE eq 'GLOBAL'`
  const factUrl =
    `${WHO_API_BASE}/FACT?$filter=${encodeURIComponent(factFilter)}` +
    `&$select=PERIOD_CODE,VALUE_NUMERIC,DIMENSION_1,DIMENSION_MEMBER_1,LAST_UPDATED&$top=5000&$count=true`
  const facts = await getJson(factUrl, revalidateSeconds)
  if (!facts || typeof facts !== 'object') return null
  const body = facts as { value?: unknown; '@odata.count'?: unknown }
  if (!Array.isArray(body.value)) return null
  const count = body['@odata.count']
  if (typeof count === 'number' && count > body.value.length) return null

  const reduced = reduceWhoFacts(body.value as WhoFactRow[])
  if (reduced.status === 'unavailable') {
    return { status: 'unavailable', indicator, reason: reduced.reason }
  }
  return {
    status: 'ok',
    indicator,
    indicatorName: meta.INDICATOR_NAME || indicator,
    series: reduced.series,
    latest: reduced.series[reduced.series.length - 1],
    sourceLastUpdated: reduced.sourceLastUpdated,
    url: meta.INDICATOR_URL || WHO_DATA_URL,
  }
}
