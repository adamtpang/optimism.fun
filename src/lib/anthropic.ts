/**
 * Thin wrapper around the Anthropic SDK. Gracefully reports unconfigured
 * state via `isAnthropicConfigured()` so callers can degrade.
 *
 * Default model is Claude Opus 4.7 — chosen for high-stakes reasoning
 * (scoring candidate problems, drafting blackpapers). Lighter calls can
 * pass a different model id.
 */
import Anthropic from '@anthropic-ai/sdk'

let cached: Anthropic | null = null

export const DEFAULT_MODEL = 'claude-opus-4-7'

export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

export function getAnthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not configured. Wire it in Vercel env vars before calling getAnthropic().',
    )
  }
  if (!cached) {
    cached = new Anthropic({ apiKey })
  }
  return cached
}

/**
 * Convenience: ask Claude a single question and parse a JSON block out of
 * the response. The prompt should instruct the model to wrap its answer in
 * a ```json ... ``` fence (or return raw JSON). Returns null on parse fail
 * so callers don't have to try/catch every call.
 */
export async function askForJson<T = unknown>(args: {
  system: string
  prompt: string
  model?: string
  maxTokens?: number
}): Promise<T | null> {
  const anthropic = getAnthropic()
  const msg = await anthropic.messages.create({
    model: args.model ?? DEFAULT_MODEL,
    max_tokens: args.maxTokens ?? 2048,
    system: args.system,
    messages: [{ role: 'user', content: args.prompt }],
  })
  const text = msg.content
    .filter((c) => c.type === 'text')
    .map((c) => (c as { type: 'text'; text: string }).text)
    .join('\n')
  return extractJson<T>(text)
}

export function extractJson<T = unknown>(raw: string): T | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const payload = fenced ? fenced[1] : raw
  try {
    return JSON.parse(payload.trim()) as T
  } catch {
    return null
  }
}
