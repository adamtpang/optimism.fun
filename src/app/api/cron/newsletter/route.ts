/**
 * POST /api/cron/newsletter
 *
 * Weekly newsletter drafting. Runs every Monday morning via Vercel Cron.
 *
 * Pipeline (when fully configured):
 *   1. Pick the next-up problem from a deterministic rotation through
 *      src/data/problems.ts (by current week number).
 *   2. Ask Anthropic to draft a two-part doc:
 *        - blackpaper: deep dive on the problem
 *        - whitepaper: proposed solution in YC RFS voice
 *   3. Email the draft to the editor (RESEND_NOTIFY_EMAIL).
 *
 * The actual broadcast is *not* auto-sent. After editing, the editor copies
 * the doc into src/data/whitepapers.ts and triggers
 * POST /api/newsletter/broadcast to ship it via Resend.
 *
 * Auth: Bearer CRON_SECRET.
 *
 * Degrades to stub mode when ANTHROPIC_API_KEY or RESEND_API_KEY is missing.
 */
import { NextResponse } from 'next/server'
import { askForJson, isAnthropicConfigured } from '@/lib/anthropic'
import { resend, fromEmail, notifyEmail } from '@/lib/resend'
import { problems } from '@/data/problems'
import { currentWeekNumber } from '@/data/whitepapers'
import type { Problem } from '@/data/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

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

const SYSTEM_PROMPT = `You are the lead writer at optimism.fun. You produce a weekly two-part drop on a chosen problem from humanity's leaderboard.

Voice: serious, evidence-led, optimistic. Think Patrick Collison's "We Need a New Science of Progress" meets Hyperloop Alpha meets the YC Request for Startups.

You will be given a problem entry. Produce two markdown documents:

1. BLACKPAPER — the deep dive on the problem. Sections:
   - "What the world looks like today" — concrete, falsifiable
   - "Who's affected" — populations + numbers, sourced
   - "What's been tried" — name the approaches and where they fall short
   - "Why it persists" — the structural reason the world hasn't fixed this

2. WHITEPAPER — the proposed solution. Sections:
   - "The shape" — what a serious team would build
   - "Why now" — the unlock (tech, cost, regulatory)
   - "Market size" — TAM with sourced reasoning
   - "Who would back it" — types of allocators + named examples
   - "Call to action" — 2-3 sentences in YC RFS voice, addressed to founders

Constraints:
- Lead with the pain in every section.
- No hand-waving. Numbers cite a source even if the source is "open question".
- Each doc is 600-1000 words.
- Output ONLY the JSON below in a single \`\`\`json fenced block.

Schema:
{
  "blackpaper": "string (markdown)",
  "whitepaper": "string (markdown)",
  "subject": "string (newsletter subject, <=70 chars)",
  "preheader": "string (preheader line, <=110 chars)",
  "ctaFor": "founder" | "allocator",
  "ctaBody": "string (2-3 sentences)"
}`

type Draft = {
  blackpaper: string
  whitepaper: string
  subject: string
  preheader: string
  ctaFor: 'founder' | 'allocator'
  ctaBody: string
}

function isValidDraft(x: unknown): x is Draft {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.blackpaper === 'string' &&
    typeof o.whitepaper === 'string' &&
    typeof o.subject === 'string' &&
    typeof o.preheader === 'string' &&
    (o.ctaFor === 'founder' || o.ctaFor === 'allocator') &&
    typeof o.ctaBody === 'string'
  )
}

function pickProblemForWeek(week: number): Problem {
  // Deterministic rotation through the curated list. Once whitepapers
  // start landing we can prefer "no whitepaper this quarter" instead, but
  // for week-1 the rotation is fine.
  if (problems.length === 0) throw new Error('no problems to rotate')
  return problems[week % problems.length]!
}

async function draftFor(problem: Problem): Promise<Draft | null> {
  const compact = {
    slug: problem.slug,
    name: problem.name,
    tier: problem.tier,
    tagline: problem.tagline,
    description: problem.description,
    humansAffected: problem.humansAffected.value,
    severity: problem.severity.value,
    marketSize: problem.marketSize?.value,
    welfareBCR: problem.scores.welfareBCR?.value,
    xriskITN: problem.scores.xriskITN?.value,
    utilityDelta: problem.scores.utilityDelta?.value,
    transformation: problem.transformation,
    sources: problem.sources,
  }
  const prompt = `Problem entry (JSON):\n${JSON.stringify(compact, null, 2)}\n\nProduce the two-doc drop per the schema in your system prompt.`
  const result = await askForJson<Draft>({
    system: SYSTEM_PROMPT,
    prompt,
    maxTokens: 8000,
  })
  if (!isValidDraft(result)) return null
  return result
}

function renderDraftEmail(args: {
  problem: Problem
  draft: Draft
  week: number
}): { html: string; text: string } {
  const { problem, draft, week } = args
  const text = `Week ${week} draft: ${problem.name}

SUBJECT: ${draft.subject}
PREHEADER: ${draft.preheader}
CTA FOR: ${draft.ctaFor}

---
BLACKPAPER
---
${draft.blackpaper}

---
WHITEPAPER
---
${draft.whitepaper}

---
CTA
---
${draft.ctaBody}

---
Once edited, add the finalized doc to src/data/whitepapers.ts and
POST /api/newsletter/broadcast?slug=<doc-slug> to ship.
`
  const html = `<pre style="font-family: ui-monospace, monospace; white-space: pre-wrap; font-size: 13px; line-height: 1.5;">${escapeHtml(text)}</pre>`
  return { html, text }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function GET(req: Request) {
  return POST(req)
}

export async function POST(req: Request) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  const anthropicOn = isAnthropicConfigured()
  const resendOn = Boolean(resend)
  const fullyConfigured = anthropicOn && resendOn

  const week = currentWeekNumber()
  const problem = pickProblemForWeek(week)

  const envStatus = {
    required: { CRON_SECRET: Boolean(process.env.CRON_SECRET) },
    optional: {
      ANTHROPIC_API_KEY: anthropicOn,
      RESEND_API_KEY: resendOn,
      RESEND_NOTIFY_EMAIL: Boolean(process.env.RESEND_NOTIFY_EMAIL),
    },
    fullyConfigured,
  }

  if (!fullyConfigured) {
    const payload = {
      ok: true,
      ranAt: new Date().toISOString(),
      env: envStatus,
      week,
      pickedProblem: { slug: problem.slug, name: problem.name },
      result: { mode: 'stub' as const, emailed: false },
      nextSteps: [
        anthropicOn ? null : 'Wire ANTHROPIC_API_KEY',
        resendOn ? null : 'Wire RESEND_API_KEY',
      ].filter(Boolean),
    }
    console.info(JSON.stringify({ event: 'cron:newsletter', ...payload }))
    return NextResponse.json(payload)
  }

  let emailed = false
  let draftSummary: { hasBlackpaper: boolean; hasWhitepaper: boolean } | null = null
  let error: string | null = null

  try {
    const draft = await draftFor(problem)
    if (!draft) {
      error = 'anthropic returned an unparseable draft'
    } else {
      draftSummary = {
        hasBlackpaper: Boolean(draft.blackpaper),
        hasWhitepaper: Boolean(draft.whitepaper),
      }
      const { html, text } = renderDraftEmail({ problem, draft, week })
      const sent = await resend!.emails.send({
        from: fromEmail,
        to: notifyEmail,
        subject: `[optimism.fun draft] week ${week} · ${problem.name}`,
        html,
        text,
      })
      emailed = !sent.error
      if (sent.error) error = sent.error.message ?? 'resend send failed'
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  const payload = {
    ok: !error,
    ranAt: new Date().toISOString(),
    env: envStatus,
    week,
    pickedProblem: { slug: problem.slug, name: problem.name },
    result: { mode: 'live' as const, emailed, draftSummary, error },
    nextSteps: emailed
      ? [
          `Edit the draft now in your inbox (${notifyEmail}).`,
          'Move the finalized doc into src/data/whitepapers.ts.',
          'POST /api/newsletter/broadcast?slug=<doc-slug> with Bearer CRON_SECRET to ship.',
        ]
      : [],
  }
  console.info(JSON.stringify({ event: 'cron:newsletter', ...payload }))
  return NextResponse.json(payload)
}
