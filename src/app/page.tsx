import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import ProblemTable from '@/components/ProblemTable'
import EmailCapture from '@/components/EmailCapture'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { publicCompanies } from '@/data/public-companies'
import { ecosystem } from '@/data/ecosystem'
import { voices } from '@/data/voices'
import { founders } from '@/data/founders'
import { progress } from '@/data/progress'

// The journey — how humanity solves problems, in order. The site formalizes
// what's already happening: a pipeline from problem → explanation → solution
// → founder → capital → progress.
const journey = [
  {
    href: '#problems',
    step: '01',
    kicker: 'the problem',
    n: problems.length,
    title: 'What humanity faces.',
    desc: 'Ranked on welfare, x-risk, and utility delta — three lenses, not one. Tier and humans-affected confidence on every row.',
    tone: 'amber',
  },
  {
    href: '/voices',
    step: '02',
    kicker: 'the explanation',
    n: voices.length,
    title: 'Why it matters.',
    desc: 'The thinkers who argue each problem is THE problem to work on — Deutsch, Musk, Collison, Crawford, Cowen, Stephens. Quotes and source links.',
    tone: 'violet',
  },
  {
    href: '/companies',
    step: '03',
    kicker: 'the solution',
    n: companies.length + publicCompanies.length,
    title: 'What gets built.',
    desc: 'Companies tagged to the problems they solve. Public market caps and private valuations, every number sourced and confidence-tagged.',
    tone: 'cyan',
  },
  {
    href: '/founders',
    step: '04',
    kicker: 'the founder',
    n: founders.length,
    title: 'Who builds it.',
    desc: 'The 2026 Forbes top 10 — net worth, source of wealth, country. Soon: every founder, allocator, and operator on each quest.',
    tone: 'amber',
  },
  {
    href: '/ecosystem',
    step: '05',
    kicker: 'the capital',
    n: ecosystem.length,
    title: 'Who funds it.',
    desc: 'Grants, fellowships, FROs, studios, VCs. The full capital stack working on each problem — not just the headline-name VCs.',
    tone: 'green',
  },
  {
    href: '/progress',
    step: '06',
    kicker: 'the progress',
    n: progress.length,
    title: "What's already worked.",
    desc: 'Long-run series on extreme poverty, child mortality, literacy, life expectancy, GDP, electricity, internet. The historical receipts.',
    tone: 'cyan',
  },
] as const

const TONE: Record<'amber' | 'green' | 'violet' | 'cyan', string> = {
  amber: 'text-amber-300',
  green: 'text-terminal-green',
  violet: 'text-terminal-violet',
  cyan: 'text-terminal-cyan',
}

const shoulders = [
  { name: 'David Deutsch & Karl Popper', note: 'critical rationalism · the soluble-problem thesis' },
  { name: 'Trae Stephens & Markie Wagner', note: 'the Choose Good Quests framing' },
  { name: '80,000 Hours', note: 'ITN framework · importance × tractability × neglectedness' },
  { name: 'Copenhagen Consensus Center', note: 'benefit-cost analysis for welfare interventions' },
  { name: 'Jason Crawford & Roots of Progress', note: 'the progress-studies canon' },
  { name: 'Patrick Collison & Tyler Cowen', note: 'scientific productivity as a meta-cause' },
  { name: 'Conjecture Institute', note: 'applying critical rationalism to AI safety' },
  { name: 'The Rise Fund', note: 'Impact Multiple of Money methodology' },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="humanity's requests for startups · v0.1"
          title="Infinite problems. Infinite solutions."
          lede="A live, ranked dashboard of humanity's priority problems — sourced and sorted across quantity × severity × current-solution-quality × market-size, then packaged as whitepapers in the spirit of Hyperloop Alpha. Built for founders looking for what to build next, and the investors looking for who to back. Every number sourced. Every ranking open to refutation. New whitepaper every monday."
          rightStats={[
            { label: 'problems', value: problems.length, tone: 'amber' },
            { label: 'explanations', value: voices.length, tone: 'violet' },
            { label: 'solutions', value: companies.length + publicCompanies.length, tone: 'cyan' },
            { label: 'progress', value: progress.length, tone: 'green' },
          ]}
        />

        {/* Primary CTA — point founders straight at the table */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[11px] text-ink-400">
              The whole point of the site is below. Pick a problem worth your life.
            </p>
            <a
              href="#problems"
              className="font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-4 py-2 hover:bg-amber-300/[0.08] transition-colors"
            >
              Find your problem →
            </a>
          </div>
        </section>

        {/* Secondary CTA — newsletter / weekly memo signup */}
        <EmailCapture />

        {/* Thesis / what-this-is */}
        <section className="border-b border-hair">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-6">
              The thesis
            </p>
            <blockquote className="font-serif text-2xl md:text-4xl leading-[1.15] text-ink-100 mb-4">
              <span className="text-ink-300">&ldquo;All problems are explainable.</span>
              <span className="block text-amber-300">All solutions are creatable.&rdquo;</span>
            </blockquote>
            <p className="font-mono text-[11px] text-ink-500 mb-10">
              David Deutsch &middot; via Karl Popper &middot; operationalized with data
            </p>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                  What this is
                </p>
                <p className="text-ink-300 leading-relaxed mb-4">
                  A ranked dashboard of humanity&rsquo;s most important problems, with the
                  companies, founders, and capital working on each one mapped directly to the
                  quest. Welfare, x-risk, and utility-delta scored separately so the
                  disagreements stay visible.
                </p>
                <p className="text-ink-300 leading-relaxed">
                  Targeted at two audiences:{' '}
                  <span className="text-ink-100">capital allocators</span> deciding where
                  dollars should move, and{' '}
                  <span className="text-ink-100">entrepreneurs</span> deciding what to work
                  on with the rest of their twenties, thirties, and forties.
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                  What it is not
                </p>
                <ul className="space-y-3 text-ink-300">
                  <li>
                    <span className="text-ink-100">Not a startup idea browser.</span> Not a
                    feed of reddit pain points to build SaaS for. These are hard problems,
                    mostly underfunded relative to their scale.
                  </li>
                  <li>
                    <span className="text-ink-100">Not a charity evaluator.</span> GiveWell
                    exists and is excellent. This sits upstream of where they work.
                  </li>
                  <li>
                    <span className="text-ink-100">Not for sale.</span> No company pays to
                    move up the rank. No advertising that looks like endorsement. The moment
                    that rule breaks, the dataset is worth nothing.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The journey: same data as the atlas, resequenced as a pipeline */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                How humanity solves problems
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink-100 leading-tight">
                The problem &rarr; the explanation &rarr; the solution &rarr; the founder &rarr; the capital &rarr; the progress.
              </h2>
              <p className="mt-3 text-ink-400 max-w-2xl leading-relaxed">
                The pipeline is already here. The site formalizes it — every node sourced, every number tagged, every conjecture open to refutation.
              </p>
            </div>
            <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/50 border border-hair">
              {journey.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6 h-full"
                  >
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="font-mono text-[11px] tabular-nums text-amber-300">
                        {s.step}
                      </span>
                      <span className={`font-mono tabular-nums text-2xl ${TONE[s.tone]}`}>
                        {s.n}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                      {s.kicker}
                    </p>
                    <h3 className="font-serif text-xl text-ink-100 mb-2 group-hover:text-amber-300 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-ink-400 leading-relaxed">{s.desc}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* The receipts — this system already works; the site formalizes it */}
        <section className="border-b border-hair surface-paper">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-paper-copper mb-3">
              The receipts
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-100 leading-tight mb-6">
              This system already works. We just want more of it.
            </h2>
            <p className="font-serif text-lg text-ink-200 leading-relaxed mb-4">
              Extreme poverty has been cut by more than half since 1990. Child
              mortality down ~60%. Literacy near-universal. Life expectancy up two
              decades. Internet access went from a luxury to a near-utility in one
              generation. The progress-studies thesis (Patrick Collison, Tyler Cowen,
              Roots of Progress) is right: humanity has been solving its biggest
              problems — often quietly, often without coordination.
            </p>
            <p className="font-serif text-lg text-ink-200 leading-relaxed mb-6">
              What&rsquo;s missing is legibility. Founders can&rsquo;t see which
              problem to pick. Investors can&rsquo;t see the field. Researchers
              don&rsquo;t see who&rsquo;s already on it.{' '}
              <span className="text-ink-100">
                optimism.fun makes the system visible so more people can join it.
              </span>
            </p>
            <Link
              href="/progress"
              className="font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-4 py-2 hover:bg-amber-300/[0.08] transition-colors inline-block"
            >
              See the receipts &rarr;
            </Link>
          </div>
        </section>

        {/* Problem leaderboard */}
        <section id="problems" className="px-6 py-14 max-w-7xl mx-auto scroll-mt-24">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                The main table
              </p>
              <h2 className="font-serif text-2xl text-ink-100">Problem leaderboard.</h2>
            </div>
            <span className="font-mono text-[11px] text-ink-500">
              {problems.length} ranked · sort, filter, click any row
            </span>
          </div>
          <ProblemTable problems={problems} />
        </section>

        {/* Participate — multi-persona CTAs to plug into the pipeline */}
        <section className="border-t border-hair">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                Participate
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink-100 leading-tight">
                How to plug in.
              </h2>
              <p className="mt-3 text-ink-400 max-w-2xl leading-relaxed">
                The pipeline is open. Pick the role that fits and start there.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-700/50 border border-hair">
              <Link
                href="#problems"
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  if you build
                </p>
                <h3 className="font-serif text-xl text-ink-100 mb-2 group-hover:text-amber-300 transition-colors">
                  I&rsquo;m a founder &rarr;
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">
                  Browse the ranked priority problems. Pick the one that fits your
                  skills, time horizon, and conviction.
                </p>
              </Link>
              <Link
                href="/ecosystem"
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  if you allocate
                </p>
                <h3 className="font-serif text-xl text-ink-100 mb-2 group-hover:text-amber-300 transition-colors">
                  I deploy capital &rarr;
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">
                  See the full stack — grants, fellowships, FROs, studios, VCs —
                  working on each quest. Find counterparts and gaps.
                </p>
              </Link>
              <Link
                href="/voices"
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  if you research
                </p>
                <h3 className="font-serif text-xl text-ink-100 mb-2 group-hover:text-amber-300 transition-colors">
                  I want explanations &rarr;
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">
                  Read the position statements from the thinkers who argue each
                  problem is THE problem. Refute them in writing.
                </p>
              </Link>
              <a
                href="#join"
                className="group block bg-ink-900 hover:bg-ink-800/70 transition-colors p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  if you&rsquo;re curious
                </p>
                <h3 className="font-serif text-xl text-ink-100 mb-2 group-hover:text-amber-300 transition-colors">
                  Send me the memo &rarr;
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">
                  Weekly issue: one priority problem, what&rsquo;s being built, who&rsquo;s
                  funding it, what changed in the past week.
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* The third way: EA + e/acc synthesis */}
        <section className="border-t border-hair surface-paper">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-paper-copper mb-3">
              The third way
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-100 leading-tight mb-6">
              Between EA&rsquo;s safetyism and e/acc&rsquo;s cavalier speed.
            </h2>
            <p className="font-serif text-lg text-ink-200 leading-relaxed mb-4">
              There is a position Karl Popper and David Deutsch already named: critical
              rationalism. Problems are soluble. Safety is an engineering achievement of
              progress, not a brake on it. Every ranking here is a conjecture. Every
              conjecture is open to refutation.
            </p>
            <p className="font-serif text-lg text-ink-200 leading-relaxed">
              Trae Stephens closed his Founders Fund essay with one question: <em>are you
              on a good quest now?</em> This site is an attempt to answer that question with
              data.
            </p>

            <div className="mt-12">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-4">
                Shoulders we stand on
              </p>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                {shoulders.map((s) => (
                  <div key={s.name} className="flex flex-col">
                    <span className="font-sans text-sm font-medium text-ink-100">
                      {s.name}
                    </span>
                    <span className="font-mono text-[11px] text-ink-500">{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Closer */}
        <section className="border-t border-hair">
          <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] text-ink-500">
                v0.1 &middot; shipping ledger &middot; solo-built &middot; refined weekly
              </p>
              <p className="font-mono text-[11px] text-ink-500 mt-1">
                criticism welcome. that is the deutschian engine working.
              </p>
            </div>
            <Link
              href="/methodology"
              className="inline-flex items-center font-mono text-[11px] uppercase tracking-wider text-amber-300 hover:text-amber-200 border border-amber-300/30 px-4 py-2 hover:bg-amber-300/[0.05] transition-colors self-start md:self-auto"
            >
              methodology →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
