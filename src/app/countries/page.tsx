import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { countries } from '@/data/countries'
import { formatUSD } from '@/lib/format'

export const metadata = {
  title: 'Countries by GDP | optimism.fun',
  description:
    'Countries ranked by nominal GDP (current USD), 2024. World Bank NY.GDP.MKTP.CD.',
}

const totalGDP = countries.reduce((a, c) => a + c.gdp.value, 0)
const topTen = countries.slice(0, 10).reduce((a, c) => a + c.gdp.value, 0)

export default function CountriesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · countries"
          title="Countries by GDP."
          lede="The economic weight map. Nominal current-USD GDP from the World Bank, 2024. Every country's GDP is the denominator in Musk's utility-delta: if a solution doesn't scale across GDP, it doesn't scale across people."
          rightStats={[
            { label: 'ranked', value: countries.length, tone: 'amber' },
            { label: 'combined', value: formatUSD(totalGDP), tone: 'green' },
            {
              label: 'top 10 share',
              value: `${Math.round((topTen / totalGDP) * 100)}%`,
              tone: 'cyan',
            },
          ]}
        />

        <section className="px-6 py-10 max-w-7xl mx-auto">
          <div className="overflow-x-auto border border-hair">
            <table className="min-w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-hair-strong bg-ink-800/40 text-left text-[10px] uppercase tracking-ultra-wide text-ink-400">
                  <th className="px-3 py-2.5 font-medium w-10">#</th>
                  <th className="px-3 py-2.5 font-medium">country</th>
                  <th className="px-3 py-2.5 font-medium">iso</th>
                  <th className="px-3 py-2.5 font-medium text-right">gdp (usd, 2024)</th>
                  <th className="px-3 py-2.5 font-medium text-right">% of world</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c) => (
                  <tr
                    key={c.iso3}
                    className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-ink-600 tabular-nums">
                      {c.rank.toString().padStart(2, '0')}
                    </td>
                    <td className="px-3 py-2.5 text-ink-100 font-sans text-sm">
                      {c.name}
                    </td>
                    <td className="px-3 py-2.5 text-ink-500">{c.iso3}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-amber-300">
                      {formatUSD(c.gdp.value)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-400">
                      {((c.gdp.value / totalGDP) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-500">
            <span className="text-ink-600">source:</span>{' '}
            <a
              href="https://data.worldbank.org/indicator/NY.GDP.MKTP.CD"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
            >
              World Bank · GDP, current US$ (NY.GDP.MKTP.CD)
            </a>
            {' · '}
            <span className="text-ink-600">as of</span> {countries[0]?.gdp.asOf}
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
