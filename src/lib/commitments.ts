/**
 * The coordination layer.
 *
 * The rest of this site is a research ledger: curated rows with sourced numbers
 * and visible confidence. This module is the one live, user-generated dataset,
 * and it is deliberately kept at arm's length from the ledger. A commitment
 * never changes a rank, never feeds a demand score, and always renders with a
 * "user-submitted" marker plus its review status. Rankings stay the map. This
 * is the market.
 *
 * Two independent gates before anything is public:
 *   1. Email confirmation proves the address exists.
 *   2. Human review proves someone read it.
 * Neither alone is sufficient, which is what keeps the board from becoming a
 * spam surface without turning it into a social network.
 */
import { randomUUID } from 'crypto'
import { getSql, isDbConfigured } from '@/lib/db'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'

/* ── Vocabulary ──────────────────────────────────────────────────────────── */

export const ACTOR_TYPES = ['talent', 'capital', 'operator'] as const
export type ActorType = (typeof ACTOR_TYPES)[number]

export const INTENTS = ['start', 'join', 'contribute', 'fund', 'hire', 'raise'] as const
export type Intent = (typeof INTENTS)[number]

export const CHECK_SIZE_BANDS = [
  '<25k',
  '25k-100k',
  '100k-500k',
  '500k-2m',
  '2m-10m',
  '10m+',
] as const
export type CheckSizeBand = (typeof CHECK_SIZE_BANDS)[number]

export const STAGES = [
  'pre-seed',
  'seed',
  'series-a',
  'series-b+',
  'grant',
  'non-dilutive',
] as const
export type Stage = (typeof STAGES)[number]

export const ROLE_TYPES = [
  'engineering',
  'research',
  'operations',
  'design',
  'gtm',
  'policy',
  'other',
] as const
export type RoleType = (typeof ROLE_TYPES)[number]

export const VISIBILITIES = ['public', 'anon'] as const
export type Visibility = (typeof VISIBILITIES)[number]

export const STATUSES = ['pending', 'approved', 'listed', 'rejected'] as const
export type CommitmentStatus = (typeof STATUSES)[number]

/** Which intents belong to which actor. Enforced in validation, not just the UI. */
export const INTENTS_BY_ACTOR: Record<ActorType, readonly Intent[]> = {
  talent: ['start', 'join', 'contribute'],
  capital: ['fund'],
  operator: ['hire', 'raise'],
}

/** Intents that must name a company already in the dataset. */
const COMPANY_REQUIRED: readonly Intent[] = ['join', 'hire', 'raise']

/** Statuses that render on the public board. */
export const PUBLIC_STATUSES: readonly CommitmentStatus[] = ['approved', 'listed']

export const INTENT_LABEL: Record<Intent, string> = {
  start: 'Willing to start',
  join: 'Wants to join',
  contribute: 'Offering a correction or intro',
  fund: 'Willing to fund',
  hire: 'Open role',
  raise: 'Raising',
}

export const BAND_LABEL: Record<CheckSizeBand, string> = {
  '<25k': 'under $25K',
  '25k-100k': '$25K to $100K',
  '100k-500k': '$100K to $500K',
  '500k-2m': '$500K to $2M',
  '2m-10m': '$2M to $10M',
  '10m+': '$10M+',
}

/* ── Shapes ──────────────────────────────────────────────────────────────── */

export type CommitmentInput = {
  problemSlug: string
  actorType: ActorType
  intent: Intent
  companySlug?: string | null
  roleType?: RoleType | null
  name: string
  email: string
  url?: string | null
  proof: string
  checkSizeBand?: CheckSizeBand | null
  stage?: Stage | null
  visibility?: Visibility
  wantsIntro?: boolean
}

export type Commitment = {
  id: string
  createdAt: string
  problemSlug: string
  companySlug: string | null
  roleType: RoleType | null
  actorType: ActorType
  intent: Intent
  /** Null when visibility is 'anon'. Never populated from the DB for anon rows. */
  name: string | null
  url: string | null
  proof: string
  checkSizeBand: CheckSizeBand | null
  stage: Stage | null
  visibility: Visibility
  status: CommitmentStatus
  wantsIntro: boolean
}

/** Admin view. Carries the email and review fields the public shape omits. */
export type CommitmentAdminRow = Commitment & {
  email: string
  name: string | null
  confirmedAt: string | null
  reviewedAt: string | null
  reviewNote: string | null
}

export type ProblemCounts = {
  problemSlug: string
  /** talent · intent start */
  willingToStart: number
  /** talent · intent join */
  willingToJoin: number
  /** capital · intent fund */
  allocatorsWatching: number
  /** operator · intent hire or raise */
  openNeeds: number
  total: number
}

/* ── Validation (pure, no IO, unit-testable) ─────────────────────────────── */

export const MAX_PROOF = 600
export const MIN_PROOF = 12
export const MAX_NAME = 120

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Accepts only absolute http(s) URLs. Rejects javascript: and friends. */
export function isSafeUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export type ValidationResult =
  | {
      ok: true
      value: Required<
        Omit<CommitmentInput, 'companySlug' | 'url' | 'checkSizeBand' | 'stage' | 'roleType'>
      > &
        Pick<CommitmentInput, 'companySlug' | 'url' | 'checkSizeBand' | 'stage' | 'roleType'>
    }
  | { ok: false; errors: string[] }

/**
 * The single source of truth for what a valid commitment is. The API route,
 * the admin tools and the tests all call this, so the rules cannot drift
 * between the form and the server.
 */
export function validateCommitment(raw: unknown): ValidationResult {
  const errors: string[] = []
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, errors: ['body must be an object'] }
  }
  const input = raw as Record<string, unknown>

  const str = (k: string): string => (typeof input[k] === 'string' ? (input[k] as string).trim() : '')

  const problemSlug = str('problemSlug')
  if (!problemSlug) {
    errors.push('problemSlug is required')
  } else if (!problems.some((p) => p.slug === problemSlug)) {
    // A commitment must attach to a ranked problem. Free-text problems would
    // let the board drift away from the index it exists to coordinate.
    errors.push(`unknown problemSlug: ${problemSlug}`)
  }

  const actorType = str('actorType') as ActorType
  if (!ACTOR_TYPES.includes(actorType)) {
    errors.push(`actorType must be one of ${ACTOR_TYPES.join(', ')}`)
  }

  const intent = str('intent') as Intent
  if (!INTENTS.includes(intent)) {
    errors.push(`intent must be one of ${INTENTS.join(', ')}`)
  } else if (ACTOR_TYPES.includes(actorType) && !INTENTS_BY_ACTOR[actorType].includes(intent)) {
    errors.push(`intent "${intent}" is not valid for actorType "${actorType}"`)
  }

  const companySlugRaw = str('companySlug')
  const companySlug = companySlugRaw || null
  if (INTENTS.includes(intent) && COMPANY_REQUIRED.includes(intent) && !companySlug) {
    errors.push(`intent "${intent}" requires a companySlug`)
  }
  if (companySlug && !companies.some((c) => c.slug === companySlug)) {
    // Companies cannot be created through this form. New ones go through the
    // contribute path and a human review, which is what stops the board from
    // becoming a paid-placement surface.
    errors.push(`unknown companySlug: ${companySlug}`)
  }

  const roleTypeRaw = str('roleType')
  const roleType = (roleTypeRaw || null) as RoleType | null
  if (roleType && !ROLE_TYPES.includes(roleType)) {
    errors.push(`roleType must be one of ${ROLE_TYPES.join(', ')}`)
  }
  if (intent === 'join' && !roleType) {
    errors.push('a join needs a roleType so the company knows what you would do')
  }

  const name = str('name')
  if (!name) errors.push('name is required')
  if (name.length > MAX_NAME) errors.push(`name must be under ${MAX_NAME} characters`)

  const email = str('email').toLowerCase()
  if (!email) errors.push('email is required')
  else if (!EMAIL_RE.test(email)) errors.push('email is not a valid address')

  const proof = str('proof')
  if (!proof) errors.push('proof is required')
  else if (proof.length < MIN_PROOF) {
    errors.push(`proof must be at least ${MIN_PROOF} characters: say what you have already done`)
  } else if (proof.length > MAX_PROOF) {
    errors.push(`proof must be under ${MAX_PROOF} characters`)
  }

  const urlRaw = str('url')
  const url = urlRaw || null
  if (url && !isSafeUrl(url)) errors.push('url must be an absolute http(s) link')

  const bandRaw = str('checkSizeBand')
  const checkSizeBand = (bandRaw || null) as CheckSizeBand | null
  if (checkSizeBand && !CHECK_SIZE_BANDS.includes(checkSizeBand)) {
    errors.push(`checkSizeBand must be one of ${CHECK_SIZE_BANDS.join(', ')}`)
  }
  if (intent === 'fund' && !checkSizeBand) {
    errors.push('a funding signal requires a checkSizeBand')
  }

  const stageRaw = str('stage')
  const stage = (stageRaw || null) as Stage | null
  if (stage && !STAGES.includes(stage)) {
    errors.push(`stage must be one of ${STAGES.join(', ')}`)
  }

  const visibilityRaw = str('visibility') || 'public'
  const visibility = visibilityRaw as Visibility
  if (!VISIBILITIES.includes(visibility)) {
    errors.push(`visibility must be one of ${VISIBILITIES.join(', ')}`)
  }

  const wantsIntro = input.wantsIntro === true

  if (errors.length > 0) return { ok: false, errors }

  return {
    ok: true,
    value: {
      problemSlug,
      actorType,
      intent,
      companySlug,
      roleType,
      name,
      email,
      url,
      proof,
      checkSizeBand,
      stage,
      visibility,
      wantsIntro,
    },
  }
}

/* ── Row mapping ─────────────────────────────────────────────────────────── */

type Row = {
  id: string
  created_at: string | Date
  problem_slug: string
  company_slug: string | null
  role_type: RoleType | null
  actor_type: ActorType
  intent: Intent
  name: string
  email: string
  url: string | null
  proof: string
  check_size_band: CheckSizeBand | null
  stage: Stage | null
  visibility: Visibility
  status: CommitmentStatus
  wants_intro: boolean
  confirmed_at?: string | Date | null
  reviewed_at?: string | Date | null
  review_note?: string | null
}

const toIso = (v: string | Date | null | undefined): string | null =>
  v instanceof Date ? v.toISOString() : (v ?? null)

/**
 * Public projection. Drops the email always, and drops name and url for anon
 * rows, so an anonymous allocator signal cannot be de-anonymised by reading
 * the rendered board or its JSON.
 */
function toPublic(row: Row): Commitment {
  const anon = row.visibility === 'anon'
  return {
    id: row.id,
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    problemSlug: row.problem_slug,
    companySlug: row.company_slug,
    roleType: row.role_type,
    actorType: row.actor_type,
    intent: row.intent,
    name: anon ? null : row.name,
    url: anon ? null : row.url,
    proof: row.proof,
    checkSizeBand: row.check_size_band,
    stage: row.stage,
    visibility: row.visibility,
    status: row.status,
    wantsIntro: row.wants_intro,
  }
}

function toAdmin(row: Row): CommitmentAdminRow {
  return {
    ...toPublic(row),
    // The admin view intentionally sees the real name even for anon rows, so a
    // reviewer can judge the submission. Only the public projection hides it.
    name: row.name,
    url: row.url,
    email: row.email,
    confirmedAt: toIso(row.confirmed_at),
    reviewedAt: toIso(row.reviewed_at),
    reviewNote: row.review_note ?? null,
  }
}

/* ── Reads ───────────────────────────────────────────────────────────────── */

/** Approved and listed commitments for one problem, newest first. */
export async function listByProblem(problemSlug: string): Promise<Commitment[]> {
  if (!isDbConfigured()) return []
  const sql = getSql()
  const rows = (await sql`
    select * from commitments
    where problem_slug = ${problemSlug}
      and status in ('approved', 'listed')
    order by created_at desc
    limit 200
  `) as Row[]
  return rows.map(toPublic)
}

/** Public counts for every problem in one query. Drives the board headers. */
export async function countsByProblem(): Promise<Map<string, ProblemCounts>> {
  const out = new Map<string, ProblemCounts>()
  if (!isDbConfigured()) return out
  const sql = getSql()
  const rows = (await sql`
    select problem_slug, actor_type, intent, count(*)::int as n
    from commitments
    where status in ('approved', 'listed')
    group by problem_slug, actor_type, intent
  `) as { problem_slug: string; actor_type: ActorType; intent: Intent; n: number }[]

  for (const r of rows) {
    const cur =
      out.get(r.problem_slug) ??
      ({
        problemSlug: r.problem_slug,
        willingToStart: 0,
        willingToJoin: 0,
        allocatorsWatching: 0,
        openNeeds: 0,
        total: 0,
      } satisfies ProblemCounts)

    if (r.intent === 'start') cur.willingToStart += r.n
    else if (r.intent === 'join') cur.willingToJoin += r.n
    else if (r.intent === 'fund') cur.allocatorsWatching += r.n
    else if (r.intent === 'hire' || r.intent === 'raise') cur.openNeeds += r.n
    cur.total += r.n

    out.set(r.problem_slug, cur)
  }
  return out
}

/** The homepage ticker. Anon-safe by construction, since it uses toPublic. */
export async function listRecentPublic(limit = 5): Promise<Commitment[]> {
  if (!isDbConfigured()) return []
  const sql = getSql()
  const rows = (await sql`
    select * from commitments
    where status in ('approved', 'listed')
    order by created_at desc
    limit ${limit}
  `) as Row[]
  return rows.map(toPublic)
}

/** Review queue. Confirmed-but-unreviewed first, because those are actionable. */
export async function listForReview(): Promise<CommitmentAdminRow[]> {
  if (!isDbConfigured()) return []
  const sql = getSql()
  const rows = (await sql`
    select * from commitments
    order by
      case when status = 'pending' and confirmed_at is not null then 0
           when status = 'pending' then 1
           else 2 end,
      created_at desc
    limit 200
  `) as Row[]
  return rows.map(toAdmin)
}

/** New approvals since a cutoff, for the weekly digest. */
export async function listApprovedSince(since: Date): Promise<Commitment[]> {
  if (!isDbConfigured()) return []
  const sql = getSql()
  const rows = (await sql`
    select * from commitments
    where status in ('approved', 'listed')
      and reviewed_at >= ${since.toISOString()}
    order by problem_slug, created_at desc
  `) as Row[]
  return rows.map(toPublic)
}

/* ── Writes ──────────────────────────────────────────────────────────────── */

export type CreateResult =
  | { ok: true; id: string; confirmToken: string }
  | { ok: false; errors: string[]; status: number }

/**
 * How many submissions this address may make per day. A soft guard, not real
 * abuse prevention. It exists so one enthusiastic person cannot fill the
 * review queue before a human ever sees it.
 */
export const DAILY_LIMIT_PER_EMAIL = 5

export async function createCommitment(raw: unknown): Promise<CreateResult> {
  const parsed = validateCommitment(raw)
  if (!parsed.ok) return { ok: false, errors: parsed.errors, status: 400 }

  if (!isDbConfigured()) {
    return {
      ok: false,
      errors: ['the coordination board is not configured on this deployment'],
      status: 503,
    }
  }

  const v = parsed.value
  const sql = getSql()

  const recent = (await sql`
    select count(*)::int as n from commitments
    where email = ${v.email} and created_at > now() - interval '1 day'
  `) as { n: number }[]
  if ((recent[0]?.n ?? 0) >= DAILY_LIMIT_PER_EMAIL) {
    return {
      ok: false,
      errors: ['too many submissions from this address today'],
      status: 429,
    }
  }

  const confirmToken = randomUUID()
  const inserted = (await sql`
    insert into commitments (
      problem_slug, company_slug, role_type, actor_type, intent,
      name, email, url, proof,
      check_size_band, stage, visibility, wants_intro,
      status, confirm_token
    ) values (
      ${v.problemSlug}, ${v.companySlug}, ${v.roleType}, ${v.actorType}, ${v.intent},
      ${v.name}, ${v.email}, ${v.url}, ${v.proof},
      ${v.checkSizeBand}, ${v.stage}, ${v.visibility}, ${v.wantsIntro},
      'pending', ${confirmToken}
    )
    returning id
  `) as { id: string }[]

  const id = inserted[0]?.id
  if (!id) return { ok: false, errors: ['insert failed'], status: 500 }
  return { ok: true, id, confirmToken }
}

/**
 * Marks the address verified. Does NOT make the row public: it still needs a
 * human. Returns null when the token is unknown or already used.
 */
export async function confirmCommitment(token: string): Promise<Commitment | null> {
  if (!isDbConfigured() || !token) return null
  const sql = getSql()
  const rows = (await sql`
    update commitments
    set confirmed_at = now()
    where confirm_token = ${token} and confirmed_at is null
    returning *
  `) as Row[]
  const row = rows[0]
  return row ? toPublic(row) : null
}

export async function setStatus(
  id: string,
  status: CommitmentStatus,
  reviewNote?: string,
): Promise<void> {
  if (!isDbConfigured()) return
  const sql = getSql()
  await sql`
    update commitments
    set status = ${status},
        reviewed_at = now(),
        review_note = ${reviewNote ?? null}
    where id = ${id}
  `
}
