/**
 * Tests for the coordination layer's one write path.
 *
 * Validation is pure and tested directly. The create/list paths talk to Neon,
 * so `@/lib/db` is mocked with an in-memory table: the point is to prove the
 * module's own logic (rate limiting, status defaults, the anon projection,
 * problem filtering), not to test Postgres.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

/* ── In-memory stand-in for Neon ─────────────────────────────────────────── */

type StoredRow = Record<string, unknown>
const table: StoredRow[] = []
let dbConfigured = true

/**
 * The Neon driver is a tagged template. We identify which query is running by
 * looking for marker words in the SQL text, then serve it from `table`.
 */
function fakeSql(strings: TemplateStringsArray, ...values: unknown[]) {
  const text = strings.join(' ').replace(/\s+/g, ' ').trim().toLowerCase()

  if (text.includes('count(*)::int as n') && text.includes('where email =')) {
    const email = values[0]
    const since = Date.now() - 24 * 60 * 60 * 1000
    const n = table.filter(
      (r) => r.email === email && new Date(r.created_at as string).getTime() > since,
    ).length
    return Promise.resolve([{ n }])
  }

  if (text.startsWith('insert into commitments')) {
    const [
      problem_slug, company_slug, role_type, actor_type, intent,
      name, email, url, proof,
      check_size_band, stage, visibility, wants_intro,
      confirm_token,
    ] = values
    const row: StoredRow = {
      id: `id-${table.length + 1}`,
      created_at: new Date().toISOString(),
      problem_slug, company_slug, role_type, actor_type, intent,
      name, email, url, proof,
      check_size_band, stage, visibility, wants_intro,
      status: 'pending',
      confirm_token,
      confirmed_at: null,
      reviewed_at: null,
      review_note: null,
    }
    table.push(row)
    return Promise.resolve([{ id: row.id }])
  }

  if (text.startsWith('update commitments') && text.includes('confirmed_at = now()')) {
    const token = values[0]
    const row = table.find((r) => r.confirm_token === token && r.confirmed_at === null)
    if (!row) return Promise.resolve([])
    row.confirmed_at = new Date().toISOString()
    return Promise.resolve([row])
  }

  if (text.startsWith('update commitments') && text.includes('set status =')) {
    const [status, reviewNote, id] = values
    const row = table.find((r) => r.id === id)
    if (row) {
      row.status = status
      row.review_note = reviewNote
      row.reviewed_at = new Date().toISOString()
    }
    return Promise.resolve([])
  }

  if (text.includes('group by problem_slug')) {
    const groups = new Map<string, { problem_slug: string; actor_type: string; intent: string; n: number }>()
    for (const r of table) {
      if (r.status !== 'approved' && r.status !== 'listed') continue
      const key = `${r.problem_slug}|${r.actor_type}|${r.intent}`
      const cur = groups.get(key)
      if (cur) cur.n += 1
      else groups.set(key, {
        problem_slug: r.problem_slug as string,
        actor_type: r.actor_type as string,
        intent: r.intent as string,
        n: 1,
      })
    }
    return Promise.resolve([...groups.values()])
  }

  if (text.includes('where problem_slug =')) {
    const slug = values[0]
    return Promise.resolve(
      table.filter(
        (r) => r.problem_slug === slug && (r.status === 'approved' || r.status === 'listed'),
      ),
    )
  }

  if (text.includes("status in ('approved', 'listed')")) {
    return Promise.resolve(
      table.filter((r) => r.status === 'approved' || r.status === 'listed'),
    )
  }

  return Promise.resolve(table)
}

vi.mock('@/lib/db', () => ({
  isDbConfigured: () => dbConfigured,
  getSql: () => fakeSql,
}))

import {
  validateCommitment,
  createCommitment,
  confirmCommitment,
  listByProblem,
  countsByProblem,
  listRecentPublic,
  setStatus,
  isSafeUrl,
  DAILY_LIMIT_PER_EMAIL,
  MIN_PROOF,
} from '@/lib/commitments'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'

const REAL_PROBLEM = problems[0].slug
const OTHER_PROBLEM = problems[1].slug
const REAL_COMPANY = companies[0].slug
const COMPANY_PROBLEM = companies[0].problemSlugs[0]

const base = {
  problemSlug: REAL_PROBLEM,
  actorType: 'talent',
  intent: 'start',
  name: 'Ada Lovelace',
  email: 'Ada@Example.com',
  proof: 'I shipped a prototype of the analytical engine notes last month.',
}

beforeEach(() => {
  table.length = 0
  dbConfigured = true
})

/* ── Validation ──────────────────────────────────────────────────────────── */

describe('validateCommitment', () => {
  it('accepts a well-formed talent start', () => {
    const r = validateCommitment(base)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.value.email).toBe('ada@example.com') // normalised
      expect(r.value.visibility).toBe('public') // defaulted
      expect(r.value.wantsIntro).toBe(false)
    }
  })

  it('rejects a non-object body', () => {
    expect(validateCommitment(null).ok).toBe(false)
    expect(validateCommitment('nope').ok).toBe(false)
  })

  it('rejects a problem slug that is not in the ranked index', () => {
    const r = validateCommitment({ ...base, problemSlug: 'time-travel' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.join()).toMatch(/unknown problemSlug/)
  })

  it('rejects an intent that does not belong to the actor type', () => {
    const r = validateCommitment({ ...base, actorType: 'capital', intent: 'start' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.join()).toMatch(/not valid for actorType/)
  })

  it('requires a company for join, hire and raise', () => {
    for (const intent of ['join', 'hire', 'raise']) {
      const actorType = intent === 'join' ? 'talent' : 'operator'
      const r = validateCommitment({ ...base, actorType, intent, companySlug: '' })
      expect(r.ok).toBe(false)
      if (!r.ok) expect(r.errors.join()).toMatch(/requires a companySlug/)
    }
  })

  it('rejects a company that is not already in the dataset', () => {
    const r = validateCommitment({
      ...base, intent: 'join', companySlug: 'pay-for-placement-inc',
    })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.join()).toMatch(/unknown companySlug/)
  })

  it('accepts a join against a real company', () => {
    const r = validateCommitment({
      ...base,
      problemSlug: COMPANY_PROBLEM,
      intent: 'join',
      companySlug: REAL_COMPANY,
      roleType: 'engineering',
    })
    expect(r.ok).toBe(true)
  })

  it('requires a role type on a join, so the record stays structured', () => {
    const r = validateCommitment({
      ...base, problemSlug: COMPANY_PROBLEM, intent: 'join', companySlug: REAL_COMPANY,
    })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.join()).toMatch(/roleType/)
  })

  it('requires a check size band on a funding signal', () => {
    const r = validateCommitment({ ...base, actorType: 'capital', intent: 'fund' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.join()).toMatch(/checkSizeBand/)
  })

  it('accepts an anonymous funding signal with a band', () => {
    const r = validateCommitment({
      ...base,
      actorType: 'capital',
      intent: 'fund',
      checkSizeBand: '100k-500k',
      visibility: 'anon',
    })
    expect(r.ok).toBe(true)
  })

  it('rejects proof that is too short to carry any signal', () => {
    const r = validateCommitment({ ...base, proof: 'yes' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.join()).toMatch(new RegExp(`${MIN_PROOF} characters`))
  })

  it('rejects a bad email', () => {
    const r = validateCommitment({ ...base, email: 'not-an-email' })
    expect(r.ok).toBe(false)
  })

  it('rejects a javascript: url and accepts an https one', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false)
    expect(isSafeUrl('https://example.com/proof')).toBe(true)
    const r = validateCommitment({ ...base, url: 'javascript:alert(1)' })
    expect(r.ok).toBe(false)
  })

  it('reports every problem at once rather than one at a time', () => {
    const r = validateCommitment({ problemSlug: '', actorType: 'x', intent: 'y', name: '', email: '', proof: '' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.length).toBeGreaterThan(3)
  })
})

/* ── Create ──────────────────────────────────────────────────────────────── */

describe('createCommitment', () => {
  it('writes a pending, unconfirmed row and returns a confirm token', async () => {
    const r = await createCommitment(base)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.confirmToken).toBeTruthy()
    expect(table).toHaveLength(1)
    expect(table[0].status).toBe('pending')
    expect(table[0].confirmed_at).toBeNull()
  })

  it('never creates an already-public row', async () => {
    await createCommitment(base)
    expect(await listByProblem(REAL_PROBLEM)).toHaveLength(0)
  })

  it('refuses invalid input without writing', async () => {
    const r = await createCommitment({ ...base, proof: 'no' })
    expect(r.ok).toBe(false)
    expect(table).toHaveLength(0)
  })

  it('rate limits one address per day', async () => {
    for (let i = 0; i < DAILY_LIMIT_PER_EMAIL; i++) {
      expect((await createCommitment(base)).ok).toBe(true)
    }
    const overflow = await createCommitment(base)
    expect(overflow.ok).toBe(false)
    if (!overflow.ok) expect(overflow.status).toBe(429)
  })

  it('degrades to a 503 rather than throwing when the database is absent', async () => {
    dbConfigured = false
    const r = await createCommitment(base)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.status).toBe(503)
  })
})

/* ── Confirm and review ──────────────────────────────────────────────────── */

describe('confirm and review', () => {
  it('confirming marks the address but does not publish', async () => {
    const created = await createCommitment(base)
    if (!created.ok) throw new Error('setup failed')
    const confirmed = await confirmCommitment(created.confirmToken)
    expect(confirmed).not.toBeNull()
    expect(table[0].confirmed_at).not.toBeNull()
    expect(table[0].status).toBe('pending')
    expect(await listByProblem(REAL_PROBLEM)).toHaveLength(0)
  })

  it('a token cannot be replayed', async () => {
    const created = await createCommitment(base)
    if (!created.ok) throw new Error('setup failed')
    expect(await confirmCommitment(created.confirmToken)).not.toBeNull()
    expect(await confirmCommitment(created.confirmToken)).toBeNull()
  })

  it('an unknown token returns null', async () => {
    expect(await confirmCommitment('not-a-real-token')).toBeNull()
  })

  it('approving publishes it to the board', async () => {
    const created = await createCommitment(base)
    if (!created.ok) throw new Error('setup failed')
    await setStatus(created.id, 'approved')
    const listed = await listByProblem(REAL_PROBLEM)
    expect(listed).toHaveLength(1)
    expect(listed[0].intent).toBe('start')
  })

  it('rejecting keeps it off the board', async () => {
    const created = await createCommitment(base)
    if (!created.ok) throw new Error('setup failed')
    await setStatus(created.id, 'rejected', 'spam')
    expect(await listByProblem(REAL_PROBLEM)).toHaveLength(0)
  })
})

/* ── List by problem ─────────────────────────────────────────────────────── */

describe('listByProblem', () => {
  it('returns only the requested problem', async () => {
    const a = await createCommitment(base)
    const b = await createCommitment({ ...base, email: 'b@example.com', problemSlug: OTHER_PROBLEM })
    if (!a.ok || !b.ok) throw new Error('setup failed')
    await setStatus(a.id, 'approved')
    await setStatus(b.id, 'approved')

    const first = await listByProblem(REAL_PROBLEM)
    expect(first).toHaveLength(1)
    expect(first[0].problemSlug).toBe(REAL_PROBLEM)
  })

  it('hides the name and url of an anonymous row', async () => {
    const created = await createCommitment({
      ...base,
      actorType: 'capital',
      intent: 'fund',
      checkSizeBand: '2m-10m',
      visibility: 'anon',
      url: 'https://example.com/fund',
    })
    if (!created.ok) throw new Error('setup failed')
    await setStatus(created.id, 'approved')

    const [row] = await listByProblem(REAL_PROBLEM)
    expect(row.name).toBeNull()
    expect(row.url).toBeNull()
    // The band is the whole point of an anonymous signal, so it survives.
    expect(row.checkSizeBand).toBe('2m-10m')
  })

  it('never leaks an email address into the public shape', async () => {
    const created = await createCommitment(base)
    if (!created.ok) throw new Error('setup failed')
    await setStatus(created.id, 'approved')
    const [row] = await listByProblem(REAL_PROBLEM)
    expect(JSON.stringify(row)).not.toContain('example.com')
  })

  it('returns an empty array instead of throwing with no database', async () => {
    dbConfigured = false
    expect(await listByProblem(REAL_PROBLEM)).toEqual([])
    expect(await listRecentPublic()).toEqual([])
    expect([...(await countsByProblem()).keys()]).toEqual([])
  })
})

/* ── Counts ──────────────────────────────────────────────────────────────── */

describe('countsByProblem', () => {
  it('buckets each intent into the right counter', async () => {
    const mk = async (over: Record<string, unknown>, email: string) => {
      const r = await createCommitment({ ...base, email, ...over })
      if (!r.ok) throw new Error(`setup failed: ${r.errors.join()}`)
      await setStatus(r.id, 'approved')
    }
    await mk({}, 'a@example.com')
    await mk(
      { intent: 'join', companySlug: REAL_COMPANY, problemSlug: COMPANY_PROBLEM, roleType: 'research' },
      'b@example.com',
    )
    await mk({ actorType: 'capital', intent: 'fund', checkSizeBand: '<25k' }, 'c@example.com')

    const counts = await countsByProblem()
    expect(counts.get(REAL_PROBLEM)?.willingToStart).toBe(1)
    expect(counts.get(REAL_PROBLEM)?.allocatorsWatching).toBe(1)
    expect(counts.get(COMPANY_PROBLEM)?.willingToJoin).toBe(1)
  })

  it('counts only approved rows', async () => {
    await createCommitment(base)
    const counts = await countsByProblem()
    expect(counts.get(REAL_PROBLEM)).toBeUndefined()
  })
})
