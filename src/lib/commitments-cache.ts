/**
 * Cached reads of the board, for pages that are otherwise prerendered.
 *
 * The Neon driver issues an uncached fetch, which is enough on its own to make
 * any page that touches it render per request. That is the right behaviour for
 * the admin queue and wrong for the homepage and the 15 problem pages, which
 * were fully static before the board existed and are the site's whole traffic.
 *
 * These wrappers put the board reads behind a tagged cache entry, so those
 * pages stay prerendered and refresh either when the window expires or the
 * moment a commitment is approved, whichever comes first. Approving calls
 * revalidateTag(COMMITMENTS_TAG), so the board is never stale in practice.
 *
 * Uncached originals stay in lib/commitments.ts: the admin queue and the API
 * route must always read through to Postgres.
 */
import { unstable_cache } from 'next/cache'
import {
  listByProblem,
  countsByProblem,
  listRecentPublic,
  type Commitment,
  type ProblemCounts,
} from '@/lib/commitments'

export const COMMITMENTS_TAG = 'commitments'

/** Five minutes. The floor is set by approval, which revalidates immediately. */
const WINDOW = 300

export const cachedListByProblem = (problemSlug: string): Promise<Commitment[]> =>
  unstable_cache(
    () => listByProblem(problemSlug),
    ['commitments:by-problem', problemSlug],
    { revalidate: WINDOW, tags: [COMMITMENTS_TAG] },
  )()

export const cachedCountsByProblem = async (): Promise<Map<string, ProblemCounts>> => {
  // A Map does not survive the cache boundary, so the entries are cached as an
  // array and rebuilt on the way out.
  const entries = await unstable_cache(
    async () => [...(await countsByProblem()).entries()],
    ['commitments:counts'],
    { revalidate: WINDOW, tags: [COMMITMENTS_TAG] },
  )()
  return new Map(entries)
}

export const cachedListRecentPublic = (limit = 5): Promise<Commitment[]> =>
  unstable_cache(
    () => listRecentPublic(limit),
    ['commitments:recent', String(limit)],
    { revalidate: WINDOW, tags: [COMMITMENTS_TAG] },
  )()
