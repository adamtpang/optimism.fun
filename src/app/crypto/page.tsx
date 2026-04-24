import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { crypto } from '@/data/crypto'
import { formatUSD } from '@/lib/format'

export const metadata = {
  title: 'Crypto market caps | optimism.fun',
  description:
    'Top cryptocurrencies by market capitalization. Snapshot from CoinMarketCap.',
}

const totalMC = crypto.reduce((a, c) => a + c.marketCap.value, 0)

export default function CryptoPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · crypto"
          title="Crypto by market cap."
          lede="Digital-asset leaderboard. Bitcoin and stablecoins aside, crypto is humanity's largest ongoing experiment in coordination outside state money. The valuation tells you which experiments have network effects."
          rightStats={[
            { label: 'ranked', value: crypto.length, tone: 'amber' },
            { label: 'combined', value: formatUSD(totalMC), tone: 'violet' },
            {
              label: 'btc share',
              value: `${Math.round((crypto[0].marketCap.value / totalMC) * 100)}%`,
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
                  <th className="px-3 py-2.5 font-medium">name</th>
                  <th className="px-3 py-2.5 font-medium">symbol</th>
                  <th className="px-3 py-2.5 font-medium text-right">price</th>
                  <th className="px-3 py-2.5 font-medium text-right">market cap</th>
                  <th className="px-3 py-2.5 font-medium text-right">% of field</th>
                </tr>
              </thead>
              <tbody>
                {crypto.map((c) => (
                  <tr
                    key={c.symbol}
                    className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-ink-600 tabular-nums">
                      {c.rank.toString().padStart(2, '0')}
                    </td>
                    <td className="px-3 py-2.5 text-ink-100 font-sans text-sm">
                      {c.name}
                    </td>
                    <td className="px-3 py-2.5 text-terminal-violet">{c.symbol}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-300">
                      {c.price.value < 1
                        ? `$${c.price.value.toFixed(4)}`
                        : c.price.value < 100
                          ? `$${c.price.value.toFixed(2)}`
                          : `$${c.price.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                    </td>
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
              href="https://coinmarketcap.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
            >
              CoinMarketCap
            </a>
            {' · '}
            <span className="text-ink-600">as of</span> {crypto[0]?.asOf} ·
            <span className="text-ink-600"> prices move, snapshot is at ingest time</span>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
