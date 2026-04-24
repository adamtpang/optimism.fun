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
  topic?: string
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

  const topic = (body.topic ?? 'other').slice(0, 40)
  const message = (body.message ?? '').trim().slice(0, 4000)
  const email = (body.email ?? '').trim().slice(0, 240)
  const page = (body.page ?? '').slice(0, 240)

  if (!message) {
    return NextResponse.json({ ok: false, error: 'empty message' }, { status: 400 })
  }

  const payload = {
    event: 'feedback',
    topic,
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
      subject: `[optimism.fun] feedback · ${topic}`,
      text: [
        `topic: ${topic}`,
        `page: ${page}`,
        `email: ${email || '(none)'}`,
        '',
        message,
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
