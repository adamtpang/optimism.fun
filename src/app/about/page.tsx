import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About | optimism.fun',
  description:
    'What optimism.fun is, who is behind it, how its rankings work, and where its evidence comes from.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-hair pt-28 pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
              About the project
            </div>
            <h1 className="font-serif text-4xl text-ink-100 md:text-6xl">Humanity&rsquo;s quest log.</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-ink-300">
              optimism.fun is an open-source research and navigation project that ranks major
              unsolved problems, then connects each problem to evidence, organizations, founders,
              capital, and measurable progress. Its purpose is to help builders and allocators
              compare important work without pretending that one score replaces judgment.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-4xl gap-10 px-6 py-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl text-ink-100">Who is behind it</h2>
            <p className="mt-4 leading-7 text-ink-300">
              The site identifies Adam Pangelinan as its builder and includes Anchor Marianas LLC
              in its sitewide operator credits. The project&rsquo;s source, issue history, and data
              files are publicly inspectable in the optimism.fun GitHub repository, so factual
              corrections can be proposed against the same material that produces the site.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider">
              <a className="border border-hair px-3 py-2 text-amber-300 hover:border-amber-300" href="https://adampang.com">
                Adam Pangelinan
              </a>
              <a className="border border-hair px-3 py-2 text-ink-300 hover:border-ink-400" href="https://anchormarianas.com">
                Anchor Marianas LLC
              </a>
              <a className="border border-hair px-3 py-2 text-ink-300 hover:border-ink-400" href="https://github.com/adamtpang/optimism.fun">
                Source on GitHub
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink-100">How the ranking works</h2>
            <p className="mt-4 leading-7 text-ink-300">
              The ranking combines several explicit lenses, including people affected, welfare
              benefit-cost evidence, existential-risk importance, utility gains, urgency, and
              observed supply. Every number is intended to remain traceable to a source or marked
              estimate; the methodology page explains normalization, confidence, and known gaps.
            </p>
            <Link className="mt-5 inline-block font-mono text-[11px] uppercase tracking-wider text-amber-300 hover:underline" href="/methodology">
              Read the methodology &rarr;
            </Link>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink-100">Evidence and limits</h2>
            <p className="mt-4 leading-7 text-ink-300">
              The repository draws on public and cited material from organizations such as the
              World Bank, WHO, Our World in Data, SEC EDGAR, OpenAlex, USAspending, and the Federal
              Register, alongside project-maintained research files. Coverage and freshness vary,
              and a ranking is a decision aid rather than investment, legal, or medical advice.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink-100">What the site offers</h2>
            <p className="mt-4 leading-7 text-ink-300">
              Visitors can browse the published research, filter interactive rankings, subscribe
              for project updates, send feedback, and use an optional founder-fit interview. The
              site does not advertise a supported public API or MCP contract; automated readers
              should use the substantive pages and the project&rsquo;s llms.txt guidance instead.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
