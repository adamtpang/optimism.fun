import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import HeroFigure from '@/components/HeroFigure'
import { questStages, QUEST_INTRO, QUEST_CLOSER, QUEST_MISSION } from '@/data/journey'
import { medianMonthlyRevenue, zeroCostStarts } from '@/data/microsaas-benchmarks'

export const metadata: Metadata = {
  title: 'The Quest — six gates | optimism.fun',
  description:
    'The methods for building something enormous are public and free. What people lack is permission to begin and the means to survive the middle. Six stages, each ending in a test you either passed or you did not.',
}

export default function JourneyPage() {
  const median = medianMonthlyRevenue()
  const zeroStarts = zeroCostStarts().length

  return (
    <>
      <Navbar />
      <main>
        {/* Mission */}
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="max-w-4xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The mission
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-5">
              {QUEST_MISSION.statement}
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              {QUEST_MISSION.why}
            </p>
          </div>
        </section>

        {/* The reframe */}
        <section className="border-b border-hair bg-ink-900/30">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              {QUEST_INTRO.kicker}
            </p>
            <h2 className="font-serif text-2xl md:text-4xl text-ink-100 leading-tight mb-4">
              {QUEST_INTRO.title}
            </h2>
            <p className="text-ink-300 leading-relaxed max-w-2xl">{QUEST_INTRO.blurb}</p>
            <p className="mt-4 font-mono text-[11px] text-ink-500 max-w-2xl leading-relaxed">
              Eric Jorgenson published 69 of Musk&apos;s methods, free, in every bookshop. The
              Algorithm is on page 130. And there are not a million Musks — so information was
              never the constraint. Permission and survival are.
            </p>
          </div>
        </section>

        {/* The stages */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <ol className="relative">
            {questStages.map((st, i) => (
              <li key={st.key} className="relative pl-16 sm:pl-24 pb-14 last:pb-0">
                {i < questStages.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[1.375rem] sm:left-7 top-12 sm:top-14 bottom-0 w-px bg-ink-700"
                  />
                )}
                <span className="absolute left-0 top-0 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-hair bg-paper font-mono text-sm sm:text-base text-amber-300">
                  {st.stage}
                </span>

                <div className="pt-1">
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink-100 leading-snug">
                    {st.title}
                  </h2>
                  <p className="font-mono text-xs sm:text-sm text-amber-300 mt-1.5 mb-4">
                    {st.tagline}
                  </p>

                  {/* the gate — the load-bearing element */}
                  <div className="border border-amber-300/40 rounded px-4 py-3 mb-5 max-w-2xl">
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1.5">
                      The gate — you pass when
                    </p>
                    <p className="text-ink-100 text-[15px] leading-relaxed">{st.gate}</p>
                  </div>

                  <p className="text-ink-300 leading-relaxed mb-5 max-w-2xl">{st.why}</p>

                  <ul className="space-y-2 mb-5 max-w-2xl">
                    {st.moves.map((m, j) => (
                      <li key={j} className="flex gap-3 text-sm text-ink-400 leading-relaxed">
                        <span className="font-mono text-ink-600 mt-px shrink-0">
                          {String.fromCharCode(97 + j)}.
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>

                  {/* the methods that apply here */}
                  <div className="mb-5 max-w-2xl">
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                      The methods that apply here
                    </p>
                    <ul className="space-y-1.5">
                      {st.methods.map((m) => (
                        <li key={m.n} className="flex gap-2.5 text-[13px] leading-relaxed">
                          <span className="font-mono text-[10px] text-ink-600 tabular-nums mt-0.5 shrink-0">
                            #{m.n}
                          </span>
                          <span className="text-ink-300">{m.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* historical analogue */}
                  <div className="border-l-2 border-hair rounded-r bg-paper/50 px-4 py-3 mb-5 max-w-2xl">
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                      Someone already did this · {st.analogue.year}
                    </p>
                    <p className="text-ink-200 text-sm leading-relaxed">
                      <span className="text-ink-100 font-medium">
                        {st.analogue.founder}, {st.analogue.company}.
                      </span>{' '}
                      {st.analogue.moment}
                    </p>
                    <p className="text-ink-400 text-sm leading-relaxed mt-2 italic">
                      {st.analogue.lesson}
                    </p>
                  </div>

                  <Link
                    href={st.cta.href}
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-amber-300 hover:text-amber-200 border border-hair hover:border-amber-300 rounded px-3 py-2 transition-colors"
                  >
                    {st.cta.label}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* what a first company actually earns — the survival evidence */}
        <section className="border-y border-hair bg-ink-900/30">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] gap-8 items-start">
              <HeroFigure
                value={`$${(median / 1000).toFixed(0)}k`}
                label="Median micro-SaaS, per month"
                caption={`Across 190 small software businesses with reported revenue. ${zeroStarts} of them started with no capital at all.`}
              />
              <div className="space-y-4">
                <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                  Stage 3 is smaller than it looks.
                </h2>
                <p className="text-ink-400 text-sm leading-relaxed max-w-2xl">
                  The gap between Stage 0 and a company that pays for your life is not a decade.
                  In this benchmark set the median business earns more per month than most people
                  need per quarter, and the most common starting cost is nothing. That is not an
                  argument that it is easy — the set is survivorship-biased by construction, since
                  it is a list of businesses that worked. It is an argument that the first gate is
                  closer than the fear suggests.
                </p>
                <p className="font-mono text-[10px] text-ink-600 leading-relaxed max-w-2xl">
                  Self-reported figures compiled from public founder interviews. Not audited, and
                  not a base rate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closer */}
        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-14 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-ink-100 mb-4">
              {QUEST_CLOSER.title}
            </h2>
            <p className="text-ink-300 leading-relaxed max-w-2xl mx-auto mb-8">
              {QUEST_CLOSER.blurb}
            </p>
            <Link
              href={QUEST_CLOSER.cta.href}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-ultra-wide text-paper bg-amber-300 hover:bg-amber-200 rounded px-5 py-3 transition-colors"
            >
              {QUEST_CLOSER.cta.label}
            </Link>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
