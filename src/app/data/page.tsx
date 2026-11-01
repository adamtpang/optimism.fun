import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { DATA_LICENSE } from '@/lib/open-data'

export const metadata: Metadata = {
  title: 'Open data | optimism.fun',
  description: 'Download the problems, the time series, the discoveries, and the calls to action. Code is MIT. Data is CC BY 4.0.',
}

const SETS = [
  {
    name: 'Problems',
    note: 'Rank, people affected, headline measure, neglectedness, tractability, and the citation on each.',
    json: '/api/problems',
    csv: '/api/problems/csv',
  },
  {
    name: 'Time series',
    note: 'Only the year-by-year points already stored on a problem. No filled-in years.',
    json: '/api/series',
    csv: '/api/series/csv',
  },
  {
    name: 'Discoveries',
    note: 'Verified findings, with the paper link and the problem they are tagged to.',
    json: '/api/discoveries',
    csv: '/api/discoveries/csv',
  },
  {
    name: 'Calls to action',
    note: 'Build, fund, buy, and learn. Amounts appear only when a source URL was recorded.',
    json: '/api/ctas',
    csv: '/api/ctas/csv',
  },
]

export default function DataPage() {
  return (
    <>
      <Navbar />
      <main className="site-shell pt-28 pb-16">
        <p className="font-mono text-small uppercase text-primary mb-3">Open data</p>
        <h1 className="font-serif text-4xl md:text-6xl text-ink-100 leading-[1.05]">Download the data.</h1>
        <p className="text-ink-400 mt-4 text-lg">
          Code is MIT. This compilation is {DATA_LICENSE.name}. Cite optimism.fun and the source on each row.
        </p>
        <p className="text-sm mt-3">
          <a href={DATA_LICENSE.url} className="text-primary underline decoration-dotted" target="_blank" rel="noopener noreferrer">
            {DATA_LICENSE.id}
          </a>
          {' · '}
          <Link href="/poster" className="text-primary underline decoration-dotted">
            Poster
          </Link>
        </p>

        <ul className="mt-10 border-t border-hair">
          {SETS.map((set) => (
            <li key={set.name} className="py-5 border-b border-hair">
              <h2 className="font-serif text-2xl text-ink-100">{set.name}</h2>
              <p className="text-sm text-ink-400 mt-1">{set.note}</p>
              <p className="font-mono text-sm mt-3">
                <a href={set.json} className="text-primary hover:underline">JSON</a>
                {' · '}
                <a href={set.csv} className="text-primary hover:underline">CSV</a>
              </p>
            </li>
          ))}
        </ul>

        <p className="text-sm text-ink-400 mt-8 leading-relaxed">
          One problem is also at <span className="font-mono text-ink-300">/api/problems/&lt;slug&gt;</span> and the same path plus{' '}
          <span className="font-mono text-ink-300">/csv</span>. Add a row by pull request. The guide is{' '}
          <span className="font-mono text-ink-300">research/CTAS.md</span> and{' '}
          <span className="font-mono text-ink-300">research/DISCOVERIES.md</span>. A human reviews it before it merges.
        </p>
      </main>
      <Footer />
    </>
  )
}
