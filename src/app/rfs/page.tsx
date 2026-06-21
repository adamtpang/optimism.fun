/**
 * /rfs — Humanity's Requests for Startups.
 *
 * Genre: YC's RFS (concrete, buildable, urgent) crossed with Founders Fund's
 * "Choose Good Quests" (important × frontier × unambiguously good). Grouped by
 * ranked problem; each request is a call to action, the whitepaper is the
 * analysis behind it.
 */
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import EmailCapture from '@/components/EmailCapture'
import RfsBoard, { type RfsGroupData } from '@/components/RfsBoard'
import { problems } from '@/data/problems'
import { requestsForStartups, getRequestsForProblem } from '@/data/rfs'
import { getEcosystemForProblem } from '@/data/ecosystem'
import { getInLimitCap } from '@/data/in-limit'
import { getCapitalFlow } from '@/data/capital-flows'
import { computeAllocations } from '@/lib/allocation'

export const metadata: Metadata = {
  title: "Requests for Startups & Investors | optimism.fun",
  description:
    "Humanity's Requests for Startups are also Requests for Investors — the same concrete companies, seen from both sides, each tagged with the in-the-limit market cap if the team executes perfectly. Modeled on YC's RFS and Founders Fund's Choose Good Quests.",
}

// Problems that actually have requests, in ranked order (problems.ts order).
// For each, pre-compute the two-sided action data: who funds it (ecosystem),
// the prize at the limit, the capital flowing, and the allocation verdict.
const allocations = computeAllocations()

const groups: RfsGroupData[] = problems
  .map((p): RfsGroupData | null => {
    const requests = getRequestsForProblem(p.slug)
    if (requests.length === 0) return null
    const prize = getInLimitCap(p.slug)
    const flow = getCapitalFlow(p.slug)
    const alloc = allocations.get(p.slug)
    return {
      problemSlug: p.slug,
      problemName: p.name,
      tier: p.tier,
      prizeUsd: prize?.marketCap.value ?? null,
      capitalUsd: flow?.usdPerYear.value ?? null,
      momentum: flow?.momentum ?? null,
      ratio: alloc?.ratio ?? null,
      verdict: alloc?.verdict ?? null,
      funders: getEcosystemForProblem(p.slug).map((e) => ({
        slug: e.slug,
        name: e.name,
        type: e.type,
        url: e.url,
        thesis: e.thesis,
        bestFor: e.bestFor,
      })),
      requests: requests.map((r) => ({
        slug: r.slug,
        title: r.title,
        pitch: r.pitch,
        whyNow: r.whyNow,
        shape: r.shape,
        successLooksLike: r.successLooksLike,
        goodQuest: r.goodQuest,
      })),
    }
  })
  .filter((g): g is RfsGroupData => g !== null)

export default function RfsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="requests for startups · requests for investors · v0.1"
          title="Two sides of one coin."
          lede="Each request is one object seen from both sides: to a founder it says build this; to an investor it says fund this. Concrete companies that attack humanity's highest-ranked problems — in the genre of YC's Requests for Startups, held to Founders Fund's Choose Good Quests test, and tagged with the in-the-limit market cap: what the company is worth if the team executes perfectly. If you are looking for what to do with your one life, or where the next dollar should go — start here."
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

        {/* The requests — a two-sided action board (Build it / Fund it) */}
        <RfsBoard groups={groups} />

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
