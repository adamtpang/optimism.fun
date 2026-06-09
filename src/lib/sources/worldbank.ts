/**
 * World Bank Open Data (World Development Indicators) client.
 * Free, no API key. https://api.worldbank.org/v2
 *
 * Response shape is [meta, observations]:
 *   meta         = { page, pages, per_page, total, sourceid, lastupdated }
 *   observations = [{ indicator:{id,value}, countryiso3code, date:"2023",
 *                     value: number|null, ... }]  (newest-first)
 *
 * We normalize to an ascending, null-free series plus the source's own
 * `lastupdated` date, which is exactly the "data last uploaded" signal we show.
 */

export type WdiPoint = { year: number; value: number }

export type WdiResult = {
  indicator: string
  indicatorName: string
  countryIso3: string
  series: WdiPoint[] // ascending by year, nulls dropped
  latest: WdiPoint | null
  /** The date the World Bank last refreshed this indicator (meta.lastupdated). */
  sourceLastUpdated: string | null
}

const BASE = 'https://api.worldbank.org/v2'

export async function fetchWdi(
  countryIso3: string,
  indicator: string,
  opts: { mrv?: number; revalidateSeconds?: number } = {},
): Promise<WdiResult | null> {
  const mrv = opts.mrv ?? 20
  const url = `${BASE}/country/${encodeURIComponent(countryIso3)}/indicator/${encodeURIComponent(
    indicator,
  )}?format=json&per_page=100&mrv=${mrv}`

  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      // Cache a day by default; the cron passes 0 to force-fresh.
      next: { revalidate: opts.revalidateSeconds ?? 86400 },
    })
    if (!res.ok) return null

    const json = (await res.json()) as unknown
    if (!Array.isArray(json) || json.length < 2 || !Array.isArray(json[1])) return null

    const meta = json[0] as { lastupdated?: string }
    const obs = json[1] as Array<{
      indicator?: { id?: string; value?: string }
      countryiso3code?: string
      date?: string
      value?: number | null
    }>

    const series: WdiPoint[] = obs
      .filter((o) => o.value != null && o.date)
      .map((o) => ({ year: Number(o.date), value: Number(o.value) }))
      .filter((p) => Number.isFinite(p.year) && Number.isFinite(p.value))
      .sort((a, b) => a.year - b.year)

    if (series.length === 0) return null

    return {
      indicator,
      indicatorName: obs[0]?.indicator?.value ?? indicator,
      countryIso3,
      series,
      latest: series[series.length - 1],
      sourceLastUpdated: meta?.lastupdated ?? null,
    }
  } catch {
    return null
  }
}

/** Fetch several indicators concurrently; failed ones come back as null. */
export async function fetchWdiBatch(
  reqs: { countryIso3: string; indicator: string }[],
  opts: { revalidateSeconds?: number } = {},
): Promise<Record<string, WdiResult | null>> {
  const out: Record<string, WdiResult | null> = {}
  await Promise.all(
    reqs.map(async (r) => {
      out[r.indicator] = await fetchWdi(r.countryIso3, r.indicator, opts)
    }),
  )
  return out
}
