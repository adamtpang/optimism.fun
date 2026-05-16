/**
 * POST /api/cron/problem-sourcing
 *
 * Programmatic problem sourcing + sorting. Runs daily via Vercel Cron.
 * Auth via CRON_SECRET (Bearer header).
 *
 * What this is meant to do (full pipeline, when env is wired):
 *   1. Pull recent signal from web sources (news, research feeds, RSS, GNews,
 *      relevant subreddits, X discourse around progress-studies / EA / x-risk).
 *   2. For each candidate problem, ask Anthropic to score against the four axes:
 *        - Quantity      (humans affected)
 *        - Severity      (per-capita welfare loss)
 *        - Current solution quality (low = high opportunity)
 *        - Market size   (TAM the world is already paying)
 *      And to draft a tagline, description, and transformation { before, after }.
 *   3. Upsert candidates into a Neon `problem_candidates` table (separate from
 *      the curated `problems.ts` array — humans still gate promotion).
 *   4. Surface promoted candidates in the dashboard with a "draft" badge until
 *      manual review.
 *
 * Current state: STUB. This returns the intended schema, validates auth, and
 * lists the env vars + work it would do. Wire-up is incremental:
 *   - Add ANTHROPIC_API_KEY, CRON_SECRET, DATABASE_URL to Vercel env vars
 *   - Add a web-search provider key (GNEWS_API_KEY or similar)
 *   - Create the `problem_candidates` table in Neon
 *   - Replace the stub body below with the live pipeline
 *
 * See also: src/data/problems.ts (curated list), src/data/types.ts (Problem
 * schema), and the related cron route `/api/cron/research` that exists in the
 * larger Aether tree.
 */
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const REQUIRED_ENV = ['CRON_SECRET'] as const
const OPTIONAL_ENV = [
  'ANTHROPIC_API_KEY',
  'DATABASE_URL',
  'GNEWS_API_KEY',
] as const

function authorize(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    // In dev / preview without CRON_SECRET set, allow but log so we don't
    // accidentally leak the route to the public internet on production.
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, status: 500, error: 'CRON_SECRET not configured on this deployment' }
    }
    return { ok: true }
  }
  const header = req.headers.get('authorization') ?? ''
  const presented = header.startsWith('Bearer ') ? header.slice(7) : header
  if (presented !== expected) {
    return { ok: false, status: 401, error: 'invalid or missing CRON_SECRET' }
  }
  return { ok: true }
}

async function runStub() {
  // No-op for now. Returns the work the live pipeline will do, so cron
  // schedules can be configured + monitored before the real run lands.
  return {
    candidatesConsidered: 0,
    candidatesUpserted: 0,
    notes: [
      'stub run — no external API calls, no DB writes.',
      'configure ANTHROPIC_API_KEY + DATABASE_URL + a web-search provider to enable.',
    ],
  }
}

export async function GET(req: Request) {
  return POST(req)
}

export async function POST(req: Request) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  const envStatus = {
    required: Object.fromEntries(
      REQUIRED_ENV.map((k) => [k, Boolean(process.env[k])]),
    ),
    optional: Object.fromEntries(
      OPTIONAL_ENV.map((k) => [k, Boolean(process.env[k])]),
    ),
  }

  const result = await runStub()
  const payload = {
    ok: true,
    ranAt: new Date().toISOString(),
    env: envStatus,
    result,
    nextSteps: [
      'Wire ANTHROPIC_API_KEY in Vercel env vars',
      'Wire a web-search provider key (GNEWS_API_KEY, EXA_API_KEY, or similar)',
      'Create problem_candidates table in Neon (or chosen DB)',
      'Replace runStub() with the live sourcing + scoring loop',
    ],
  }

  // Visible in Vercel runtime logs.
  console.info(JSON.stringify({ event: 'cron:problem-sourcing', ...payload }))

  return NextResponse.json(payload)
}
