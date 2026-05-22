import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProblemTable from '@/components/ProblemTable'
import EmailCapture from '@/components/EmailCapture'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { publicCompanies } from '@/data/public-companies'
import { ecosystem } from '@/data/ecosystem'
import { voices } from '@/data/voices'
import { founders } from '@/data/founders'

export default function Home() {
  const solutionCount = companies.length + publicCompanies.length

  return (
    <>
      <Navbar />
      <main>
        {/* Hero — minimal. Title, one line, and a pointer to the table. */}
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-300 text-[10px]">◆</span>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-400">
                humanity&rsquo;s requests for startups &middot; v0.1
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.02] text-ink-100 mb-4">
              Infinite problems.{' '}
              <span className="text-amber-300">Infinite solutions.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              {problems.length} priority problems, ranked. Every number sourced. Pick one
              worth your life.
            </p>
          </div>
        </section>

        {/* The leaderboard — front and center. */}
        <section
          id="problems"
          className="px-6 pt-10 pb-14 max-w-7xl mx-auto scroll-mt-24"
        >
          <ProblemTable problems={problems} />
        </section>

        {/* The pipeline: explanations → solutions → coordination (talent + capital). */}
        <section className="border-y border-hair">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-8 mb-6">
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                The pipeline.
              </h2>
              <p className="text-ink-400 leading-relaxed max-w-2xl text-sm">
                Each problem above has thinkers explaining it, companies attacking it, and
                a coordination layer of talent and capital pointed at it. Every node sourced.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-ink-700/50 border border-hair">
              <Link
                href="/voices"
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-mono text-[11px] tabular-nums text-amber-300">
                    02
                  </span>
                  <span className="font-mono tabular-nums text-2xl text-terminal-violet">
                    {voices.length}
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  the explanations
                </p>
                <h3 className="font-serif text-xl text-ink-100 group-hover:text-amber-300 transition-colors">
                  Why each one matters.
                </h3>
              </Link>

              <Link
                href="/companies"
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-mono text-[11px] tabular-nums text-amber-300">
                    03
                  </span>
                  <span className="font-mono tabular-nums text-2xl text-terminal-cyan">
                    {solutionCount}
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  the solutions
                </p>
                <h3 className="font-serif text-xl text-ink-100 group-hover:text-amber-300 transition-colors">
                  What gets built.
                </h3>
              </Link>
            </div>

            {/* Coordination row — talent + capital paired under one header */}
            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                04 &middot; coordination
              </p>
              <div className="grid md:grid-cols-2 gap-px bg-ink-700/50 border border-hair">
                <Link
                  href="/founders"
                  className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                      talent
                    </span>
                    <span className="font-mono tabular-nums text-2xl text-amber-300">
                      {founders.length}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-ink-100 group-hover:text-amber-300 transition-colors">
                    Who builds it.
                  </h3>
                </Link>

                <Link
                  href="/ecosystem"
                  className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                      capital
                    </span>
                    <span className="font-mono tabular-nums text-2xl text-terminal-green">
                      {ecosystem.length}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-ink-100 group-hover:text-amber-300 transition-colors">
                    Who funds it.
                  </h3>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The white mirror — every problem above, solved, for all that have it. */}
        <section className="border-b border-hair surface-paper">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-paper-copper mb-4">
              05 &middot; the white mirror
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-ink-100 leading-[1.05] mb-6">
              Every problem above,{' '}
              <span className="text-amber-300">solved for all that have it.</span>
            </h2>
            <p className="font-serif text-lg text-ink-200 leading-relaxed mb-8 max-w-3xl">
              Extreme poverty cut by more than half since 1990. Child mortality down ~60%.
              Literacy near-universal. Life expectancy up two decades. This is the world on
              the other side of the table — and the receipts are getting longer.
            </p>
            <Link
              href="/progress"
              className="font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-4 py-2 hover:bg-amber-300/[0.08] transition-colors inline-block"
            >
              See the receipts &rarr;
            </Link>
          </div>
        </section>

        {/* Join */}
        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
