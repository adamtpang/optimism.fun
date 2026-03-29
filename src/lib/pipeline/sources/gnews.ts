import { RawArticle } from '../types'

export async function fetchGNews(): Promise<RawArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY
  if (!apiKey) {
    console.warn('GNEWS_API_KEY not set, skipping GNews')
    return []
  }

  const queries = [
    'global crisis humanitarian',
    'technology problem challenge',
    'climate energy food water',
  ]

  const articles: RawArticle[] = []

  for (const q of queries) {
    try {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=10&token=${apiKey}`
      const res = await fetch(url)
      if (!res.ok) continue

      const data = await res.json()
      for (const article of data.articles || []) {
        articles.push({
          title: article.title,
          description: article.description || '',
          url: article.url,
          source_name: article.source?.name || 'GNews',
          source_type: 'gnews',
          published_at: article.publishedAt,
        })
      }
    } catch (err) {
      console.error(`GNews fetch error for "${q}":`, err)
    }
  }

  return articles
}
