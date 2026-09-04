'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { setStatus, type CommitmentStatus } from '@/lib/commitments'
import { COMMITMENTS_TAG } from '@/lib/commitments-cache'

/**
 * The review gate. Nothing on the public board got there without one of these
 * calls, which is the whole reason the board cannot be bought or spammed onto.
 *
 * The homepage and the problem pages read the board through a tagged cache so
 * they can stay prerendered. Busting that tag here is what keeps a 5 minute
 * cache window from turning into a 5 minute delay: an approval is visible at
 * once, and the window only ever applies to rows nobody has touched.
 *
 * updateTag rather than revalidateTag because this runs inside a server action
 * and the reviewer should see their own decision reflected on the next render,
 * which is exactly the read-your-own-writes case updateTag exists for.
 */
export async function reviewCommitmentAction(
  id: string,
  status: CommitmentStatus,
  problemSlug: string,
  note?: string,
) {
  await setStatus(id, status, note)
  updateTag(COMMITMENTS_TAG)
  revalidatePath('/admin/commitments')
  revalidatePath(`/p/${problemSlug}`)
  revalidatePath('/')
}
