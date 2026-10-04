import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { computeAllocations, fmtUsdCompact } from '@/lib/allocation'
import { problems } from '@/data/problems'
import { constraintTrees, type Constraint } from '@/data/constraints'
import { capitalMoves, gotExpensive, gotCheap, type Move } from '@/data/market-moves'
import {
  assets,
  biggestMarkets,
  fastestMarkets,
  idiotIndex,
  collapsed,
  topCompanies,
  type AtlasRow,
} from '@/data/market-atlas'

export const metadata: Metadata = {
  title: 'Capital, talent, markets | optimism.fun',
  description: 'Where money is, where it is missing, and where a person can help most.',
}

const nameOf = (slug: string) => problems.find((p) => p.slug === slug)?.name ?? slug

/** A number row: label, value, source link. Nothing else. */
function Row({ label, value, href, src, tag }: { label: string; value: string; href: string; src: string; tag?: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 py-2 border-t border-hair first:border-t-0">
      <span className="text-sm text-ink-200">
        {label}
        {tag && <span className="ml-2 font-mono text-xs text-amber-300">{tag}</span>}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={src}
        className="font-mono text-sm tabular-nums text-ink-100 whitespace-nowrap hover:text-amber-300"
      >
        {value}
      </a>
    </li>
  )
}

const atlas = (r: AtlasRow) => (
  <Row key={r.name} label={r.name} value={r.change ? `${r.value} · ${r.change}` : r.value} href={r.source.url} src={r.source.label} tag={r.aiDriven ? 'AI' : undefined} />
)
const move = (m: Move) => <Row key={m.label} label={m.label} value={m.value} href={m.source.url} src={m.source.label} />

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-hair p-5">
      <h3 className="font-mono text-xs uppercase tracking-wider text-ink-500 mb-3">{title}</h3>
      {children}
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <h2 className="font-serif text-3xl text-ink-100 mb-5">{title}</h2>
      {children}
    </section>
  )
}

function entryPointsFor(who: 'talent' | 'capital' | 'operator') {
  const out: { slug: string; action: string }[] = []
  for (const t of constraintTrees) {
    const walk = (c: Constraint) => {
      for (const e of c.entryPoints) if (e.who === who) out.push({ slug: t.problemSlug, action: e.action })
      c.children?.forEach(walk)
    }
    t.root.forEach(walk)
  }
  return out
}

function Asks({ items, cta }: { items: { slug: string; action: string }[]; cta: string }) {
  return (
    <ul className="space-y-2">
      {items.map((e) => (
        <li key={e.action} className="flex items-center justify-between gap-4 border border-hair p-4">
          <div>
            <p className="text-ink-100">{e.action}</p>
            <p className="text-xs text-ink-500 mt-1">{nameOf(e.slug)}</p>
          </div>
          <Link
            href={`/p/${e.slug}#coordinate`}
            className="shrink-0 font-mono text-xs uppercase tracking-wider text-paper bg-amber-300 hover:bg-amber-200 px-3 py-2 rounded"
          >
            {cta}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function CommandPage() {
  const under = [...computeAllocations().values()]
    .filter((a) => a.verdict === 'underallocated')
    .sort((a, b) => (a.ratio ?? 0) - (b.ratio ?? 0))
    .slice(0, 5)

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-ink-100">Capital, talent, markets.</h1>
        <p className="text-ink-400 mt-3">Click any number for its source. Not investment advice.</p>

        <Section id="capital" title="Capital">
          <Asks items={entryPointsFor('capital')} cta="Fund" />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Box title="Most underfunded vs need">
              <ul>
                {under.map((a) => (
                  <li key={a.problemSlug} className="flex justify-between gap-3 py-2 border-t border-hair first:border-t-0">
                    <Link href={`/p/${a.problemSlug}`} className="text-sm text-ink-200 hover:text-amber-300">{nameOf(a.problemSlug)}</Link>
                    <span className="font-mono text-sm text-ink-100">{a.capitalUsd != null ? `${fmtUsdCompact(a.capitalUsd)}/yr` : '—'}</span>
                  </li>
                ))}
              </ul>
            </Box>
            <Box title="Where money is moving">
              <ul>{capitalMoves.map(move)}</ul>
            </Box>
          </div>
        </Section>

        <Section id="talent" title="Talent">
          <Asks items={entryPointsFor('talent')} cta="Join" />
          <div className="flex flex-wrap gap-2 mt-4">
            <Link href="/fit" className="font-mono text-xs uppercase tracking-wider border border-hair hover:border-amber-300 px-4 py-2">Find your fit &rarr;</Link>
            <Link href="/coordinate" className="font-mono text-xs uppercase tracking-wider border border-hair hover:border-amber-300 px-4 py-2">See who committed &rarr;</Link>
          </div>
        </Section>

        <Section id="markets" title="Markets">
          <div className="grid md:grid-cols-3 gap-4">
            <Box title="Wealth (overlapping)"><ul>{assets.map(atlas)}</ul></Box>
            <Box title="Biggest, per year"><ul>{biggestMarkets.map(atlas)}</ul></Box>
            <Box title="Fastest growing"><ul>{fastestMarkets.map(atlas)}</ul></Box>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Box title={`Largest companies · ${topCompanies.asOf}`}>
              <ul>
                {topCompanies.rows.map(([n, v]) => (
                  <Row key={n} label={n} value={v} href={topCompanies.source.url} src={topCompanies.source.label} />
                ))}
              </ul>
            </Box>
            <Box title="Got expensive"><ul>{gotExpensive.map(move)}</ul></Box>
            <Box title="Got cheap"><ul>{gotCheap.map(move)}</ul></Box>
          </div>
        </Section>

        <Section id="idiot-index" title="Idiot Index: price ÷ cost to make">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left font-mono text-xs uppercase tracking-wider text-ink-500">
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Price</th>
                  <th className="py-2 pr-3">Cost</th>
                  <th className="py-2 pr-3 text-right">Ratio</th>
                  <th className="py-2 text-right">Gap</th>
                </tr>
              </thead>
              <tbody>
                {idiotIndex.map((r) => (
                  <tr key={r.name} className="border-t border-hair" title={r.why}>
                    <td className="py-2 pr-3">
                      <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="text-ink-100 hover:text-amber-300">{r.name}</a>
                    </td>
                    <td className="py-2 pr-3 font-mono text-ink-300 whitespace-nowrap">{r.price}</td>
                    <td className="py-2 pr-3 font-mono text-ink-300">{r.cost}</td>
                    <td className="py-2 pr-3 font-mono text-right text-ink-100 tabular-nums">{r.ratio}×</td>
                    <td className={`py-2 text-right font-mono text-xs uppercase ${r.closing === 'open' ? 'text-terminal-rose' : r.closing === 'closing' ? 'text-amber-300' : 'text-terminal-green'}`}>
                      {r.closing}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            {collapsed.map((c) => (
              <a key={c.name} href={c.source.url} target="_blank" rel="noopener noreferrer" className="border border-hair p-4 hover:border-amber-300">
                <p className="font-mono text-3xl text-terminal-green">{c.ratio}</p>
                <p className="text-sm text-ink-200 mt-1">{c.name} got cheaper</p>
                <p className="text-xs text-ink-500 mt-1">{c.then} &rarr; {c.now}</p>
              </a>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
