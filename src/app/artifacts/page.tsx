import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FIGMA_ARTIFACT_FACTORY_URL, infographicBriefs } from '@/data/infographics'

export const metadata = {
  title: 'Artifacts · optimism.fun',
  description: 'Source-first visual briefs: data-backed findings designed for publication, review, and discussion.',
}

const statusLabel = {
  'ready-for-design': 'ready for design',
  'in-review': 'in review',
  published: 'published',
} as const

export default function ArtifactsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="site-shell">
            <p className="font-mono text-small uppercase text-primary mb-3">
              artifact factory
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] text-ink-100 mb-5 max-w-7xl">
              Findings worth <span className="text-primary">passing on.</span>
            </h1>
            <p className="text-lg text-ink-300 leading-relaxed max-w-7xl">
              A source-first editorial queue for publishable infographics. Each brief starts with
              a claim that can survive scrutiny, then becomes an editable Figma asset and
              platform-native draft. Nothing is posted without human review.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={FIGMA_ARTIFACT_FACTORY_URL} target="_blank" rel="noreferrer" className="font-mono text-small uppercase tracking-wider text-paper bg-primary hover:bg-primary/90 px-4 py-2.5 transition-colors">
                Open Figma factory &rarr;
              </a>
              <Link href="/methodology" className="font-mono text-small uppercase tracking-wider text-ink-300 border border-hair hover:border-primary px-4 py-2.5 transition-colors">
                Read the evidence standard &rarr;
              </Link>
            </div>
          </div>
        </section>

        <section className="site-shell py-12">
          <div className="grid gap-6">
            {infographicBriefs.map((brief, i) => (
              <article key={brief.slug} className="border border-hair bg-ink-900/30">
                <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)]">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span className="font-mono text-small uppercase text-primary">{String(i + 1).padStart(2, '0')} · {brief.kicker}</span>
                      <span className="font-mono text-small uppercase tracking-wide text-terminal-cyan">{statusLabel[brief.status]}</span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-3">{brief.title}</h2>
                    <p className="font-serif text-lg text-primary leading-relaxed mb-6">{brief.claim}</p>
                    <div className="grid sm:grid-cols-3 gap-px bg-ink-700/50 border border-hair">
                      {brief.facts.map((fact) => (
                        <a key={fact.label} href={fact.sourceUrl} target="_blank" rel="noreferrer" className="bg-ink-900 p-4 hover:bg-ink-800/70 transition-colors">
                          <p className="font-mono text-2xl text-ink-100 tabular-nums mb-1">{fact.value}</p>
                          <p className="text-small text-ink-300 leading-snug">{fact.label}</p>
                          <p className="mt-2 font-mono text-small text-ink-600 leading-snug">{fact.source}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                  <aside className="border-t lg:border-t-0 lg:border-l border-hair p-6 bg-ink-900/60">
                    <p className="font-mono text-small uppercase text-ink-500 mb-2">Visual direction</p>
                    <p className="font-serif text-lg text-ink-100 mb-2">{brief.visual.chart}</p>
                    <p className="text-sm text-ink-400 leading-relaxed mb-5">{brief.visual.direction}</p>
                    <p className="font-mono text-small uppercase text-ink-500 mb-2">Publishing draft</p>
                    <p className="text-sm text-ink-300 leading-relaxed whitespace-pre-line">{brief.xDraft}</p>
                    <p className="mt-5 font-mono text-small text-ink-600 leading-relaxed">{brief.sourceNote}</p>
                  </aside>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

