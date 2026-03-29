import { RawArticle } from '../types'

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)
  const match = xml.match(regex)
  return match ? match[1].trim() : ''
}

export async function fetchArxiv(): Promise<RawArticle[]> {
  const queries = [
    'all:global+AND+all:challenge',
    'all:humanitarian+AND+all:crisis',
    'all:climate+AND+all:risk',
  ]

  const articles: RawArticle[] = []

  for (const q of queries) {
    try {
      const url = `http://export.arxiv.org/api/query?search_query=${q}&max_results=10&sortBy=submittedDate&sortOrder=descending`
      const res = await fetch(url)
      if (!res.ok) continue

      const xml = await res.text()
      const entries = xml.split('<entry>').slice(1)

      for (const entry of entries) {
        const title = extractTag(entry, 'title').replace(/\s+/g, ' ')
        const summary = extractTag(entry, 'summary').replace(/\s+/g, ' ')
        const id = extractTag(entry, 'id')
        const published = extractTag(entry, 'published')

        if (title && summary) {
          articles.push({
            title,
            description: summary.slice(0, 500),
            url: id,
            source_name: 'arXiv',
            source_type: 'arxiv',
            published_at: published,
          })
        }
      }
    } catch (err) {
      console.error('arXiv fetch error:', err)
    }
  }

  return articles
}
