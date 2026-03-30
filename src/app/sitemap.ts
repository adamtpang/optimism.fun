import { getDb } from '@/lib/db'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: 'https://optimism.fun', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://optimism.fun/problems', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: 'https://optimism.fun/leaderboards', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.85 },
    { url: 'https://optimism.fun/discover', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://optimism.fun/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  let problemPages: MetadataRoute.Sitemap = []

  try {
    const sql = getDb()
    const problems = await sql`SELECT slug, last_updated_at FROM problems ORDER BY composite_score DESC`
    problemPages = problems.map((p) => ({
      url: `https://optimism.fun/problems/${p.slug}`,
      lastModified: new Date(p.last_updated_at as string),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch {
    // DB unavailable — return static pages only
  }

  return [...staticPages, ...problemPages]
}
