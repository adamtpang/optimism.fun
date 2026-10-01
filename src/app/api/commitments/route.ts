/**
 * POST /api/commitments  - create a commitment (pending)
 * GET  /api/commitments?problemSlug=slug - list the public board for a problem
 *
 * Creating never publishes. The row is written as `pending` and a human has to
 * approve it in /admin/commitments before it renders anywhere. That review is
 * the single gate: the submitter confirmation email was dropped on 2026-10-01
 * so the board does not depend on a mail provider. The owner still gets a
 * notification when one is configured.
 */
import { NextResponse } from 'next/server'
import {
  createCommitment,
  listByProblem,
  validateCommitment,
  isHoneypotTripped,
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

  // A filled honeypot means a bot. Answer exactly as a success would, so the
  // bot learns nothing and does not retry, and write nothing at all.
  if (isHoneypotTripped(body)) {
    console.info(JSON.stringify({ event: 'commitment:honeypot', at: new Date().toISOString() }))
    return NextResponse.json({
      ok: true,
      status: 'pending',
      message: 'Received. A human reviews it before it goes on the board.',
    })
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

  // Tell the owner there is something to review. Optional: with no mailer the
  // row still lands in the queue.
  if (resend) {
    try {
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
        note: 'no mailer configured; review at /admin/commitments',
      }),
    )
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    status: 'pending',
    message: 'Received. A human reviews it before it goes on the board.',
  })
}
