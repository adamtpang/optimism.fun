/**
 * POST /api/fit-interview
 *
 * The AI founder-fit interviewer. Instead of a fixed quiz, Claude runs a short
 * adaptive interview (3-5 questions, one at a time) to understand who the person
 * is in the economy — their obsession, their edge, what they've actually built,
 * their risk appetite — then matches them to the 2-3 problems that are their best
 * founder-problem-market fit, favoring larger markets among genuine fits
 * (Andreessen: a great team in a tiny market still fails).
 *
 * Stateless: the client sends the whole conversation each call; we return either
 * the next question or the final result as JSON. Degrades to {type:'unconfigured'}
 * when ANTHROPIC_API_KEY is absent, so the UI can fall back to the quick quiz.
 */
import { NextResponse } from 'next/server'
import {
  getAnthropic,
  isAnthropicConfigured,
  extractJson,
  DEFAULT_MODEL,
} from '@/lib/anthropic'
import { problems, getProblemBySlug, DOMAIN_LABEL } from '@/data/problems'
import { getInLimitCap } from '@/data/in-limit'
import { ARCHETYPE_LIST, ARCHETYPES, type ArchetypeKey } from '@/data/archetypes'
import { fmtUsdCompact } from '@/lib/allocation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_QUESTIONS = 5

type Turn = { role: 'user' | 'assistant'; content: string }

const catalog = () =>
  problems
    .map((p) => {
      const prize = getInLimitCap(p.slug)
      const market = prize ? `${fmtUsdCompact(prize.marketCap.value)} prize` : 'market n/a'
      const domain = p.domain ? DOMAIN_LABEL[p.domain] : '—'
      return `- ${p.slug} — ${p.name} [${domain} / ${p.tier}] · ${market} · ${p.tagline}`
    })
    .join('\n')

const archetypeLines = () =>
  ARCHETYPE_LIST.map((a) => `- ${a.key}: ${a.name} — ${a.essence}`).join('\n')

function systemPrompt(): string {
  return `You are the founder-fit interviewer for optimism.fun — a site that ranks humanity's biggest problems and helps a person find their founder-problem fit: the problem that could be their life's work, and the company only they should build.

Your job: through a SHORT adaptive interview, understand who this person actually is in the economy — what they cannot stop thinking about, what they have actually built or done (revealed preference beats stated), their genuine edge, their risk appetite and resources — then match them to the 2-3 problems below that are their best founder-problem-market fit.

How to weigh it:
- Founder-problem fit first: real obsession + earned, specific insight into a problem.
- But a great team in a tiny market still fails (Andreessen). Among genuine fits, favor the LARGER markets (see each problem's prize at the limit).
- The best opportunities are high-demand and under-served. Reward non-consensus fit.

Interview style:
- Ask ONE question at a time, under 40 words, conversational and a little provocative — a good interviewer pushes and follows the thread. Build on their answers; never re-ask what you already know.
- Open by asking what problem or domain they find themselves returning to again and again.
- Stop as soon as you have enough signal (usually after 3-4 answers). NEVER exceed ${MAX_QUESTIONS} questions.

Output STRICT JSON inside a single \`\`\`json fence, nothing else. Exactly one of:
{"type":"question","question":"<your next question>","n":<question number, 1-${MAX_QUESTIONS}>}
{"type":"result","archetype":"<one archetype key>","summary":"<2-4 sentences: who they are and why these fit them specifically>","fits":[{"slug":"<problem slug from the catalog>","why":"<1-2 sentences, specific to THIS person>","marketAngle":"<the market size / why-now in one line>"}]}

The fits array has 2-3 items, best first. Every slug MUST be from the catalog. The archetype MUST be one of the keys below.

THE PROBLEMS (use these exact slugs):
${catalog()}

THE ARCHETYPES (pick the closest one key):
${archetypeLines()}`
}

export async function POST(req: Request) {
  if (!isAnthropicConfigured()) {
    return NextResponse.json({ type: 'unconfigured' })
  }

  let body: { messages?: Turn[] }
  try {
    body = (await req.json()) as { messages?: Turn[] }
  } catch {
    return NextResponse.json({ type: 'error', error: 'bad request' }, { status: 400 })
  }

  const history = Array.isArray(body.messages) ? body.messages : []
  // Count how many questions the AI has already asked.
  const asked = history.filter((m) => m.role === 'assistant').length

  const mapped: Turn[] = history.map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content ?? '').slice(0, 2000),
  }))

  // Force a result once we've hit the question budget — appended to the last
  // user turn so the conversation stays strictly alternating.
  if (asked >= MAX_QUESTIONS && mapped.length > 0 && mapped[mapped.length - 1].role === 'user') {
    mapped[mapped.length - 1] = {
      role: 'user',
      content: `${mapped[mapped.length - 1].content}\n\n[That is enough. Do not ask another question — return the result JSON now with my best 2-3 founder-problem fits.]`,
    }
  }

  // Always lead with a user turn (Claude requires it); the kickoff also primes
  // the interviewer to open with the right first question.
  const convo: Turn[] = [
    { role: 'user', content: 'Begin the founder-fit interview. Ask me your first question.' },
    ...mapped,
  ]

  try {
    const anthropic = getAnthropic()
    const msg = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1500,
      system: systemPrompt(),
      messages: convo,
    })
    const text = (msg.content as Array<{ type: string; text?: string }>)
      .filter((c) => c.type === 'text')
      .map((c) => c.text ?? '')
      .join('\n')

    const parsed = extractJson<{
      type?: string
      question?: string
      n?: number
      archetype?: string
      summary?: string
      fits?: { slug?: string; why?: string; marketAngle?: string }[]
    }>(text)

    if (!parsed || typeof parsed !== 'object') {
      return NextResponse.json({ type: 'error', error: 'unparseable' }, { status: 502 })
    }

    if (parsed.type === 'question' && parsed.question) {
      return NextResponse.json({
        type: 'question',
        question: String(parsed.question).slice(0, 400),
        n: Math.min(Math.max(Number(parsed.n) || asked + 1, 1), MAX_QUESTIONS),
        max: MAX_QUESTIONS,
      })
    }

    // Validate + clean the result.
    const validArch: ArchetypeKey = (parsed.archetype && parsed.archetype in ARCHETYPES
      ? parsed.archetype
      : 'missionary') as ArchetypeKey

    const fits = (parsed.fits ?? [])
      .filter((f) => f.slug && getProblemBySlug(f.slug))
      .slice(0, 3)
      .map((f) => ({
        slug: f.slug as string,
        why: String(f.why ?? '').slice(0, 400),
        marketAngle: String(f.marketAngle ?? '').slice(0, 300),
      }))

    if (fits.length === 0) {
      return NextResponse.json({ type: 'error', error: 'no valid fits' }, { status: 502 })
    }

    return NextResponse.json({
      type: 'result',
      archetype: validArch,
      summary: String(parsed.summary ?? '').slice(0, 800),
      fits,
    })
  } catch (err) {
    return NextResponse.json(
      { type: 'error', error: err instanceof Error ? err.message : 'interview failed' },
      { status: 502 },
    )
  }
}
