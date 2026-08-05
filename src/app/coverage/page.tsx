import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import HeroFigure from '@/components/HeroFigure'
import {
  coverageTaxonomies,
  coverageGapCandidates,
  coverageStats,
  type CoverageStatus,
} from '@/data/coverage'

export const metadata: Metadata = {
  title: 'Is this index comprehensive? | optimism.fun',
  description:
    'The 11 problems on this index were hand-seeded, not discovered. Cross-referenced against the UN SDGs, 80,000 Hours, and the Global Burden of Disease to find out what is missing.',
}

const STATUS_LABEL: Record<CoverageStatus, string> = {
  covered: 'covered',
  partial: 'partial',
  gap: 'gap',
  excluded: 'excluded',
}

const STATUS_TONE: Record<CoverageStatus, string> = {
  covered: 'text-terminal-green',
  partial: 'text-ink-400',
  gap: 'text-terminal-rose',
  excluded: 'text-ink-600',
}

export default function CoveragePage() {
  const totalScorable = coverageTaxonomies.reduce((s, t) => s + coverageStats(t).total, 0)
  const totalCovered = coverageTaxonomies.reduce((s, t) => s + coverageStats(t).covered, 0)

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-4xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The coverage audit
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              Is this actually
              <span className="block text-amber-300">a comprehensive index?</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              The 11 problems on this index were hand-seeded across a build session — not
              discovered. A curated list reflects the curator&apos;s blind spots. So instead of
              trusting that, we cross-checked the list against three taxonomies that were each
              built, independently, to be exhaustive over a domain — and counted what falls
              outside all three.
            </p>
          </div>
        </section>

        <section className="border-b border-hair bg-ink-900/30">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <HeroFigure
              value={`${totalCovered} of ${totalScorable}`}
              label="Taxonomy items directly matched by a problem on the index"
              caption="Summed across the three taxonomies below. Partial matches and deliberate exclusions are not counted as covered — see each list for the full breakdown."
            />
          </div>
        </section>

        {coverageTaxonomies.map((t) => {
          const stats = coverageStats(t)
          return (
            <section key={t.slug} className="border-b border-hair">
              <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                    {t.name}
                  </h2>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] text-ink-500 hover:text-amber-300 transition-colors shrink-0"
                  >
                    source →
                  </a>
                </div>
                <p className="font-mono text-[11px] text-ink-500 leading-relaxed max-w-2xl mb-2">
                  {t.method}
                </p>
                <p className="font-mono text-[11px] text-ink-400 mb-5">
                  <span className="text-terminal-green">{stats.covered} covered</span>
                  {' · '}
                  <span className="text-ink-400">{stats.partial} partial</span>
                  {' · '}
                  <span className="text-terminal-rose">{stats.gap} gap</span>
                  {' · '}
                  {stats.total} scored
                </p>

                <div className="border border-hair rounded-lg overflow-hidden">
                  {t.items.map((item, i) => (
                    <div
                      key={item.name}
                      className={`px-3 py-2.5 flex items-baseline justify-between gap-4 ${
                        i < t.items.length - 1 ? 'border-b border-hair' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-sans text-[13px] text-ink-100">{item.name}</span>
                        <p className="font-mono text-[10px] text-ink-500 leading-relaxed mt-0.5 max-w-xl">
                          {item.note}
                          {item.matchedSlugs.length > 0 && (
                            <span className="text-ink-600">
                              {' '}
                              — {item.matchedSlugs.join(', ')}
                            </span>
                          )}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 font-mono text-[10px] uppercase tracking-wide ${STATUS_TONE[item.status]}`}
                      >
                        {STATUS_LABEL[item.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        {/* the candidate gaps */}
        <section className="border-b border-hair bg-ink-900/30">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              What&apos;s actually missing
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-2">
              Nine candidates, ranked by how many lists agree.
            </h2>
            <p className="text-ink-400 leading-relaxed max-w-2xl mb-6 text-sm">
              Hand-curated from the gap rows above. A cause flagged by only one taxonomy might be
              that taxonomy&apos;s own bias; a cause flagged by two or three independent lists is a
              stronger claim that the index is actually missing something.
            </p>
            <div className="border border-hair rounded-lg overflow-hidden">
              {coverageGapCandidates.map((c, i) => (
                <div
                  key={c.name}
                  className={`px-3 py-3 ${
                    i < coverageGapCandidates.length - 1 ? 'border-b border-hair' : ''
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <span className="font-sans text-[14px] text-ink-100">{c.name}</span>
                    <span className="font-mono text-[10px] text-ink-500 shrink-0">
                      flagged by {c.flaggedBy.length}/3
                    </span>
                  </div>
                  <p className="text-ink-400 text-[13px] leading-relaxed">{c.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* method note */}
        <section className="border-b border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              Why this isn&apos;t the whole answer
            </p>
            <div className="space-y-4 font-mono text-[11px] leading-relaxed text-ink-400 max-w-3xl">
              <p>
                <span className="text-ink-100">This is a snapshot, not a live check.</span> The
                taxonomies here are hand-fetched and hand-mapped, same as the 11 problems
                themselves. It answers &quot;what are we obviously missing&quot;, not &quot;are we
                complete&quot; — no finite set of taxonomies proves completeness, it only lowers the
                chance of an obvious blind spot.
              </p>
              <p>
                <span className="text-ink-100">There is a live path to closing this.</span> The{' '}
                <span className="text-ink-200">Exa Agent problem-sourcing pipeline</span> already
                exists in code — it does open-ended web research and returns structured candidates
                to a review queue at <span className="text-ink-200">/admin/candidates</span>. It is
                currently in stub mode because it needs a database connection that has not been
                wired up yet. Once it is, discovery stops depending on this page being re-run by
                hand.
              </p>
              <p>
                <span className="text-ink-100">Three lists, three biases.</span> The SDGs skew
                toward negotiated political consensus, 80,000 Hours skews toward existential and
                catastrophic risk, and GBD skews toward measurable mortality and disability. None
                of them alone would be a fair comprehensiveness check — together they cover most of
                the space any one of them would miss.
              </p>
            </div>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
