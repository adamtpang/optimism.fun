/**
 * /p/[slug]/whitepaper — the full RFS-style document for a single problem.
 *
 * Modeled on Musk's Hyperloop Alpha and the "Attention Is All You Need"
 * transformer paper. Sections:
 *   §1 Abstract & the four axes
 *   §2 The problem
 *   §3 Why it persists
 *   §4 Existing alternatives
 *   §5 Proposed direction
 *   §6 Cost and scale
 *   §7 Safety and considerations
 *   §8 Suggested investors
 *   §9 Sources & criticism invite
 *
 * Sections that need deeper human/AI authorship (technical specs, full safety
 * analysis) render an "In progress" placeholder pointing at the weekly cadence.
 */
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SourceBadge from '@/components/SourceBadge'
import TierPill from '@/components/TierPill'
import EmailCapture from '@/components/EmailCapture'
import { problems, getProblemBySlug } from '@/data/problems'
import { getCompaniesForProblem } from '@/data/companies'
import { getEcosystemForProblem } from '@/data/ecosystem'
import { getPositionsForProblem } from '@/data/voices'
import { ECOSYSTEM_TYPE_LABEL } from '@/data/types'
import { formatHumans, formatUSD, formatPercent } from '@/lib/format'

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const problem = getProblemBySlug(slug)
  if (!problem) return {}
  return {
    title: `Whitepaper: ${problem.name} | optimism.fun`,
    description: `RFS-style deep dive on ${problem.name.toLowerCase()} — the four-axis ranking, current alternatives, proposed direction, and the investors who would back it.`,
  }
}

/** Tiny inline section heading helper. */
function SectionHeading({
  number,
  kicker,
  title,
}: {
  number: string
  kicker?: string
  title: string
}) {
  return (
    <header className="mb-5 border-b border-hair pb-3">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 tabular-nums">
          §{number}
        </span>
        {kicker ? (
          <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
            {kicker}
          </span>
        ) : null}
      </div>
      <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
        {title}
      </h2>
    </header>
  )
}

/** Card for sections that need deeper authorship. */
function InProgressCallout({ note }: { note: string }) {
  return (
    <div className="border border-dashed border-amber-300/50 bg-amber-300/[0.04] p-5 text-sm text-ink-300 leading-relaxed">
      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
        Section in progress
      </p>
      <p>
        {note} New whitepaper sections ship with each Monday newsletter drop.{' '}
        <Link
          href="/#join"
          className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
        >
          Subscribe
        </Link>{' '}
        to get the upgrade, or{' '}
        <a
          href="https://github.com/adamtpang/optimism.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
        >
          contribute on GitHub
        </a>
        .
      </p>
    </div>
  )
}

export default async function WhitepaperPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const problem = getProblemBySlug(slug)
  if (!problem) notFound()

  const companies = getCompaniesForProblem(slug)
  const ecosystem = getEcosystemForProblem(slug)
  const positions = getPositionsForProblem(slug)

  // Heuristic: any allocator type that meaningfully writes checks for new
  // ventures or research orgs counts as a "would-back-this" candidate. Grants
  // and fellowships fund the early people; catalytic / studio / vc / fro fund
  // the entities.
  const fundingCandidates = ecosystem // already filtered by problemSlug

  // Public companies first — they're the market validators ("this market is
  // real, here is who it's already paying").
  const publicCompanies = companies.filter((c) => c.stage === 'public')
  const privateCompanies = companies.filter((c) => c.stage === 'private')

  return (
    <>
      <Navbar />
      <main className="surface-paper">
        {/* Cover */}
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="max-w-3xl mx-auto px-6">
            <Link
              href={`/p/${problem.slug}`}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-ultra-wide text-ink-500 hover:text-amber-300 transition-colors mb-8"
            >
              <span>←</span> back to problem page
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
                Whitepaper · v0.1
              </span>
              <span className="font-mono text-[10px] text-ink-500">·</span>
              <TierPill tier={problem.tier} />
              <span className="font-mono text-[10px] text-ink-500">·</span>
              <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                open to refutation
              </span>
            </div>

            <p className="font-mono text-[11px] uppercase tracking-ultra-wide text-paper-copper mb-3">
              An optimism.fun request for startups
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] text-ink-100 mb-5">
              {problem.name}
            </h1>
            <p className="text-lg md:text-xl text-ink-300 leading-relaxed">
              {problem.tagline}
            </p>

            <div className="mt-8 font-mono text-[11px] text-ink-500 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-6 border-t border-hair pt-6">
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-600 mb-1">
                  Published
                </p>
                <p className="text-ink-200 tabular-nums">{problem.asOf}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-600 mb-1">
                  Authors
                </p>
                <p className="text-ink-200">optimism.fun</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-600 mb-1">
                  Status
                </p>
                <p className="text-ink-200">Draft · v0.1</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-600 mb-1">
                  License
                </p>
                <p className="text-ink-200">CC BY 4.0</p>
              </div>
            </div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-6 py-12 space-y-16">
          {/* §1 — Abstract */}
          <section>
            <SectionHeading number="1" kicker="abstract" title="The four-axis ranking" />
            <p className="font-serif text-lg text-ink-200 leading-relaxed mb-6">
              We rank humanity&rsquo;s most important problems on four quantifiable
              dimensions — quantity of humans affected, severity per capita, current
              solution quality, and addressable market size — and package each as a
              proposal in the spirit of Musk&rsquo;s <em>Hyperloop Alpha</em>. This
              document is the proposal for{' '}
              <strong className="text-ink-100">{problem.name.toLowerCase()}</strong>.
              Every number below is sourced and tagged with confidence. Every
              ranking is a conjecture, open to refutation.
            </p>

            <div className="grid sm:grid-cols-2 gap-px bg-ink-700/50 border border-hair">
              <div className="bg-[rgb(var(--bg))] p-5">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  Quantity · humans affected
                </p>
                <p className="font-mono text-2xl tabular-nums text-amber-300 mb-1">
                  {formatHumans(problem.humansAffected.value)}
                </p>
                <SourceBadge
                  confidence={problem.humansAffected.confidence}
                  source={problem.humansAffected.source}
                  asOf={problem.humansAffected.asOf}
                />
              </div>
              <div className="bg-[rgb(var(--bg))] p-5">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  Severity · WTP / wealth
                </p>
                <p className="font-mono text-2xl tabular-nums text-terminal-rose mb-1">
                  {formatPercent(problem.severity.value)}
                </p>
                <SourceBadge
                  confidence={problem.severity.confidence}
                  source={problem.severity.source}
                  asOf={problem.severity.asOf}
                />
              </div>
              {problem.currentSolutionQuality ? (
                <div className="bg-[rgb(var(--bg))] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                    Current solutions
                  </p>
                  <p className="font-mono text-2xl tabular-nums text-terminal-violet mb-1">
                    {(problem.currentSolutionQuality.value * 10).toFixed(1)} / 10
                  </p>
                  <SourceBadge
                    confidence={problem.currentSolutionQuality.confidence}
                    source={problem.currentSolutionQuality.source}
                    asOf={problem.currentSolutionQuality.asOf}
                  />
                </div>
              ) : null}
              {problem.marketSize ? (
                <div className="bg-[rgb(var(--bg))] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                    Market size · TAM
                  </p>
                  <p className="font-mono text-2xl tabular-nums text-terminal-cyan mb-1">
                    {formatUSD(problem.marketSize.value)}
                  </p>
                  <SourceBadge
                    confidence={problem.marketSize.confidence}
                    source={problem.marketSize.source}
                    asOf={problem.marketSize.asOf}
                  />
                </div>
              ) : null}
            </div>
          </section>

          {/* §2 — The problem */}
          <section>
            <SectionHeading number="2" kicker="problem statement" title="What we are trying to solve" />
            <p className="font-serif text-lg text-ink-200 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>
          </section>

          {/* §3 — Why it persists (current solution quality + transformation.before) */}
          <section>
            <SectionHeading
              number="3"
              kicker="why it persists"
              title="The gap between the world and the world that is physically possible"
            />
            {problem.transformation ? (
              <p className="font-serif text-lg text-ink-200 leading-relaxed mb-4">
                <span className="text-ink-100">Today: </span>
                {problem.transformation.before}
              </p>
            ) : null}
            {problem.currentSolutionQuality ? (
              <p className="font-serif text-base text-ink-300 leading-relaxed">
                Current solution quality is rated{' '}
                <strong className="text-ink-100 tabular-nums">
                  {(problem.currentSolutionQuality.value * 10).toFixed(1)} / 10
                </strong>{' '}
                ({problem.currentSolutionQuality.confidence} confidence) — meaning
                there is substantial unclaimed ground between what exists and what is
                possible. {problem.currentSolutionQuality.source}.
              </p>
            ) : null}
          </section>

          {/* §4 — Existing alternatives (companies tagged to this problem) */}
          <section>
            <SectionHeading
              number="4"
              kicker="existing alternatives"
              title="Who is already working on this"
            />
            {companies.length > 0 ? (
              <>
                <p className="font-serif text-base text-ink-300 leading-relaxed mb-6">
                  {companies.length} entities are currently working on this problem
                  across public markets, private companies, and research orgs. Each is
                  evidence the market is real; none has obviously solved it.
                </p>
                <div className="space-y-3">
                  {[...publicCompanies, ...privateCompanies].slice(0, 12).map((c) => (
                    <div
                      key={c.slug}
                      className="border border-hair p-4 grid grid-cols-[1fr_auto] gap-4 items-baseline"
                    >
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <h3 className="font-serif text-lg text-ink-100">
                            {c.url ? (
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-amber-300 transition-colors"
                              >
                                {c.name}
                              </a>
                            ) : (
                              c.name
                            )}
                          </h3>
                          <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                            {c.stage}
                            {c.country ? ` · ${c.country}` : null}
                          </span>
                        </div>
                        <p className="text-sm text-ink-400 leading-relaxed">
                          {c.description}
                        </p>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        {c.marketCap?.value ? (
                          <p className="text-sm text-amber-300">
                            {formatUSD(c.marketCap.value)}
                          </p>
                        ) : c.valuation?.value ? (
                          <p className="text-sm text-amber-300">
                            {formatUSD(c.valuation.value)}
                          </p>
                        ) : (
                          <p className="text-[11px] text-ink-500">undisclosed</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {companies.length > 12 ? (
                  <p className="font-mono text-[11px] text-ink-500 mt-4">
                    {companies.length - 12} more entries on the{' '}
                    <Link
                      href={`/p/${problem.slug}`}
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      problem page
                    </Link>
                    .
                  </p>
                ) : null}
              </>
            ) : (
              <p className="font-serif text-base text-ink-300 leading-relaxed">
                No companies have yet been tagged to this problem in the dataset.
                If you know one,{' '}
                <a
                  href="https://github.com/adamtpang/optimism.fun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                >
                  open a PR
                </a>
                .
              </p>
            )}
          </section>

          {/* §5 — Proposed direction (transformation.after) */}
          <section>
            <SectionHeading
              number="5"
              kicker="proposed direction"
              title="If we solve this, here is the world we get"
            />
            {problem.transformation ? (
              <>
                <div className="border border-hair p-6 bg-[rgb(var(--bg))] mb-6">
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green mb-3">
                    After · {problem.transformation.horizon}
                  </p>
                  <p className="font-serif text-lg text-ink-100 leading-relaxed">
                    {problem.transformation.after}
                  </p>
                </div>
                <InProgressCallout
                  note="Technical specifications, architectural choices, and capital-stack design — the Hyperloop Alpha-equivalent depth — are being authored as the weekly cadence ships."
                />
              </>
            ) : (
              <InProgressCallout note="The success vision and technical proposal for this problem are still being drafted." />
            )}
          </section>

          {/* §6 — Cost and scale */}
          <section>
            <SectionHeading number="6" kicker="cost & scale" title="What the market can pay" />
            {problem.marketSize ? (
              <>
                <p className="font-serif text-lg text-ink-200 leading-relaxed mb-4">
                  The world is already paying{' '}
                  <strong className="text-amber-300 font-mono tabular-nums">
                    {formatUSD(problem.marketSize.value)}
                  </strong>{' '}
                  per year against this problem ({problem.marketSize.source};{' '}
                  {problem.marketSize.confidence} confidence).
                </p>
                <p className="font-serif text-base text-ink-300 leading-relaxed">
                  A successful solution does not need to capture more — it needs to
                  redirect a meaningful slice of existing spend, plus the latent
                  willingness-to-pay implied by the severity score above. The cost
                  ceiling for a real solution is bounded by this number; everything
                  cheaper is dominated, everything more expensive is a non-starter.
                </p>
              </>
            ) : (
              <InProgressCallout note="Addressable-market sizing for this problem is not yet in the dataset." />
            )}
          </section>

          {/* §7 — Safety and considerations */}
          <section>
            <SectionHeading
              number="7"
              kicker="safety & considerations"
              title="What could go wrong, and how we know we are not wrong"
            />
            <InProgressCallout
              note="Failure modes, ethical considerations, and the conditions under which this whitepaper would be falsified are being authored as the weekly cadence ships. The Deutschian commitment: every claim above is a conjecture; we publish the conditions under which we would update."
            />
          </section>

          {/* §8 — Suggested investors */}
          <section>
            <SectionHeading
              number="8"
              kicker="suggested investors"
              title="Who would back this"
            />
            {fundingCandidates.length > 0 ? (
              <>
                <p className="font-serif text-base text-ink-300 leading-relaxed mb-6">
                  Capital allocators with a stated thesis or deployed portfolio in
                  this domain. This is a starting list — Exa Websets enrichment will
                  expand it to direct check-writers per company.
                </p>
                <div className="space-y-3">
                  {fundingCandidates.slice(0, 10).map((e) => (
                    <div
                      key={e.slug}
                      className="border border-hair p-4 flex items-start gap-4"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 whitespace-nowrap mt-1">
                        {ECOSYSTEM_TYPE_LABEL[e.type]}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-ink-100 mb-1">
                          {e.url ? (
                            <a
                              href={e.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-amber-300 transition-colors"
                            >
                              {e.name}
                            </a>
                          ) : (
                            e.name
                          )}
                        </h3>
                        <p className="text-sm text-ink-400 leading-relaxed">
                          {e.thesis}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <InProgressCallout note="No capital allocators have yet been tagged to this problem in the dataset." />
            )}
          </section>

          {/* §9 — Voices on this quest */}
          {positions.length > 0 ? (
            <section>
              <SectionHeading number="9" kicker="voices" title="What the thinkers say" />
              <div className="space-y-4">
                {positions.slice(0, 6).map(({ voice, position }) => (
                  <blockquote
                    key={voice.slug}
                    className="border-l-2 border-amber-300/50 pl-4"
                  >
                    <p className="font-serif text-base text-ink-200 leading-relaxed italic mb-2">
                      &ldquo;{position.stance}&rdquo;
                    </p>
                    <footer className="font-mono text-[11px] text-ink-500">
                      — {voice.name}
                      {voice.role ? ` · ${voice.role}` : null}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          ) : null}

          {/* §10 — Sources & criticism invite */}
          <section>
            <SectionHeading
              number={positions.length > 0 ? '10' : '9'}
              kicker="sources & criticism invite"
              title="Where this is wrong, tell us"
            />
            <p className="font-serif text-base text-ink-300 leading-relaxed mb-4">
              Every number on this page carries a source and a confidence tag.
              Every section open to refutation. If a citation is wrong, a number
              is stale, or a conjecture is unfounded — file a correction.
            </p>
            <ul className="space-y-2 mb-6 list-none">
              {problem.sources.map((s, i) => (
                <li key={i} className="font-mono text-[12px] text-ink-400">
                  <span className="text-ink-600">[{i + 1}]</span>{' '}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-mono text-[11px] text-ink-500 leading-relaxed">
              corrections → use the feedback widget in the nav · open issue at{' '}
              <a
                href="https://github.com/adamtpang/optimism.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
              >
                github.com/adamtpang/optimism.fun
              </a>
            </p>
          </section>
        </article>

        {/* Newsletter CTA — same Resend audience as the homepage */}
        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
