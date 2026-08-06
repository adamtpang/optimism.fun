import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import HeroFigure from '@/components/HeroFigure'
import { founders } from '@/data/founders'
import { problems } from '@/data/problems'
import { formatUSD } from '@/lib/format'
import type { FrontierBet, FrontierPattern } from '@/data/types'

export const metadata: Metadata = {
  title: 'The frontier of demand | optimism.fun',
  description:
    'What the richest people on earth are buying before the price comes down — money at the top of the wealth curve is a leading indicator, not a trailing one.',
}

const PATTERN_LABEL: Record<FrontierPattern, string> = {
  'frontier-bets': 'funds unproven frontier science',
  'conventional-philanthropy': 'gives at scale to established causes',
  'prestige-giving': 'prestige / sovereignty giving',
  'scaling-proven-tech': 'scales what already works',
}

const PATTERN_TONE: Record<FrontierPattern, string> = {
  'frontier-bets': 'text-amber-300',
  'conventional-philanthropy': 'text-terminal-cyan',
  'prestige-giving': 'text-ink-500',
  'scaling-proven-tech': 'text-ink-500',
}

type BetWithFounder = FrontierBet & { founderName: string }

function BetRow({ b }: { b: BetWithFounder }) {
  const problem = b.problemSlug ? problems.find((p) => p.slug === b.problemSlug) : null
  return (
    <div className="border-t border-hair pt-2.5 mt-2.5 first:border-t-0 first:pt-0 first:mt-0">
      <div className="flex items-baseline justify-between gap-3 mb-0.5">
        <span className="font-sans text-[13px] text-ink-100">{b.vehicle}</span>
        {b.amount && (
          <span className="font-mono text-[11px] text-amber-300 shrink-0 tabular-nums">
            {formatUSD(b.amount.value)}
          </span>
        )}
      </div>
      <p className="text-[12px] text-ink-400 leading-relaxed mb-1.5">{b.description}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {problem && (
          <Link
            href={`/p/${problem.slug}`}
            className="font-mono text-[10px] uppercase tracking-wide text-terminal-cyan border border-terminal-cyan/40 rounded px-1.5 py-0.5 hover:bg-terminal-cyan/10 transition-colors"
          >
            validates → {problem.name}
          </Link>
        )}
        {b.gapLabel && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-amber-300 border border-amber-300/40 rounded px-1.5 py-0.5">
            not on the index → {b.gapLabel}
          </span>
        )}
        <a
          href={b.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-ink-600 hover:text-ink-300 transition-colors ml-auto"
        >
          source →
        </a>
      </div>
    </div>
  )
}

export default function FrontierPage() {
  const allBets: BetWithFounder[] = founders.flatMap((f) =>
    (f.frontierBets ?? []).map((b) => ({ ...b, founderName: f.name })),
  )

  const byProblem = new Map<string, BetWithFounder[]>()
  const byGap = new Map<string, BetWithFounder[]>()
  for (const b of allBets) {
    if (b.problemSlug) {
      byProblem.set(b.problemSlug, [...(byProblem.get(b.problemSlug) ?? []), b])
    }
    if (b.gapLabel) {
      byGap.set(b.gapLabel, [...(byGap.get(b.gapLabel) ?? []), b])
    }
  }

  const betters = founders.filter((f) => f.frontierPattern === 'frontier-bets')
  const others = founders.filter((f) => f.frontierPattern && f.frontierPattern !== 'frontier-bets')

  const gapNames = [...byGap.keys()]

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-4xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The frontier of demand
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              The rich buy the future first.
              <span className="block text-amber-300">Then it gets cheap.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              Technology comes down a cost curve. Solar, gene sequencing, and satellite launch were
              all once luxuries only the wealthiest could buy at the price the frontier demands —
              then the price fell and everyone got the solution. So instead of asking what humanity
              needs in the abstract, this page asks a narrower question: what are the richest
              people on earth putting real, disclosed capital behind right now, before it&apos;s
              cheap? Their money is a leading indicator of demand, not a trailing one.
            </p>
          </div>
        </section>

        <section className="border-b border-hair bg-ink-900/30">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <HeroFigure
              value={String(gapNames.length)}
              label="Problem domains this money reveals that aren't on the ranked index yet"
              caption={
                gapNames.length > 0
                  ? `${gapNames.join(', ')} — surfaced by tracing where disclosed capital actually goes, not from a published taxonomy like the ones on /coverage.`
                  : undefined
              }
            />
          </div>
        </section>

        {/* per-person cards */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-6">
            Disclosed capital, top {founders.length} by net worth
          </p>
          <div className="space-y-6">
            {founders.map((f) => (
              <div key={f.name} className="border border-hair rounded-lg px-4 py-4">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className="font-sans text-[16px] text-ink-100">
                    {f.name}
                    <span className="text-ink-500 font-mono text-[11px] ml-2">{f.source}</span>
                  </span>
                  <span className="font-mono text-[12px] text-amber-300 tabular-nums shrink-0">
                    {formatUSD(f.netWorth.value)}
                  </span>
                </div>
                {f.frontierPattern && (
                  <p className={`font-mono text-[10px] uppercase tracking-wide mb-3 ${PATTERN_TONE[f.frontierPattern]}`}>
                    {PATTERN_LABEL[f.frontierPattern]}
                  </p>
                )}
                {f.frontierBets && f.frontierBets.length > 0 ? (
                  <div>
                    {f.frontierBets.map((b, i) => (
                      <BetRow key={i} b={{ ...b, founderName: f.name }} />
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-[11px] text-ink-600">No disclosed frontier bets researched yet.</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* rollup: validated problems */}
        {byProblem.size > 0 && (
          <section className="border-y border-hair bg-ink-900/30">
            <div className="max-w-4xl mx-auto px-6 py-10">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-cyan mb-3">
                Already validated
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-5">
                Problems the ultra-wealthy already fund independently.
              </h2>
              <div className="space-y-3">
                {[...byProblem.entries()].map(([slug, bets]) => {
                  const problem = problems.find((p) => p.slug === slug)
                  if (!problem) return null
                  return (
                    <div key={slug} className="flex items-baseline justify-between gap-4 border-b border-hair pb-3 last:border-b-0">
                      <Link href={`/p/${slug}`} className="text-ink-100 text-[14px] hover:text-amber-300 transition-colors">
                        {problem.name}
                      </Link>
                      <span className="font-mono text-[11px] text-ink-500 shrink-0">
                        {[...new Set(bets.map((b) => b.founderName))].join(', ')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* rollup: new gaps */}
        {byGap.size > 0 && (
          <section className="border-b border-hair">
            <div className="max-w-4xl mx-auto px-6 py-10">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
                Not on the index
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-2">
                What they&apos;re buying that isn&apos;t ranked anywhere.
              </h2>
              <p className="text-ink-400 leading-relaxed max-w-2xl mb-5 text-sm">
                A fourth taxonomy for the{' '}
                <Link href="/coverage" className="text-amber-300 hover:underline">
                  coverage audit
                </Link>{' '}
                — sourced from revealed capital instead of a published list.
              </p>
              <div className="space-y-3">
                {[...byGap.entries()].map(([gap, bets]) => (
                  <div key={gap} className="flex items-baseline justify-between gap-4 border-b border-hair pb-3 last:border-b-0">
                    <span className="text-ink-100 text-[14px]">{gap}</span>
                    <span className="font-mono text-[11px] text-ink-500 shrink-0">
                      {[...new Set(bets.map((b) => b.founderName))].join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* not everyone fits */}
        {others.length > 0 && (
          <section className="border-b border-hair bg-ink-900/30">
            <div className="max-w-4xl mx-auto px-6 py-10">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                The honest exception
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-4">
                Not everyone buys the frontier.
              </h2>
              <p className="text-ink-400 leading-relaxed max-w-2xl mb-6 text-sm">
                {betters.length} of {founders.length} fit the thesis. The other{' '}
                {others.length} don&apos;t, and forcing them into the narrative would be dishonest —
                their giving is real and large, just a different pattern.
              </p>
              <div className="space-y-4">
                {others.map((f) => (
                  <div key={f.name} className="border-l-2 border-hair pl-4">
                    <p className="text-ink-100 text-[14px] mb-0.5">
                      {f.name}{' '}
                      {f.frontierPattern && (
                        <span className={`font-mono text-[10px] uppercase ml-2 ${PATTERN_TONE[f.frontierPattern]}`}>
                          {PATTERN_LABEL[f.frontierPattern]}
                        </span>
                      )}
                    </p>
                    {f.frontierBets?.map((b, i) => (
                      <p key={i} className="text-ink-400 text-[12px] leading-relaxed">
                        {b.description}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* method */}
        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              How this is built
            </p>
            <div className="space-y-4 font-mono text-[11px] leading-relaxed text-ink-400 max-w-3xl">
              <p>
                <span className="text-ink-100">Disclosed capital only.</span> A funding round, a
                pledge with a number, a foundation&apos;s public grant. Never an interview quote
                about what someone says they&apos;re &quot;interested in&quot; — that&apos;s
                attention, not demand, and this site already has a page for the difference between
                the two.
              </p>
              <p>
                <span className="text-ink-100">Hand-curated, not live.</span> This is ~10 named
                individuals, not a statistical aggregate — there is no API for &quot;what
                billionaires fund.&quot; Each entry is researched and cited individually, the same
                way <Link href="/founders" className="text-amber-300 hover:underline">/founders</Link> itself
                is.
              </p>
              <p>
                <span className="text-ink-100">Top {founders.length} so far.</span> Same caveat as{' '}
                <Link href="/founders" className="text-amber-300 hover:underline">/founders</Link> —
                more coming. Some bets shown here (Calico, Altos Labs) are company- or
                consortium-funded, not solely personal; where a personal share isn&apos;t disclosed,
                the total is shown with that caveat stated, never presented as one person&apos;s
                money.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/coverage"
                className="px-4 py-2 border border-amber-300/40 text-amber-300 font-mono text-[12px] hover:bg-amber-300/[0.06] transition-colors"
              >
                The full coverage audit →
              </Link>
              <Link
                href="/founders"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                All 10 by net worth →
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
