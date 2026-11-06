import { problems } from '@/data/problems'
import { voices } from '@/data/voices'
import { sectors } from '@/data/sectors'
import { rfsSeasons } from '@/data/rfs-seasons'
import { whitepapers } from '@/data/whitepapers'

/**
 * Canonical public paths. No query-string duplicates. Admin and draft
 * tooling stay out of the index.
 */
const STATIC_PATHS = [
  '',
  '/about',
  '/ages',
  '/capital',
  '/command',
  '/companies',
  '/contact',
  '/coordinate',
  '/countries',
  '/coverage',
  '/crypto',
  '/data',
  '/demand',
  '/discoveries',
  '/ecosystem',
  '/fit',
  '/founders',
  '/frontier',
  '/globe',
  '/good-quests',
  '/journey',
  '/last-company',
  '/manifesto',
  '/marketcap',
  '/media',
  '/methodology',
  '/movers',
  '/paths',
  '/poster',
  '/privacy',
  '/progress',
  '/radar',
  '/rankings',
  '/research',
  '/rfs',
  '/s-tier',
  '/sector',
  '/signals',
  '/trends',
  '/underserved',
  '/value',
  '/voices',
  '/wealth',
  '/where',
  '/whitepapers',
]

export function publicPaths(): string[] {
  const paths = new Set<string>(STATIC_PATHS)
  for (const problem of problems) {
    paths.add(`/p/${problem.slug}`)
    if (whitepapers.some((paper) => paper.problemSlug === problem.slug)) {
      paths.add(`/p/${problem.slug}/whitepaper`)
    }
  }
  for (const voice of voices) paths.add(`/voices/${voice.slug}`)
  for (const sector of sectors) paths.add(`/sector/${sector.slug}`)
  for (const season of rfsSeasons) paths.add(`/rfs/${season.slug}`)
  return [...paths].sort()
}
