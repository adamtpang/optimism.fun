import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProblemTable from '@/components/ProblemTable'
import RadarClient from '@/components/RadarClient'
import DataFreshness from '@/components/DataFreshness'
import GlobeView from '@/components/GlobeView'
import EmailCapture from '@/components/EmailCapture'
import { computeRadarRows } from '@/lib/radar'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { publicCompanies } from '@/data/public-companies'
import { ecosystem } from '@/data/ecosystem'
import { voices } from '@/data/voices'
import { founders } from '@/data/founders'
import { sectors } from '@/data/sectors'

export default function Home() {
  const solutionCount = companies.length + publicCompanies.length
  const radarRows = computeRadarRows()

  return (
    <>
      <Navbar />
      <main>
        {/* GLOBE HERO — capitalism on a globe, the landing's first impression. */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 pt-28 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-300 text-[10px]">◆</span>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-400">
                humanity&rsquo;s requests for startups &middot; v0.1
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.02] text-ink-100 mb-4 max-w-3xl">
              Infinite problems.{' '}
              <span className="text-amber-300">Infinite solutions.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              A live map of capitalism — every company, founder, and economy — pointed at{' '}
              {problems.length} ranked problems worth your life. Spin the globe, then start
              your quest.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                href="/journey"
                className="font-mono text-[11px] uppercase tracking-wider text-paper bg-amber-300 hover:bg-amber-200 px-4 py-2.5 rounded transition-colors"
              >
                Start the quest &rarr;
              </Link>
              <Link
                href="#problems"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-300 border border-hair hover:border-amber-300 px-4 py-2.5 rounded transition-colors"
              >
                See the ranking &rarr;
              </Link>
            </div>
            <DataFreshness className="mt-5" />
          </div>
          {/* full-bleed globe — companies + founders by default; toggle layers below it */}
          <GlobeView
            className="relative w-full h-[62vh] min-h-[420px]"
            initialLayers={['companies', 'founders']}
          />
        </section>

        {/* THE RADAR — opportunity-ranked: where demand is high and supply is low */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
                The radar
              </p>
              <h2 className="font-serif text-2xl md:text-4xl text-ink-100 leading-tight">
                Where demand is high, and supply is low.
              </h2>
              <p className="mt-2 text-ink-400 max-w-2xl text-sm leading-relaxed">
                Every problem ranked by opportunity: how badly the world needs a solution,
                divided by how well-served it already is. The biggest gaps are step zero.
              </p>
            </div>
            <RadarClient rows={radarRows} />
          </div>
        </section>

        {/* The leaderboard — the detailed, multi-metric sortable index. */}
        <section
          id="problems"
          className="px-6 pt-10 pb-14 max-w-7xl mx-auto scroll-mt-24"
        >
          <ProblemTable problems={problems} />

          {/* Sector chip strip — pick a cluster instead of scanning the table */}
          <div className="mt-8 border-t border-hair pt-6">
            <div className="flex items-baseline justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                or browse by sector
              </p>
              <Link
                href="/sector"
                className="font-mono text-[11px] text-ink-500 hover:text-amber-300 transition-colors"
              >
                all sectors &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sectors.map((s) => (
                <Link
                  key={s.slug}
                  href={`/sector/${s.slug}`}
                  className="border border-hair hover:border-amber-300/60 px-3 py-1.5 font-mono text-[11px] text-ink-300 hover:text-amber-300 transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
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

        {/* 06 — Already happening. The market is already pricing problem-solving. */}
        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-4">
              06 &middot; already happening
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-ink-100 leading-[1.05] mb-6">
              The market has already started{' '}
              <span className="text-amber-300">pricing the solutions.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <p className="font-serif text-lg text-ink-300 leading-relaxed">
                The world&rsquo;s largest companies are already worth more than{' '}
                <Link
                  href="/companies"
                  className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                >
                  $100T combined
                </Link>{' '}
                — and most of that valuation traces back to a single quest: someone picked a
                hard problem and shipped a solution at scale. The leaderboard above ranks
                where the next dollar should go.
              </p>
              <p className="font-serif text-lg text-ink-300 leading-relaxed">
                GDP growth has no physical ceiling — only a willingness ceiling. As long as
                we keep picking good problems and solving them, the curve compounds. Some
                quests are{' '}
                <span className="text-amber-300">power-law</span>: aligned AI, cheap fusion,
                disease eradication. Hit one and the whole table shifts up.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/companies"
                className="font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-4 py-2 hover:bg-amber-300/[0.08] transition-colors"
              >
                Who&rsquo;s building &rarr;
              </Link>
              <Link
                href="/ecosystem"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-300 border border-hair px-4 py-2 hover:border-ink-400 hover:text-ink-100 transition-colors"
              >
                Who&rsquo;s funding &rarr;
              </Link>
              <a
                href="https://foundersfund.com/2023/06/choose-good-quests/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-300 border border-hair px-4 py-2 hover:border-ink-400 hover:text-ink-100 transition-colors"
              >
                Founders Fund · choose good quests &rarr;
              </a>
              <a
                href="https://patrickcollison.com/progress"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-300 border border-hair px-4 py-2 hover:border-ink-400 hover:text-ink-100 transition-colors"
              >
                Collison &middot; progress &rarr;
              </a>
              <a
                href="https://www.ycombinator.com/rfs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-300 border border-hair px-4 py-2 hover:border-ink-400 hover:text-ink-100 transition-colors"
              >
                Y Combinator &middot; RFS &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* Join */}
        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
