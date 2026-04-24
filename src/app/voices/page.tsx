import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { voices } from '@/data/voices'
import { problems } from '@/data/problems'

export const metadata = {
  title: 'Voices | optimism.fun',
  description:
    'Progress studies thinkers and what they say matters. Deutsch, Musk, Collison, Crawford, Cowen, Stephens, mapped to the problems they prioritize.',
}

export default function VoicesPage() {
  const problemBySlug = new Map(problems.map((p) => [p.slug, p]))

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-300 transition-colors mb-8"
            >
              <span>←</span> back
            </Link>
            <p className="text-terminal-violet font-medium tracking-[0.2em] uppercase text-xs mb-3">
              Voices
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.1] mb-6">
              What the thinkers say.
            </h1>
            <p className="text-lg text-ink-400 leading-relaxed max-w-3xl mb-16">
              The people who have spent careers thinking about which problems humanity should
              work on, and what they&rsquo;ve actually said. When multiple voices point at the
              same quest, that&rsquo;s a convergence signal. Disagreement is information too.
            </p>

            <div className="grid gap-6">
              {voices.map((v) => (
                <div
                  key={v.slug}
                  className="rounded border border-hair bg-ink-900 p-7 hover:border-terminal-violet/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-3">
                    <div>
                      <Link
                        href={`/voices/${v.slug}`}
                        className="font-serif text-2xl font-normal text-ink-100 hover:text-terminal-violet transition-colors"
                      >
                        {v.name}
                      </Link>
                      <p className="text-sm text-ink-500 mt-0.5">
                        {v.role}
                        {v.org ? ` · ${v.org}` : ''}
                      </p>
                    </div>
                    <span className="text-xs text-ink-500">
                      {v.positions.length}{' '}
                      {v.positions.length === 1 ? 'problem' : 'problems'} cited
                    </span>
                  </div>
                  <p className="text-ink-400 leading-relaxed mb-5">{v.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {v.positions.map((pos) => {
                      const problem = problemBySlug.get(pos.problemSlug)
                      if (!problem) return null
                      return (
                        <Link
                          key={pos.problemSlug}
                          href={`/p/${pos.problemSlug}`}
                          className="inline-flex items-center rounded-none border border-hair bg-ink-900 px-2.5 py-0.5 text-[11px] text-ink-400 hover:border-terminal-violet/30 hover:text-terminal-violet transition-colors"
                        >
                          {problem.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
