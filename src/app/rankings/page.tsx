import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import QuestRankings from '@/components/QuestRankings'
import DataFreshness from '@/components/DataFreshness'
import { computeQuestRankings, groupByTier } from '@/lib/rankings'

export const metadata: Metadata = {
  title: 'The Power Rankings | optimism.fun',
  description:
    "The highest-demand startups that aren't being built yet, ranked. A power ranking of good quests — specific, buildable companies scored by the demand-supply gap: how badly the world needs it, divided by how well-served it already is.",
}

export default function RankingsPage() {
  const ranked = computeQuestRankings()
  const bands = groupByTier(ranked)
  const top = ranked[0]
  const sTier = ranked.filter((q) => q.tier === 'S').length

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-6xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The power rankings · the meta
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              The startups that should exist,
              <span className="block text-amber-300">ranked.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              A power ranking of good quests — specific, buildable companies, scored by the
              demand-supply gap. Not the biggest demand (supply already chases that), but the
              widest <span className="text-ink-200">residual</span>: how badly the world needs
              a thing, divided by how well-served it already is, gated by whether it&apos;s a
              real, buildable frontier. The head of this board is where the next great company
              is hiding.
            </p>
            {top && (
              <p className="mt-4 font-mono text-[11px] text-ink-500">
                <span className="text-amber-300">#1</span> {top.title} · {sTier} in S-tier ·{' '}
                {ranked.length} quests ranked
              </p>
            )}
            <DataFreshness className="mt-5" />
          </div>
        </section>

        <section className="px-6 py-10 max-w-6xl mx-auto">
          <QuestRankings bands={bands} />
        </section>

        {/* methodology */}
        <section className="border-y border-hair bg-ink-900/30">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              How the ranking works
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-[11px] leading-relaxed text-ink-400">
              <div>
                <p className="text-ink-100 mb-1">1 · Opportunity, not demand</p>
                Score spine = demand × (1 − supply) × urgency. Raw demand is anti-ranked on
                purpose — the biggest demand is the most contested.
              </div>
              <div>
                <p className="text-ink-100 mb-1">2 · Triangulated demand</p>
                The demand term is the composite from the{' '}
                <Link href="/demand" className="text-amber-300 hover:underline">
                  demand map
                </Link>{' '}
                — burden, willingness-to-pay, capital, research, queues — never one signal.
              </div>
              <div>
                <p className="text-ink-100 mb-1">3 · Ready-to-build gate</p>
                Each quest is discounted by confidence: a real why-now frontier outranks a
                someday-maybe, even at equal demand.
              </div>
              <div>
                <p className="text-ink-100 mb-1">4 · Tiers</p>
                S = build this now, down to C = on the radar. The{' '}
                <span className="text-amber-300">$ figure</span> is the prize at the limit if a
                team executes perfectly.
              </div>
            </div>
            <p className="mt-5 font-mono text-[10px] text-ink-600 max-w-3xl leading-relaxed">
              Conjectures, open to refutation — each quest&apos;s good-quest line is the
              falsifiable claim. Coming next: the demand term goes fully live per-quest (not
              per-problem) as Exa sources demand data at the sub-problem altitude, and a
              &ldquo;why-now&rdquo; frontier axis (research + cost-curve acceleration) replaces
              confidence as the readiness gate.
            </p>
          </div>
        </section>

        {/* step one */}
        <section className="border-b border-hair">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-2">
              Found your quest? Now match yourself to it.
            </h2>
            <p className="text-ink-400 max-w-2xl text-sm leading-relaxed mb-5">
              A ranking is step zero. The company gets built when the right founder meets the
              right gap — then puts themselves in the middle of the match.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/demand"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                See the demand behind it → the Demand Map
              </Link>
              <Link
                href="/fit"
                className="px-4 py-2 border border-amber-300/40 text-amber-300 font-mono text-[12px] hover:bg-amber-300/[0.06] transition-colors"
              >
                Match yourself → Your Fit
              </Link>
              <Link
                href="/rfs"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                The full brief → Requests
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
