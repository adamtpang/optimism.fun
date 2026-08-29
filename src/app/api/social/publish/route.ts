/**
 * POST /api/social/publish?id=<queue-id>
 *
 * Operator API for an already-approved queue item. The admin queue is the
 * normal UI; this route exists for a deliberate release workflow or scheduler.
 * It never creates drafts and rejects unapproved items.
 */
import { NextResponse } from 'next/server'
import { getSocialPost, markFailed, markPublished } from '@/lib/social-posts'
import { publishSocialPost } from '@/lib/social-publish'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorize(req: Request) {
  const expected = process.env.CRON_SECRET
  if (!expected) return process.env.NODE_ENV !== 'production'
  const header = req.headers.get('authorization') ?? ''
  return header === `Bearer ${expected}`
}

export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ ok: false, error: 'invalid or missing CRON_SECRET' }, { status: 401 })
  }
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 })

  const post = await getSocialPost(id)
  if (!post) return NextResponse.json({ ok: false, error: 'queue item not found' }, { status: 404 })
  if (post.status !== 'approved') {
    return NextResponse.json({ ok: false, error: 'queue item must be approved before publishing' }, { status: 409 })
  }

  try {
    const result = await publishSocialPost(post)
    await markPublished(post.id, result.providerPostId, result.response)
    return NextResponse.json({ ok: true, platform: post.platform, providerPostId: result.providerPostId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'social publish failed'
    await markFailed(post.id, message)
    return NextResponse.json({ ok: false, error: message }, { status: 502 })
  }
}

