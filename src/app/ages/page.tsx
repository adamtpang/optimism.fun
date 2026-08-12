import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { ages } from '@/data/ages'
import { progress, getProgressBySlug } from '@/data/progress'
import { formatUSD } from '@/lib/format'

export const metadata: Metadata = {
  title: "Humanity's ages | optimism.fun",
  description:
    'Every epochal leap, in order, from the first Homo sapiens to the current civilizational moment. Kardashev scale, cost to orbit, and healthy life expectancy, tracked live.',
}

const CURRENT_AGE_SLUGS = ['kardashev-scale', 'cost-to-orbit', 'healthy-life-expectancy'] as const

function formatMetricValue(value: number, format: string) {
  switch (format) {
    case 'usd':
      return formatUSD(value)
    case 'years':
      return `${value.toFixed(0)} yrs`
    default:
      return value.toLocaleString()
  }
}

export default function AgesPage() {
  const currentAge = CURRENT_AGE_SLUGS.map((slug) => getProgressBySlug(slug)).filter(Boolean)

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · humanity's ages"
          title="Every leap, in order."
          lede="~300,000 years of one species, compressed to the moments that actually changed the ceiling on what was possible. Deep history has no clean before/after number to cite, just a date and why it mattered. The current age does have numbers, tracked live below, the same Kardashev scale and cost-to-orbit data already on /progress."
          rightStats={[{ label: 'epochs', value: ages.length, tone: 'amber' }]}
        />

        {/* the timeline */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <ol className="relative">
            {ages.map((age, i) => (
              <li key={age.slug} className="relative pl-16 sm:pl-24 pb-12 last:pb-0">
                {i < ages.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[1.375rem] sm:left-7 top-12 sm:top-14 bottom-0 w-px bg-ink-700"
                  />
                )}
                <span className="absolute left-0 top-0 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-hair bg-paper font-mono text-[10px] sm:text-xs text-amber-300 text-center leading-tight px-1">
                  {age.year < 0
                    ? `~${Math.round(Math.abs(age.year) / 1000)}k BP`
                    : age.year}
                </span>
                <div className="pt-1">
                  <p className="font-mono text-[11px] text-ink-500 mb-1">
                    {age.yearLabel}
                    {age.precision === 'approximate' && (
                      <span className="text-ink-600"> · approximate</span>
                    )}
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl text-ink-100 leading-snug mb-2">
                    {age.name}
                  </h2>
                  <p className="text-ink-300 text-sm leading-relaxed max-w-2xl mb-2">
                    {age.description}
                  </p>
                  <a
                    href={age.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] text-ink-600 hover:text-amber-300 transition-colors"
                  >
                    {age.source} →
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* the current age */}
        <section className="border-t border-hair bg-ink-900/30">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The current age, tracked live
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-6">
              No date on this one yet. It&apos;s still being written.
            </h2>
            <div className="grid sm:grid-cols-3 gap-px bg-ink-700/50 border border-hair">
              {currentAge.map((m) => {
                if (!m) return null
                const delta = m.latest.value / m.baseline.value
                const deltaLabel =
                  delta >= 2
                    ? `${delta.toFixed(1)}× ${m.direction === 'up' ? 'higher' : 'lower'}`
                    : delta <= 0.5
                      ? `${(1 / delta).toFixed(1)}× lower`
                      : `${(((m.latest.value - m.baseline.value) / m.baseline.value) * 100).toFixed(0)}%`
                return (
                  <div key={m.slug} className="bg-ink-900 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                      {m.name}
                    </p>
                    <p className="font-sans text-2xl text-ink-100 mb-1">
                      {formatMetricValue(m.latest.value, m.format)}
                    </p>
                    <p className="font-mono text-[11px] text-ink-500 mb-3">
                      {m.baseline.year} → {m.latest.year}, {deltaLabel}
                    </p>
                    <p className="text-ink-400 text-[12px] leading-relaxed">{m.description}</p>
                  </div>
                )
              })}
            </div>
            <p className="mt-3 font-mono text-[11px] text-ink-500">
              source and methodology on{' '}
              <Link href="/progress" className="text-amber-300 hover:underline">
                /progress
              </Link>
            </p>
          </div>
        </section>

        <section className="border-t border-hair">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <p className="text-ink-400 leading-relaxed max-w-2xl mb-6 text-sm">
              The Moon landing is the honest caution on this page: 66 years from first flight to
              the Moon, then 55 years and counting with no human past low Earth orbit. A curve
              compounding does not mean it keeps compounding.{' '}
              <Link href="/frontier" className="text-amber-300 hover:underline">
                /frontier
              </Link>{' '}
              tracks who is disclosing real capital toward restarting it now.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/progress"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                Full progress tracker →
              </Link>
              <Link
                href="/signals"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                What's growing right now →
              </Link>
              <Link
                href="/frontier"
                className="px-4 py-2 border border-amber-300/40 text-amber-300 font-mono text-[12px] hover:bg-amber-300/[0.06] transition-colors"
              >
                Who's funding the next one →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
