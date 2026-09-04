import type { Metadata } from 'next'
import Link from 'next/link'
import { Atom, Biohazard, BrainCircuit, ExternalLink, Orbit, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DataFreshness from '@/components/DataFreshness'
import { existentialRisks } from '@/data/existential-risks'

export const metadata: Metadata = {
  title: 'S-Tier Existential Quests | optimism.fun',
  description:
    'The small set of problems with credible pathways to human extinction or permanent civilizational loss, translated into concrete quests.',
}

const ICONS = {
  'ai-control': BrainCircuit,
  'engineered-pandemics': Biohazard,
  'nuclear-war': Atom,
  'planetary-catastrophe': Orbit,
}

export default function STierPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-3 text-terminal-rose">
              <ShieldCheck size={15} aria-hidden />
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide">
                S-tier only
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 max-w-4xl">
              Problems humanity
              <span className="block text-terminal-rose">cannot afford to lose.</span>
            </h1>
            <p className="mt-5 text-ink-400 leading-relaxed max-w-3xl text-base">
              S-tier is not the top percentile of a long list. It is a consequence class: a
              credible path to human extinction or permanent loss of civilization&apos;s future.
              The ranking below separates the existential mechanism from the concrete defenses
              a founder, researcher, funder, or institution can build now.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-ink-500">
              <span><strong className="text-ink-100">{existentialRisks.length}</strong> threat classes</span>
              <span><strong className="text-ink-100">{existentialRisks.reduce((sum, risk) => sum + risk.quests.length, 0)}</strong> concrete quests</span>
              <span><strong className="text-ink-100">0</strong> invented probabilities</span>
            </div>
            <DataFreshness className="mt-5" />
          </div>
        </section>

        <section className="border-b border-hair bg-ink-900/30">
          <div className="max-w-6xl mx-auto px-6 py-7 grid md:grid-cols-[12rem_1fr] gap-4 md:gap-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-rose">
              The admission test
            </p>
            <div className="grid sm:grid-cols-3 gap-5 text-sm leading-relaxed text-ink-400">
              <p><span className="block text-ink-100 mb-1">1. Species-wide consequence</span>A credible mechanism reaches every population or permanently destroys humanity&apos;s future.</p>
              <p><span className="block text-ink-100 mb-1">2. Evidence, with uncertainty</span>The mechanism is sourced. Unknown probability is shown as unknown, never converted into fake precision.</p>
              <p><span className="block text-ink-100 mb-1">3. Actionable defense</span>There is a measurable bottleneck where additional engineering, science, capital, or coordination can change the outcome.</p>
            </div>
          </div>
        </section>

        <section>
          {existentialRisks.map((risk) => {
            const Icon = ICONS[risk.slug]
            return (
              <article key={risk.slug} id={risk.slug} className="border-b border-hair scroll-mt-24">
                <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
                  <div className="grid lg:grid-cols-[7rem_minmax(0,1fr)] gap-6 lg:gap-10">
                    <div className="flex lg:flex-col items-center lg:items-start gap-3">
                      <span className="h-12 w-12 inline-flex items-center justify-center border border-terminal-rose/40 text-terminal-rose" aria-hidden>
                        <Icon size={23} />
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-wide text-terminal-rose">
                        S{risk.rank}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-600 mb-2">
                        {risk.shortName}
                      </p>
                      <h2 className="font-serif text-3xl md:text-4xl text-ink-100 leading-tight">
                        {risk.name}
                      </h2>

                      <div className="mt-7 grid md:grid-cols-2 gap-x-10 gap-y-6 text-sm leading-relaxed">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-rose mb-2">Failure mechanism</p>
                          <p className="text-ink-300">{risk.mechanism}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-cyan mb-2">What evidence says</p>
                          <p className="text-ink-400">{risk.evidenceState}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-green mb-2">Victory condition</p>
                          <p className="text-ink-300">{risk.objective}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-amber-300 mb-2">Rate-limiting bottleneck</p>
                          <p className="text-ink-400">{risk.bottleneck}</p>
                        </div>
                      </div>

                      <div className="mt-9 border-t border-hair">
                        <div className="py-3 flex items-center justify-between gap-4 border-b border-hair">
                          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">Buildable quests</p>
                          <span className="font-mono text-[10px] text-ink-600">proof, not aspiration</span>
                        </div>
                        {risk.quests.map((quest, index) => (
                          <div key={quest.title} className="grid md:grid-cols-[2rem_13rem_minmax(0,1fr)] gap-3 md:gap-5 py-5 border-b border-hair last:border-b-0">
                            <span className="font-mono text-[11px] tabular-nums text-ink-600">{String(index + 1).padStart(2, '0')}</span>
                            <h3 className="font-serif text-lg text-ink-100 leading-snug">{quest.title}</h3>
                            <div className="min-w-0">
                              <p className="text-sm leading-relaxed text-ink-400">{quest.wedge}</p>
                              <p className="mt-2 font-mono text-[10px] leading-relaxed text-terminal-green">
                                PROOF: {quest.proof}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <a
                        href={risk.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] text-ink-500 hover:text-terminal-cyan transition-colors"
                      >
                        Primary evidence: {risk.source.label}
                        <ExternalLink size={13} aria-hidden />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        <section className="border-b border-hair">
          <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-[1fr_auto] gap-6 md:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-rose mb-2">The focus rule</p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100">Everything else is supporting infrastructure.</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-400 max-w-2xl">
                Energy, climate resilience, institutions, scientific productivity, and demographic health matter here when they measurably reduce one of these four risks. They are not relabeled existential merely because they are important.
              </p>
            </div>
            <Link href="/fit" className="h-10 inline-flex items-center justify-center px-4 border border-terminal-rose/50 text-terminal-rose font-mono text-[11px] uppercase tracking-wide hover:bg-terminal-rose/10 transition-colors">
              Find your S-tier fit
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

