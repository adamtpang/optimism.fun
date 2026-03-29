import { RawArticle } from '../types'

export async function fetchRSS(): Promise<RawArticle[]> {
  const feeds = [
    {
      url: 'https://news.google.com/rss/search?q=global+crisis+humanitarian&hl=en-US&gl=US&ceid=US:en',
      name: 'Google News',
    },
    {
      url: 'https://news.google.com/rss/search?q=technology+problem+breakthrough&hl=en-US&gl=US&ceid=US:en',
      name: 'Google News',
    },
  ]

  const articles: RawArticle[] = []

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url)
      if (!res.ok) continue

      const xml = await res.text()
      const items = xml.split('<item>').slice(1)

      for (const item of items.slice(0, 10)) {
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
            source_name: feed.name,
            source_type: 'rss',
            published_at: dateMatch?.[1]?.trim(),
          })
        }
      }
    } catch (err) {
      console.error(`RSS fetch error for ${feed.name}:`, err)
    }
  }

  return articles
}
