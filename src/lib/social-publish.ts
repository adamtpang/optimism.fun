import type { SocialPlatform } from '@/lib/social-posts'

export type PublishInput = {
  platform: SocialPlatform
  body: string
  assetUrl: string | null
  xMediaId: string | null
}

export type PublishResult = { providerPostId: string; response: unknown }

function configured(name: string) {
  return Boolean(process.env[name])
}

export function socialReleaseGates(platform: SocialPlatform, assetUrl: string | null): string[] {
  if (platform === 'x') {
    return [
      ...(configured('X_USER_ACCESS_TOKEN') ? [] : ['X_USER_ACCESS_TOKEN']),
      ...(assetUrl ? [] : ['a reviewed asset URL']),
    ]
  }
  return [
    ...(configured('INSTAGRAM_USER_ID') ? [] : ['INSTAGRAM_USER_ID']),
    ...(configured('INSTAGRAM_ACCESS_TOKEN') ? [] : ['INSTAGRAM_ACCESS_TOKEN']),
    ...(assetUrl ? [] : ['a public HTTPS image URL']),
  ]
}

async function parseResponse(response: Response) {
  const text = await response.text()
  try { return JSON.parse(text) as unknown } catch { return { raw: text } }
}

export async function publishSocialPost(input: PublishInput): Promise<PublishResult> {
  const gates = socialReleaseGates(input.platform, input.assetUrl)
  if (gates.length) throw new Error(`Release blocked: ${gates.join(', ')}`)

  if (input.platform === 'x') {
    const payload: { text: string; media?: { media_ids: string[] } } = { text: input.body }
    const mediaId = input.xMediaId
    if (mediaId) payload.media = { media_ids: [mediaId] }
    const response = await fetch('https://api.x.com/2/tweets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.X_USER_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })
    const data = await parseResponse(response) as { data?: { id?: string }; detail?: string }
    if (!response.ok || !data.data?.id) {
      throw new Error(data.detail ?? `X API request failed (${response.status})`)
    }
    return { providerPostId: data.data.id, response: data }
  }

  const base = `https://graph.facebook.com/${process.env.INSTAGRAM_GRAPH_VERSION ?? 'v23.0'}`
  const create = await fetch(`${base}/${process.env.INSTAGRAM_USER_ID}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.INSTAGRAM_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: input.assetUrl, caption: input.body }),
    cache: 'no-store',
  })
  const container = await parseResponse(create) as { id?: string; error?: { message?: string } }
  if (!create.ok || !container.id) throw new Error(container.error?.message ?? `Instagram container failed (${create.status})`)

  const publish = await fetch(`${base}/${process.env.INSTAGRAM_USER_ID}/media_publish`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.INSTAGRAM_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id }),
    cache: 'no-store',
  })
  const media = await parseResponse(publish) as { id?: string; error?: { message?: string } }
  if (!publish.ok || !media.id) throw new Error(media.error?.message ?? `Instagram publish failed (${publish.status})`)
  return { providerPostId: media.id, response: { container, media } }
}

