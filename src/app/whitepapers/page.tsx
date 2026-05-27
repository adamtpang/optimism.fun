import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { whitepapers } from '@/data/whitepapers'
import { getProblemBySlug } from '@/data/problems'

export const metadata = {
  title: 'Whitepapers · optimism.fun',
  description:
    'Weekly blackpaper + whitepaper drops. One problem at a time, deep dive plus proposed solution.',
}

export default function WhitepapersIndex() {
  const sorted = [...whitepapers].sort((a, b) => b.week - a.week)
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="max-w-3xl mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-ultra-wide text-ink-500 hover:text-amber-300 transition-colors mb-8"
            >
              <span>&larr;</span> back
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              weekly drops
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] text-ink-100 mb-5">
              Whitepapers.
            </h1>
            <p className="text-lg text-ink-300 leading-relaxed max-w-2xl">
              Every Monday, one problem. Blackpaper: the deep dive. Whitepaper: the
              proposed solution and the founders &amp; allocators it&rsquo;s
              addressed to.
            </p>
          </div>
        </section>

        <section className="px-6 py-10 max-w-3xl mx-auto">
          {sorted.length === 0 ? (
            <div className="border border-dashed border-hair p-8 text-center">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
                no drops yet
              </p>
              <p className="text-sm text-ink-400 leading-relaxed max-w-md mx-auto mb-4">
                The first issue is in flight. Subscribe to get it in your inbox the
                Monday it ships.
              </p>
              <Link
                href="/#join"
                className="font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-4 py-2 hover:bg-amber-300/[0.08] transition-colors inline-block"
              >
                Subscribe &rarr;
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {sorted.map((w) => {
                const problem = getProblemBySlug(w.problemSlug)
                if (!problem) return null
                return (
                  <li key={w.slug}>
                    <Link
                      href={`/p/${problem.slug}/whitepaper`}
                      className="block border border-hair bg-ink-900 hover:bg-ink-800/60 transition-colors p-5"
                    >
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <span className="font-mono text-[11px] tabular-nums text-amber-300">
                          week {w.week.toString().padStart(2, '0')}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                          {w.publishedAt}
                        </span>
                      </div>
                      <h2 className="font-serif text-xl text-ink-100 mb-1">
                        {problem.name}
                      </h2>
                      <p className="text-sm text-ink-400 leading-snug line-clamp-2">
                        {problem.tagline}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
