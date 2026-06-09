/**
 * Persistence + read layer for live indicator observations (World Bank WDI today,
 * more sources later). The refresh-indicators cron writes here; the /api/indicators
 * route and any server component read from here.
 *
 * Every function degrades to an empty result when DATABASE_URL is not configured,
 * so the app still renders from its seed data when the DB is absent. Schema:
 * scripts/db/0002_indicator_observations.sql (table indicator_observations).
 */
import { getSql, isDbConfigured } from '@/lib/db'
import type { WdiResult } from '@/lib/sources/worldbank'

export type IndicatorSeed = {
  sourceId: string
  indicator: string
  problemSlug: string
  countryIso3: string
  sourceLastUpdated: string | null
}

/**
 * Upsert an entire WDI series — one row per year — keyed on
 * (indicator, country_iso3, year). Re-runs update the value and fetched_at
 * rather than duplicating. Returns the number of rows written.
 */
export async function persistSeries(seed: IndicatorSeed, wdi: WdiResult): Promise<number> {
  if (!isDbConfigured()) return 0
  const sql = getSql()
  let n = 0
  for (const p of wdi.series) {
    await sql`
      insert into indicator_observations (
        source_id, indicator, problem_slug, country_iso3, year, value, source_last_updated, fetched_at
      ) values (
        ${seed.sourceId}, ${seed.indicator}, ${seed.problemSlug}, ${seed.countryIso3},
        ${p.year}, ${p.value}, ${seed.sourceLastUpdated}, now()
      )
      on conflict (indicator, country_iso3, year) do update set
        value = excluded.value,
        problem_slug = excluded.problem_slug,
        source_id = excluded.source_id,
        source_last_updated = excluded.source_last_updated,
        fetched_at = excluded.fetched_at
    `
    n++
  }
  return n
}

export type LatestObservation = {
  problemSlug: string
  indicator: string
  countryIso3: string
  year: number
  value: number
  sourceLastUpdated: string | null
  fetchedAt: string
}

/** Latest observation per problem (highest year), DB-backed. */
export async function getLatestObservations(): Promise<LatestObservation[]> {
  if (!isDbConfigured()) return []
  const sql = getSql()
  const rows = (await sql`
    select distinct on (problem_slug)
      problem_slug              as "problemSlug",
      indicator,
      country_iso3              as "countryIso3",
      year,
      value,
      source_last_updated::text as "sourceLastUpdated",
      fetched_at::text          as "fetchedAt"
    from indicator_observations
    order by problem_slug, year desc
  `) as unknown as LatestObservation[]
  return rows
}

/** Full ascending series for one problem (for DB-backed sparklines). */
export async function getSeriesForProblem(
  problemSlug: string,
): Promise<{ year: number; value: number }[]> {
  if (!isDbConfigured()) return []
  const sql = getSql()
  const rows = (await sql`
    select year, value
    from indicator_observations
    where problem_slug = ${problemSlug}
    order by year asc
  `) as unknown as { year: number; value: number }[]
  return rows
}

/** Most recent fetch time across all observations — the "data last refreshed" signal. */
export async function getLatestFetchedAt(): Promise<string | null> {
  if (!isDbConfigured()) return null
  const sql = getSql()
  const rows = (await sql`
    select max(fetched_at)::text as "fetchedAt" from indicator_observations
  `) as unknown as { fetchedAt: string | null }[]
  return rows[0]?.fetchedAt ?? null
}
