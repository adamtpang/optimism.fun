/**
 * WHO Global Health Observatory (GHO) OData client.
 * Free, no API key. https://ghoapi.azureedge.net/api
 *
 * Response shape is { value: [{ IndicatorCode, SpatialDim, TimeDim,
 * NumericValue, Dim1 (e.g. SEX_BTSX), Date, ... }] }. We query the GLOBAL
 * aggregate, keep both-sexes rows where a sex dimension exists, and normalize
 * to an ascending, null-free series — same contract as worldbank.ts.
 */

export type GhoPoint = { year: number; value: number }

export type GhoResult = {
  indicator: string
  series: GhoPoint[] // ascending by year, nulls dropped
  latest: GhoPoint | null
  /** The most recent row-publication date WHO reports (max of Date fields). */
  sourceLastUpdated: string | null
}

const BASE = 'https://ghoapi.azureedge.net/api'

export async function fetchGho(
  indicator: string,
  opts: { revalidateSeconds?: number } = {},
): Promise<GhoResult | null> {
  const url = `${BASE}/${encodeURIComponent(indicator)}?%24filter=SpatialDim%20eq%20%27GLOBAL%27`

  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: opts.revalidateSeconds ?? 86400 },
    })
    if (!res.ok) return null

    const json = (await res.json()) as {
      value?: Array<{
        TimeDim?: number
        NumericValue?: number | null
        Dim1Type?: string | null
        Dim1?: string | null
        Date?: string | null
      }>
    }
    if (!Array.isArray(json.value)) return null

    // Where a sex dimension exists, keep only the both-sexes aggregate.
    const rows = json.value
      .filter((r) => r.Dim1Type !== 'SEX' || r.Dim1 === 'SEX_BTSX')
      .filter((r) => r.NumericValue != null && r.TimeDim != null)

    const series: GhoPoint[] = rows
      .map((r) => ({ year: Number(r.TimeDim), value: Number(r.NumericValue) }))
      .filter((p) => Number.isFinite(p.year) && Number.isFinite(p.value))
      .sort((a, b) => a.year - b.year)

    if (series.length === 0) return null

    // Indicators disaggregated by a non-SEX dimension (age group, cause…)
    // produce duplicate years; `latest` would be an arbitrary sub-slice.
    // Degrade to null per the invariant rather than report a wrong number.
    const years = new Set(series.map((p) => p.year))
    if (years.size !== series.length) return null

    const dates = rows.map((r) => r.Date).filter((d): d is string => Boolean(d))
    const lastUpdated = dates.length ? dates.sort()[dates.length - 1] : null

    return {
      indicator,
      series,
      latest: series[series.length - 1],
      sourceLastUpdated: lastUpdated ? lastUpdated.slice(0, 10) : null,
    }
  } catch {
    return null
  }
}
