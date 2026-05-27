/**
 * POST /api/newsletter/broadcast?slug=<whitepaper-slug>
 *
 * Manually ships a finalized whitepaper to the Resend audience. The weekly
 * cron only drafts; the editor explicitly triggers this endpoint when the
 * doc is ready.
 *
 * Auth: Bearer CRON_SECRET (reused — same operator scope).
 *
 * Requires RESEND_API_KEY and RESEND_AUDIENCE_ID. Returns 503 otherwise.
 */
import { NextResponse } from 'next/server'
import { resend, fromEmail, audienceId } from '@/lib/resend'
import { getWhitepaperBySlug } from '@/data/whitepapers'
import { getProblemBySlug } from '@/data/problems'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

function authorize(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, status: 500, error: 'CRON_SECRET not configured on this deployment' }
    }
    return { ok: true }
  }
  const header = req.headers.get('authorization') ?? ''
  const presented = header.startsWith('Bearer ') ? header.slice(7) : header
  if (presented !== expected) {
    return { ok: false, status: 401, error: 'invalid or missing CRON_SECRET' }
  }
  return { ok: true }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Tiny line-break-to-paragraph renderer. Upgrade to real markdown when an
 * entry actually needs headings / lists / links. */
function paragraphize(md: string): string {
  return md
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 18px 0;">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('\n')
}

function renderEmailHtml(args: {
  problemName: string
  problemSlug: string
  blackpaper: string
  whitepaper: string
  ctaBody?: string
  ctaUrl?: string
  ctaLabel?: string
  preheader?: string
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://optimism.fun'
  const landingUrl = `${baseUrl}/p/${args.problemSlug}`
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(args.problemName)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0c;color:#e6e6e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.55;">
  ${args.preheader ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(args.preheader)}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0c;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:0 8px 16px 8px;">
          <p style="margin:0;font-family:ui-monospace,monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#f4a949;">◆ optimism.fun · weekly drop</p>
        </td></tr>
        <tr><td style="padding:0 8px 8px 8px;">
          <h1 style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:32px;line-height:1.1;font-weight:400;color:#f5f5f7;">${escapeHtml(args.problemName)}</h1>
          <p style="margin:0 0 24px 0;font-family:ui-monospace,monospace;font-size:11px;color:#8a8a92;"><a href="${landingUrl}" style="color:#f4a949;">${landingUrl} →</a></p>
        </td></tr>

        <tr><td style="padding:0 8px;">
          <p style="margin:0 0 8px 0;font-family:ui-monospace,monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#f4a949;">blackpaper · the problem</p>
          ${paragraphize(args.blackpaper)}
        </td></tr>

        <tr><td style="padding:24px 8px 0 8px;">
          <p style="margin:0 0 8px 0;font-family:ui-monospace,monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#f4a949;">whitepaper · the proposal</p>
          ${paragraphize(args.whitepaper)}
        </td></tr>

        ${args.ctaBody ? `
        <tr><td style="padding:24px 8px;">
          <div style="border:1px solid rgba(244,169,73,0.4);background:rgba(244,169,73,0.04);padding:18px;">
            <p style="margin:0 0 12px 0;font-family:ui-monospace,monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#f4a949;">request for startups</p>
            ${paragraphize(args.ctaBody)}
            ${args.ctaUrl ? `<a href="${args.ctaUrl}" style="display:inline-block;margin-top:8px;padding:10px 16px;font-family:ui-monospace,monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#f4a949;border:1px solid #f4a949;text-decoration:none;">${escapeHtml(args.ctaLabel ?? 'apply')} →</a>` : ''}
          </div>
        </td></tr>` : ''}

        <tr><td style="padding:32px 8px 16px 8px;border-top:1px solid #25252b;">
          <p style="margin:0;font-family:ui-monospace,monospace;font-size:11px;color:#6a6a72;">Sent by optimism.fun. <a href="${baseUrl}" style="color:#f4a949;">optimism.fun</a> · <a href="${baseUrl}/methodology" style="color:#f4a949;">methodology</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: Request) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  if (!resend) {
    return NextResponse.json(
      { ok: false, error: 'RESEND_API_KEY not configured' },
      { status: 503 },
    )
  }
  if (!audienceId) {
    return NextResponse.json(
      { ok: false, error: 'RESEND_AUDIENCE_ID not configured' },
      { status: 503 },
    )
  }

  const url = new URL(req.url)
  const slug = url.searchParams.get('slug') ?? ''
  const dryRun = url.searchParams.get('dryRun') === '1'

  const doc = getWhitepaperBySlug(slug)
  if (!doc) {
    return NextResponse.json(
      { ok: false, error: `no whitepaper with slug "${slug}" in src/data/whitepapers.ts` },
      { status: 404 },
    )
  }

  const problem = getProblemBySlug(doc.problemSlug)
  if (!problem) {
    return NextResponse.json(
      { ok: false, error: `whitepaper points to unknown problem "${doc.problemSlug}"` },
      { status: 422 },
    )
  }

  const html = renderEmailHtml({
    problemName: problem.name,
    problemSlug: problem.slug,
    blackpaper: doc.blackpaper,
    whitepaper: doc.whitepaper,
    ctaBody: doc.cta?.body,
    ctaUrl: doc.cta?.url,
    ctaLabel: doc.cta?.ctaLabel,
    preheader: doc.newsletter?.preheader,
  })

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      mode: 'dry-run',
      slug,
      subject: doc.newsletter?.subject ?? problem.name,
      htmlBytes: html.length,
    })
  }

  const broadcast = await resend.broadcasts.create({
    audienceId,
    from: fromEmail,
    subject: doc.newsletter?.subject ?? problem.name,
    html,
  })

  if (broadcast.error) {
    return NextResponse.json(
      { ok: false, error: broadcast.error.message ?? 'resend broadcast create failed' },
      { status: 502 },
    )
  }

  const broadcastId = broadcast.data?.id
  if (broadcastId) {
    const send = await resend.broadcasts.send(broadcastId)
    if (send.error) {
      return NextResponse.json(
        { ok: false, error: send.error.message ?? 'resend broadcast send failed', broadcastId },
        { status: 502 },
      )
    }
  }

  return NextResponse.json({
    ok: true,
    mode: 'sent',
    slug,
    broadcastId,
    subject: doc.newsletter?.subject ?? problem.name,
  })
}
