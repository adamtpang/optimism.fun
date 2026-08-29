import { getSql, isDbConfigured } from '@/lib/db'
import { infographicBriefs } from '@/data/infographics'

export type SocialPlatform = 'x' | 'instagram'
export type SocialPostStatus = 'draft' | 'approved' | 'published' | 'failed'

export type SocialPost = {
  id: string
  briefSlug: string
  platform: SocialPlatform
  body: string
  assetUrl: string | null
  xMediaId: string | null
  status: SocialPostStatus
  approvedAt: string | null
  publishedAt: string | null
  providerPostId: string | null
  lastError: string | null
}

type SocialPostRow = {
  id: string
  brief_slug: string
  platform: SocialPlatform
  body: string
  asset_url: string | null
  x_media_id: string | null
  status: SocialPostStatus
  approved_at: string | Date | null
  published_at: string | Date | null
  provider_post_id: string | null
  last_error: string | null
}

const toIso = (value: string | Date | null) =>
  value instanceof Date ? value.toISOString() : value

function fromRow(row: SocialPostRow): SocialPost {
  return {
    id: row.id,
    briefSlug: row.brief_slug,
    platform: row.platform,
    body: row.body,
    assetUrl: row.asset_url,
    xMediaId: row.x_media_id,
    status: row.status,
    approvedAt: toIso(row.approved_at),
    publishedAt: toIso(row.published_at),
    providerPostId: row.provider_post_id,
    lastError: row.last_error,
  }
}

function getSeed(briefSlug: string, platform: SocialPlatform) {
  const brief = infographicBriefs.find((entry) => entry.slug === briefSlug)
  if (!brief) throw new Error(`Unknown infographic brief: ${briefSlug}`)
  return {
    body: platform === 'x' ? brief.xDraft : brief.instagramDraft,
    // A real public asset URL is intentionally supplied at release time. Figma
    // exports are not stable public URLs suitable for the Instagram API.
    assetUrl: null,
  }
}

export async function ensureSocialPost(briefSlug: string, platform: SocialPlatform) {
  if (!isDbConfigured()) return null
  const seed = getSeed(briefSlug, platform)
  const sql = getSql()
  await sql`
    insert into social_posts (brief_slug, platform, body, asset_url)
    values (${briefSlug}, ${platform}, ${seed.body}, ${seed.assetUrl})
    on conflict (brief_slug, platform) do nothing
  `
}

export async function listSocialPosts(): Promise<SocialPost[]> {
  if (!isDbConfigured()) return []
  const sql = getSql()
  const rows = (await sql`
    select id, brief_slug, platform, body, asset_url, x_media_id, status, approved_at,
      published_at, provider_post_id, last_error
    from social_posts
    order by created_at desc
  `) as unknown as SocialPostRow[]
  return rows.map(fromRow)
}

export async function approveSocialPost(id: string) {
  if (!isDbConfigured()) throw new Error('DATABASE_URL is not configured')
  const sql = getSql()
  await sql`
    update social_posts
    set status = 'approved', approved_at = now(), last_error = null
    where id = ${id} and status in ('draft', 'failed')
  `
}

export async function setSocialPostAsset(id: string, assetUrl: string) {
  if (!isDbConfigured()) throw new Error('DATABASE_URL is not configured')
  const parsed = new URL(assetUrl)
  if (parsed.protocol !== 'https:') throw new Error('Social asset URL must use HTTPS')
  const sql = getSql()
  await sql`
    update social_posts
    set asset_url = ${assetUrl}, status = case when status = 'published' then status else 'draft' end,
      approved_at = case when status = 'published' then approved_at else null end
    where id = ${id}
  `
}

export async function setSocialPostXMediaId(id: string, mediaId: string) {
  if (!isDbConfigured()) throw new Error('DATABASE_URL is not configured')
  if (!/^\d{1,19}$/.test(mediaId)) throw new Error('X media ID must be a numeric media identifier')
  const sql = getSql()
  await sql`
    update social_posts
    set x_media_id = ${mediaId}, status = case when status = 'published' then status else 'draft' end,
      approved_at = case when status = 'published' then approved_at else null end
    where id = ${id}
  `
}

export async function getSocialPost(id: string): Promise<SocialPost | null> {
  if (!isDbConfigured()) return null
  const sql = getSql()
  const rows = (await sql`
    select id, brief_slug, platform, body, asset_url, x_media_id, status, approved_at,
      published_at, provider_post_id, last_error
    from social_posts where id = ${id} limit 1
  `) as unknown as SocialPostRow[]
  return rows[0] ? fromRow(rows[0]) : null
}

export async function markPublished(id: string, providerPostId: string, response: unknown) {
  const sql = getSql()
  await sql`
    update social_posts
    set status = 'published', published_at = now(), provider_post_id = ${providerPostId},
      provider_response = ${JSON.stringify(response)}::jsonb, last_error = null
    where id = ${id}
  `
}

export async function markFailed(id: string, error: string) {
  const sql = getSql()
  await sql`
    update social_posts set status = 'failed', last_error = ${error} where id = ${id}
  `
}

