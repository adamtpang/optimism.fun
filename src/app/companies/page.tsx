import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import { publicCompanies } from '@/data/public-companies'
import { formatUSD } from '@/lib/format'
import { companyRows, type SortMode } from '@/lib/contribution-sort'

export const metadata = {
  title: 'Public companies by market cap | optimism.fun',
  description:
    'Top public companies by market capitalization, sourced from companiesmarketcap.com.',
}

const totalMC = publicCompanies.reduce((a, c) => a + c.marketCap.value, 0)

function sortLink(active: boolean) {
  return `inline-flex items-center h-11 px-3 text-sm border ${
    active ? 'border-primary text-ink-100 bg-primary/10' : 'border-hair text-ink-300 hover:border-primary'
  }`
}

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort } = await searchParams
  const mode: SortMode = sort === 'contribution' ? 'contribution' : 'size'
  const rows = companyRows(mode)
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · companies"
          title="Public companies by market cap."
          lede="The top listed companies globally. Every market cap is a revealed bet that this company is solving a problem at scale. Who solves what is the next question; that's on the problem pages."
          rightStats={[
            { label: 'ranked', value: publicCompanies.length, tone: 'amber' },
            { label: 'combined', value: formatUSD(totalMC), tone: 'cyan' },
            {
              label: 'top 10',
              value: formatUSD(
                publicCompanies
                  .slice(0, 10)
                  .reduce((a, c) => a + c.marketCap.value, 0),
              ),
              tone: 'amber',
            },
          ]}
        />

        <section className="px-6 py-10 max-w-7xl mx-auto min-w-0">
          <p className="text-sm text-ink-400 max-w-2xl mb-4">
            Market cap is the default. Contribution puts a company whose name matches a sourced organization, or a company already tagged to a ranked problem, first. The existing problem rank breaks ties. A company with no sourced problem says not yet sourced and keeps its market-cap place behind the matched names. The number column stays the size rank. Problem rankings are unchanged.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Link href="/companies" className={sortLink(mode === 'size')}>
              Market cap
            </Link>
            <Link href="/companies?sort=contribution" className={sortLink(mode === 'contribution')}>
              Contribution to a problem
            </Link>
          </div>
          <div className="overflow-x-auto border border-hair min-w-0">
            <table className="min-w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-hair-strong bg-ink-800/40 text-left text-small uppercase text-ink-400">
                  <th className="px-3 py-2.5 font-medium w-10">#</th>
                  <th className="px-3 py-2.5 font-medium">company</th>
                  <th className="px-3 py-2.5 font-medium">ticker</th>
                  <th className="px-3 py-2.5 font-medium">country</th>
                  <th className="px-3 py-2.5 font-medium text-right">market cap</th>
                  <th className="px-3 py-2.5 font-medium text-right">% of field</th>
                  <th className="px-3 py-2.5 font-medium">problem</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ company: c, contribution }) => (
                  <tr
                    key={c.ticker}
                    className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-ink-600 tabular-nums">
                      {c.rank.toString().padStart(2, '0')}
                    </td>
                    <td className="px-3 py-2.5 text-ink-100 font-sans text-sm">
                      {c.name}
                    </td>
                    <td className="px-3 py-2.5 text-terminal-cyan">{c.ticker}</td>
                    <td className="px-3 py-2.5 text-ink-400">{c.country}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-primary">
                      {formatUSD(c.marketCap.value)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-400">
                      {((c.marketCap.value / totalMC) * 100).toFixed(2)}%
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
              href="https://companiesmarketcap.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary underline decoration-dotted underline-offset-2"
            >
              companiesmarketcap.com
            </a>
            {' · '}
            <span className="text-ink-600">as of</span> {publicCompanies[0]?.asOf}
            {' · '}
            <Link
              href="/value#companies"
              className="text-terminal-green hover:underline underline-offset-2"
            >
              why these companies are valuable →
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
