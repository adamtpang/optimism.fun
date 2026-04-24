import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'About | optimism.fun',
  description:
    'Humanity\u2019s quest log. The applied, data-driven operationalization of Stephens & Wagner\u2019s "Choose Good Quests."',
}

export default function AboutPage() {
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
            <p className="text-terminal-green font-medium tracking-[0.2em] uppercase text-xs mb-3">
              The thesis
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.1] mb-8">
              All problems are explainable.
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                All solutions are creatable.
              </span>
            </h1>

            <div className="space-y-10 text-ink-300 leading-relaxed text-lg">
              <p>
                David Deutsch argued that problems are soluble. Every evil is a lack of
                knowledge, and every problem can be solved if we create the right knowledge.
                Trae Stephens argued that high-agency people have a moral obligation to take
                on good quests instead of defaulting to easy ones. He closed his Founders
                Fund essay with one question: <em>are you on a good quest now?</em>
              </p>
              <p>
                optimism.fun is an attempt to answer that question with data.
              </p>

              <div className="border-l-2 border-amber-300/40 pl-6 italic text-ink-400">
                A good quest makes the future better than our world today. A bad quest
                doesn&rsquo;t improve the world much at all, or makes it worse.
                <span className="block not-italic text-sm mt-2 text-ink-500">
                  Trae Stephens & Markie Wagner, Choose Good Quests (2023)
                </span>
              </div>

              <h2 className="font-serif text-2xl font-normal text-ink-100 pt-4">
                What this is
              </h2>
              <p>
                A ranked dashboard of humanity&rsquo;s most important problems, with the
                companies, founders, and capital that are working on each one mapped
                directly to the quest. Welfare, x-risk, and utility-delta scored separately
                so the disagreements stay visible.
              </p>
              <p>
                Targeted at two audiences: <span className="text-ink-100">capital
                allocators</span> deciding where dollars should move, and{' '}
                <span className="text-ink-100">entrepreneurs</span> deciding what to
                actually work on with the rest of their twenties, thirties, and forties.
              </p>

              <h2 className="font-serif text-2xl font-normal text-ink-100 pt-4">
                The third way
              </h2>
              <p>
                Between effective altruism&rsquo;s safetyism and effective accelerationism&rsquo;s
                cavalier speed is a position Karl Popper and David Deutsch already named:
                critical rationalism. Problems are soluble. Safety is an engineering
                achievement of progress, not a brake on it. Every ranking here is a
                conjecture. Every conjecture is open to refutation.
              </p>

              <h2 className="font-serif text-2xl font-normal text-ink-100 pt-4">
                What it is not
              </h2>
              <ul className="space-y-3 text-ink-400 text-base">
                <li>
                  <span className="text-ink-200">Not a startup idea browser.</span> This
                  is not a feed of reddit pain points to build SaaS for. The problems here
                  are mostly hard, mostly underfunded relative to their scale.
                </li>
                <li>
                  <span className="text-ink-200">Not a charity evaluator.</span>{' '}
                  GiveWell exists and is excellent. This is upstream of where they work.
                </li>
                <li>
                  <span className="text-ink-200">Not a job board.</span> Yet. The
                  &ldquo;common app for good quests&rdquo; is v1, not v0.
                </li>
                <li>
                  <span className="text-ink-200">Not for sale.</span> No company pays to
                  move up the rank. No advertising that looks like endorsement. The moment
                  that rule breaks, the dataset is worth nothing.
                </li>
              </ul>

              <h2 className="font-serif text-2xl font-normal text-ink-100 pt-4">
                Shoulders we are standing on
              </h2>
              <ul className="space-y-3 text-ink-400 text-base">
                <li>
                  <span className="text-ink-200">David Deutsch &amp; Karl Popper</span>:
                  critical rationalism, the soluble-problem thesis
                </li>
                <li>
                  <span className="text-ink-200">Trae Stephens &amp; Markie Wagner</span>:
                  the Choose Good Quests framing
                </li>
                <li>
                  <span className="text-ink-200">80,000 Hours</span>: the ITN framework for
                  importance, tractability, neglectedness
                </li>
                <li>
                  <span className="text-ink-200">Copenhagen Consensus Center</span>:
                  benefit-cost analysis for welfare interventions
                </li>
                <li>
                  <span className="text-ink-200">Jason Crawford &amp; Roots of Progress</span>:
                  the progress-studies canon
                </li>
                <li>
                  <span className="text-ink-200">Patrick Collison &amp; Tyler Cowen</span>:
                  the case for scientific productivity as meta-cause
                </li>
                <li>
                  <span className="text-ink-200">Conjecture Institute</span>: applying
                  critical rationalism to AI safety specifically
                </li>
                <li>
                  <span className="text-ink-200">The Rise Fund</span>: Impact Multiple of
                  Money methodology
                </li>
              </ul>

              <h2 className="font-serif text-2xl font-normal text-ink-100 pt-4">
                Status
              </h2>
              <p>
                Shipping ledger v0.1. 10 problems. ~50 companies. 15 capital allocators.
                Solo-built. Refined weekly. Criticism welcome. That is the Deutschian engine
                working.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
