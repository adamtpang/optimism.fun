import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'
import Broll from '@/components/media/Broll'
import FigureCard from '@/components/FigureCard'
import ClassActionBar from '@/components/ClassActionBar'
import { featuredFigure } from '@/data/featured-figure'
import { commitHref } from '@/lib/visitor-classes'
import RankedProblems from '@/components/RankedProblems'
import SupplyDemandTable from '@/components/SupplyDemandTable'
import { balanceRows } from '@/lib/sourced-balance'
import { problems } from '@/data/problems'
import { discoveryCountByProblem } from '@/data/discoveries'
import { computeRadarRows } from '@/lib/radar'
import { displayDeaths } from '@/lib/burden'
import { decadeBarPercent } from '@/lib/charts'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export const revalidate = 300

export default function Home() {
  const rows = computeRadarRows().sort((a, b) => b.opportunity - a.opportunity)
  const supplyRows = balanceRows()
  const bySlug = new Map(problems.map((p) => [p.slug, p]))
  const discoveryCounts = discoveryCountByProblem()
  const updated = [...problems.map((p) => p.lastUpdated ?? p.asOf)].sort().at(-1)

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-24 md:pt-28 pb-10 md:pb-14">
          <Container>
            <h1 className="text-h2 md:text-h1 text-ink-100 max-w-[26ch]">
              Humanity&rsquo;s hardest problems, and what you can do about each one.
            </h1>
            <p className="text-body text-ink-300 mt-3 max-w-[60ch]">
              {problems.length} problems, ranked. Every number has a source. Whether you bring money, work or
              scrutiny, each one ends with something to do.
            </p>

            <div className="mt-8">
              <FigureCard figure={featuredFigure}>
                <ClassActionBar
                  hrefs={{
                    patron: commitHref(featuredFigure.problemSlug, 'patron'),
                    founder: commitHref(featuredFigure.problemSlug, 'founder'),
                    researcher: commitHref(featuredFigure.problemSlug, 'researcher'),
                  }}
                />
              </FigureCard>
            </div>

            <p className="text-small mt-5 flex flex-wrap gap-x-5 gap-y-1">
              <Link href="#problems" className="inline-flex items-center min-h-11 text-primary underline">
                See all {problems.length} problems
              </Link>
              <Link href="/quests" className="inline-flex items-center min-h-11 text-primary underline">
                Find the quest that fits you
              </Link>
              <Link href="/data" className="inline-flex items-center min-h-11 text-primary underline">
                Download the data
              </Link>
            </p>
          </Container>
        </section>

        <Section id="problems" className="scroll-mt-20">
          <Container>
            <p className="font-figure text-small text-ink-500">
              Table 01 &middot; {problems.length} problems{updated ? ` · reviewed through ${updated}` : ''}
            </p>
            <h2 className="text-h2 md:text-h1 text-ink-100 mt-2 max-w-[28ch]">
              Every problem, ranked by how underserved it is
            </h2>

            <RankedProblems
              rows={rows.map((r) => {
                const p = bySlug.get(r.slug)
                const people = p?.humansAffected?.value ?? null
                return {
                  slug: r.slug,
                  name: r.name,
                  people,
                  unit: p?.humansAffected?.unit ?? null,
                  deaths: displayDeaths(r.slug),
                  discoveries: discoveryCounts.get(r.slug) ?? 0,
                  width: people ? decadeBarPercent(people) : 0,
                  score: p?.neglectedness?.score ?? null,
                }
              })}
            />

            <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3 text-small text-neutral-600">
              <p className="max-w-[68ch]">
                Each count is the humans-affected figure on that problem, with its own source and unit. Neglectedness is the stored 0 to 10 score.
                {updated ? ` Figures reviewed through ${updated}.` : ''}{' '}
                <Link href="/methodology" className="text-primary underline underline-offset-2">
                  How
                </Link>
                {' · '}
                <Link href="/data" className="text-primary underline underline-offset-2">
                  Download the data
                </Link>
              </p>
              <p>CC BY 4.0</p>
            </div>
          </Container>
        </Section>

        <Section id="supply-demand" className="scroll-mt-20 pt-0">
          <Container>
            <p className="text-label text-primary">Supply and demand</p>
            <h2 className="text-h1 text-ink-100 mt-2 max-w-[28ch]">Numbers next to the rank.</h2>
            <p className="text-body text-neutral-600 mt-3 max-w-[68ch]">
              Priority rank stays the site ranking. Demand, supply, and gap are a separate score. A demand score is shown only when at least 3 demand inputs have a comparable number. Otherwise the cell says not enough data. Burden enters the score only as deaths or DALYs. Supply uses counted companies, trial sponsors, paper affiliations, founders, funders, and capital when that figure is stored. A stored zero counts. A missing input stays not yet sourced. An open quest marker means no sourced company, and the placeholder is not counted.
            </p>
            <p className="text-small text-neutral-600 mt-2">
              <Link href="/methodology" className="text-primary underline underline-offset-2">
                Formula and every input
              </Link>
            </p>
            <SupplyDemandTable rows={supplyRows} />
          </Container>
        </Section>

        <Broll />
      </main>
      <Footer />
    </>
  )
}
