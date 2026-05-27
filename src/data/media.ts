import type { MediaItem } from './types'

/**
 * Seeded media items — handpicked essays / videos / threads that already
 * map cleanly to specific problems on the leaderboard. These render
 * immediately on /p/[slug], /media, and (when the sector PR lands) on
 * /sector/[slug] without depending on any cron or DB.
 *
 * The /api/cron/media-ingest pipeline will append rows here (or to a Neon
 * table once DB is wired) over time. The MediaFeed component reads from a
 * unified accessor below so swapping in a DB source is one function.
 */
export const seededMedia: MediaItem[] = [
  {
    id: 'rop-progress-as-moral-imperative',
    title: 'The case for progress as a moral imperative',
    url: 'https://rootsofprogress.org/the-case-for-progress',
    sourceId: 'substack:roots-of-progress',
    publishedAt: '2025-03-12',
    excerpt:
      'Material progress is not just nice-to-have. It is the precondition for nearly every flourishing humans care about.',
    problemSlugs: ['scientific-productivity', 'energy-abundance'],
    sectorSlugs: ['science-and-progress', 'energy-and-abundance'],
    status: 'live',
  },
  {
    id: 'wip-housing-supply-physics',
    title: 'The physics of cheap housing',
    url: 'https://worksinprogress.co/issue/the-physics-of-cheap-housing',
    sourceId: 'substack:works-in-progress',
    publishedAt: '2025-08-04',
    excerpt:
      'A first-principles look at why factory-built housing keeps stalling out at scale — and the supply chain that would unstick it.',
    problemSlugs: ['housing-construction'],
    sectorSlugs: ['shelter-and-construction'],
    status: 'live',
  },
  {
    id: 'cp-construction-productivity-50yrs',
    title: 'Why construction productivity has been flat for 50 years',
    url: 'https://www.construction-physics.com/p/construction-productivity-flat',
    sourceId: 'substack:construction-physics',
    publishedAt: '2024-11-19',
    excerpt:
      "McKinsey's chart of construction productivity vs every other manufactured good is the most damning chart in industrial economics.",
    problemSlugs: ['housing-construction'],
    sectorSlugs: ['shelter-and-construction'],
    status: 'live',
  },
  {
    id: 'notboring-fusion-near',
    title: 'Fusion is closer than you think',
    url: 'https://www.notboring.co/p/fusion-is-closer-than-you-think',
    sourceId: 'substack:not-boring',
    publishedAt: '2025-09-15',
    excerpt:
      'A reader-friendly tour of the private fusion landscape — Commonwealth, Helion, TAE, and the milestones that would unlock dispatchable abundance.',
    problemSlugs: ['energy-abundance'],
    sectorSlugs: ['energy-and-abundance'],
    status: 'live',
  },
  {
    id: 's3-fusion-startups',
    title: 'Inside the fusion startups',
    url: 'https://www.youtube.com/watch?v=fusion-startups-s3',
    sourceId: 'youtube:s3',
    publishedAt: '2025-10-08',
    excerpt:
      'S3 walks the floor of the private-fusion ecosystem — pulsed magnetics, inertial confinement, and the milestones each team is chasing.',
    problemSlugs: ['energy-abundance'],
    sectorSlugs: ['energy-and-abundance'],
    status: 'live',
  },
  {
    id: 'sb-fertility-policy',
    title: 'What actually moves fertility rates',
    url: 'https://www.slowboring.com/p/what-actually-moves-fertility-rates',
    sourceId: 'substack:slow-boring',
    publishedAt: '2025-12-02',
    excerpt:
      "A cross-country look at fertility policy — what works, what doesn't, and why the floor keeps moving.",
    problemSlugs: ['fertility-decline'],
    sectorSlugs: ['demographics-and-society'],
    status: 'live',
  },
  {
    id: 'mr-ideas-getting-harder',
    title: 'Are ideas really getting harder to find?',
    url: 'https://marginalrevolution.com/marginalrevolution/2024/05/ideas-harder-find',
    sourceId: 'substack:marginal-revolution',
    publishedAt: '2024-05-22',
    excerpt:
      "Cowen revisits Bloom-Jones-Reenen-Webb and considers the case for institutional rather than purely cognitive bottlenecks.",
    problemSlugs: ['scientific-productivity'],
    sectorSlugs: ['science-and-progress'],
    status: 'live',
  },
  {
    id: 'coogan-housing-zoning',
    title: 'Why zoning is the most expensive policy in America',
    url: 'https://www.youtube.com/watch?v=coogan-zoning',
    sourceId: 'youtube:john-coogan',
    publishedAt: '2025-06-14',
    excerpt:
      'Coogan unpacks the per-capita cost of zoning constraints across the top 50 U.S. metros and what the YIMBY agenda is fighting for.',
    problemSlugs: ['housing-construction'],
    sectorSlugs: ['shelter-and-construction'],
    status: 'live',
  },
  {
    id: 'notboring-ai-aligned-by-default',
    title: "What 'aligned by default' would actually mean",
    url: 'https://www.notboring.co/p/aligned-by-default',
    sourceId: 'substack:not-boring',
    publishedAt: '2025-11-29',
    excerpt:
      'A non-technical walk through the alignment debate, the deployment gates, and what would have to be true for civilization to keep agency.',
    problemSlugs: ['ai-safety'],
    sectorSlugs: ['ai-and-x-risk'],
    status: 'live',
  },
  {
    id: 'rop-longevity-not-too-late',
    title: "It's not too late on longevity — but the clock is loud",
    url: 'https://rootsofprogress.org/longevity-not-too-late',
    sourceId: 'substack:roots-of-progress',
    publishedAt: '2025-07-30',
    excerpt:
      "Crawford on why aging research is now a genuine engineering project, not philosophy — and the institutional reforms it still needs.",
    problemSlugs: ['longevity'],
    sectorSlugs: ['aging-and-longevity'],
    status: 'live',
  },
]

/**
 * Read-side accessor for the MediaFeed component. Today this just returns
 * the seeded array; once Neon-backed items land, merge them in here so the
 * rest of the app stays unchanged.
 */
export async function getMediaItems(opts: {
  status?: 'live' | 'draft' | 'all'
  problemSlug?: string
  sectorSlug?: string
  sourceId?: string
  limit?: number
} = {}): Promise<MediaItem[]> {
  const status = opts.status ?? 'live'
  let items = seededMedia
  if (status !== 'all') items = items.filter((i) => i.status === status)
  if (opts.problemSlug) {
    items = items.filter((i) => i.problemSlugs.includes(opts.problemSlug!))
  }
  if (opts.sectorSlug) {
    items = items.filter((i) => (i.sectorSlugs ?? []).includes(opts.sectorSlug!))
  }
  if (opts.sourceId) {
    items = items.filter((i) => i.sourceId === opts.sourceId)
  }
  items = [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
  if (opts.limit !== undefined) items = items.slice(0, opts.limit)
  return items
}
