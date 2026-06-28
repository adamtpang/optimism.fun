/**
 * POST /api/cron/problem-sourcing
 *
 * Daily market research for humanity's problems. Triggered by Vercel Cron
 * (see vercel.json).
 *
 * Two additive sourcing pipelines feed the same problem_candidates table; a
 * human gates promotion to src/data/problems.ts via /admin/candidates.
 *
 *   A. Exa Agent (preferred): one async run does deep web research AND returns
 *      schema-validated candidates with citations (src/lib/sources/exa.ts).
 *   B. GNews → Anthropic (legacy): pull recent signal, then ask Claude to score
 *      each candidate against the four axes — quantity, severity,
 *      current-solution-quality, market size — and draft a transformation.
 *
 * Whichever sources are configured run; their results merge. Persistence
 * requires the Neon DB.
 *
 * Auth: Bearer CRON_SECRET. Vercel Cron sets this automatically when
 * CRON_SECRET is configured in env vars.
 *
 * Degrades gracefully:
 *   - missing CRON_SECRET in prod → 500 "not configured"
 *   - no DB, or no source keys → stub mode, returns status without calling
 *     external APIs or writing anything.
 */
import { NextResponse } from 'next/server'
import { fetchRecentSignal, isNewsConfigured, type SignalItem } from '@/lib/news-sources'
import { askForJson, isAnthropicConfigured } from '@/lib/anthropic'
import { isDbConfigured } from '@/lib/db'
import { upsertCandidate } from '@/lib/candidates'
import { isExaConfigured, sourceProblemCandidates } from '@/lib/sources/exa'
import type { Tier } from '@/data/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const VALID_TIERS: Tier[] = ['welfare', 'x-risk', 'hard-tech', 'progress', 'emerging']

function authorize(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.CRON_SECRET
  if (!expected) {
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

const SYSTEM_PROMPT = `You are the editorial assistant for optimism.fun — a public, hand-curated leaderboard ranking humanity's highest-leverage problems.

You will be given a recent news headline + description. Decide whether this signal points to a candidate "problem" worth adding to the leaderboard. If yes, produce structured JSON the editor can review.

Rules:
- A candidate problem is something affecting >1M humans that the world is currently under-attacking, where a focused effort could meaningfully move the needle.
- One signal can point to a problem we already have on the list (return null); we'll de-duplicate later. But if it's a notably new framing, include it.
- Every numeric field must be honest: if you don't have a defensible source for the number, leave it null.
- Tier must be one of: welfare, x-risk, hard-tech, progress, emerging.
- transformation.before/after should be concrete, falsifiable. Hyperloop Alpha's "1.35 hour SF to LA at \$20/ticket" is the spirit.

Return JSON in a single \`\`\`json fenced block. If the signal is not actionable, return \`\`\`json\\nnull\\n\`\`\`.

Schema:
{
  "slug": "kebab-case-slug",
  "name": "Short title (<=60 chars)",
  "tier": "welfare" | "x-risk" | "hard-tech" | "progress" | "emerging",
  "tagline": "Single-sentence pitch (<=180 chars)",
  "description": "2-4 paragraph framing",
  "humansAffected": number | null,
  "severity": number (0..1) | null,
  "marketSize": number (USD) | null,
  "currentSolutionQuality": number (0..1, low = high opportunity) | null,
  "welfareBCR": number | null,
  "xriskITN": number (0..10) | null,
  "utilityDelta": number (0..1) | null,
  "transformation": { "before": "...", "after": "...", "horizon": "..." } | null,
  "sources": [ { "title": "...", "url": "..." } ],
  "rationale": "Why this signal points to a candidate problem (1-2 sentences)"
}`

type AiCandidate = {
  slug: string
  name: string
  tier: Tier
  tagline: string
  description: string
  humansAffected: number | null
  severity: number | null
  marketSize: number | null
  currentSolutionQuality: number | null
  welfareBCR: number | null
  xriskITN: number | null
  utilityDelta: number | null
  transformation: { before: string; after: string; horizon: string } | null
  sources: { title: string; url: string }[]
  rationale: string
}

function isValidCandidate(c: unknown): c is AiCandidate {
  if (!c || typeof c !== 'object') return false
  const o = c as Record<string, unknown>
  if (typeof o.slug !== 'string' || !o.slug) return false
  if (typeof o.name !== 'string' || !o.name) return false
  if (typeof o.tagline !== 'string') return false
  if (typeof o.description !== 'string') return false
  if (typeof o.tier !== 'string' || !VALID_TIERS.includes(o.tier as Tier)) return false
  return true
}

async function scoreSignal(signal: SignalItem): Promise<AiCandidate | null> {
  const prompt = `Recent signal:
Title: ${signal.title}
Source: ${signal.source}
Published: ${signal.publishedAt}
URL: ${signal.url}
${signal.description ? `Description: ${signal.description}` : ''}

Produce the JSON candidate (or null) per the schema in your system prompt.`
  const result = await askForJson<AiCandidate | null>({
    system: SYSTEM_PROMPT,
    prompt,
    maxTokens: 2000,
  })
  if (!isValidCandidate(result)) return null
  return result
}

type PipelineRun = { considered: number; upserted: number; errors: string[] }

async function runNewsPipeline(): Promise<PipelineRun> {
  const signals = await fetchRecentSignal()
  let considered = 0
  let upserted = 0
  const errors: string[] = []

  for (const signal of signals) {
    considered++
    try {
      const candidate = await scoreSignal(signal)
      if (!candidate) continue
      const today = new Date().toISOString().slice(0, 10)
      await upsertCandidate({
        slug: candidate.slug,
        name: candidate.name,
        tier: candidate.tier,
        tagline: candidate.tagline,
        description: candidate.description,
        humansAffected: candidate.humansAffected,
        severity: candidate.severity,
        marketSize: candidate.marketSize,
        currentSolutionQuality: candidate.currentSolutionQuality,
        welfareBCR: candidate.welfareBCR,
        xriskITN: candidate.xriskITN,
        utilityDelta: candidate.utilityDelta,
        transformation: candidate.transformation
          ? { ...candidate.transformation, confidence: 'low', asOf: today }
          : null,
        sources: candidate.sources?.length
          ? candidate.sources
          : [{ title: signal.title, url: signal.url }],
        signalUrl: signal.url,
        signalTitle: signal.title,
        signalPublishedAt: signal.publishedAt,
        rationale: candidate.rationale ?? null,
      })
      upserted++
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err))
    }
  }

  return { considered, upserted, errors }
}

async function runExaPipeline(): Promise<PipelineRun> {
  let considered = 0
  let upserted = 0
  const errors: string[] = []

  // sourceProblemCandidates already returns upsert-ready, validated rows and
  // never throws (resolves to [] on any failure).
  const candidates = await sourceProblemCandidates({ effort: 'medium' })
  for (const candidate of candidates) {
    considered++
    try {
      await upsertCandidate(candidate)
      upserted++
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err))
    }
  }

  return { considered, upserted, errors }
}

export async function GET(req: Request) {
  return POST(req)
}

export async function POST(req: Request) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  const newsOn = isNewsConfigured()
  const anthropicOn = isAnthropicConfigured()
  const exaOn = isExaConfigured()
  const dbOn = isDbConfigured()

  // A source is "ready" if it can produce candidates end-to-end. Exa does
  // sourcing + structuring in one call; the news path needs GNews + Anthropic.
  const newsPathReady = newsOn && anthropicOn
  const anySourceReady = exaOn || newsPathReady
  // Persistence requires the DB. Without it we can't write candidates anywhere.
  const canRunLive = dbOn && anySourceReady

  const envStatus = {
    required: { CRON_SECRET: Boolean(process.env.CRON_SECRET) },
    optional: {
      EXA_API_KEY: exaOn,
      GNEWS_API_KEY: newsOn,
      ANTHROPIC_API_KEY: anthropicOn,
      DATABASE_URL: dbOn,
    },
    canRunLive,
  }

  let result: {
    mode: 'stub' | 'live'
    sources: string[]
    considered: number
    upserted: number
    errors: string[]
  }

  if (!canRunLive) {
    result = { mode: 'stub', sources: [], considered: 0, upserted: 0, errors: [] }
  } else {
    const sources: string[] = []
    let considered = 0
    let upserted = 0
    const errors: string[] = []

    if (exaOn) {
      const r = await runExaPipeline()
      sources.push('exa')
      considered += r.considered
      upserted += r.upserted
      errors.push(...r.errors)
    }
    if (newsPathReady) {
      const r = await runNewsPipeline()
      sources.push('news')
      considered += r.considered
      upserted += r.upserted
      errors.push(...r.errors)
    }

    result = { mode: 'live', sources, considered, upserted, errors }
  }

  const payload = {
    ok: true,
    ranAt: new Date().toISOString(),
    env: envStatus,
    result,
    nextSteps: canRunLive
      ? ['Review new candidates at /admin/candidates']
      : ([
          dbOn ? null : 'Wire DATABASE_URL (Neon) and run scripts/db/0001_problem_candidates.sql',
          anySourceReady
            ? null
            : 'Wire EXA_API_KEY (preferred — one-call sourcing) OR GNEWS_API_KEY + ANTHROPIC_API_KEY',
        ].filter(Boolean) as string[]),
  }

  console.info(JSON.stringify({ event: 'cron:problem-sourcing', ...payload }))

  return NextResponse.json(payload)
}
