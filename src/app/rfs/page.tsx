/**
 * /rfs — Humanity's Requests for Startups.
 *
 * Genre: YC's RFS (concrete, buildable, urgent) crossed with Founders Fund's
 * "Choose Good Quests" (important × frontier × unambiguously good). Grouped by
 * ranked problem; each request is a call to action, the whitepaper is the
 * analysis behind it.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import EmailCapture from '@/components/EmailCapture'
import TierPill from '@/components/TierPill'
import { problems } from '@/data/problems'
import { requestsForStartups, getRequestsForProblem } from '@/data/rfs'

export const metadata: Metadata = {
  title: "Requests for Startups | optimism.fun",
  description:
    "Humanity's Requests for Startups — concrete, buildable companies someone should start to attack the highest-ranked problems. Modeled on YC's RFS and Founders Fund's Choose Good Quests.",
}

// Problems that actually have requests, in ranked order (problems.ts order).
const groups = problems
  .map((p) => ({ problem: p, requests: getRequestsForProblem(p.slug) }))
  .filter((g) => g.requests.length > 0)

export default function RfsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="humanity's requests for startups · v0.1"
          title="Choose a good quest."
          lede="These are concrete companies someone should build to attack humanity's highest-ranked problems. In the genre of YC's Requests for Startups, held to Founders Fund's Choose Good Quests test: important if it works, a genuine frontier, and unambiguously good. You do not need to build one of these. But if you are looking for what to do with your one life — start here."
          rightStats={[
            { label: 'requests', value: requestsForStartups.length, tone: 'amber' },
            { label: 'problems', value: groups.length, tone: 'violet' },
          ]}
        />

        {/* The rubric — make the Choose Good Quests test explicit */}
        <section className="border-b border-hair surface-paper">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-paper-copper mb-3">
              The test
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-5">
              Most ambition is spent on bad quests. This is the filter.
            </h2>
            <div className="grid sm:grid-cols-3 gap-px bg-ink-700/50 border border-hair">
              <div className="bg-[rgb(var(--bg))] p-5">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
                  Important if it works
                </p>
                <p className="text-sm text-ink-300 leading-relaxed">
                  Success measurably moves one of humanity&rsquo;s ranked problems —
                  not a derivative of a derivative.
                </p>
              </div>
              <div className="bg-[rgb(var(--bg))] p-5">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-violet mb-2">
                  A genuine frontier
                </p>
                <p className="text-sm text-ink-300 leading-relaxed">
                  Real technical, scientific, or institutional risk. If it were
                  easy it would already be done.
                </p>
              </div>
              <div className="bg-[rgb(var(--bg))] p-5">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green mb-2">
                  Unambiguously good
                </p>
                <p className="text-sm text-ink-300 leading-relaxed">
                  Success is clearly net-positive for humanity, not a
                  zero-sum extraction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The requests, grouped by ranked problem */}
        <section className="max-w-5xl mx-auto px-6 py-14 space-y-16">
          {groups.map(({ problem, requests }) => (
            <div key={problem.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6 border-b border-hair pb-3">
                <div className="flex items-center gap-3">
                  <TierPill tier={problem.tier} />
                  <h2 className="font-serif text-2xl md:text-3xl text-ink-100">
                    {problem.name}
                  </h2>
                </div>
                <Link
                  href={`/p/${problem.slug}/whitepaper`}
                  className="font-mono text-[11px] uppercase tracking-ultra-wide text-amber-300 hover:text-amber-200 transition-colors"
                >
                  read the whitepaper →
                </Link>
              </div>

              <div className="space-y-4">
                {requests.map((r) => (
                  <article
                    key={r.slug}
                    className="border border-hair p-6 hover:border-hair-strong transition-colors"
                  >
                    <h3 className="font-serif text-xl md:text-2xl text-ink-100 mb-3">
                      {r.title}
                    </h3>
                    <p className="font-serif text-lg text-ink-200 leading-relaxed mb-5">
                      {r.pitch}
                    </p>

                    <div className="grid md:grid-cols-3 gap-px bg-ink-700/40 border border-hair mb-4">
                      <div className="bg-[rgb(var(--bg))] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                          Why now
                        </p>
                        <p className="text-sm text-ink-300 leading-relaxed">
                          {r.whyNow}
                        </p>
                      </div>
                      <div className="bg-[rgb(var(--bg))] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                          The shape of it
                        </p>
                        <p className="text-sm text-ink-300 leading-relaxed">
                          {r.shape}
                        </p>
                      </div>
                      <div className="bg-[rgb(var(--bg))] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                          Success looks like
                        </p>
                        <p className="text-sm text-ink-300 leading-relaxed">
                          {r.successLooksLike}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l-2 border-amber-300/50 pl-4">
                      <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 whitespace-nowrap mt-0.5">
                        good quest
                      </span>
                      <p className="text-sm text-ink-300 leading-relaxed italic">
                        {r.goodQuest}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Closer + newsletter */}
        <section className="border-t border-hair">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
              This list is a conjecture
            </p>
            <p className="font-serif text-lg md:text-xl text-ink-200 leading-relaxed mb-4">
              Every request here is an argument, not an oracle. The
              ranking that orders them, the &ldquo;why now,&rdquo; the claim that
              success would be good — all of it is open to refutation. If a
              request is wrong, or one is missing, tell us.
            </p>
            <p className="font-mono text-[11px] text-ink-500">
              corrections → feedback widget in the nav · open issue at{' '}
              <a
                href="https://github.com/adamtpang/optimism.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
              >
                github.com/adamtpang/optimism.fun
              </a>
            </p>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
