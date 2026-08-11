import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import HeroFigure from '@/components/HeroFigure'
import { computeSignals } from '@/lib/signals/compute'
import { CATEGORY_VERIFIED_ASOF } from '@/lib/signals/categories'

export const metadata = {
  title: 'Market signals | optimism.fun',
  description:
    'The Bezos move, generalized: he found Amazon in a report showing internet usage growing 2,300%/year, not a trend piece. Real category-level growth curves, not attention.',
}

export const revalidate = 86400

function fmtPct(n: number) {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(0)}%`
}

export default async function SignalsPage() {
  const signals = await computeSignals()
  const top = signals[0]

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · market signals"
          title="Find the report before it's obvious."
          lede="Bezos didn't find Amazon by reading trend pieces about e-commerce. He found one number: internet usage growing 2,300% a year. This page is that move, generalized — real category-level adoption and production curves, not mention counts. /trends already covers attention (what's being talked about) and explicitly treats that as crowding, not demand. This is the other side: what the world is actually using, building, or spending on."
          rightStats={[
            { label: 'tracked', value: signals.length, tone: 'amber' },
            {
              label: 'fastest, per year',
              value: top ? `${fmtPct(top.cagrPct)}/yr` : '—',
              tone: 'cyan',
            },
          ]}
        />

        {top && (
          <section className="border-b border-hair bg-ink-900/30">
            <div className="max-w-4xl mx-auto px-6 py-10">
              <HeroFigure
                value={`${fmtPct(top.cagrPct)}/yr`}
                label={`${top.category.name} — annualized, ${top.baseline.year} to ${top.latest.year}`}
                caption={`${top.baseline.value.toFixed(1)}${top.category.unit.startsWith('%') ? '%' : ''} → ${top.latest.value.toFixed(1)}${top.category.unit.startsWith('%') ? '%' : ''} over ${top.years} years (${fmtPct(top.totalGrowthPct)} total). ${top.category.note}`}
              />
            </div>
          </section>
        )}

        <section className="px-6 py-10 max-w-7xl mx-auto">
          <div className="overflow-x-auto border border-hair">
            <table className="min-w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-hair-strong bg-ink-800/40 text-left text-[10px] uppercase tracking-ultra-wide text-ink-400">
                  <th className="px-3 py-2.5 font-medium w-10">#</th>
                  <th className="px-3 py-2.5 font-medium">category</th>
                  <th className="px-3 py-2.5 font-medium text-right">baseline</th>
                  <th className="px-3 py-2.5 font-medium text-right">latest</th>
                  <th className="px-3 py-2.5 font-medium text-right">window</th>
                  <th className="px-3 py-2.5 font-medium text-right">total growth</th>
                  <th className="px-3 py-2.5 font-medium text-right">per year</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((s, i) => (
                  <tr
                    key={s.category.slug}
                    className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors align-top"
                  >
                    <td className="px-3 py-2.5 text-ink-600 tabular-nums">
                      {(i + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-ink-100 font-sans text-sm block">{s.category.name}</span>
                      <span className="text-ink-500 text-[10px] leading-relaxed block max-w-md mt-0.5">
                        {s.category.note}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-400">
                      {s.baseline.value.toFixed(1)}
                      <span className="text-ink-600"> ({s.baseline.year})</span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-100">
                      {s.latest.value.toFixed(1)}
                      <span className="text-ink-600"> ({s.latest.year})</span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-600">
                      {s.years}y
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-500">
                      {fmtPct(s.totalGrowthPct)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right tabular-nums font-medium ${
                        s.cagrPct >= 0 ? 'text-amber-300' : 'text-terminal-rose'
                      }`}
                    >
                      {fmtPct(s.cagrPct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-500">
            <span className="text-ink-600">source:</span>{' '}
            <a
              href="https://data.worldbank.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
            >
              World Bank Open Data
            </a>
            {' · '}
            <span className="text-ink-600">indicators verified live</span> {CATEGORY_VERIFIED_ASOF}
          </p>
        </section>

        <section className="border-t border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              How this is built, and what&apos;s next
            </p>
            <div className="space-y-4 font-mono text-[11px] leading-relaxed text-ink-400 max-w-3xl">
              <p>
                <span className="text-ink-100">Usage, not attention.</span> Every series here is
                World Bank Open Data — real adoption, production, or spend, worldwide, keyless and
                free. Nothing here is a mention count, a search-interest score, or a headline
                tally.
              </p>
              <p>
                <span className="text-ink-100">Ranked by annualized growth, not total growth.</span>{' '}
                Each indicator has its own history and reporting lag — mobile and renewable-energy
                data go back to 1996, internet and broadband only to 2005, high-tech exports only
                to 2007 — so a raw baseline-to-latest percentage isn&apos;t comparable across rows: a
                29-year window will out-accumulate a 17-year one regardless of which is actually
                compounding faster. Total growth is still shown for context; the ranking uses CAGR
                (the standard fix for comparing unequal windows).
              </p>
              <p>
                <span className="text-ink-100">Six categories today. More need a free key.</span>{' '}
                FRED (840,000+ US economic series — GDP by industry, consumer spend by category)
                and UN Comtrade (import/export volume by product) would add real firepower, but
                both now require a free API key — a 2-minute signup, same pattern as this
                project&apos;s other credentials. Neither is wired up yet.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/movers"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                Company-level growth →
              </Link>
              <Link
                href="/trends"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                Attention, tracked separately →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
