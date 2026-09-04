/**
 * GET /api/cron/commitment-digest
 *
 * The weekly "who showed up" email. Groups the past week's approved
 * commitments by problem and sends one plain-text digest to the Resend
 * audience. Deliberately boring: a list of what moved, not a newsletter.
 *
 * Dry run by default. Pass ?send=1 to actually broadcast, matching the
 * existing newsletter route's shape so nothing sends by accident.
 */
import { NextResponse } from 'next/server'
import { listApprovedSince, INTENT_LABEL } from '@/lib/commitments'
import { problems } from '@/data/problems'
import { resend, audienceId, fromEmail } from '@/lib/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://optimism.fun'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const send = searchParams.get('send') === '1'
  const days = Math.min(Math.max(Number(searchParams.get('days') ?? 7), 1), 90)

  const since = new Date(Date.now() - days * 86_400_000)
  const commitments = await listApprovedSince(since)

  if (commitments.length === 0) {
    return NextResponse.json({
      ok: true,
      sent: false,
      reason: 'no new approved commitments in the window',
      days,
    })
  }

  // Group by problem so the digest reads as "what moved where".
  const byProblem = new Map<string, typeof commitments>()
  for (const c of commitments) {
    const list = byProblem.get(c.problemSlug) ?? []
    list.push(c)
    byProblem.set(c.problemSlug, list)
  }

  const nameOf = (slug: string) => problems.find((p) => p.slug === slug)?.name ?? slug

  const lines: string[] = [
    `${commitments.length} new commitments in the last ${days} days.`,
    '',
  ]
  for (const [slug, list] of byProblem) {
    lines.push(`${nameOf(slug)}`)
    const counts = new Map<string, number>()
    for (const c of list) {
      counts.set(c.intent, (counts.get(c.intent) ?? 0) + 1)
    }
    for (const [intent, n] of counts) {
      lines.push(`  ${n} x ${INTENT_LABEL[intent as keyof typeof INTENT_LABEL]}`)
    }
    lines.push(`  ${BASE_URL}/p/${slug}`)
    lines.push('')
  }
  lines.push('The map is research. The board is the market.')
  lines.push(`${BASE_URL}/coordinate`)

  const body = lines.join('\n')
  const subject = `${commitments.length} new commitments across ${byProblem.size} problems`

  if (!send) {
    return NextResponse.json({
      ok: true,
      sent: false,
      dryRun: true,
      note: 'add ?send=1 to broadcast',
      subject,
      preview: body,
      problems: byProblem.size,
      commitments: commitments.length,
    })
  }

  if (!resend || !audienceId) {
    return NextResponse.json(
      { ok: false, error: 'RESEND_API_KEY or RESEND_AUDIENCE_ID not configured' },
      { status: 503 },
    )
  }

  try {
    const { data, error } = await resend.broadcasts.create({
      audienceId,
      from: fromEmail,
      subject,
      text: body,
    })
    if (error) {
      return NextResponse.json({ ok: false, error: String(error) }, { status: 502 })
    }
    if (data?.id) await resend.broadcasts.send(data.id)
    return NextResponse.json({ ok: true, sent: true, broadcastId: data?.id, subject })
  } catch (err) {
    console.error('[commitment-digest] broadcast failed:', err)
    return NextResponse.json({ ok: false, error: 'broadcast failed' }, { status: 500 })
  }
}
