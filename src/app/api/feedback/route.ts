/**
 * POST /api/feedback
 * Body: { topic, message, email?, page?, userAgent? }
 *
 * Sends the submission as an email to RESEND_NOTIFY_EMAIL (default
 * adamtpang@gmail.com) via Resend. Admin panel = the recipient's inbox.
 *
 * Falls back to a structured log line if Resend isn't configured.
 */

import { NextResponse } from 'next/server'
import { resend, notifyEmail, fromEmail } from '@/lib/resend'

export const runtime = 'nodejs'

type FeedbackBody = {
  rating?: number
  message?: string
  email?: string
  page?: string
  userAgent?: string
}

export async function POST(req: Request) {
  let body: FeedbackBody = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const rawRating = Number(body.rating)
  const rating = Number.isFinite(rawRating) && rawRating >= 1 && rawRating <= 5 ? Math.round(rawRating) : 0
  const message = (body.message ?? '').trim().slice(0, 4000)
  const email = (body.email ?? '').trim().slice(0, 240)
  const page = (body.page ?? '').slice(0, 240)

  if (!rating) {
    return NextResponse.json({ ok: false, error: 'rating required (1-5)' }, { status: 400 })
  }
  // For ratings under 5, require a written reason so feedback is actionable.
  if (rating < 5 && !message) {
    return NextResponse.json({ ok: false, error: 'message required for ratings under 5' }, { status: 400 })
  }

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
  const payload = {
    event: 'feedback',
    rating,
    message,
    email: email || null,
    page,
    timestamp: new Date().toISOString(),
  }

  if (!resend) {
    console.info(JSON.stringify(payload))
    return NextResponse.json({ ok: true, delivered: false })
  }

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      replyTo: email || undefined,
      subject: `[optimism.fun] feedback · ${stars} (${rating}/5)`,
      text: [
        `rating: ${stars} (${rating}/5)`,
        `page: ${page}`,
        `email: ${email || '(none)'}`,
        '',
        message || '(no message — perfect score)',
      ].join('\n'),
    })
    if (error) {
      console.warn('[feedback] resend error:', error)
      return NextResponse.json({ ok: true, delivered: false })
    }
    return NextResponse.json({ ok: true, delivered: true })
  } catch (err) {
    console.error('[feedback] resend threw:', err)
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}
