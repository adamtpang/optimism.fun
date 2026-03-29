import { RawArticle } from '../types'
import { fetchGNews } from './gnews'
import { fetchArxiv } from './arxiv'
import { fetchWHO } from './who'
import { fetchWorldBank } from './worldbank'
import { fetchRSS } from './rss'
import { fetchReddit } from './reddit'
import { fetchHackerNews } from './hackernews'
import { fetchX } from './x'

export async function fetchAllSources(): Promise<RawArticle[]> {
  const results = await Promise.allSettled([
    fetchGNews(),
    fetchArxiv(),
    fetchWHO(),
    fetchWorldBank(),
    fetchRSS(),
    fetchReddit(),
    fetchHackerNews(),
    fetchX(),
  ])

  const articles: RawArticle[] = []
  const seenUrls = new Set<string>()

  const sourceNames = ['GNews', 'arXiv', 'WHO', 'World Bank', 'RSS', 'Reddit', 'Hacker News', 'X']

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (result.status === 'fulfilled') {
      for (const article of result.value) {
        if (!seenUrls.has(article.url)) {
          seenUrls.add(article.url)
          articles.push(article)
        }
      }
    } else {
      console.error(`${sourceNames[i]} fetch failed:`, result.reason)
    }
  }

  const succeeded = results.filter(r => r.status === 'fulfilled').length
  console.log(`Fetched ${articles.length} unique articles from ${succeeded}/${results.length} sources`)
  return articles
}
