import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LiveIndicators from '@/components/LiveIndicators'
import Link from 'next/link'
import { problems } from '@/data/problems'
import { deathRatePair } from '@/lib/citations'

export const metadata = {
  title: 'Methodology | optimism.fun',
  description:
    'How optimism.fun ranks humanity\u2019s problems. Three lenses, confidence tags, and the rules we refuse to break.',
}

export default function MethodologyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-300 transition-colors mb-8"
            >
              <span>←</span> back
            </Link>
            <p className="text-amber-300 font-medium tracking-[0.2em] uppercase text-xs mb-3">
              Methodology
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.1] mb-6">
              How we rank.
            </h1>
            <p className="text-lg text-ink-400 leading-relaxed mb-12">
              Every ranking is a conjecture open to refutation. The point is not to be right
              forever, it is to be wrong in public and correctable by evidence.
            </p>

            <div className="space-y-12 text-ink-300 leading-relaxed">
              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  Three lenses, not one composite
                </h2>
                <p className="mb-4">
                  A single score always hides trade-offs. We use three lenses from three
                  distinct traditions. Every problem gets scored on each lens where the data
                  supports it. Users pick which lens matters and sort by it.
                </p>
                <div className="space-y-4">
                  <div className="rounded border border-amber-500/20 bg-amber-500/[0.03] p-5">
                    <p className="text-amber-300 text-xs uppercase tracking-wider mb-2">
                      welfare lens
                    </p>
                    <h3 className="font-serif font-semibold mb-2 text-ink-100">
                      Copenhagen Consensus Benefit-Cost Ratio
                    </h3>
                    <p className="text-sm text-ink-400">
                      Dollars of social good per dollar of intervention. Developed by Nobel-
                      laureate economists at the Copenhagen Consensus Center. Favors
                      high-certainty, shovel-ready interventions like micronutrients and
                      disease control.
                    </p>
                  </div>
                  <div className="rounded border border-rose-500/20 bg-rose-500/[0.03] p-5">
                    <p className="text-terminal-rose text-xs uppercase tracking-wider mb-2">
                      x-risk lens
                    </p>
                    <h3 className="font-serif font-semibold mb-2 text-ink-100">
                      80,000 Hours ITN composite
                    </h3>
                    <p className="text-sm text-ink-400">
                      Importance × Tractability × Neglectedness. Developed at 80,000 Hours
                      for Effective Altruism cause prioritization. Favors problems where an
                      additional unit of effort has the highest marginal impact on avoiding
                      civilizational loss.
                    </p>
                  </div>
                  <div className="rounded border border-amber-300/20 bg-indigo-500/[0.03] p-5">
                    <p className="text-amber-200 text-xs uppercase tracking-wider mb-2">
                      utility delta lens
                    </p>
                    <h3 className="font-serif font-semibold mb-2 text-ink-100">
                      State-of-the-art vs physics-possible
                    </h3>
                    <p className="text-sm text-ink-400">
                      The ratio of current best solution to what physics and economics would
                      allow. Inspired by Musk&rsquo;s utility-delta framing. Favors hard tech
                      with massive unrealized gaps. Energy, construction, transportation, bio.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  Detecting demand: humanity&rsquo;s market research
                </h2>
                <p className="mb-4">
                  Demand for a problem&rsquo;s solution is what the world is{' '}
                  <em>already paying</em> &mdash; in suffering, money, capital, research, and
                  policy &mdash; to make it go away. The trap is mistaking{' '}
                  <span className="text-ink-100">attention</span> (hype, news spikes, search
                  volume) for demand. Attention is cheap and faddish; we treat it as a{' '}
                  <em>crowding</em> signal, not demand. So we detect demand by triangulating
                  revealed-preference signal classes, and never let one noisy number move the
                  ranking on its own.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="rounded border border-hair p-4">
                    <p className="text-amber-300 text-xs uppercase tracking-wider mb-1">
                      burden &middot; who, how badly
                    </p>
                    <p className="text-sm text-ink-400">
                      Affected population × per-capita severity. Live sources:{' '}
                      <span className="text-ink-200">
                        IHME Global Burden of Disease, WHO, World Bank, Our World in Data
                      </span>
                      .
                    </p>
                  </div>
                  <div className="rounded border border-hair p-4">
                    <p className="text-amber-300 text-xs uppercase tracking-wider mb-1">
                      willingness to pay &middot; revealed spend
                    </p>
                    <p className="text-sm text-ink-400">
                      The addressable market the world already pays into &mdash; household,
                      government, and enterprise spend. National accounts and sector TAM.
                    </p>
                  </div>
                  <div className="rounded border border-hair p-4">
                    <p className="text-amber-300 text-xs uppercase tracking-wider mb-1">
                      capital flux &middot; smart money + momentum
                    </p>
                    <p className="text-sm text-ink-400">
                      Estimated venture, grant, and R&amp;D dollars flowing at the problem, and
                      whether they&rsquo;re rising. Crunchbase / Dealroom, NIH RePORTER, NSF,
                      philanthropy.
                    </p>
                  </div>
                  <div className="rounded border border-hair p-4">
                    <p className="text-ink-300 text-xs uppercase tracking-wider mb-1">
                      research &amp; policy &middot; frontier and institutions{' '}
                      <span className="text-ink-600 normal-case">(feeds coming online)</span>
                    </p>
                    <p className="text-sm text-ink-400">
                      Publication and patent intensity (OpenAlex, NIH RePORTER, The Lens) and
                      institutional demand &mdash; legislation, procurement, prizes. Wired into
                      the model; awaiting their live feeds.
                    </p>
                  </div>
                  <div className="rounded border border-hair p-4">
                    <p className="text-amber-300 text-xs uppercase tracking-wider mb-1">
                      expert priors &middot; credible prioritizers
                    </p>
                    <p className="text-sm text-ink-400">
                      Convergence of institutions that rank problems with a transparent
                      methodology &mdash; 80,000 Hours, Open Philanthropy, GiveWell, Copenhagen
                      Consensus, YC RFS, Founders Fund. When several agree independently, that
                      is signal.
                    </p>
                  </div>
                </div>
                <p>
                  The composite weights revealed-preference classes above softer priors,
                  log-normalizes each against a named ceiling, and applies a{' '}
                  <span className="text-ink-100">corroboration gate</span>: a problem&rsquo;s
                  demand isn&rsquo;t trusted until at least two independent signal classes agree
                  &mdash; a lone signal is discounted. A class with no credible source yet is{' '}
                  dropped from the blend, never counted as a silent zero. The{' '}
                  <span className="text-amber-300">●</span> dots on the{' '}
                  <Link
                    href="/radar"
                    className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                  >
                    radar
                  </Link>{' '}
                  show how many classes corroborate each number. The most valuable problems are
                  where demand is high but attention and capital are{' '}
                  <em>low</em> &mdash; that gap is the founder&rsquo;s and the
                  allocator&rsquo;s edge.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  Time and capital are order-of-magnitude estimates
                </h2>
                <p className="mb-4">
                  Two questions a founder asks before anything else: how long will this
                  take, and how much capital will it consume? We surface both, with the
                  caveat that each is an order-of-magnitude estimate based on analogues,
                  not a forecast.
                </p>
                <p className="mb-4">
                  For <span className="text-ink-100">time-to-impact</span>, we pattern-match
                  against the closest historical arc — biotech base rates for longevity, IEA
                  Net-Zero envelopes for energy, Gavi/Global Fund scaling curves for
                  infectious disease. The number is years from <em>today</em> to
                  civilizational-scale impact, not first product.
                </p>
                <p>
                  For <span className="text-ink-100">capital required</span>, we sum the
                  R&amp;D, deployment, and supply-chain build-out across the arc. These are
                  always tagged <span className="text-terminal-rose">low</span> confidence
                  and will move with new data. The point is to give founders and allocators
                  a starting reference, not a closed answer.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  The homepage order
                </h2>
                <p className="mb-4">
                  The list on the homepage is one number, on purpose, so a visitor can see
                  what the index currently puts first. It is not a moral score. The other
                  lenses above still disagree with it, and that disagreement stays on the
                  problem pages.
                </p>
                <p className="mb-4">
                  <span className="text-ink-100">How many people,</span> on a log scale.
                  One person scores 0. All 8.2 billion score 1.
                </p>
                <p className="mb-4">
                  <span className="text-ink-100">How bad, per person,</span> from 0 to 1,
                  the same way for every problem. Where a source states an annual death
                  toll and how many people are affected, severity is the log of deaths
                  divided by people affected. One death per 10,000 affected people per year
                  scores 0. Certain death this year scores 1. A tenfold deadlier rate scores
                  a quarter of the scale higher, so a rare death and a common one are not
                  crushed together and not treated as the same. Where we cannot open both
                  numbers, severity is left empty and scores one half: missing data is not
                  a zero and not a free boost. Death counts are never stored in this field.
                  A pair whose years differ is still scored, and the mismatch is written
                  on the row. Two counts are not added when adding them would double-count
                  or mix a stock with a flow.
                </p>
                <p className="mb-4 text-ink-100">Sourced on the death-rate scale</p>
                <ul className="space-y-3 text-sm text-ink-400 mb-4">
                  {problems.filter((p) => deathRatePair(p)).map((p) => {
                    const pair = deathRatePair(p)!
                    return (
                      <li key={p.slug}>
                        <Link href={`/p/${p.slug}`} className="text-ink-200 underline decoration-dotted">
                          {p.name}
                        </Link>
                        {': '}
                        {p.severity!.value.toFixed(3)}
                        {'. '}
                        {pair.deaths.value.toLocaleString('en-US')} {pair.deaths.label}
                        {pair.deaths.year != null ? ` (${pair.deaths.year})` : ' (year not stated)'}
                        {' / '}
                        {pair.affected.value.toLocaleString('en-US')} {pair.affected.label}
                        {pair.affected.year != null ? ` (${pair.affected.year})` : ''}
                        {pair.yearMismatch ? `. Year mismatch: ${pair.yearMismatch}` : '. Same year.'}
                      </li>
                    )
                  })}
                </ul>
                <p className="mb-4 text-ink-100">Sourced as the share lost if the catastrophe occurs</p>
                <ul className="space-y-3 text-sm text-ink-400 mb-4">
                  {problems
                    .filter((p) => p.tier === 'x-risk' && p.severity && !deathRatePair(p))
                    .map((p) => (
                      <li key={p.slug}>
                        <Link href={`/p/${p.slug}`} className="text-ink-200 underline decoration-dotted">
                          {p.name}
                        </Link>
                        {': '}
                        {p.severity!.value.toFixed(3)}
                        {'. '}
                        {p.severityNote}
                      </li>
                    ))}
                </ul>
                <p className="mb-4 text-ink-100">Not scored</p>
                <ul className="space-y-3 text-sm text-ink-400 mb-4">
                  {problems
                    .filter((p) => !p.severity)
                    .map((p) => (
                      <li key={p.slug}>
                        <Link href={`/p/${p.slug}`} className="text-ink-200 underline decoration-dotted">
                          {p.name}
                        </Link>
                        {'. '}
                        {p.severityNote}
                      </li>
                    ))}
                </ul>
                <p className="mb-4">
                  <span className="text-ink-100">Scale</span> is how many times how bad.
                  A market, log-scaled up to $10 trillion, then pulls that between half and
                  full, so a problem nobody can pay for is halved rather than erased. An
                  unknown market stays at the middle.
                </p>
                <p className="mb-4">
                  <span className="text-ink-100">Neglectedness and tractability</span> are
                  the 1-to-10 judgments already written on every problem, divided by 10. The
                  product is scale × neglectedness × tractability. A large problem that is
                  ignored and still movable outranks a large problem that is crowded or
                  stuck. A missing judgment scores one half.
                </p>
                <p className="mb-4">
                  <span className="text-ink-100">Catastrophic risk</span> is scored on the
                  loss if it happens, not on deaths already recorded this year. When the
                  source&apos;s outcome is human extinction, that share is 1: everyone.
                  Expected value would multiply the stake by a probability. We multiply
                  only when a source states one number. A range with no midpoint, including
                  &quot;greater than 1 in 10,000, potentially 1 in 100&quot; for an
                  extinction-level pandemic, is printed on the row and is not averaged.
                  Averaging it would invent a figure. Tagged companies are not treated as
                  proof the tail is handled. For an x-risk, the supply of effort is read
                  from the neglectedness judgment.
                </p>
                <p className="mb-4">
                  <span className="text-ink-100">Supply</span> is half the quality of
                  today&apos;s solutions (0 to 1; low means a wide gap) and half who is
                  already on it. Companies and funders tagged in this repo count on a log
                  scale. Zero of each is missing data, not an empty field. In that case the
                  headcount half uses neglectedness: a cause judged 8 out of 10 neglected is
                  treated as thinly supplied, and a cause judged 2 out of 10 is treated as
                  crowded even if we forgot to tag anyone. Solution quality outside 0 to 1
                  is rejected. A 7-out-of-10 judgment is stored as 0.7.
                </p>
                <p>
                  <span className="text-ink-100">Opportunity</span> multiplies that product
                  by how thin the supply is, then nudges it with urgency (worsening, flat,
                  or improving, blended with the solution gap). The result is 0 to 100. It
                  sits lower than the old score because more fractions are multiplied. Read
                  the rank first. When a problem has no tags, neglectedness is used twice,
                  once in the product and once as the supply assumption. That is one
                  judgment standing in for a missing count, not two measurements.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  Every number carries a confidence tag
                </h2>
                <p className="mb-4">
                  If we don&rsquo;t know, we say so. Every numeric cell is tagged{' '}
                  <span className="text-terminal-green">high</span>,{' '}
                  <span className="text-amber-300">med</span>, or{' '}
                  <span className="text-terminal-rose">low</span> with a source and an as-of date.
                  Unknown values are written as &ldquo;unknown&rdquo; and tagged low. No silent
                  guessing.
                </p>
                <p>
                  This is the single rule that makes a reference asset trustworthy over
                  decades. CoinMarketCap became the reference because it was transparent
                  about methodology and did not sell rank placement. We are holding the same
                  line.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  Live data, refreshed daily
                </h2>
                <p className="mb-5">
                  Some scale numbers are not static seeds. A daily cron pulls them straight from
                  the World Bank&rsquo;s World Development Indicators, writes the full series to our
                  database, and stamps each with the source&rsquo;s own last-published date. The
                  values below are read live from that table. This is the first of many feeds.
                </p>
                <LiveIndicators />
              </section>

              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  Five tiers, for navigation not hierarchy
                </h2>
                <ul className="space-y-2 text-sm text-ink-400">
                  <li>
                    <span className="text-amber-300">welfare floor</span>: Copenhagen
                    Consensus baseline. High-certainty, high-BCR interventions.
                  </li>
                  <li>
                    <span className="text-terminal-rose">x-risk frontier</span>: 80,000 Hours
                    top-priority areas. AI, bio, nuclear, catastrophic risk.
                  </li>
                  <li>
                    <span className="text-amber-200">hard tech</span>: Stephens&rsquo;
                    &ldquo;good quests&rdquo; from Founders Fund. Energy, construction, space,
                    bio-manufacturing.
                  </li>
                  <li>
                    <span className="text-terminal-green">progress &amp; abundance</span>: Roots
                    of Progress / Collison / Cowen canon. The meta-quests that compound.
                  </li>
                  <li>
                    <span className="text-terminal-violet">emerging</span>: massive problems
                    under-indexed by EA and e/acc. Fertility, loneliness, epistemics.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  What we refuse to do
                </h2>
                <ul className="space-y-3 text-ink-400">
                  <li>
                    <span className="text-ink-200">Never sell ranking placement.</span>{' '}
                    No company pays to move up. No advertising that looks like endorsement.
                    The moment this rule breaks, the dataset is worth nothing.
                  </li>
                  <li>
                    <span className="text-ink-200">Never silently guess a number.</span>{' '}
                    If we don&rsquo;t have a source, the cell is &ldquo;unknown&rdquo; and tagged low until
                    we do.
                  </li>
                  <li>
                    <span className="text-ink-200">
                      Never collapse to a single moral score.
                    </span>{' '}
                    Welfare, x-risk, and utility delta disagree. That disagreement is
                    information, not noise.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  Shoulders we stand on
                </h2>
                <p className="mb-4">
                  optimism.fun is downstream of three open inspirations. Each one supplies
                  a piece of the rubric we use to rank.
                </p>
                <ul className="space-y-3 text-sm text-ink-400">
                  <li>
                    <a
                      href="https://traestephens.substack.com/p/choose-good-quests"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      Trae Stephens &amp; Markie Wagner &middot; &ldquo;Choose Good Quests&rdquo;
                    </a>{' '}
                    &mdash; the good&times;hard quest grid: a good quest makes the future
                    better, a bad one doesn&rsquo;t. Our best people owe the world a hard one.
                    Gamified on{' '}
                    <Link href="/good-quests" className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2">
                      /good-quests
                    </Link>
                    .
                  </li>
                  <li>
                    <a
                      href="https://patrickcollison.com/progress"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      Patrick Collison &middot; Progress Studies
                    </a>{' '}
                    &mdash; the case that progress is a study, not a vibe. Cowen &amp;
                    Collison&rsquo;s 2019 essay set the field. The dense linkroll on that
                    page is the spirit we want for our /voices and /progress.
                  </li>
                  <li>
                    <a
                      href="https://www.ycombinator.com/rfs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      Y Combinator &middot; Requests for Startups
                    </a>{' '}
                    &mdash; the format for turning a problem into a concrete buildable
                    company. Our per-problem whitepapers follow the RFS voice: lead with the
                    pain, name the unlock, describe the shape.
                  </li>
                  <li>
                    <a
                      href="https://80000hours.org/problem-profiles/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      80,000 Hours &middot; problem profiles
                    </a>{' '}
                    &mdash; the ITN composite (importance &times; tractability &times;
                    neglectedness) we use as the x-risk lens.
                  </li>
                  <li>
                    <a
                      href="https://copenhagenconsensus.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      Copenhagen Consensus
                    </a>{' '}
                    &mdash; benefit-cost ratios for the welfare lens. Lomborg&rsquo;s
                    Nobel-laureate panel methodology.
                  </li>
                  <li>
                    <a
                      href="https://ourworldindata.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      Our World in Data
                    </a>{' '}
                    &mdash; the gold standard for &ldquo;every number sourced.&rdquo; Many of
                    our progress receipts trace back here.
                  </li>
                  <li>
                    <a
                      href="https://rootsofprogress.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      Roots of Progress
                    </a>{' '}
                    &mdash; Jason Crawford&rsquo;s case that progress is the moral imperative
                    of our era. Anchors the &ldquo;progress &amp; abundance&rdquo; tier.
                  </li>
                  <li>
                    <a
                      href="https://worksinprogress.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      Works in Progress
                    </a>{' '}
                    &mdash; the magazine of the progress-studies movement. Where many of the
                    arguments behind the rankings get sharpened.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-normal mb-4 text-ink-100">
                  Phase 0 status
                </h2>
                <p className="mb-3">
                  This is v0.1. 10 problems, ~50 companies, 15 ecosystem entities. Shipped in
                  days, not months. Every cell is hand-curated and honestly tagged. Many
                  cells are &ldquo;med&rdquo; or &ldquo;low&rdquo; confidence. Expected at this
                  stage.
                </p>
                <p>
                  The public ledger gets refined weekly. Criticism is the point. If you see a
                  number that is wrong, we want to know.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
