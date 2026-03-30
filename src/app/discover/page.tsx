import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DiscoveryFlow from '@/components/discover/DiscoveryFlow'
import { getDb } from '@/lib/db'
import type { Category } from '@/lib/db/types'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Discover Your Path | optimism.fun',
  description: 'Discover which problems match your passions, talents, and work preferences. Find meaningful work with freedom.',
}

export default async function DiscoverPage() {
  let categories: Category[] = []
  let problems: { slug: string; title: string; composite_score: number; category_slug: string | null; category_icon: string | null; category_name: string | null }[] = []

  try {
    const sql = getDb()
    const [catResult, probResult] = await Promise.all([
      sql`SELECT * FROM categories ORDER BY name`,
      sql`
        SELECT p.slug, p.title, p.composite_score,
               c.slug as category_slug, c.icon as category_icon, c.name as category_name
        FROM problems p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
        ORDER BY p.composite_score DESC
      `,
    ])
    categories = catResult as unknown as Category[]
    problems = probResult as unknown as typeof problems
  } catch {
    // DB unavailable - show empty state
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <p className="text-gold font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-4">
              Self-Discovery
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-3">
              Find Your Path
            </h1>
            <p className="text-warm text-sm sm:text-base max-w-lg">
              Answer a few questions to match your passions and talents with problems
              worth solving. It takes 30 seconds.
            </p>
          </div>

          <DiscoveryFlow
            categories={categories}
            problems={problems}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
