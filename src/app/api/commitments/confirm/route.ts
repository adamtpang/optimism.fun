/**
 * GET /api/commitments/confirm?token=uuid
 *
 * Clicked from the confirmation email. Marks the address verified and sends the
 * person to a page that is honest about what happens next: confirming does not
 * publish anything, it just moves the row into the human review queue.
 */
import { NextResponse } from 'next/server'
import { confirmCommitment } from '@/lib/commitments'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const token = searchParams.get('token') ?? ''

  if (!token) {
    return NextResponse.redirect(`${origin}/coordinate?confirm=missing`, { status: 302 })
  }

  const commitment = await confirmCommitment(token)
  if (!commitment) {
    // Unknown token, or already confirmed. Deliberately does not distinguish
    // the two, so this endpoint cannot be used to probe for valid tokens.
    return NextResponse.redirect(`${origin}/coordinate?confirm=invalid`, { status: 302 })
  }

  return NextResponse.redirect(
    `${origin}/p/${commitment.problemSlug}?confirm=ok`,
    { status: 302 },
  )
}
