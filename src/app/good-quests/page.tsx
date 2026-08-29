import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import PageHeader from '@/components/PageHeader'
import HeroFigure from '@/components/HeroFigure'
import QuestGrid from '@/components/QuestGrid'
import { getProgressBySlug } from '@/data/progress'
import { ARCHETYPES } from '@/data/archetypes'
import { computeQuestRankings } from '@/lib/rankings'
import { placeOnQuestGrid } from '@/lib/quest-grid'

export const metadata: Metadata = {
  title: 'Choose a good quest | optimism.fun',
  description:
    'A gamified walkthrough of Trae Stephens & Markie Wagner’s "Choose Good Quests" — plotted with every real quest this site tracks. You are not too late for humanity’s story. You are absurdly early.',
}

export default function GoodQuestsPage() {
  const kardashev = getProgressBySlug('kardashev-scale')
  const ranked = computeQuestRankings()
  const plotted = placeOnQuestGrid(ranked)
  const hardGoodCount = plotted.filter((q) => q.good >= 50 && q.hard >= 50).length
  const missionary = ARCHETYPES.missionary
  const evangelist = ARCHETYPES.evangelist

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="A gamified walkthrough · Choose Good Quests"
          title="You are not too late. You are absurdly early."
          lede="Homo sapiens has existed for roughly 300,000 years. Writing is 5,000 years old. Every technology you've ever used is younger than your grandparents. Humanity is not in its late chapters — it is in its opening pages, and the pages left to write are the ones you're standing in front of right now."
          rightStats={
            kardashev
              ? [
                  {
                    label: 'humanity, Kardashev scale',
                    value: `Type ${kardashev.latest.value.toFixed(2)}`,
                    tone: 'amber',
                  },
                  { label: 'hard + good quests, live', value: hardGoodCount, tone: 'cyan' },
                ]
              : undefined
          }
        />

        {/* you are here */}
        <section className="border-b border-hair bg-ink-900/30">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="grid md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] gap-8 items-start">
              {kardashev && (
                <HeroFigure
                  value={`${(kardashev.latest.value * 100).toFixed(0)}%`}
                  label="of one planet's energy, harnessed"
                  caption="Type I on the Kardashev scale is full use of everything Earth receives from the sun. We are not there yet. Type III is a civilization running on the energy of an entire galaxy."
                />
              )}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                  This is what &ldquo;the beginning of infinity&rdquo; actually means.
                </h2>
                <p className="text-ink-300 text-sm leading-relaxed max-w-2xl">
                  Not a slogan — a fact about knowledge. Every problem that is not forbidden by
                  the laws of physics is solvable, given the right knowledge, and the stock of
                  knowledge has no ceiling anyone has ever found. The species that couldn&rsquo;t
                  cross an ocean 500 years ago now argues about who gets to live on Mars. There is
                  no evidence the curve stops here, only evidence that someone has to keep
                  pushing it.
                </p>
                <p className="font-mono text-[10px] text-ink-600 leading-relaxed max-w-2xl">
                  Full deep-history timeline and the live numbers behind this on{' '}
                  <Link href="/ages" className="text-amber-300 hover:underline">
                    /ages
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* the real test */}
        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The test, borrowed straight
            </p>
            <h2 className="font-serif text-2xl md:text-4xl text-ink-100 leading-tight mb-5">
              Every pursuit you could spend a life on sits somewhere on one grid.
            </h2>
            <p className="text-ink-300 leading-relaxed max-w-2xl mb-3">
              Founders Fund partner{' '}
              <a
                href="https://traestephens.substack.com/p/choose-good-quests"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
              >
                Trae Stephens, with Markie Wagner
              </a>
              , put it plainly: &ldquo;a good quest makes the future better than our world
              today, while a bad quest doesn&rsquo;t improve the world much at all, or even
              makes it worse.&rdquo; Cross that against how hard the quest is, and you get four
              boxes.
            </p>
            <p className="text-ink-300 leading-relaxed max-w-2xl mb-8">
              Their claim isn&rsquo;t subtle: &ldquo;there is a moral imperative for our best
              players to choose good, hard quests.&rdquo; If you have the rare combination of
              skill, resources, and time to take on something hard, and you spend it on
              something easy instead — good or not — that is, in their words, &ldquo;a loss for
              humanity.&rdquo;
            </p>

            <div className="grid sm:grid-cols-2 gap-px bg-ink-700/50 border border-hair mb-3">
              <div className="bg-ink-900 p-5 sm:border-r border-b sm:border-b-0 border-hair">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-600 mb-2">
                  Hard + bad
                </p>
                <p className="text-ink-500 text-[13px] leading-relaxed">
                  Real suffering for no real gain — a war of attrition, a career spent
                  protecting a shrinking moat. The essay gives this box no examples. It doesn&rsquo;t
                  need any; nobody aspires here on purpose.
                </p>
              </div>
              <div className="bg-ink-900 p-5 relative">
                <span className="absolute top-3 right-3 font-mono text-[9px] uppercase text-amber-300">
                  the target
                </span>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
                  Hard + good
                </p>
                <p className="text-ink-300 text-[13px] leading-relaxed">
                  Reversing aging. Going to Mars. Curing cancer. Building AGI. A supersonic
                  plane. &ldquo;Significantly more consequential than easy, good quests&rdquo; —
                  their words. This is the box the whole site is built to point you toward.
                </p>
              </div>
              <div className="bg-ink-900 p-5 sm:border-r border-hair">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-600 mb-2">
                  Easy + bad
                </p>
                <p className="text-ink-500 text-[13px] leading-relaxed">
                  Where most people optimizing for &ldquo;easy&rdquo; land without meaning to.
                  The essay&rsquo;s own examples: luxury credit cards, task-management apps.
                  Comfortable, and it changes nothing.
                </p>
              </div>
              <div className="bg-ink-900 p-5">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  Easy + good
                </p>
                <p className="text-ink-400 text-[13px] leading-relaxed">
                  Top marks in school, a modest fitness goal — fine, even admirable, and real.
                  Just not the ceiling of what you could do with one life.
                </p>
              </div>
            </div>
            <p className="font-mono text-[10px] text-ink-600 leading-relaxed">
              Quotes from the original essay, reproduced here as written. Read it in full at the
              link above — it&rsquo;s short.
            </p>
          </div>
        </section>

        {/* the live grid */}
        <section className="border-b border-hair bg-ink-900/30">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              Not hypothetical — plotted with this site&rsquo;s own live data
            </p>
            <h2 className="font-serif text-2xl md:text-4xl text-ink-100 leading-tight mb-5">
              Here are {plotted.length} real quests, on the real grid.
            </h2>
            <p className="text-ink-400 text-sm leading-relaxed max-w-2xl mb-8">
              The x-axis is <span className="text-ink-200">opportunity</span> — demand crossed
              with how open the gap still is, computed live on{' '}
              <Link href="/rankings" className="text-amber-300 hover:underline">
                /rankings
              </Link>
              . The y-axis is <span className="text-ink-200">how much frontier is left</span> —
              a low-confidence quest has no playbook yet; that&rsquo;s what makes it hard. Every
              quest here already cleared &ldquo;good&rdquo; before it was ranked at all — this
              site only tracks unambiguously good problems (see{' '}
              <Link href="/methodology" className="text-amber-300 hover:underline">
                /methodology
              </Link>
              ) — so the left half of the grid is real, just empty by construction. Click a
              point.
            </p>
            <QuestGrid quests={plotted} />
          </div>
        </section>

        {/* the people hard quests need */}
        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              A good quest needs believers
            </p>
            <h2 className="font-serif text-2xl md:text-4xl text-ink-100 leading-tight mb-5 max-w-3xl">
              The hard part is not only technical. It is moral endurance.
            </h2>
            <p className="text-ink-300 leading-relaxed max-w-2xl mb-8">
              The quests that change the world are often too early, too difficult, or too
              unfashionable to justify themselves on a quarterly timeline. They need people who
              would still do the work when the prestige, consensus, and easy money disappear.
              That is not branding. It is the operating advantage of a genuine mission.
            </p>
            <div className="grid md:grid-cols-2 gap-px border border-hair bg-ink-700/50">
              <article className="bg-ink-900 p-6">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
                  {missionary.name}
                </p>
                <h3 className="font-serif text-xl text-ink-100 mb-2">Carry the cause.</h3>
                <p className="text-sm text-ink-400 leading-relaxed mb-4">{missionary.essence}</p>
                <p className="text-sm text-ink-300 leading-relaxed">
                  {missionary.edge}
                </p>
              </article>
              <article className="bg-ink-900 p-6">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-cyan mb-2">
                  {evangelist.name}
                </p>
                <h3 className="font-serif text-xl text-ink-100 mb-2">Build the coalition.</h3>
                <p className="text-sm text-ink-400 leading-relaxed mb-4">{evangelist.essence}</p>
                <p className="text-sm text-ink-300 leading-relaxed">
                  {evangelist.edge}
                </p>
              </article>
            </div>
            <p className="mt-5 font-mono text-[10px] text-ink-500 leading-relaxed max-w-2xl">
              A moral mission is necessary, not sufficient. The standard here is still a specific
              problem, a real frontier, evidence that the future would be better if it works, and
              the discipline to earn founder-problem fit in the real world.
            </p>
          </div>
        </section>

        {/* the honest question */}
        <section className="border-b border-hair">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <h2 className="font-serif text-3xl md:text-5xl text-ink-100 leading-tight mb-5">
              Are you on a good quest right now?
              <span className="block text-amber-300">Be honest.</span>
            </h2>
            <p className="text-ink-400 leading-relaxed max-w-xl mx-auto mb-8">
              Not a rhetorical question — the essay&rsquo;s actual closing line. If the honest
              answer is no, the fix isn&rsquo;t motivation. It&rsquo;s finding the specific hard,
              good quest that only you are positioned to run at. That match has a name here:
              founder-problem fit.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/fit"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-ultra-wide text-paper bg-amber-300 hover:bg-amber-200 rounded px-5 py-3 transition-colors"
              >
                Find your quest &rarr;
              </Link>
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-ultra-wide text-ink-200 border border-hair hover:border-amber-300/60 rounded px-5 py-3 transition-colors"
              >
                How to actually start &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* close, looping back to beginning of infinity */}
        <section className="border-b border-hair">
          <div className="max-w-3xl mx-auto px-6 py-10">
            <p className="text-ink-400 leading-relaxed max-w-2xl text-sm">
              The current age of humanity has no date on it yet. It&rsquo;s still being written —
              see{' '}
              <Link href="/ages" className="text-amber-300 hover:underline">
                /ages
              </Link>
              . Every quest on{' '}
              <Link href="/rankings" className="text-amber-300 hover:underline">
                /rankings
              </Link>{' '}
              is an unclaimed line in it.
            </p>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
