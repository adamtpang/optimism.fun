import { RawArticle } from '../types'

// X/Twitter monitoring via Google News RSS - $0 cost
// Surfaces problems being discussed on X by key accounts and trending topics
//
// Strategy: Use Google News RSS with site:x.com filter to find
// problems and crises being discussed on X
// When budget allows, upgrade to X API v2 ($100/mo) for real-time monitoring
//
// Key accounts to monitor (progress movement + problem solvers):
// @elonmusk @naval @balaboris @jasoncrawford @DavidDeutschOxf
// @PatrickCollison @tylercowen @AstralCodexTen @conaboris

const X_SEARCH_QUERIES = [
  // Problems surfaced on X
  'site:x.com global crisis 2026',
  'site:x.com humanity biggest problem',
  'site:x.com climate technology solution',
  // Progress movement voices
  'site:x.com progress studies technology',
  'site:x.com problem solving startup',
]

export async function fetchX(): Promise<RawArticle[]> {
  const articles: RawArticle[] = []

  for (const query of X_SEARCH_QUERIES) {
    try {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`

      const res = await fetch(rssUrl)
      if (!res.ok) continue

      const xml = await res.text()
      const items = xml.split('<item>').slice(1)

      for (const item of items.slice(0, 3)) {
        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/)
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/)
        const descMatch = item.match(/<description>([\s\S]*?)<\/description>/)
        const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)

        const title = (titleMatch?.[1] || '').replace(/<!\[CDATA\[|\]\]>/g, '').trim()
        const url = (linkMatch?.[1] || '').trim()
        const description = (descMatch?.[1] || '')
          .replace(/<!\[CDATA\[|\]\]>/g, '')
          .replace(/<[^>]+>/g, '')
          .trim()

        if (title && url) {
          articles.push({
            title,
            description: description.slice(0, 500) || title,
            url,
            source_name: 'X (via Google News)',
            source_type: 'x',
            published_at: dateMatch?.[1]?.trim(),
          })
        }
      }
    } catch (err) {
      console.error(`X search error:`, err)
    }
  }

  console.log(`X/Twitter: fetched ${articles.length} posts via Google News`)
  return articles
}
