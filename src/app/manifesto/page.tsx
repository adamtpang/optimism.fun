import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import { problems } from '@/data/problems'

export const metadata: Metadata = {
  title: 'Manifesto | optimism.fun',
  description:
    'The philosophy behind optimism.fun: problems are soluble, progress is a choice, and the way to make more of it is to see the work clearly and route talent and capital to it.',
}

const tenets = [
  {
    n: '01',
    title: 'Problems are soluble.',
    body: 'David Deutsch put it plainly: every problem that is not forbidden by the laws of physics is solvable, given the right knowledge. Suffering is not the natural order, it is an unsolved problem. That single idea, taken seriously, changes what a life is for.',
  },
  {
    n: '02',
    title: 'Progress is a choice, not a guarantee.',
    body: 'Extreme poverty has more than halved since 1990. Child mortality is down sixty percent. None of that was inevitable. It happened because specific people decided specific problems were worth solving, and then solved them. The receipts are real, and the work is unfinished.',
  },
  {
    n: '03',
    title: 'Technology and capitalism are the engines.',
    body: 'Technology is how knowledge becomes a solution. Markets are how a solution finds everyone who needs it, and how the people who build it can keep building. This is techno-optimism with a ledger: not faith that things will work out, but the practice of making them work out, and pricing it honestly.',
  },
  {
    n: '04',
    title: 'Rank the work honestly.',
    body: 'Not every problem is equal. Importance is roughly how many people are affected times how badly, and whether there is a real market that can pay for a fair solution. Urgency is whether it is getting better or worse. We rank with sourced numbers and visible confidence, and every ranking is a conjecture open to refutation.',
  },
  {
    n: '05',
    title: 'Coordinate like one tribe.',
    body: 'Humanity already has everything it needs to solve its hardest problems: talent, capital, attention, time, expertise. What it lacks is legibility. Founders cannot see which problem to pick. Investors cannot see the whole field. This site is the coordination layer: a map that routes the right people and the right money to the right problems.',
  },
  {
    n: '06',
    title: 'Build the next million builders.',
    body: 'The goal is not one more index to read. It is to help a million people find a problem worth their life and go solve it. If you are looking for what to do with the rest of yours, this is an invitation.',
  },
]

export default function ManifestoPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-12 border-b border-hair">
          <div className="max-w-3xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-5">
              The manifesto
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-6">
              Every problem is a door.
              <span className="block text-amber-300">Open one.</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-300 leading-relaxed">
              optimism.fun is a map of what is worth doing with a human life: humanity&rsquo;s
              hardest problems, ranked by how many they hurt and how badly, with the people,
              capital, and companies already storming each one. This is the thinking behind it.
            </p>
          </div>
        </section>

        {/* Tenets */}
        <section className="px-6 py-4">
          <div className="max-w-3xl mx-auto divide-y divide-hair">
            {tenets.map((t) => (
              <div key={t.n} className="py-10 grid md:grid-cols-[3rem_1fr] gap-x-6 gap-y-3">
                <span className="font-mono text-sm tabular-nums text-amber-300">{t.n}</span>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-3">
                    {t.title}
                  </h2>
                  <p className="text-ink-300 leading-relaxed text-base md:text-lg">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The closing line */}
        <section className="border-y border-hair surface-paper">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <p className="font-serif text-2xl md:text-4xl text-ink-100 leading-snug">
              All problems are explainable.
              <span className="block text-amber-300">All solutions are creatable.</span>
            </p>
            <p className="font-mono text-[11px] text-ink-500 mt-4">
              David Deutsch, via Karl Popper, operationalized with data.
            </p>
          </div>
        </section>

        {/* CTAs: talent + investors */}
        <section className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-6 text-center">
              Three ways in
            </p>
            <div className="grid md:grid-cols-3 gap-px bg-ink-700/50 border border-hair">
              <Link
                href="/"
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-7"
              >
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
                  If you build
                </p>
                <h3 className="font-serif text-xl text-ink-100 mb-2 group-hover:text-amber-300 transition-colors">
                  Find your problem &rarr;
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">
                  Browse {problems.length} ranked problems and the concrete companies someone
                  should build for each.
                </p>
              </Link>
              <Link
                href="/ecosystem"
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-7"
              >
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green mb-2">
                  If you fund
                </p>
                <h3 className="font-serif text-xl text-ink-100 mb-2 group-hover:text-amber-300 transition-colors">
                  See the field &rarr;
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">
                  The capital already deployed against each problem, and the gaps where it is
                  not. Find the underfunded quests.
                </p>
              </Link>
              <Link
                href="/rfs"
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-7"
              >
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-violet mb-2">
                  If you are deciding
                </p>
                <h3 className="font-serif text-xl text-ink-100 mb-2 group-hover:text-amber-300 transition-colors">
                  Read the requests &rarr;
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">
                  Humanity&rsquo;s requests for startups: concrete, buildable, held to the
                  Choose Good Quests test.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
