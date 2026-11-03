import { NextResponse } from 'next/server'
import { parsePaperUrl, similarResearch } from '@/lib/research/ask'
import { researchClientIp, takeResearchSlot } from '@/lib/research/limit'
import { isExaConfigured } from '@/lib/sources/exa'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  if (!isExaConfigured()) return NextResponse.json({ configured: false })
  if (!takeResearchSlot(researchClientIp(req.headers.get('x-forwarded-for')))) {
    return NextResponse.json(
      { configured: true, error: 'Too many research requests. Wait a minute and try again.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ configured: true, error: 'Request body must be JSON.' }, { status: 400 })
  }

  const parsed = parsePaperUrl(body && typeof body === 'object' ? (body as { url?: unknown }).url : undefined)
  if (!parsed.ok) {
    return NextResponse.json({ configured: true, error: parsed.error }, { status: 400 })
  }

  const result = await similarResearch(parsed.url)
  const status = result.configured && result.error ? 502 : 200
  return NextResponse.json(result, { status })
}
