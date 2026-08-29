/**
 * Thin wrapper around the Anthropic SDK. Vercel deployments authenticate to
 * AI Gateway with their automatically provisioned OIDC token; local and
 * non-Vercel environments can still use a direct Anthropic API key.
 *
 * Hosted requests use a zero-cost AI Gateway model so the public interview
 * does not depend on a separately funded provider account. Direct Anthropic
 * requests still use Claude Sonnet by default.
 */
import Anthropic from '@anthropic-ai/sdk'

let cachedDirectClient: Anthropic | null = null

function gatewayCredential(request?: Request):
  | { token: string; bearer: boolean }
  | undefined {
  if (process.env.AI_GATEWAY_API_KEY) {
    return { token: process.env.AI_GATEWAY_API_KEY, bearer: false }
  }
  const oidc =
    process.env.VERCEL_OIDC_TOKEN ??
    request?.headers.get('x-vercel-oidc-token') ??
    undefined
  return oidc ? { token: oidc, bearer: true } : undefined
}

export const DEFAULT_MODEL = 'claude-sonnet-4-6'
const GATEWAY_MODEL = 'minimax/minimax-m2.7-free'

export function getAnthropicModel(request?: Request): string {
  return gatewayCredential(request) ? GATEWAY_MODEL : DEFAULT_MODEL
}

export function isAnthropicConfigured(request?: Request): boolean {
  return Boolean(gatewayCredential(request) ?? process.env.ANTHROPIC_API_KEY)
}

export function getAnthropic(request?: Request): Anthropic {
  const gateway = gatewayCredential(request)
  const directApiKey = process.env.ANTHROPIC_API_KEY
  if (!gateway && !directApiKey) {
    throw new Error(
      'No AI provider is configured. Use Vercel OIDC, AI_GATEWAY_API_KEY, or ANTHROPIC_API_KEY.',
    )
  }
  // Request-scoped OIDC tokens rotate, so never cache a Gateway client across
  // invocations. Direct API-key clients are stable and can be reused.
  if (gateway) {
    return new Anthropic({
      baseURL: 'https://ai-gateway.vercel.sh',
      ...(gateway.bearer
        ? { apiKey: null, authToken: gateway.token }
        : { apiKey: gateway.token }),
    })
  }
  if (!cachedDirectClient) cachedDirectClient = new Anthropic({ apiKey: directApiKey })
  return cachedDirectClient
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
  request?: Request
}): Promise<T | null> {
  const anthropic = getAnthropic(args.request)
  const msg = await anthropic.messages.create({
    model: args.model ?? getAnthropicModel(args.request),
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
