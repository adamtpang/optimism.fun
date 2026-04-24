import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

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
        <section className="pt-28 pb-20 px-6">
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
                  Severity is willingness to pay over wealth
                </h2>
                <p>
                  The severity of a problem to a person is what they would pay for a solution
                  divided by what they have. Someone with $100 facing a $100-severity problem
                  would spend the whole $100 to solve it. We proxy this from market data
                  where possible, health-economics studies where not.
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
