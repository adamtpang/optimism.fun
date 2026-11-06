import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Container from '@/components/layout/Container'
import CommandTabs from '@/components/CommandTabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

function Row({ label, value, href, src, tag }: { label: string; value: string; href: string; src: string; tag?: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 py-2 border-t border-neutral-200 first:border-t-0 min-w-0">
      <span className="text-small text-ink-200 min-w-0">
        {label}
        {tag && <span className="ml-2 text-small text-blue-700">{tag}</span>}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-body tabular-nums text-ink-100 hover:text-primary text-right min-w-0 break-words underline decoration-dotted underline-offset-2"
      >
        {value}
        <span className="block text-small font-normal text-primary no-underline">{src}</span>
      </a>
    </li>
  )
}

const atlas = (r: AtlasRow) => (
  <Row key={r.name} label={r.name} value={r.change ? `${r.value} · ${r.change}` : r.value} href={r.source.url} src={r.source.label} tag={r.aiDriven ? 'AI' : undefined} />
)
const move = (m: Move) => <Row key={m.label} label={m.label} value={m.value} href={m.source.url} src={m.source.label} />

function Box({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="min-w-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-small font-medium text-neutral-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
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
        <li key={e.action} className="flex items-center justify-between gap-4 border border-neutral-200 rounded-xl p-4 min-w-0">
          <div className="min-w-0">
            <p className="text-body text-ink-100">{e.action}</p>
            <p className="text-small text-neutral-600 mt-1">{nameOf(e.slug)}</p>
          </div>
          <Button asChild className="shrink-0">
            <Link href={`/p/${e.slug}#coordinate`}>{cta}</Link>
          </Button>
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
      <main className="pt-20 md:pt-24 pb-16">
        <Container>
          <h1 className="text-h1 md:text-display-2 text-ink-100">Capital, talent, markets.</h1>
          <p className="text-body-lg text-ink-400 mt-3">Click any number for its source. Not investment advice.</p>

          <CommandTabs
            capital={
              <>
                <Asks items={entryPointsFor('capital')} cta="Fund" />
                <div className="grid md:grid-cols-2 gap-4 mt-4 min-w-0">
                  <Box title="Most underfunded vs need">
                    <ul>
                      {under.map((a) => (
                        <li key={a.problemSlug} className="flex justify-between gap-3 py-2 border-t border-neutral-200 first:border-t-0">
                          <Link href={`/p/${a.problemSlug}`} className="text-small text-ink-200 hover:text-primary min-w-0">
                            {nameOf(a.problemSlug)}
                          </Link>
                          <span className="text-small text-ink-100 shrink-0">{a.capitalUsd != null ? `${fmtUsdCompact(a.capitalUsd)}/yr` : '—'}</span>
                        </li>
                      ))}
                    </ul>
                  </Box>
                  <Box title="Where money is moving">
                    <ul>{capitalMoves.map(move)}</ul>
                  </Box>
                </div>
              </>
            }
            talent={
              <>
                <Asks items={entryPointsFor('talent')} cta="Join" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button asChild variant="outline">
                    <Link href="/fit">Find your fit →</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/coordinate">See who committed →</Link>
                  </Button>
                </div>
              </>
            }
            markets={
              <>
                <div className="grid md:grid-cols-3 gap-4 min-w-0">
                  <Box title="Wealth (overlapping)"><ul>{assets.map(atlas)}</ul></Box>
                  <Box title="Biggest, per year"><ul>{biggestMarkets.map(atlas)}</ul></Box>
                  <Box title="Fastest growing"><ul>{fastestMarkets.map(atlas)}</ul></Box>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-4 min-w-0">
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
                <section id="idiot-index" className="mt-10 scroll-mt-32">
                  <h2 className="text-h2 text-ink-100 mb-4">Idiot Index: price ÷ cost to make</h2>
                  <div className="overflow-x-auto max-w-full min-w-0">
                    <table className="w-full text-small">
                      <thead>
                        <tr className="text-left text-neutral-600 bg-neutral-50">
                          <th className="py-3 pr-3 font-medium">Product</th>
                          <th className="py-3 pr-3 font-medium">Price</th>
                          <th className="py-3 pr-3 font-medium">Cost</th>
                          <th className="py-3 pr-3 text-right font-medium">Ratio</th>
                          <th className="py-3 text-right font-medium">Gap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {idiotIndex.map((r) => (
                          <tr key={r.name} className="border-t border-neutral-200" title={r.why}>
                            <td className="py-3 pr-3">
                              <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="text-ink-100 hover:text-primary">
                                {r.name}
                              </a>
                            </td>
                            <td className="py-3 pr-3 text-ink-300 break-words">{r.price}</td>
                            <td className="py-3 pr-3 text-ink-300 break-words">{r.cost}</td>
                            <td className="py-3 pr-3 text-right text-ink-100 tabular-nums">{r.ratio}×</td>
                            <td className={`py-3 text-right text-small ${r.closing === 'open' ? 'text-terminal-rose' : r.closing === 'closing' ? 'text-blue-700' : 'text-terminal-green'}`}>
                              {r.closing}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 mt-6">
                    {collapsed.map((c) => (
                      <a key={c.name} href={c.source.url} target="_blank" rel="noopener noreferrer" className="border border-neutral-200 rounded-xl p-4 hover:border-primary min-h-11">
                        <p className="text-data-xl text-terminal-green">{c.ratio}</p>
                        <p className="text-small text-ink-200 mt-1">{c.name} got cheaper</p>
                        <p className="text-small text-neutral-600 mt-1">{c.then} → {c.now}</p>
                      </a>
                    ))}
                  </div>
                </section>
              </>
            }
          />
        </Container>
      </main>
      <Footer />
    </>
  )
}
