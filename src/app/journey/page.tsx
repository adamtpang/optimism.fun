import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import { questLevels, QUEST_INTRO, QUEST_CLOSER } from '@/data/journey'

export const metadata: Metadata = {
  title: 'The Quest — founder to history books | optimism.fun',
  description:
    'The gamified founder journey: choose a problem worth your life, call your shot, raise from opinionated capital, write the spec, ship, and build the platonic-ideal company. Seven moves, each proven by a founder who already walked it.',
}

export default function JourneyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="max-w-4xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              {QUEST_INTRO.kicker}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-5">
              {QUEST_INTRO.title}
            </h1>
            <p className="text-ink-300 leading-relaxed max-w-2xl text-base md:text-lg">
              {QUEST_INTRO.blurb}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
              <span>7 levels</span>
              <span>·</span>
              <span>map demand → find the gap → build the company</span>
              <span>·</span>
              <span>each move already proven</span>
            </div>
          </div>
        </section>

        {/* The quest path */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <ol className="relative">
            {questLevels.map((lv, i) => (
              <li key={lv.key} className="relative pl-16 sm:pl-24 pb-14 last:pb-0">
                {/* connecting path line */}
                {i < questLevels.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[1.375rem] sm:left-7 top-12 sm:top-14 bottom-0 w-px bg-ink-700"
                  />
                )}
                {/* level node */}
                <span className="absolute left-0 top-0 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-hair bg-paper font-mono text-sm sm:text-base text-amber-300">
                  {lv.level}
                </span>

                <div className="pt-1">
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                    Level {lv.level}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink-100 leading-snug">
                    {lv.title}
                  </h2>
                  <p className="font-mono text-xs sm:text-sm text-amber-300 mt-1.5 mb-4">
                    {lv.tagline}
                  </p>
                  <p className="text-ink-300 leading-relaxed mb-5 max-w-2xl">{lv.move}</p>

                  <ul className="space-y-2 mb-5 max-w-2xl">
                    {lv.steps.map((s, j) => (
                      <li key={j} className="flex gap-3 text-sm text-ink-400 leading-relaxed">
                        <span className="font-mono text-ink-600 mt-px shrink-0">
                          {String.fromCharCode(97 + j)}.
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>

                  {/* historical analogue */}
                  <div className="border-l-2 border-amber-300/40 rounded-r bg-paper/50 px-4 py-3 mb-5 max-w-2xl">
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                      Someone already did this · {lv.analogue.year}
                    </p>
                    <p className="text-ink-200 text-sm leading-relaxed">
                      <span className="text-ink-100 font-medium">
                        {lv.analogue.founder}, {lv.analogue.company}.
                      </span>{' '}
                      {lv.analogue.moment}
                    </p>
                    <p className="text-ink-400 text-sm leading-relaxed mt-2 italic">
                      {lv.analogue.lesson}
                    </p>
                  </div>

                  <Link
                    href={lv.cta.href}
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-amber-300 hover:text-amber-200 border border-hair hover:border-amber-300 rounded px-3 py-2 transition-colors"
                  >
                    {lv.cta.label} <span aria-hidden>→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Closer */}
        <section className="border-t border-hair">
          <div className="max-w-4xl mx-auto px-6 py-14 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-ink-100 mb-4">
              {QUEST_CLOSER.title}
            </h2>
            <p className="text-ink-300 leading-relaxed max-w-2xl mx-auto mb-8">
              {QUEST_CLOSER.blurb}
            </p>
            <Link
              href="/radar"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-ultra-wide text-paper bg-amber-300 hover:bg-amber-200 rounded px-5 py-3 transition-colors"
            >
              Take the first step <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
