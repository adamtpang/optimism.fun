import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { founders } from '@/data/founders'
import { formatUSD } from '@/lib/format'

export const metadata = {
  title: 'Billionaires & founders | optimism.fun',
  description:
    "Top of the Forbes 2026 billionaires list. Founders and heirs ranked by net worth.",
}

const totalNW = founders.reduce((a, f) => a + f.netWorth.value, 0)

export default function FoundersPage() {
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

        <section className="px-6 py-10 max-w-7xl mx-auto">
          <div className="overflow-x-auto border border-hair">
            <table className="min-w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-hair-strong bg-ink-800/40 text-left text-[10px] uppercase tracking-ultra-wide text-ink-400">
                  <th className="px-3 py-2.5 font-medium w-10">#</th>
                  <th className="px-3 py-2.5 font-medium">name</th>
                  <th className="px-3 py-2.5 font-medium">source</th>
                  <th className="px-3 py-2.5 font-medium">country</th>
                  <th className="px-3 py-2.5 font-medium text-right">age</th>
                  <th className="px-3 py-2.5 font-medium text-right">net worth</th>
                </tr>
              </thead>
              <tbody>
                {founders.map((f) => (
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
                    <td className="px-3 py-2.5 text-right tabular-nums text-amber-300">
                      {formatUSD(f.netWorth.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-500">
            <span className="text-ink-600">source:</span>{' '}
            <a
              href="https://en.wikipedia.org/wiki/The_World%27s_Billionaires"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
            >
              Forbes 2026 list (via Wikipedia)
            </a>
            {' · '}
            <span className="text-ink-600">as of</span> {founders[0]?.asOf} ·
            <span className="text-ink-600"> top 10 only for v0.1, more coming</span>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
