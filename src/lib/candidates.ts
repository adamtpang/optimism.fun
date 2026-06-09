/**
 * Data-access layer for the problem_candidates table. Every function checks
 * isDbConfigured() and returns a safe default when DB is missing — the admin
 * UI and cron endpoint both degrade gracefully into stub mode.
 *
 * Schema reference: scripts/db/0001_problem_candidates.sql
 */
import { getSql, isDbConfigured } from './db'
import type {
  CandidateStatus,
  ProblemCandidate,
  Tier,
  Transformation,
} from '@/data/types'

type CandidateRow = {
  id: string
  slug: string
  name: string
  tier: string
  tagline: string
  description: string
  humans_affected: string | number | null
  severity: string | number | null
  market_size: string | number | null
  current_solution_quality: string | number | null
  welfare_bcr: string | number | null
  xrisk_itn: string | number | null
  utility_delta: string | number | null
  transformation: Transformation | null
  sources: { title: string; url: string }[] | null
  signal_url: string | null
  signal_title: string | null
  signal_published_at: string | Date | null
  rationale: string | null
  status: string
  created_at: string | Date
  updated_at: string | Date
}

function toNumber(v: string | number | null): number | null {
  if (v === null || v === undefined) return null
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

function toIso(v: string | Date | null): string | null {
  if (!v) return null
  if (v instanceof Date) return v.toISOString()
  return v
}

function fromRow(row: CandidateRow): ProblemCandidate {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tier: row.tier as Tier,
    tagline: row.tagline,
    description: row.description,
    humansAffected: toNumber(row.humans_affected),
    severity: toNumber(row.severity),
    marketSize: toNumber(row.market_size),
    currentSolutionQuality: toNumber(row.current_solution_quality),
    welfareBCR: toNumber(row.welfare_bcr),
    xriskITN: toNumber(row.xrisk_itn),
    utilityDelta: toNumber(row.utility_delta),
    transformation: row.transformation,
    sources: row.sources ?? [],
    signalUrl: row.signal_url,
    signalTitle: row.signal_title,
    signalPublishedAt: toIso(row.signal_published_at),
    rationale: row.rationale,
    status: (row.status as CandidateStatus) ?? 'draft',
    createdAt: toIso(row.created_at)!,
    updatedAt: toIso(row.updated_at)!,
  }
}

export async function listCandidates(opts: {
  status?: CandidateStatus | 'all'
  limit?: number
} = {}): Promise<ProblemCandidate[]> {
  if (!isDbConfigured()) return []
  const sql = getSql()
  const status = opts.status ?? 'draft'
  const limit = opts.limit ?? 100
  const rows = (status === 'all'
    ? await sql`
        select * from problem_candidates
        order by created_at desc
        limit ${limit}
      `
    : await sql`
        select * from problem_candidates
        where status = ${status}
        order by created_at desc
        limit ${limit}
      `) as unknown as CandidateRow[]
  return rows.map(fromRow)
}

export async function setCandidateStatus(
  id: string,
  status: CandidateStatus,
): Promise<void> {
  if (!isDbConfigured()) return
  const sql = getSql()
  await sql`
    update problem_candidates
    set status = ${status}
    where id = ${id}
  `
}

export type UpsertCandidate = Omit<
  ProblemCandidate,
  'id' | 'createdAt' | 'updatedAt' | 'status'
> & { status?: CandidateStatus }

export async function upsertCandidate(c: UpsertCandidate): Promise<void> {
  if (!isDbConfigured()) return
  const sql = getSql()
  await sql`
    insert into problem_candidates (
      slug, name, tier, tagline, description,
      humans_affected, severity, market_size, current_solution_quality,
      welfare_bcr, xrisk_itn, utility_delta,
      transformation, sources,
      signal_url, signal_title, signal_published_at,
      rationale, status
    ) values (
      ${c.slug}, ${c.name}, ${c.tier}, ${c.tagline}, ${c.description},
      ${c.humansAffected}, ${c.severity}, ${c.marketSize}, ${c.currentSolutionQuality},
      ${c.welfareBCR}, ${c.xriskITN}, ${c.utilityDelta},
      ${c.transformation as unknown as string}, ${JSON.stringify(c.sources)}::jsonb,
      ${c.signalUrl}, ${c.signalTitle}, ${c.signalPublishedAt},
      ${c.rationale}, ${c.status ?? 'draft'}
    )
    on conflict (slug) do update set
      name = excluded.name,
      tier = excluded.tier,
      tagline = excluded.tagline,
      description = excluded.description,
      humans_affected = excluded.humans_affected,
      severity = excluded.severity,
      market_size = excluded.market_size,
      current_solution_quality = excluded.current_solution_quality,
      welfare_bcr = excluded.welfare_bcr,
      xrisk_itn = excluded.xrisk_itn,
      utility_delta = excluded.utility_delta,
      transformation = excluded.transformation,
      sources = excluded.sources,
      signal_url = excluded.signal_url,
      signal_title = excluded.signal_title,
      signal_published_at = excluded.signal_published_at,
      rationale = excluded.rationale
  `
}

export async function countCandidatesByStatus(): Promise<Record<CandidateStatus, number>> {
  const empty: Record<CandidateStatus, number> = { draft: 0, promoted: 0, rejected: 0 }
  if (!isDbConfigured()) return empty
  const sql = getSql()
  const rows = (await sql`
    select status, count(*)::int as count from problem_candidates group by status
  `) as unknown as { status: CandidateStatus; count: number }[]
  const result = { ...empty }
  for (const r of rows) result[r.status] = r.count
  return result
}
