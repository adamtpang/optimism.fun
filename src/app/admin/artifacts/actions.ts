'use server'

import { revalidatePath } from 'next/cache'
import {
  approveSocialPost,
  getSocialPost,
  markFailed,
  markPublished,
  setSocialPostAsset,
  setSocialPostXMediaId,
} from '@/lib/social-posts'
import { publishSocialPost } from '@/lib/social-publish'

export async function approveArtifactPostAction(id: string) {
  await approveSocialPost(id)
  revalidatePath('/admin/artifacts')
}

export async function setArtifactAssetAction(id: string, assetUrl: string) {
  await setSocialPostAsset(id, assetUrl)
  revalidatePath('/admin/artifacts')
}

export async function setArtifactXMediaAction(id: string, mediaId: string) {
  await setSocialPostXMediaId(id, mediaId)
  revalidatePath('/admin/artifacts')
}

export async function publishArtifactPostAction(id: string) {
  const post = await getSocialPost(id)
  if (!post) throw new Error('Queued social post was not found')
  if (post.status !== 'approved') throw new Error('Only an approved post can be published')
  try {
    const result = await publishSocialPost(post)
    await markPublished(post.id, result.providerPostId, result.response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Social publishing failed'
    await markFailed(post.id, message)
    throw error
  }
  revalidatePath('/admin/artifacts')
}

