import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProblemIndexTable from '@/components/ProblemIndexTable'
import { indexCategories, indexSummary, indexTableRows } from '@/lib/problem-index'
import { problems } from '@/data/problems'

export const metadata: Metadata = {
  title: 'Open problem index | optimism.fun',
  description: 'Sourced problems that are still unsolved, ranked by the gap between demand and supply. No market cap.',
  alternates: { canonical: '/problem-index' },
}

export const revalidate = 86400

export default function ProblemIndexPage() {
  const summary = indexSummary()
  const rows = indexTableRows()
  return (
    <>
      <Navbar />
      <main className="site-shell pt-28 pb-16">
        <p className="font-mono text-small uppercase text-primary mb-3">Open index</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink-100 leading-tight max-w-[18ch]">Problems that are still open.</h1>
        <p className="text-body text-neutral-700 mt-4 max-w-[68ch]">
          A sourced list of problems that are still unsolved. Rank is the gap between demand and supply, using the same percentile method as the curated board. A demand score is shown only when at least 3 demand inputs have a comparable number. Otherwise the cell says insufficient data. Size stays in its own unit. Nothing on this page is a market cap.
        </p>
        <p className="text-sm text-neutral-600 mt-3 max-w-[68ch]">
          {summary.problems} problems in this snapshot, retrieved {summary.retrievedOn}. {summary.ranked} have a gap score. {summary.openQuests} are open quests, which means the company search finished and found none. Rows overlap. Do not add deaths or people down the list. The curated {problems.length} stay on the home page, and this index does not change their ranks.
        </p>
        <p className="text-sm mt-3">
          <Link href="/" className="text-primary underline underline-offset-2">
            Curated problems
          </Link>
          {' · '}
          <Link href="/methodology" className="text-primary underline underline-offset-2">
            Curated ranking method
          </Link>
        </p>
        <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl">
          <div className="border border-neutral-200 bg-white p-3">
            <dt className="text-sm text-neutral-600">Problems</dt>
            <dd className="text-h3 tabular-nums text-ink-100">{summary.problems}</dd>
          </div>
          <div className="border border-neutral-200 bg-white p-3">
            <dt className="text-sm text-neutral-600">Gap scores</dt>
            <dd className="text-h3 tabular-nums text-ink-100">{summary.ranked}</dd>
          </div>
          <div className="border border-neutral-200 bg-white p-3 col-span-2 sm:col-span-1">
            <dt className="text-sm text-neutral-600">Open quests</dt>
            <dd className="text-h3 tabular-nums text-ink-100">{summary.openQuests}</dd>
          </div>
        </dl>
        <ProblemIndexTable rows={rows} categories={indexCategories()} />
        <section className="mt-10 max-w-[68ch]">
          <h2 className="text-h3 text-ink-100">How a row gets in</h2>
          <p className="text-sm text-neutral-700 mt-2">
            Each number was read from WHO, the UN SDG database, or the World Bank on {summary.retrievedOn}. A count is kept when it clears a stated floor: 1,000 deaths, 10,000 DALYs, 10,000 cases, or 100,000 people. A rate is kept when it is at least 1 per 100,000, 1 per 1,000, or a percent from 1 up to but not including 100. Some people-counts are a product of a published rate and world population. Those rows show the formula. Supply is an OpenAlex company search over the last 12 months, plus industry lead sponsors on active trials when the problem is clinical and the sponsor list fits in one page.
          </p>
          <ul className="mt-3 space-y-1">
            {summary.sources.map((source) => (
              <li key={source.url} className="text-sm">
                <a href={source.url} className="text-primary underline underline-offset-2 break-words" target="_blank" rel="noopener noreferrer">
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
