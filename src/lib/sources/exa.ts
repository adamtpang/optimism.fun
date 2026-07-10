/**
 * Exa Agent client — structured, cited problem sourcing.
 *
 * Exa Agent (https://exa.ai/docs · /reference/agent-api) is an async,
 * high-compute endpoint that runs deep web research and returns
 * schema-validated JSON with field-level citations. We use it as a one-shot
 * sourcing engine: instead of the GNews→Claude two-step (fetch a signal, then
 * score it), Exa Agent *finds and structures* candidate problems for the
 * optimism.fun leaderboard in a single run.
 *
 * No SDK dependency — raw fetch against https://api.exa.ai/agent/runs with an
 * `x-api-key` header, matching the worldbank.ts idiom. Free to wire,
 * usage-based to run (priced per Agent Compute Unit + search; `effort` sets
 * the cost/quality tradeoff).
 *
 * Degrades gracefully: isExaConfigured() === false → callers get []. Any
 * network / parse / non-terminal failure also resolves to [] rather than
 * throwing, so the cron never hard-fails on Exa.
 */
import type { Tier } from '@/data/types'
// Type-only import: erased at compile time, so this does NOT pull the Neon
// runtime (db.ts) into this module's bundle.
import type { UpsertCandidate } from '@/lib/candidates'

const BASE = 'https://api.exa.ai/agent'
const VALID_TIERS: Tier[] = ['welfare', 'x-risk', 'hard-tech', 'progress', 'emerging']

export type ExaEffort = 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'auto'

export function isExaConfigured(): boolean {
  return Boolean(process.env.EXA_API_KEY)
}

// ---------------------------------------------------------------------------
// Agent run plumbing
// ---------------------------------------------------------------------------

type RunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
const TERMINAL: RunStatus[] = ['completed', 'failed', 'cancelled']

type AgentRun = {
  id: string
  status: RunStatus
  output?: { text?: string; structured?: unknown } | null
  costDollars?: unknown
}

async function createRun(body: Record<string, unknown>): Promise<AgentRun | null> {
  const key = process.env.EXA_API_KEY
  if (!key) return null
  try {
    const res = await fetch(`${BASE}/runs`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as AgentRun
  } catch {
    return null
  }
}

async function getRun(id: string): Promise<AgentRun | null> {
  const key = process.env.EXA_API_KEY
  if (!key) return null
  try {
    const res = await fetch(`${BASE}/runs/${encodeURIComponent(id)}`, {
      headers: { 'x-api-key': key },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as AgentRun
  } catch {
    return null
  }
}

async function pollUntilFinished(
  id: string,
  opts: { intervalMs?: number; timeoutMs?: number } = {},
): Promise<AgentRun | null> {
  const interval = opts.intervalMs ?? 4000
  const timeout = opts.timeoutMs ?? 240_000
  const start = Date.now()
  for (;;) {
    const run = await getRun(id)
    if (!run) return null
    if (TERMINAL.includes(run.status)) return run
    if (Date.now() - start > timeout) return run // give up; caller treats non-completed as []
    await new Promise((r) => setTimeout(r, interval))
  }
}

// ---------------------------------------------------------------------------
// Output schema — mirrors the AiCandidate / ProblemCandidate shape so Exa
// returns rows that map 1:1 onto upsertCandidate(). Numeric fields are
// optional (omitted when Exa can't defensibly source them) rather than
// nullable, which keeps the schema simple and portable.
// ---------------------------------------------------------------------------

function buildProblemSchema(maxItems: number): Record<string, unknown> {
  return {
    type: 'object',
    properties: {
      problems: {
        type: 'array',
        maxItems,
        items: {
          type: 'object',
          properties: {
            slug: { type: 'string', description: 'kebab-case slug' },
            name: { type: 'string', description: 'Short title (<=60 chars)' },
            tier: { type: 'string', enum: VALID_TIERS },
            tagline: { type: 'string', description: 'Single-sentence pitch (<=180 chars)' },
            description: { type: 'string', description: '2-4 paragraph framing' },
            humansAffected: { type: 'number', description: 'People affected, best honest estimate' },
            severity: { type: 'number', description: '0..1' },
            marketSize: { type: 'number', description: 'Addressable spend in USD' },
            currentSolutionQuality: {
              type: 'number',
              description: '0..1, where LOW = high opportunity (the world is under-attacking it)',
            },
            welfareBCR: { type: 'number', description: 'Welfare benefit-cost ratio, if applicable' },
            xriskITN: { type: 'number', description: 'Importance×Tractability×Neglectedness, 0..10' },
            utilityDelta: { type: 'number', description: '0..1' },
            transformation: {
              type: 'object',
              description: 'Concrete, falsifiable before→after, in the spirit of Hyperloop Alpha',
              properties: {
                before: { type: 'string' },
                after: { type: 'string' },
                horizon: { type: 'string', description: 'e.g. "10 years", "1 generation"' },
              },
              required: ['before', 'after'],
            },
            sources: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  url: { type: 'string', format: 'uri' },
                },
                required: ['title', 'url'],
              },
            },
            rationale: { type: 'string', description: 'Why this is a high-leverage candidate (1-2 sentences)' },
          },
          required: ['slug', 'name', 'tier', 'tagline', 'description'],
        },
      },
    },
    required: ['problems'],
  }
}

const DEFAULT_QUERY = `You are sourcing candidate problems for optimism.fun — a public leaderboard ranking humanity's highest-leverage, most under-attacked problems.

Find distinct problems that each (a) affect at least 1 million people, and (b) the world is currently under-attacking, where a focused effort could meaningfully move the needle. Favor problems that are concrete, fresh, and defensibly real over generic restatements of well-known causes.

For each problem, return the fields in the schema. Every number must be honest: if you cannot defensibly source a value, omit that field rather than guessing. Tier must be one of: welfare, x-risk, hard-tech, progress, emerging. transformation.before/after must be concrete and falsifiable. Include 1-3 sources with real, working URLs.`

// ---------------------------------------------------------------------------
// Mapping Exa output → UpsertCandidate
// ---------------------------------------------------------------------------

type RawSource = { title?: unknown; url?: unknown }
type RawProblem = {
  slug?: unknown
  name?: unknown
  tier?: unknown
  tagline?: unknown
  description?: unknown
  humansAffected?: unknown
  severity?: unknown
  marketSize?: unknown
  currentSolutionQuality?: unknown
  welfareBCR?: unknown
  xriskITN?: unknown
  utilityDelta?: unknown
  transformation?: { before?: unknown; after?: unknown; horizon?: unknown } | null
  sources?: unknown
  rationale?: unknown
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

function num(v: unknown): number | null {
  if (typeof v !== 'number' || !Number.isFinite(v)) return null
  return v
}

function clamp01(v: number | null): number | null {
  if (v === null) return null
  return Math.min(1, Math.max(0, v))
}

function asTier(v: unknown): Tier | null {
  return typeof v === 'string' && (VALID_TIERS as string[]).includes(v) ? (v as Tier) : null
}

function cleanSources(v: unknown): { title: string; url: string }[] {
  if (!Array.isArray(v)) return []
  const out: { title: string; url: string }[] = []
  for (const s of v as RawSource[]) {
    const title = str(s?.title)
    const url = str(s?.url)
    if (title && url) out.push({ title, url })
  }
  return out
}

function toUpsert(raw: RawProblem): UpsertCandidate | null {
  const slug = str(raw.slug)
  const name = str(raw.name)
  const tier = asTier(raw.tier)
  const tagline = str(raw.tagline)
  const description = str(raw.description)
  // Same required-field gate the news pipeline applies in isValidCandidate().
  if (!slug || !name || !tier || !tagline || !description) return null

  const today = new Date().toISOString().slice(0, 10)
  const sources = cleanSources(raw.sources)
  const t = raw.transformation
  const before = str(t?.before)
  const after = str(t?.after)

  return {
    slug,
    name,
    tier,
    tagline,
    description,
    humansAffected: num(raw.humansAffected),
    severity: clamp01(num(raw.severity)),
    marketSize: num(raw.marketSize),
    currentSolutionQuality: clamp01(num(raw.currentSolutionQuality)),
    welfareBCR: num(raw.welfareBCR),
    xriskITN: num(raw.xriskITN),
    utilityDelta: clamp01(num(raw.utilityDelta)),
    transformation:
      before && after
        ? { before, after, horizon: str(t?.horizon) ?? 'unspecified', confidence: 'low', asOf: today }
        : null,
    sources,
    // Provenance: tag the row as Exa-sourced so /admin/candidates can tell it
    // apart from GNews signals at review time.
    signalUrl: sources[0]?.url ?? null,
    signalTitle: `Exa Agent sourcing — ${name}`,
    signalPublishedAt: new Date().toISOString(),
    rationale: str(raw.rationale),
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type SourceProblemsOptions = {
  /** Override the sourcing prompt. */
  query?: string
  /** Cap the number of candidates Exa returns (and we persist). Default 8. */
  maxItems?: number
  /** Cost/quality tradeoff. Default 'medium' — a balanced single-entity research run. */
  effort?: ExaEffort
  /** How long to wait for the async run before giving up. Default 240s. */
  timeoutMs?: number
}

/**
 * Run one Exa Agent sourcing pass and return validated, upsert-ready problem
 * candidates. Returns [] when Exa is unconfigured or the run fails — never throws.
 */
export async function sourceProblemCandidates(
  opts: SourceProblemsOptions = {},
): Promise<UpsertCandidate[]> {
  if (!isExaConfigured()) return []
  const maxItems = opts.maxItems ?? 8

  const created = await createRun({
    query: opts.query ?? DEFAULT_QUERY,
    effort: opts.effort ?? 'medium',
    outputSchema: buildProblemSchema(maxItems),
  })
  if (!created?.id) return []

  const run = TERMINAL.includes(created.status)
    ? created
    : await pollUntilFinished(created.id, { timeoutMs: opts.timeoutMs })
  if (!run || run.status !== 'completed') return []

  const structured = run.output?.structured as { problems?: unknown[] } | undefined
  const list = Array.isArray(structured?.problems) ? structured!.problems! : []

  const out: UpsertCandidate[] = []
  for (const raw of list.slice(0, maxItems)) {
    const mapped = toUpsert(raw as RawProblem)
    if (mapped) out.push(mapped)
  }
  return out
}

// ---------------------------------------------------------------------------
// Queue signals — Exa Agent as the extractor for demand data with NO API.
// Queues are demand that markets fail to clear (waiting = a suppressed price
// signal). The sources below publish numbers only as web pages / reports, so
// Exa's structured research turns them into rows for the `queues` demand
// class. Async + slow: call from a cron/route, never at page render.
// ---------------------------------------------------------------------------

export type QueueSignal = {
  problemSlug: string
  metric: string
  value: number
  unit: string
  asOf: string
  sourceTitle: string
  sourceUrl: string
}

const QUEUE_TARGETS: { problemSlug: string; ask: string }[] = [
  {
    problemSlug: 'energy-abundance',
    ask: 'Total active generation + storage capacity (GW) waiting in US grid interconnection queues, per the latest LBNL "Queued Up" report',
  },
  {
    problemSlug: 'housing-construction',
    ask: 'Current US rental vacancy rate (%) per the latest Census Bureau Housing Vacancies and Homeownership release, plus the most-cited current estimate of the US housing shortage in units if available',
  },
  {
    problemSlug: 'longevity',
    ask: 'Number of candidates currently on the US national organ transplant waiting list, per OPTN/UNOS national data',
  },
]

const QUEUE_SCHEMA = {
  type: 'object',
  properties: {
    signals: {
      type: 'array',
      maxItems: 6,
      items: {
        type: 'object',
        properties: {
          problemSlug: { type: 'string' },
          metric: { type: 'string' },
          value: { type: 'number' },
          unit: { type: 'string' },
          asOf: { type: 'string', description: 'Date or period the number refers to' },
          sourceTitle: { type: 'string' },
          sourceUrl: { type: 'string', format: 'uri' },
        },
        required: ['problemSlug', 'metric', 'value', 'unit', 'sourceUrl'],
      },
    },
  },
  required: ['signals'],
} as const

/**
 * One Exa Agent run extracting the queue metrics above with citations.
 * Returns [] when Exa is unconfigured or the run fails — never throws.
 */
export async function sourceQueueSignals(
  opts: { effort?: ExaEffort; timeoutMs?: number } = {},
): Promise<QueueSignal[]> {
  if (!isExaConfigured()) return []

  const query = `Extract the following demand-queue statistics, each with its authoritative source URL and the date the number refers to. Only report numbers you can cite; omit anything you cannot verify.

${QUEUE_TARGETS.map((t) => `- problemSlug "${t.problemSlug}": ${t.ask}`).join('\n')}`

  const created = await createRun({
    query,
    effort: opts.effort ?? 'medium',
    outputSchema: QUEUE_SCHEMA,
  })
  if (!created?.id) return []

  const run = TERMINAL.includes(created.status)
    ? created
    : await pollUntilFinished(created.id, { timeoutMs: opts.timeoutMs })
  if (!run || run.status !== 'completed') return []

  const structured = run.output?.structured as { signals?: unknown[] } | undefined
  const list = Array.isArray(structured?.signals) ? structured!.signals! : []
  const allowed = new Set(QUEUE_TARGETS.map((t) => t.problemSlug))

  const out: QueueSignal[] = []
  for (const raw of list) {
    const s = raw as Partial<QueueSignal>
    if (
      typeof s.problemSlug === 'string' &&
      allowed.has(s.problemSlug) &&
      typeof s.metric === 'string' &&
      typeof s.value === 'number' &&
      Number.isFinite(s.value) &&
      typeof s.unit === 'string' &&
      typeof s.sourceUrl === 'string'
    ) {
      out.push({
        problemSlug: s.problemSlug,
        metric: s.metric,
        value: s.value,
        unit: s.unit,
        asOf: typeof s.asOf === 'string' ? s.asOf : 'unspecified',
        sourceTitle: typeof s.sourceTitle === 'string' ? s.sourceTitle : s.sourceUrl,
        sourceUrl: s.sourceUrl,
      })
    }
  }
  return out
}
