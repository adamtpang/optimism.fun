import { RawArticle } from '../types'

// Hacker News Algolia API - completely free, no auth required
// Surfaces tech problems and global challenges discussed by builders

interface HNHit {
  title: string
  url: string | null
  objectID: string
  points: number
  num_comments: number
  created_at: string
  _highlightResult?: {
    title?: { value: string }
  }
}

interface HNSearchResult {
  hits: HNHit[]
}

// Search queries that surface problems worth solving
const HN_QUERIES = [
  'global crisis',
  'humanity problem',
  'climate change technology',
  'healthcare crisis',
  'AI safety risk',
  'infrastructure failing',
  'energy transition challenge',
  'water shortage',
  'education technology',
  'food security',
]

export async function fetchHackerNews(): Promise<RawArticle[]> {
  const articles: RawArticle[] = []

  // Batch queries to minimize API calls
  // Use Algolia search API (free, no rate limit issues)
  for (const query of HN_QUERIES.slice(0, 5)) {
    try {
      const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=5&numericFilters=points>20`

      const res = await fetch(url)
      if (!res.ok) continue

      const data: HNSearchResult = await res.json()

      for (const hit of data.hits) {
        const articleUrl = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`

        articles.push({
          title: hit.title,
          description: `Discussed on Hacker News with ${hit.points} points and ${hit.num_comments} comments. ${hit.title}`,
          url: articleUrl,
          source_name: 'Hacker News',
          source_type: 'hackernews',
          published_at: hit.created_at,
        })
      }
    } catch (err) {
      console.error(`HN search error for "${query}":`, err)
    }
  }

  console.log(`Hacker News: fetched ${articles.length} stories`)
  return articles
}
