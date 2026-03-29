import { RawArticle } from '../types'

// WHO Disease Outbreak News RSS
export async function fetchWHO(): Promise<RawArticle[]> {
  const articles: RawArticle[] = []

  try {
    // WHO Disease Outbreak News
    const res = await fetch('https://www.who.int/rss-feeds/news-english.xml')
    if (!res.ok) return []

    const xml = await res.text()
    const items = xml.split('<item>').slice(1)

    for (const item of items.slice(0, 15)) {
      const titleMatch = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
                         item.match(/<title>([\s\S]*?)<\/title>/)
      const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                        item.match(/<description>([\s\S]*?)<\/description>/)
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/)
      const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)

      const title = titleMatch?.[1]?.trim() || ''
      const description = descMatch?.[1]?.replace(/<[^>]+>/g, '').trim() || ''
      const url = linkMatch?.[1]?.trim() || ''

      if (title && description) {
        articles.push({
          title,
          description: description.slice(0, 500),
          url,
          source_name: 'WHO',
          source_type: 'who',
          published_at: dateMatch?.[1]?.trim(),
        })
      }
    }
  } catch (err) {
    console.error('WHO fetch error:', err)
  }

  return articles
}
