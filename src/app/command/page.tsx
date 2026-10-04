import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { computeRadarRows } from '@/lib/radar'
import { computeAllocations, fmtRatio, fmtUsdCompact } from '@/lib/allocation'
import { problems } from '@/data/problems'
import { constraintTrees, type Constraint } from '@/data/constraints'
import { capitalMoves, gotExpensive, gotCheap, type Move } from '@/data/market-moves'
import { cachedListRecentPublic } from '@/lib/commitments-cache'

export const metadata: Metadata = {
  title: 'Command Center | optimism.fun',
  description: 'Humanity’s problems, where capital is moving, and where talent is needed, on one screen.',
}

export const revalidate = 300

const nameOf = (slug: string) => problems.find((p) => p.slug === slug)?.name ?? slug

const CONF = { high: 'text-terminal-green', medium: 'text-amber-300', low: 'text-ink-500' } as const

function Panel({ n, title, sub, children }: { n: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="border border-hair bg-ink-900/30 p-5">
      <p className="font-mono text-xs uppercase tracking-ultra-wide text-amber-300">{n}</p>
      <h2 className="font-serif text-2xl text-ink-100 mt-1">{title}</h2>
      <p className="text-sm text-ink-500 mt-1 mb-5">{sub}</p>
      {children}
    </section>
  )
}

function MoveRow({ m }: { m: Move }) {
  return (
    <li className="py-3 border-t border-hair first:border-t-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink-100">{m.label}</span>
        <span className="font-mono text-sm tabular-nums text-ink-100 whitespace-nowrap">{m.value}</span>
      </div>
      <p className="text-sm text-ink-400 mt-1 leading-relaxed">{m.detail}</p>
      <p className="text-xs text-ink-500 mt-1">
        <span className={CONF[m.confidence]}>{m.confidence} confidence</span> · {m.asOf} ·{' '}
        <a href={m.source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-amber-300">
          {m.source.label}
        </a>
        {m.problemSlug && (
          <>
            {' · '}
            <Link href={`/p/${m.problemSlug}`} className="text-amber-300 hover:underline">
              {nameOf(m.problemSlug)}
            </Link>
          </>
        )}
      </p>
    </li>
  )
}

/** Every entry point on every constraint tree, flattened, for one actor. */
function entryPointsFor(who: 'talent' | 'capital' | 'operator') {
  const out: { slug: string; claim: string; action: string; binding: boolean }[] = []
  for (const t of constraintTrees) {
    const walk = (c: Constraint) => {
      for (const e of c.entryPoints) {
        if (e.who === who) out.push({ slug: t.problemSlug, claim: c.claim, action: e.action, binding: c.id === t.bindingId })
      }
      c.children?.forEach(walk)
    }
    t.root.forEach(walk)
  }
  return out
}

export default async function CommandPage() {
  const rows = computeRadarRows().sort((a, b) => b.opportunity - a.opportunity)
  const alloc = computeAllocations()
  const under = [...alloc.values()]
    .filter((a) => a.verdict === 'underallocated' && a.ratio != null)
    .sort((a, b) => (a.ratio ?? 0) - (b.ratio ?? 0))
  const over = [...alloc.values()].filter((a) => a.verdict === 'overallocated')
  const recent = await cachedListRecentPublic(5)
  const talentAsks = entryPointsFor('talent')
  const capitalAsks = entryPointsFor('capital')
  const treeSlugs = new Set(constraintTrees.map((t) => t.problemSlug))

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <p className="font-mono text-xs uppercase tracking-ultra-wide text-ink-400">Command center</p>
        <h1 className="font-serif text-3xl md:text-5xl text-ink-100 mt-2 max-w-4xl leading-tight">
          Problems, capital, talent. One screen.
        </h1>
        <p className="text-ink-400 mt-3 max-w-3xl leading-relaxed">
          What humanity most needs solved, where the money is actually going, and where a person can make the
          most difference. Every number carries its source and date. Nothing here is investment advice: it shows
          where capital flows, not what you should buy.
        </p>

        <div className="grid lg:grid-cols-3 gap-4 mt-10">
          {/* 1. Problems */}
          <Panel n="01 · Problems" title="Where the gap is widest" sub="Ranked by need against how well-served each problem already is.">
            <ol className="space-y-px">
              {rows.slice(0, 8).map((r, i) => (
                <li key={r.slug} className="flex items-baseline gap-3 py-2 border-t border-hair first:border-t-0">
                  <span className="font-mono text-xs text-ink-500 w-5">{i + 1}</span>
                  <Link href={`/p/${r.slug}`} className="flex-1 text-sm text-ink-100 hover:text-amber-300">
                    {r.name}
                    {treeSlugs.has(r.slug) && <span className="ml-2 font-mono text-xs text-amber-300">why-unsolved ✓</span>}
                  </Link>
                  <span className="font-mono text-sm tabular-nums text-ink-300">{r.opportunity}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-ink-500 mt-4">
              {constraintTrees.length} of {problems.length} problems have a tested answer to “why is this not solved yet?”.{' '}
              <Link href="/#problems" className="text-amber-300 hover:underline">All {problems.length} →</Link>
            </p>
          </Panel>

          {/* 2. Capital */}
          <Panel n="02 · Capital" title="Where money is moving" sub="The world’s big flows, then the problems money is missing.">
            <ul>
              {capitalMoves.map((m) => (
                <MoveRow key={m.label} m={m} />
              ))}
            </ul>
            <p className="font-mono text-xs uppercase tracking-wider text-ink-500 mt-6 mb-2">Underfunded against need</p>
            <ul className="space-y-1">
              {under.slice(0, 5).map((a) => (
                <li key={a.problemSlug} className="flex justify-between gap-3 text-sm">
                  <Link href={`/p/${a.problemSlug}`} className="text-ink-200 hover:text-amber-300">{nameOf(a.problemSlug)}</Link>
                  <span className="font-mono text-ink-400 whitespace-nowrap">
                    {a.capitalUsd != null ? `${fmtUsdCompact(a.capitalUsd)}/yr · ` : ''}{fmtRatio(a.ratio!)} fair share
                  </span>
                </li>
              ))}
            </ul>
            {over.length > 0 && (
              <p className="text-xs text-ink-500 mt-3">
                Crowded: {over.map((a) => nameOf(a.problemSlug)).join(', ')}.
              </p>
            )}
            {capitalAsks.length > 0 && (
              <>
                <p className="font-mono text-xs uppercase tracking-wider text-ink-500 mt-6 mb-2">A check would change</p>
                <ul className="space-y-2">
                  {capitalAsks.map((e) => (
                    <li key={e.action} className="text-sm text-ink-300">
                      <Link href={`/p/${e.slug}#why-unsolved`} className="text-amber-300 hover:underline">{nameOf(e.slug)}</Link>: {e.action}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>

          {/* 3. Talent */}
          <Panel n="03 · Talent" title="Where a person matters most" sub="Specific work on the constraint holding a problem back.">
            <ul className="space-y-3">
              {talentAsks.map((e) => (
                <li key={e.action} className="text-sm">
                  <p className="text-ink-100">{e.action}</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    <Link href={`/p/${e.slug}#why-unsolved`} className="text-amber-300 hover:underline">{nameOf(e.slug)}</Link>
                    {e.binding ? ' · on the most binding constraint' : ''}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/fit" className="font-mono text-xs uppercase tracking-wider border border-hair hover:border-amber-300 px-3 py-2">
                Find your fit →
              </Link>
              <Link href="/last-company" className="font-mono text-xs uppercase tracking-wider border border-hair hover:border-amber-300 px-3 py-2">
                Pick your decade →
              </Link>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-ink-500 mt-6 mb-2">Who has committed</p>
            {recent.length === 0 ? (
              <p className="text-sm text-ink-400">
                Nobody yet. This is the one place the site can show where talent actually is, and it fills only
                as people commit.
              </p>
            ) : (
              <ul className="space-y-1">
                {recent.map((c) => (
                  <li key={c.id} className="text-sm text-ink-300">
                    {c.name ?? 'anonymous'} · {c.intent} · {nameOf(c.problemSlug)}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Price moves: what got scarce and what got abundant */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Panel n="Scarce" title="Got expensive" sub="Supply cannot keep up. Something here is a bottleneck.">
            <ul>{gotExpensive.map((m) => <MoveRow key={m.label} m={m} />)}</ul>
          </Panel>
          <Panel n="Abundant" title="Got cheap" sub="Supply flooded in. Build on these; do not compete in them.">
            <ul>{gotCheap.map((m) => <MoveRow key={m.label} m={m} />)}</ul>
          </Panel>
        </div>

        <p className="text-sm text-ink-500 mt-8 max-w-3xl">
          The read: AI made intelligence cheap, which made its physical inputs (power, memory, delivery) scarce. The
          opportunities sit where a gap is wide and closing it is hard to copy.
        </p>
      </main>
      <Footer />
    </>
  )
}
