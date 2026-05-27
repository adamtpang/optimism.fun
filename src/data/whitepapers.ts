import type { WhitepaperDoc } from './types'

/**
 * Hand-curated weekly drops. The Monday newsletter cron at
 * /api/cron/newsletter generates a draft into the editor's inbox; once it's
 * been edited and approved, copy the finalized doc into this array.
 *
 * Order by week DESC (newest first) so /whitepapers reads as a reverse-chrono
 * feed by default.
 */
export const whitepapers: WhitepaperDoc[] = []

export function getWhitepapersForProblem(problemSlug: string): WhitepaperDoc[] {
  return whitepapers
    .filter((w) => w.problemSlug === problemSlug)
    .sort((a, b) => b.week - a.week)
}

export function getLatestWhitepaperForProblem(
  problemSlug: string,
): WhitepaperDoc | undefined {
  return getWhitepapersForProblem(problemSlug)[0]
}

export function getWhitepaperBySlug(slug: string): WhitepaperDoc | undefined {
  return whitepapers.find((w) => w.slug === slug)
}

/** ISO-style week number for "this is the Nth Monday since project start". */
export function currentWeekNumber(start = new Date('2026-01-05')): number {
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const oneWeek = 7 * 24 * 60 * 60 * 1000
  return Math.max(1, Math.floor(diffMs / oneWeek) + 1)
}
