import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ecosystem } from '@/data/ecosystem'
import { problems } from '@/data/problems'
import { ECOSYSTEM_TYPE_LABEL, type EcosystemType } from '@/data/types'

export const metadata = {
  title: 'Ecosystem | optimism.fun',
  description:
    'The capital stack: grants, fellowships, catalytic capital, venture studios, and deep-tech VC mapped to the quests they fund.',
}

const TYPE_ORDER: EcosystemType[] = [
  'grant',
  'fellowship',
  'accelerator',
  'catalytic',
  'fro',
  'studio',
  'vc',
]

const TYPE_COLOR: Record<EcosystemType, string> = {
  grant: 'text-amber-300 border-amber-500/25 bg-amber-500/5',
  fellowship: 'text-amber-300 border-amber-500/25 bg-amber-500/5',
  accelerator: 'text-terminal-green border-emerald-500/25 bg-emerald-500/5',
  catalytic: 'text-terminal-green border-emerald-500/25 bg-emerald-500/5',
  fro: 'text-terminal-violet border-terminal-violet/25 bg-purple-500/5',
  studio: 'text-amber-200 border-amber-300/25 bg-indigo-500/5',
  vc: 'text-terminal-rose border-rose-500/25 bg-rose-500/5',
}

export default function EcosystemPage() {
  const problemBySlug = new Map(problems.map((p) => [p.slug, p]))

  const grouped = TYPE_ORDER.map((type) => ({
    type,
    entities: ecosystem.filter((e) => e.type === type),
  })).filter((g) => g.entities.length > 0)

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-300 transition-colors mb-8"
            >
              <span>←</span> back
            </Link>
            <p className="text-amber-300 font-medium tracking-[0.2em] uppercase text-xs mb-3">
              The Capital Stack
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.1] mb-6">
              Who funds the quests.
            </h1>
            <p className="text-lg text-ink-400 leading-relaxed max-w-3xl mb-16">
              A map of {ecosystem.length} institutions across the good-quest capital stack.
              Ranges from small fast grants for weird ideas to growth-stage deep-tech VC
              with rigorous impact scoring. If a quest you care about isn&rsquo;t funded
              here, that&rsquo;s the white space.
            </p>

            <div className="space-y-16">
              {grouped.map(({ type, entities }) => (
                <section key={type}>
                  <div className="mb-6 flex items-baseline justify-between">
                    <h2 className="font-serif text-2xl font-normal text-ink-100">
                      {ECOSYSTEM_TYPE_LABEL[type]}
                      {entities.length > 1 ? 's' : ''}
                    </h2>
                    <span className="text-sm text-ink-500">
                      {entities.length} {entities.length === 1 ? 'entity' : 'entities'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {entities.map((e) => (
                      <div
                        key={e.slug}
                        className="rounded border border-hair bg-ink-900 p-6 hover:border-hair-strong transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <a
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif text-lg font-semibold text-ink-100 hover:text-amber-200 transition-colors"
                          >
                            {e.name}
                          </a>
                          <span
                            className={`inline-flex items-center rounded-none border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-medium ${TYPE_COLOR[e.type]}`}
                          >
                            {ECOSYSTEM_TYPE_LABEL[e.type]}
                          </span>
                        </div>
                        <p className="text-sm text-ink-300 leading-relaxed mb-3 font-medium">
                          {e.thesis}
                        </p>
                        <p className="text-sm text-ink-400 leading-relaxed mb-4">
                          {e.description}
                        </p>
                        <p className="text-xs text-ink-500 mb-4">
                          <span className="text-ink-600">best for:</span> {e.bestFor}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {e.problemSlugs.map((slug) => {
                            const p = problemBySlug.get(slug)
                            if (!p) return null
                            return (
                              <Link
                                key={slug}
                                href={`/p/${slug}`}
                                className="inline-flex items-center rounded-none border border-hair bg-ink-900 px-2 py-0.5 text-[11px] text-ink-400 hover:border-amber-300/30 hover:text-amber-200 transition-colors"
                              >
                                {p.name}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
