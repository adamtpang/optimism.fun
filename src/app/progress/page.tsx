import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import { progress } from '@/data/progress'
import { formatUSD } from '@/lib/format'

export const metadata = {
  title: 'Progress | optimism.fun',
  description:
    "The history of human problem-solving. Long-run series on the metrics that matter, sourced from Our World in Data, World Bank, UN, and ITU.",
}

function formatVal(value: number, format: string) {
  switch (format) {
    case 'percent':
      return `${(value * 100).toFixed(1)}%`
    case 'years':
      return `${value.toFixed(0)} yrs`
    case 'usd':
      return formatUSD(value)
    default:
      return value.toLocaleString()
  }
}

function delta(b: number, l: number, dir: 'up' | 'down') {
  const factor = l / b
  if (factor >= 2) return `${factor.toFixed(1)}× ${dir === 'up' ? 'higher' : 'lower'}`
  if (factor <= 0.5) return `${(b / l).toFixed(1)}× lower`
  const pct = ((l - b) / b) * 100
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`
}

export default function ProgressPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · progress"
          title="The history of human problem-solving."
          lede="For most of history, humanity barely moved on any axis that mattered. Then, around 1820, the Industrial Revolution kicked off compounding gains in nearly every welfare measure. The numbers below document what humans have actually solved, and the slope we&rsquo;re still on. Sources: Our World in Data, World Bank, UN, ITU, Maddison Project."
          rightStats={[
            { label: 'milestones', value: progress.length, tone: 'green' },
            { label: 'span', value: `${Math.min(...progress.map((p) => p.baseline.year))}-${Math.max(...progress.map((p) => p.latest.year))}`, tone: 'amber' },
          ]}
        />

        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/50 border border-hair">
            {progress.map((p) => {
              const goodTone = p.direction === 'up' ? 'text-terminal-green' : 'text-terminal-green'
              const startVal = formatVal(p.baseline.value, p.format)
              const endVal = formatVal(p.latest.value, p.format)
              return (
                <article
                  key={p.slug}
                  className="bg-ink-900 p-6 flex flex-col"
                >
                  <h3 className="font-serif text-lg text-ink-100 mb-2">{p.name}</h3>
                  <p className="text-sm text-ink-300 leading-relaxed mb-5 flex-1">
                    {p.description}
                  </p>

                  <div className="border-t border-hair pt-4 font-mono">
                    <div className="grid grid-cols-3 gap-2 items-baseline mb-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                          {p.baseline.year}
                        </p>
                        <p className="text-base tabular-nums text-ink-300">{startVal}</p>
                      </div>
                      <div className="text-center text-ink-600 text-xs">→</div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                          {p.latest.year}
                        </p>
                        <p className={`text-xl tabular-nums ${goodTone}`}>{endVal}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-300 tabular-nums">
                        {delta(p.baseline.value, p.latest.value, p.direction)}
                      </span>
                      <a
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-500 hover:text-amber-300 underline decoration-dotted underline-offset-2 truncate ml-3"
                      >
                        source
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-12 border-t border-hair pt-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
              what&rsquo;s still on the table
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 mb-3 leading-tight">
              The gains aren&rsquo;t guaranteed. The next century is still ours to lose.
            </h2>
            <p className="text-ink-300 leading-relaxed max-w-3xl mb-6">
              Progress on infectious disease, energy, and literacy compounds because someone is
              actively working on it. Stagnation is the default. Every metric above is the
              accumulated work of generations who chose hard, useful quests instead of easy ones.
            </p>
            <Link
              href="/"
              className="inline-flex items-center font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-4 py-2 hover:bg-amber-300/[0.08] transition-colors"
            >
              see what&rsquo;s open →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
