export interface RawArticle {
  title: string
  description: string
  url: string
  source_name: string
  source_type: 'gnews' | 'arxiv' | 'who' | 'worldbank' | 'rss' | 'reddit' | 'hackernews' | 'x'
  published_at?: string
}

export interface ExtractedProblem {
  title: string
  description: string
  category: string
  severity_score: number
  opportunity_score: number
  solvability_score: number
  affected_population: string
  location: string
  source_url: string
  source_name: string
}
