/**
 * POST /api/commitments  — create a commitment (pending, unconfirmed)
 * GET  /api/commitments?problemSlug=slug — list the public board for a problem
 *
 * Creating never publishes. The row is written as `pending`, a confirmation
 * email goes out, and a human still has to approve it in /admin/commitments
 * before it renders anywhere. Two gates, both required.
 */
import { NextResponse } from 'next/server'
import {
  createCommitment,
  listByProblem,
  validateCommitment,
  INTENT_LABEL,
} from '@/lib/commitments'
import { problems } from '@/data/problems'
import { resend, fromEmail, notifyEmail } from '@/lib/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://optimism.fun'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const problemSlug = searchParams.get('problemSlug')
  if (!problemSlug) {
    return NextResponse.json({ ok: false, error: 'problemSlug is required' }, { status: 400 })
  }
  if (!problems.some((p) => p.slug === problemSlug)) {
    return NextResponse.json({ ok: false, error: 'unknown problemSlug' }, { status: 404 })
  }
  const commitments = await listByProblem(problemSlug)
  return NextResponse.json({ ok: true, problemSlug, count: commitments.length, commitments })
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, errors: ['invalid json'] }, { status: 400 })
  }

  // Validate before touching the database so a malformed body costs nothing.
  const parsed = validateCommitment(body)
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 })
  }

  const result = await createCommitment(body)
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: result.status })
  }

  const v = parsed.value
  const problem = problems.find((p) => p.slug === v.problemSlug)
  const confirmUrl = `${BASE_URL}/api/commitments/confirm?token=${result.confirmToken}`

  // Confirmation to the submitter. If Resend is not configured the row still
  // exists; it just sits unconfirmed, and the admin queue shows it as such.
  if (resend) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: v.email,
        subject: `Confirm your commitment: ${problem?.name ?? v.problemSlug}`,
        text: [
          `You said: ${INTENT_LABEL[v.intent]} on ${problem?.name ?? v.problemSlug}.`,
          '',
          'Confirm that this address is yours:',
          confirmUrl,
          '',
          'After you confirm, a human reads it before it appears on the public board.',
          'Nothing is published automatically, and your email address is never shown.',
          '',
          'If you did not submit this, ignore this email and nothing happens.',
        ].join('\n'),
      })
      await resend.emails.send({
        from: fromEmail,
        to: notifyEmail,
        subject: `New commitment · ${v.actorType}/${v.intent} · ${v.problemSlug}`,
        text: [
          `${v.name} <${v.email}>`,
          `${v.actorType} · ${v.intent}${v.companySlug ? ` · ${v.companySlug}` : ''}`,
          v.checkSizeBand ? `check size: ${v.checkSizeBand}` : '',
          v.url ? `link: ${v.url}` : '',
          '',
          v.proof,
          '',
          `Review: ${BASE_URL}/admin/commitments`,
        ]
          .filter(Boolean)
          .join('\n'),
      })
    } catch (err) {
      // A mail failure must not lose the submission.
      console.error('[commitments] email send failed:', err)
    }
  } else {
    console.info(
      JSON.stringify({
        event: 'commitment:created:no-mailer',
        id: result.id,
        confirmUrl,
        note: 'RESEND_API_KEY not set; confirm manually via this URL',
      }),
    )
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    status: 'pending',
    message: 'Check your email to confirm. A human reviews it before it goes on the board.',
  })
}
