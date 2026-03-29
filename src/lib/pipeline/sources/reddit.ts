import { RawArticle } from '../types'

// Reddit JSON API - completely free, no auth required for public subreddits
// Surfaces problems from communities where people discuss real-world issues
// Inspired by ideabrowser.com's approach of mining community complaints

interface RedditPost {
  data: {
    title: string
    selftext: string
    url: string
    permalink: string
    subreddit: string
    score: number
    num_comments: number
    created_utc: number
  }
}

interface RedditListing {
  data: {
    children: RedditPost[]
  }
}

// Subreddits where humanity's problems surface naturally
const PROBLEM_SUBREDDITS = [
  { sub: 'worldnews', query: 'crisis OR disaster OR shortage OR conflict', name: 'r/worldnews' },
  { sub: 'Futurology', query: 'problem OR challenge OR threat OR risk', name: 'r/Futurology' },
  { sub: 'climate', query: '', name: 'r/climate' },
  { sub: 'healthcare', query: 'crisis OR shortage OR cost', name: 'r/healthcare' },
  { sub: 'energy', query: 'problem OR challenge OR transition', name: 'r/energy' },
  { sub: 'water', query: 'crisis OR shortage OR contamination', name: 'r/water' },
  { sub: 'education', query: 'problem OR failing OR crisis', name: 'r/education' },
]

export async function fetchReddit(): Promise<RawArticle[]> {
  const articles: RawArticle[] = []

  for (const { sub, query, name } of PROBLEM_SUBREDDITS) {
    try {
      // Use search endpoint if we have a query, otherwise top posts
      const url = query
        ? `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(query)}&sort=new&restrict_sr=1&limit=5&t=week`
        : `https://www.reddit.com/r/${sub}/hot.json?limit=5`

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'optimism.fun:v0.1 (problem research bot)',
        },
      })

      if (!res.ok) {
        console.error(`Reddit r/${sub} returned ${res.status}`)
        continue
      }

      const data: RedditListing = await res.json()

      for (const post of data.data.children) {
        const { title, selftext, permalink, score, num_comments, created_utc } = post.data

        // Only high-engagement posts (real problems people care about)
        if (score < 10) continue

        const description = selftext
          ? selftext.slice(0, 500).replace(/\n/g, ' ').trim()
          : `Community discussion with ${score} upvotes and ${num_comments} comments`

        articles.push({
          title: title.slice(0, 300),
          description: description || title,
          url: `https://www.reddit.com${permalink}`,
          source_name: name,
          source_type: 'reddit',
          published_at: new Date(created_utc * 1000).toISOString(),
        })
      }
    } catch (err) {
      console.error(`Reddit r/${sub} fetch error:`, err)
    }
  }

  console.log(`Reddit: fetched ${articles.length} posts from ${PROBLEM_SUBREDDITS.length} subreddits`)
  return articles
}
