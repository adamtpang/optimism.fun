/**
 * POST /api/subscribe
 * Body: { email: string, source?: string }
 *
 * Adds the email to the Resend audience set in RESEND_AUDIENCE_ID.
 * Admin panel: https://resend.com/audiences
 *
 * Falls back to a structured log line if Resend isn't configured — safe in
 * development and on preview deployments without env vars.
 */

import { NextResponse } from 'next/server'
import { resend, audienceId } from '@/lib/resend'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: { email?: string; source?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  const source = body.source ?? 'unknown'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid email' }, { status: 400 })
  }

  if (!resend || !audienceId) {
    // Graceful fallback — visible in Vercel runtime logs under "Functions"
    console.info(
      JSON.stringify({
        event: 'subscribe:fallback',
        email,
        source,
        timestamp: new Date().toISOString(),
        note: 'RESEND_API_KEY or RESEND_AUDIENCE_ID not set',
      }),
    )
    return NextResponse.json({ ok: true, persisted: false })
  }

  try {
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    })
    if (error) {
      // duplicate or other API error — still treat as success for the user
      console.warn('[subscribe] resend returned error:', error)
      return NextResponse.json({ ok: true, persisted: false })
    }
    return NextResponse.json({ ok: true, persisted: true })
  } catch (err) {
    console.error('[subscribe] resend threw:', err)
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}
