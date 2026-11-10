import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import { founders } from '@/data/founders'
import { formatUSD } from '@/lib/format'
import { founderRows, type SortMode } from '@/lib/contribution-sort'

export const metadata = {
  title: 'Billionaires & founders | optimism.fun',
  description:
    "Top of the Forbes 2026 billionaires list. Founders and heirs ranked by net worth.",
}

const totalNW = founders.reduce((a, f) => a + f.netWorth.value, 0)

function sortLink(active: boolean) {
  return `inline-flex items-center h-11 px-3 text-sm border ${
    active ? 'border-primary text-ink-100 bg-primary/10' : 'border-hair text-ink-300 hover:border-primary'
  }`
}

export default async function FoundersPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort } = await searchParams
  const mode: SortMode = sort === 'contribution' ? 'contribution' : 'size'
  const rows = founderRows(mode)
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · founders"
          title="Billionaires."
          lede="The top of the 2026 Forbes list. Individuals whose capital allocation most shapes the near-term direction of human progress. Ownership concentrates; so does responsibility."
          rightStats={[
            { label: 'ranked', value: founders.length, tone: 'amber' },
            { label: 'combined nw', value: formatUSD(totalNW), tone: 'amber' },
            {
              label: 'avg age',
              value: Math.round(
                founders.filter((f) => f.age).reduce((a, f) => a + (f.age ?? 0), 0) /
                  founders.filter((f) => f.age).length,
              ),
              tone: 'cyan',
            },
          ]}
        />

        <section className="px-6 py-10 max-w-7xl mx-auto min-w-0">
          <p className="text-sm text-ink-400 max-w-2xl mb-4">
            Net worth is the default. Contribution puts a person with a sourced bet on a ranked problem first, then the existing rank of that problem. A person with no sourced problem stays in list order, and the problem cell says not yet sourced. The number column stays the size rank. Problem rankings are unchanged.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Link href="/founders" className={sortLink(mode === 'size')}>
              Net worth
            </Link>
            <Link href="/founders?sort=contribution" className={sortLink(mode === 'contribution')}>
              Contribution to a problem
            </Link>
          </div>
          <div className="overflow-x-auto border border-hair min-w-0">
            <table className="min-w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-hair-strong bg-ink-800/40 text-left text-small uppercase text-ink-400">
                  <th className="px-3 py-2.5 font-medium w-10">#</th>
                  <th className="px-3 py-2.5 font-medium">name</th>
                  <th className="px-3 py-2.5 font-medium">source</th>
                  <th className="px-3 py-2.5 font-medium">country</th>
                  <th className="px-3 py-2.5 font-medium text-right">age</th>
                  <th className="px-3 py-2.5 font-medium text-right">net worth</th>
                  <th className="px-3 py-2.5 font-medium">problem</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ founder: f, contribution }) => (
                  <tr
                    key={f.name}
                    className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-ink-600 tabular-nums">
                      {f.rank.toString().padStart(2, '0')}
                    </td>
                    <td className="px-3 py-2.5 text-ink-100 font-sans text-sm">
                      {f.name}
                    </td>
                    <td className="px-3 py-2.5 text-ink-300">{f.source}</td>
                    <td className="px-3 py-2.5 text-ink-400">{f.country}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-400">
                      {f.age ?? '·'}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-primary">
                      {formatUSD(f.netWorth.value)}
                    </td>
                    <td className="px-3 py-2.5 text-ink-300 max-w-xs whitespace-normal break-words">
                      {contribution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-small text-ink-500">
            <span className="text-ink-600">source:</span>{' '}
            <a
              href="https://en.wikipedia.org/wiki/The_World%27s_Billionaires"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary underline decoration-dotted underline-offset-2"
            >
              Forbes 2026 list (via Wikipedia)
            </a>
            {' · '}
            <span className="text-ink-600">as of</span> {founders[0]?.asOf} ·
            <span className="text-ink-600"> top {founders.length} only for v0.1, more coming</span>
            {' · '}
            <Link
              href="/value#fortunes"
              className="text-terminal-green hover:underline underline-offset-2"
            >
              why these fortunes are so large →
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
