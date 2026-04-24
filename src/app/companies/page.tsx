import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { publicCompanies } from '@/data/public-companies'
import { formatUSD } from '@/lib/format'

export const metadata = {
  title: 'Public companies by market cap | optimism.fun',
  description:
    'Top public companies by market capitalization, sourced from companiesmarketcap.com.',
}

const totalMC = publicCompanies.reduce((a, c) => a + c.marketCap.value, 0)

export default function CompaniesPage() {
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

        <section className="px-6 py-10 max-w-7xl mx-auto">
          <div className="overflow-x-auto border border-hair">
            <table className="min-w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-hair-strong bg-ink-800/40 text-left text-[10px] uppercase tracking-ultra-wide text-ink-400">
                  <th className="px-3 py-2.5 font-medium w-10">#</th>
                  <th className="px-3 py-2.5 font-medium">company</th>
                  <th className="px-3 py-2.5 font-medium">ticker</th>
                  <th className="px-3 py-2.5 font-medium">country</th>
                  <th className="px-3 py-2.5 font-medium text-right">market cap</th>
                  <th className="px-3 py-2.5 font-medium text-right">% of field</th>
                </tr>
              </thead>
              <tbody>
                {publicCompanies.map((c) => (
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
                    <td className="px-3 py-2.5 text-right tabular-nums text-amber-300">
                      {formatUSD(c.marketCap.value)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-400">
                      {((c.marketCap.value / totalMC) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-500">
            <span className="text-ink-600">source:</span>{' '}
            <a
              href="https://companiesmarketcap.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
            >
              companiesmarketcap.com
            </a>
            {' · '}
            <span className="text-ink-600">as of</span> {publicCompanies[0]?.asOf}
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
