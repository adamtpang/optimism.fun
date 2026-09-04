import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProblemTable from '@/components/ProblemTable'
import RadarClient from '@/components/RadarClient'
import DataFreshness from '@/components/DataFreshness'
import GlobeView from '@/components/GlobeView'
import EmailCapture from '@/components/EmailCapture'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { publicCompanies } from '@/data/public-companies'
import { ecosystem } from '@/data/ecosystem'
import { voices } from '@/data/voices'
import { founders } from '@/data/founders'
import { sectors } from '@/data/sectors'
import { existentialRisks } from '@/data/existential-risks'
import HomeRouter from '@/components/HomeRouter'
import { cachedUnderCoordinated } from '@/lib/coordination'
import { cachedListRecentPublic } from '@/lib/commitments-cache'
import { isDbConfigured } from '@/lib/db'

// Canonical is scoped to the homepage here (not on the root layout), so it
// doesn't cascade as an inherited default onto every other route: Next.js
// metadata inheritance would otherwise make every page point back at "/".
export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

/**
 * The homepage reads the live board, which would otherwise make the site's
 * highest-traffic page server-render on every request. A five-item ticker does
 * not need per-request freshness, so it revalidates on a 5 minute window: the
 * page stays effectively static and the board is still visibly live.
 * Approving a commitment calls revalidatePath('/') anyway, so a new row shows
 * up immediately rather than waiting out the window.
 */
export const revalidate = 300

export default async function Home() {
  const solutionCount = companies.length + publicCompanies.length

  // The coordination layer. Both degrade to empty without a database, so the
  // homepage still renders in full on a deployment that has no board.
  const boardAvailable = isDbConfigured()
  const [underCoordinated, recent] = await Promise.all([
    cachedUnderCoordinated(3),
    cachedListRecentPublic(5),
  ])

  return (
    <>
      <Navbar />
      <main>
        {/* GLOBE HERO — capitalism on a globe, the landing's first impression. */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 pt-28 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-300 text-[10px]">◆</span>
              <div className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-400">
                humanity&rsquo;s requests for startups &middot; v0.1
              </div>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.02] text-ink-100 mb-4 max-w-3xl">
              Find the problems humanity{' '}
              <span className="text-terminal-rose">cannot afford to lose.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              A live map for people with a moral mission — every company, founder, and economy
              pointed at {problems.length} ranked problems worth your life. Find the good quest
              you are unusually positioned to carry, then start building.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                href="/s-tier"
                className="font-mono text-[11px] uppercase tracking-wider text-paper bg-amber-300 hover:bg-amber-200 px-4 py-2.5 rounded transition-colors"
              >
                Find your good quest &rarr;
              </Link>
              <Link
                href="/rankings"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-300 border border-hair hover:border-amber-300 px-4 py-2.5 rounded transition-colors"
              >
                Browse every quest &rarr;
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

        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid md:grid-cols-[14rem_1fr] gap-5 md:gap-10 mb-7">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-rose">
                S-tier first
              </p>
              <div>
                <h2 className="font-serif text-2xl md:text-4xl text-ink-100 leading-tight">
                  Four ways humanity could lose the future.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-400 max-w-2xl">
                  S-tier is a consequence class, not a percentile. No fake probabilities, no
                  inflation of merely large problems, and no threat without a buildable defense.
                </p>
              </div>
            </div>
            <div className="border-t border-hair">
              {existentialRisks.map((risk) => (
                <Link
                  key={risk.slug}
                  href={`/s-tier#${risk.slug}`}
                  className="group grid sm:grid-cols-[3rem_13rem_minmax(0,1fr)_auto] gap-3 sm:gap-5 items-start py-4 border-b border-hair hover:bg-ink-800/30 transition-colors"
                >
                  <span className="font-mono text-[11px] text-terminal-rose">S{risk.rank}</span>
                  <span className="font-serif text-lg text-ink-100 group-hover:text-terminal-rose transition-colors">{risk.shortName}</span>
                  <span className="text-sm leading-relaxed text-ink-500 line-clamp-2">{risk.mechanism}</span>
                  <span className="font-mono text-[11px] text-ink-600 group-hover:text-ink-100">open &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* THE RADAR — opportunity-ranked: where demand is high and supply is low */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-6">
              <div className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
                The radar
              </div>
              <h2 className="font-serif text-2xl md:text-4xl text-ink-100 leading-tight">
                Where demand is high, and supply is low.
              </h2>
              <p className="mt-2 text-ink-400 max-w-2xl text-sm leading-relaxed">
                Every problem ranked by opportunity: how badly the world needs a solution,
                divided by how well-served it already is. The biggest gaps are step zero.
              </p>
            </div>
            <RadarClient />
          </div>
        </section>

        {/* The router — three doors and the live board, above the table. The
            leaderboard is the map; this is where a visitor can actually act. */}
        <HomeRouter
          underCoordinated={underCoordinated}
          recent={recent}
          boardAvailable={boardAvailable}
        />

        {/* The leaderboard — the detailed, multi-metric sortable index. */}
        <section
          id="problems"
          className="px-6 pt-10 pb-14 max-w-7xl mx-auto scroll-mt-24"
        >
          <ProblemTable />

          {/* Sector chip strip — pick a cluster instead of scanning the table */}
          <div className="mt-8 border-t border-hair pt-6">
            <div className="flex items-baseline justify-between mb-4">
              <div className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                or browse by sector
              </div>
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
                On optimism.fun, each ranked problem has thinkers explaining it, companies
                attacking it, and a coordination layer of talent and capital pointed at it.
                Every node is sourced.
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
                <div className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  the explanations
                </div>
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
                <div className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  the solutions
                </div>
                <h3 className="font-serif text-xl text-ink-100 group-hover:text-amber-300 transition-colors">
                  What gets built.
                </h3>
              </Link>
            </div>

            {/* Coordination row — talent + capital paired under one header */}
            <div className="mt-6">
              <div className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                04 &middot; coordination
              </div>
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
            <div className="font-mono text-[10px] uppercase tracking-ultra-wide text-paper-copper mb-4">
              05 &middot; the white mirror
            </div>
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
            <div className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-4">
              06 &middot; already happening
            </div>
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
