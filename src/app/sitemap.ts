import type { MetadataRoute } from 'next'
import { publicPaths } from '@/lib/public-routes'

const SITE_URL = 'https://optimism.fun'

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths().map((route) => ({
    url: route === '' ? `${SITE_URL}/` : `${SITE_URL}${route}`,
    lastModified: new Date('2026-11-06'),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/p/') ? 0.8 : 0.6,
  }))
}
