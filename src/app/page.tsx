import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { problems } from '@/data/problems'
import { computeRadarRows } from '@/lib/radar'
import { burdenForProblem } from '@/lib/burden'
import { formatHumans } from '@/lib/format'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export const revalidate = 300

const DOORS = [
  { label: 'Problems', cta: 'Pick a problem', href: '#problems', body: 'The biggest unsolved ones, ranked.' },
  { label: 'Capital', cta: 'Fund a gap', href: '/command#capital', body: 'Where money is, and where it is missing.' },
  { label: 'Talent', cta: 'Work on one', href: '/command#talent', body: 'Specific work that moves a problem.' },
]

export default function Home() {
  const rows = computeRadarRows().sort((a, b) => b.opportunity - a.opportunity)
  const bySlug = new Map(problems.map((p) => [p.slug, p]))

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="font-serif text-4xl md:text-6xl text-ink-100 leading-[1.05]">
          Humanity&rsquo;s hardest problems.
          <br />
          <span className="text-amber-300">Bring money or work.</span>
        </h1>
        <p className="text-ink-400 mt-4 text-lg">
          {problems.length} problems. Every number sourced. Nothing for sale.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mt-10">
          {DOORS.map((d) => (
            <Link
              key={d.label}
              href={d.href}
              className="group border border-hair hover:border-amber-300 p-5 transition-colors"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-ink-500">{d.label}</p>
              <p className="font-serif text-2xl text-ink-100 group-hover:text-amber-300 mt-1">{d.cta} &rarr;</p>
              <p className="text-sm text-ink-400 mt-2">{d.body}</p>
            </Link>
          ))}
        </div>

        <section id="problems" className="mt-16 scroll-mt-24">
          <h2 className="font-serif text-3xl text-ink-100 mb-4">The problems</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left font-mono text-xs uppercase tracking-wider text-ink-500">
                  <th className="py-2 pr-3 w-8">#</th>
                  <th className="py-2 pr-3">Problem</th>
                  <th className="py-2 pr-3 text-right">People</th>
                  <th className="py-2 pr-3 text-right">Related deaths / yr</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const p = bySlug.get(r.slug)
                  const people = p?.humansAffected?.value
                  const deaths = burdenForProblem(r.slug)?.deaths
                  return (
                    <tr key={r.slug} className="border-t border-hair">
                      <td className="py-3 pr-3 font-mono text-ink-500">{i + 1}</td>
                      <td className="py-3 pr-3">
                        <Link href={`/p/${r.slug}`} className="text-ink-100 text-base hover:text-amber-300">
                          {r.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-3 text-right font-mono tabular-nums text-ink-300">
                        {people ? formatHumans(people) : '—'}
                      </td>
                      <td className="py-3 pr-3 text-right font-mono tabular-nums text-ink-300">
                        {deaths ? formatHumans(deaths) : '—'}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/p/${r.slug}#coordinate`}
                          className="font-mono text-xs uppercase tracking-wider text-paper bg-amber-300 hover:bg-amber-200 px-3 py-1.5 rounded"
                        >
                          Act
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-500 mt-3">
            Ranked by need against how well-served each problem is. Related deaths count every cause a problem feeds, so they overlap.{' '}
            <Link href="/methodology" className="underline decoration-dotted">How</Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
