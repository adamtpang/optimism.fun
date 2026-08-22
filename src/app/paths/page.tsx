import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { joinPaths, trillionShapedTargets, type Ceiling } from '@/data/join-paths'
import { starterPacks } from '@/data/starter-packs'
import { requestsForStartups } from '@/data/rfs'
import { inLimitCaps } from '@/data/in-limit'
import { getSourcedCrowding } from '@/data/quest-crowding'
import { getProblemBySlug } from '@/data/problems'
import { formatUSD } from '@/lib/format'

export const metadata = {
  title: 'Start or join | optimism.fun',
  description:
    'Two ways onto an S-tier mission. Crowding decides which: an open quest is one to found, a crowded one is a company to join. Both paths, per trillion-dollar problem.',
}

const TRILLION = 1_000_000_000_000

/** Problems whose in-limit ceiling clears $1T, biggest first. */
const bigProblems = inLimitCaps
  .filter((c) => c.marketCap.value >= TRILLION)
  .sort((a, b) => b.marketCap.value - a.marketCap.value)

const CEILING_LABEL: Record<Ceiling, { text: string; cls: string }> = {
  'trillion-shaped': {
    text: 'trillion-shaped',
    cls: 'text-terminal-green border-terminal-green/40 bg-terminal-green/[0.07]',
  },
  large: { text: 'large, not $1T', cls: 'text-amber-300 border-amber-300/40 bg-amber-300/[0.07]' },
  component: { text: 'component economics', cls: 'text-ink-400 border-hair bg-ink-800/40' },
}

const trillionShaped = trillionShapedTargets()

export default function PathsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · start or join"
          title="Start it, or join it."
          lede="Every quest on this board has quietly assumed you would found the company. That is only ever half the answer. The deciding variable is already in the data: crowding. A quest with no funded competitor is one to start. A quest with eight is a company to join, and joining is not the consolation prize, it is the correct move on the biggest problems."
          rightStats={[
            { label: '$1T+ problems', value: bigProblems.length, tone: 'amber' },
            { label: 'join paths', value: joinPaths.length, tone: 'violet' },
            { label: 'trillion-shaped targets', value: trillionShaped.length, tone: 'green' },
          ]}
        />

        {/* The routing rule */}
        <section className="px-6 pt-10 max-w-7xl mx-auto">
          <div className="border border-hair p-7 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green mb-4">
              The routing rule
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <p className="font-mono text-[11px] text-terminal-green mb-1.5">N = 0–1 · open</p>
                <p className="text-ink-100 text-sm font-medium mb-1.5">Start it</p>
                <p className="text-ink-400 text-[13px] leading-relaxed">
                  Nobody funded is racing you. The starter pack has the name ideas, the riskiest
                  assumption, and the first artifact.
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] text-amber-300 mb-1.5">N = 2–4 · contested</p>
                <p className="text-ink-100 text-sm font-medium mb-1.5">Check who the competition is</p>
                <p className="text-ink-400 text-[13px] leading-relaxed">
                  Four nonprofits is not four companies. If every competitor is academic,
                  philanthropic, or governmental, the commercial lane is still empty.
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] text-terminal-violet mb-1.5">N = 5+ · crowded</p>
                <p className="text-ink-100 text-sm font-medium mb-1.5">Join one of them</p>
                <p className="text-ink-400 text-[13px] leading-relaxed">
                  The thesis is proven and capitalised. Becoming the ninth entrant is worse than
                  owning equity in one of the eight.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Per-problem paths */}
        {bigProblems.map((cap) => {
          const problem = getProblemBySlug(cap.problemSlug)
          const join = joinPaths.find((j) => j.problemSlug === cap.problemSlug)
          const quests = requestsForStartups.filter((q) => q.problemSlug === cap.problemSlug)

          return (
            <section key={cap.problemSlug} className="px-6 pt-12 max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between gap-4 flex-wrap border-b border-hair-strong pb-3 mb-6">
                <h2 className="font-serif text-2xl md:text-3xl text-ink-100">
                  {problem?.name ?? cap.problemSlug}
                </h2>
                <p className="font-mono text-xs text-ink-400">
                  in-limit ceiling{' '}
                  <span className="text-amber-300 tabular-nums">{formatUSD(cap.marketCap.value)}</span>
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* START column */}
                <div className="border border-hair">
                  <div className="border-b border-hair px-5 py-3 bg-ink-800/30">
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green">
                      Start · found it yourself
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    {quests.map((q) => {
                      const cw = getSourcedCrowding(q.slug)
                      const pack = starterPacks.find((p) => p.questSlug === q.slug)
                      const startable = !cw || cw.competitorCount <= 4
                      return (
                        <div key={q.slug} className="border-b border-hair last:border-b-0 pb-4 last:pb-0">
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <p className="text-ink-100 text-sm font-medium leading-snug">{q.title}</p>
                            <span
                              className={`font-mono text-[10px] whitespace-nowrap px-1.5 py-0.5 border ${
                                !cw
                                  ? 'text-ink-500 border-hair'
                                  : cw.competitorCount <= 1
                                    ? 'text-terminal-green border-terminal-green/40'
                                    : cw.competitorCount <= 4
                                      ? 'text-amber-300 border-amber-300/40'
                                      : 'text-terminal-violet border-terminal-violet/40'
                              }`}
                            >
                              {cw ? `N=${cw.competitorCount}` : 'unsourced'}
                            </span>
                          </div>
                          {startable ? (
                            pack ? (
                              <p className="text-ink-400 text-[13px] leading-relaxed">
                                <span className="text-terminal-green">Starter pack ready.</span>{' '}
                                Riskiest assumption: {pack.riskiestAssumption}
                              </p>
                            ) : (
                              <p className="text-ink-500 text-[13px]">
                                Startable, no starter pack written yet.
                              </p>
                            )
                          ) : (
                            <p className="text-ink-500 text-[13px] leading-relaxed">
                              Too crowded to found. See the join column.
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* JOIN column */}
                <div className="border border-hair">
                  <div className="border-b border-hair px-5 py-3 bg-ink-800/30">
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-violet">
                      Join · get in at one of them
                    </p>
                  </div>
                  <div className="p-5">
                    {join ? (
                      <>
                        <p className="text-ink-400 text-[13px] leading-relaxed mb-4 pb-4 border-b border-hair">
                          {join.whyJoinNotStart}
                        </p>
                        <div className="space-y-4">
                          {join.targets.map((t) => {
                            const badge = CEILING_LABEL[t.ceiling]
                            return (
                              <div key={t.company} className="border-b border-hair last:border-b-0 pb-4 last:pb-0">
                                <div className="flex items-start justify-between gap-3 mb-1">
                                  <a
                                    href={t.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-ink-100 text-sm font-medium hover:text-terminal-violet transition-colors"
                                  >
                                    {t.company}
                                  </a>
                                  <span
                                    className={`font-mono text-[9.5px] whitespace-nowrap px-1.5 py-0.5 border ${badge.cls}`}
                                  >
                                    {badge.text}
                                  </span>
                                </div>
                                <p className="font-mono text-[11px] text-ink-500 mb-2">{t.stage}</p>
                                <p className="text-ink-400 text-[13px] leading-relaxed mb-2">
                                  {t.whyThisOne}
                                </p>
                                <p className="text-ink-300 text-[13px] leading-relaxed">
                                  <span className="text-terminal-cyan font-mono text-[10px] uppercase tracking-wide">
                                    software way in ·{' '}
                                  </span>
                                  {t.softwareBridge}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                        <div className="mt-5 pt-4 border-t border-hair space-y-3">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                              Build this to get a reply
                            </p>
                            <p className="text-ink-300 text-[13px] leading-relaxed">
                              {join.provingArtifact}
                            </p>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                              How to approach
                            </p>
                            <p className="text-ink-300 text-[13px] leading-relaxed">{join.outreachAngle}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-ink-500 text-[13px]">No join path written for this problem yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )
        })}

        <section className="px-6 pt-12 pb-4 max-w-7xl mx-auto">
          <p className="font-mono text-[11px] text-ink-500 leading-relaxed">
            <span className="text-ink-600">note:</span> every valuation above is real, dated, and
            sourced. The &ldquo;software way in&rdquo; names a role category each company demonstrably
            needs given what it publicly builds, not a claim that a specific opening exists today.
            Check live roles at each company&rsquo;s own careers page. Crowding counts come from{' '}
            <span className="text-ink-400">src/data/quest-crowding.ts</span> and are re-sourced
            periodically; the datacenter-power-smoothing count was corrected from N=0 to N=5 on
            2026-08-22 after an adversarial re-search.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
