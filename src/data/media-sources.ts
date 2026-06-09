import type { MediaSource } from './types'

/**
 * The curated source list. The media-ingest cron polls each one (RSS for
 * substacks, YouTube channel feed for video, an X polling worker for handles
 * — see /api/cron/media-ingest for the pipeline).
 *
 * Adding a source: pick a stable id of the form "<kind>:<slug>" and supply
 * the canonical feed URL when available.
 */
export const mediaSources: MediaSource[] = [
  {
    id: 'substack:not-boring',
    kind: 'substack',
    name: 'Not Boring',
    author: 'Packy McCormick',
    url: 'https://www.notboring.co',
    feedUrl: 'https://www.notboring.co/feed',
  },
  {
    id: 'substack:roots-of-progress',
    kind: 'substack',
    name: 'Roots of Progress',
    author: 'Jason Crawford',
    url: 'https://rootsofprogress.org',
    feedUrl: 'https://rootsofprogress.org/feed.xml',
  },
  {
    id: 'substack:works-in-progress',
    kind: 'substack',
    name: 'Works in Progress',
    url: 'https://worksinprogress.co',
    feedUrl: 'https://worksinprogress.co/rss',
  },
  {
    id: 'substack:construction-physics',
    kind: 'substack',
    name: 'Construction Physics',
    author: 'Brian Potter',
    url: 'https://www.construction-physics.com',
    feedUrl: 'https://www.construction-physics.com/feed',
  },
  {
    id: 'substack:slow-boring',
    kind: 'substack',
    name: 'Slow Boring',
    author: 'Matt Yglesias',
    url: 'https://www.slowboring.com',
    feedUrl: 'https://www.slowboring.com/feed',
  },
  {
    id: 'substack:marginal-revolution',
    kind: 'blog',
    name: 'Marginal Revolution',
    author: 'Cowen & Tabarrok',
    url: 'https://marginalrevolution.com',
    feedUrl: 'https://marginalrevolution.com/feed',
  },
  {
    id: 'youtube:s3',
    kind: 'youtube',
    name: 'S3',
    author: 'Jason Carman',
    url: 'https://www.youtube.com/@jasoncarman',
    feedUrl: 'https://www.youtube.com/feeds/videos.xml?user=jasoncarman',
  },
  {
    id: 'youtube:john-coogan',
    kind: 'youtube',
    name: 'John Coogan',
    author: 'John Coogan',
    url: 'https://www.youtube.com/@johncoogan',
    feedUrl: 'https://www.youtube.com/feeds/videos.xml?user=johncoogan',
  },
  {
    id: 'x:pmarca',
    kind: 'x',
    name: 'Marc Andreessen',
    author: '@pmarca',
    url: 'https://x.com/pmarca',
  },
  {
    id: 'x:tylercowen',
    kind: 'x',
    name: 'Tyler Cowen',
    author: '@tylercowen',
    url: 'https://x.com/tylercowen',
  },
]

export function getMediaSource(id: string): MediaSource | undefined {
  return mediaSources.find((s) => s.id === id)
}
