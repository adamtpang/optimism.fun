'use client'

/**
 * RfsBoard — the two-sided action layer for Humanity's Requests for Startups.
 *
 * Each request is one object seen from both sides. The audience toggle decides
 * which side leads:
 *   - Founders → "Where to apply": the real grants, fellowships, accelerators,
 *     and VCs that fund this problem, with direct outbound links. The concrete
 *     next step is an application, not a vibe.
 *   - Investors → "The trade": the prize at the limit, the capital actually
 *     flowing, the allocation verdict, and the co-allocators already in the
 *     space — plus a link to the full deal view.
 *
 * No invented data: every funder, prize, and flow comes from ecosystem.ts,
 * in-limit.ts, and capital-flows.ts via the server component that renders this.
 */
import { useState } from 'react'
import Link from 'next/link'
import TierPill from '@/components/TierPill'
import { ECOSYSTEM_TYPE_LABEL, type EcosystemType, type Tier } from '@/data/types'
import { fmtRatio, fmtUsdCompact } from '@/lib/allocation'

export type RfsFunder = {
  slug: string
  name: string
  type: EcosystemType
  url: string
  thesis: string
  bestFor: string
}

export type RfsRequestData = {
  slug: string
  title: string
  pitch: string
  whyNow: string
  shape: string
  successLooksLike: string
  goodQuest: string
}

export type RfsGroupData = {
  problemSlug: string
  problemName: string
  tier: Tier
  prizeUsd: number | null
  capitalUsd: number | null
  momentum: 'rising' | 'falling' | 'flat' | null
  ratio: number | null
  verdict: 'underallocated' | 'balanced' | 'overallocated' | null
  funders: RfsFunder[]
  requests: RfsRequestData[]
}

type Audience = 'founders' | 'investors'

// Which capital comes first depends on who's reading. Founders want fast,
// permissionless money first; investors want the venture/catalytic end.
const FOUNDER_ORDER: EcosystemType[] = [
  'grant',
  'fellowship',
  'accelerator',
  'studio',
  'fro',
  'catalytic',
  'vc',
]
const INVESTOR_ORDER: EcosystemType[] = [
  'vc',
  'catalytic',
  'studio',
  'fro',
  'accelerator',
  'fellowship',
  'grant',
]

function orderFunders(funders: RfsFunder[], audience: Audience): RfsFunder[] {
  const order = audience === 'founders' ? FOUNDER_ORDER : INVESTOR_ORDER
  const rank = (t: EcosystemType) => {
    const i = order.indexOf(t)
    return i === -1 ? order.length : i
  }
  return [...funders].sort((a, b) => rank(a.type) - rank(b.type))
}

const MOMENTUM_LABEL: Record<'rising' | 'falling' | 'flat', string> = {
  rising: '↗ rising',
  falling: '↘ falling',
  flat: '→ flat',
}

export default function RfsBoard({ groups }: { groups: RfsGroupData[] }) {
  const [audience, setAudience] = useState<Audience>('founders')

  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      {/* Audience toggle — pick the side of the coin you're standing on */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 border-b border-hair pb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
            I&rsquo;m here to
          </p>
          <p className="text-sm text-ink-300 max-w-md leading-relaxed">
            {audience === 'founders'
              ? 'Pick a quest worth your life — then go where the capital already is. Each request links to the funds that back this problem.'
              : 'Find the underpriced quests — high demand, thin capital, a huge prize at the limit — and the co-allocators already in the space.'}
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Audience"
          className="inline-flex shrink-0 border border-hair self-start"
        >
          {(['founders', 'investors'] as const).map((a) => {
            const active = audience === a
            return (
              <button
                key={a}
                role="tab"
                aria-selected={active}
                onClick={() => setAudience(a)}
                className={`font-mono text-[11px] uppercase tracking-wider px-4 py-2 transition-colors ${
                  active
                    ? 'bg-amber-300 text-paper'
                    : 'text-ink-400 hover:text-ink-100'
                }`}
              >
                {a === 'founders' ? 'Build it' : 'Fund it'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-16">
        {groups.map((g) => {
          const funders = orderFunders(g.funders, audience)
          const showFounderFunders = funders.slice(0, 4)
          return (
            <div key={g.problemSlug}>
              {/* Group header */}
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5 border-b border-hair pb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <TierPill tier={g.tier} />
                  <h2 className="font-serif text-2xl md:text-3xl text-ink-100">
                    {g.problemName}
                  </h2>
                  {g.prizeUsd != null && (
                    <span
                      className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 border border-amber-300/40 px-2 py-1"
                      title="In-the-limit market cap: what the winning company is worth at perfect execution"
                    >
                      {fmtUsdCompact(g.prizeUsd)} prize at the limit
                    </span>
                  )}
                </div>
                <Link
                  href={`/p/${g.problemSlug}`}
                  className="font-mono text-[11px] uppercase tracking-ultra-wide text-amber-300 hover:text-amber-200 transition-colors"
                >
                  the trade: demand · capital · prize →
                </Link>
              </div>

              {/* Investor trade strip — the economics that flip "build" into "fund" */}
              {audience === 'investors' &&
                (g.capitalUsd != null || g.prizeUsd != null) && (
                  <div className="grid sm:grid-cols-3 gap-px bg-ink-700/40 border border-hair mb-5">
                    <div className="bg-[rgb(var(--bg))] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                        Capital flowing
                      </p>
                      <p className="font-mono text-xl tabular-nums text-ink-100">
                        {g.capitalUsd != null ? (
                          <>
                            {fmtUsdCompact(g.capitalUsd)}
                            <span className="text-sm text-ink-400">/yr</span>
                          </>
                        ) : (
                          <span className="text-sm text-ink-500">unmapped</span>
                        )}
                        {g.momentum && (
                          <span className="ml-2 font-mono text-[11px] text-ink-400">
                            {MOMENTUM_LABEL[g.momentum]}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="bg-[rgb(var(--bg))] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                        Allocation
                      </p>
                      {g.verdict ? (
                        <p
                          className={`font-mono text-xl ${
                            g.verdict === 'underallocated'
                              ? 'text-amber-300'
                              : g.verdict === 'overallocated'
                                ? 'text-terminal-rose'
                                : 'text-ink-200'
                          }`}
                        >
                          {g.verdict}
                          {g.ratio != null && (
                            <span className="block font-mono text-[11px] text-ink-500 mt-0.5">
                              {fmtRatio(g.ratio)} fair share
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="font-mono text-sm text-ink-500">unmapped</p>
                      )}
                    </div>
                    <div className="bg-[rgb(var(--bg))] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                        Prize at the limit
                      </p>
                      <p className="font-mono text-xl tabular-nums text-amber-300">
                        {g.prizeUsd != null ? (
                          fmtUsdCompact(g.prizeUsd)
                        ) : (
                          <span className="text-sm text-ink-500">unmapped</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

              {/* The requests */}
              <div className="space-y-4">
                {g.requests.map((r) => (
                  <article
                    key={r.slug}
                    className="border border-hair p-6 hover:border-hair-strong transition-colors"
                  >
                    <h3 className="font-serif text-xl md:text-2xl text-ink-100 mb-3">
                      {r.title}
                    </h3>
                    <p className="font-serif text-lg text-ink-200 leading-relaxed mb-5">
                      {r.pitch}
                    </p>

                    <div className="grid md:grid-cols-3 gap-px bg-ink-700/40 border border-hair mb-4">
                      <div className="bg-[rgb(var(--bg))] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                          Why now
                        </p>
                        <p className="text-sm text-ink-300 leading-relaxed">
                          {r.whyNow}
                        </p>
                      </div>
                      <div className="bg-[rgb(var(--bg))] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                          The shape of it
                        </p>
                        <p className="text-sm text-ink-300 leading-relaxed">
                          {r.shape}
                        </p>
                      </div>
                      <div className="bg-[rgb(var(--bg))] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                          Success looks like
                        </p>
                        <p className="text-sm text-ink-300 leading-relaxed">
                          {r.successLooksLike}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l-2 border-amber-300/50 pl-4">
                      <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 whitespace-nowrap mt-0.5">
                        good quest
                      </span>
                      <p className="text-sm text-ink-300 leading-relaxed italic">
                        {r.goodQuest}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* The action panel — the actual next step, by audience */}
              <div className="mt-4 border border-amber-300/30 bg-amber-300/[0.03] p-6">
                {audience === 'founders' ? (
                  <>
                    <div className="flex items-baseline justify-between gap-3 mb-4">
                      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
                        Where to apply
                      </p>
                      <Link
                        href="/journey"
                        className="font-mono text-[11px] uppercase tracking-wider text-ink-300 hover:text-amber-300 transition-colors"
                      >
                        start the quest →
                      </Link>
                    </div>
                    {showFounderFunders.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-px bg-ink-700/40 border border-hair">
                        {showFounderFunders.map((f) => (
                          <a
                            key={f.slug}
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-[rgb(var(--bg))] p-4 hover:bg-ink-800/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-sans text-sm font-medium text-ink-100 group-hover:text-amber-300 transition-colors">
                                {f.name}
                              </span>
                              <span className="font-mono text-[9px] uppercase tracking-ultra-wide text-amber-300 border border-amber-300/30 px-1.5 py-px">
                                {ECOSYSTEM_TYPE_LABEL[f.type]}
                              </span>
                              <span className="ml-auto font-mono text-[11px] text-ink-500 group-hover:text-amber-300 transition-colors">
                                apply →
                              </span>
                            </div>
                            <p className="font-mono text-[11px] text-ink-400 leading-relaxed">
                              <span className="text-ink-600">best for:</span>{' '}
                              {f.bestFor}
                            </p>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="font-mono text-[11px] text-ink-500">
                        No funder mapped to this quest yet — that&rsquo;s the white
                        space.{' '}
                        <Link
                          href="/ecosystem"
                          className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                        >
                          browse the full capital stack →
                        </Link>
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between gap-3 mb-4">
                      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
                        Co-allocators in this space
                      </p>
                      <Link
                        href={`/p/${g.problemSlug}`}
                        className="font-mono text-[11px] uppercase tracking-wider text-ink-300 hover:text-amber-300 transition-colors"
                      >
                        see the full deal →
                      </Link>
                    </div>
                    {funders.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-px bg-ink-700/40 border border-hair">
                        {funders.map((f) => (
                          <a
                            key={f.slug}
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-[rgb(var(--bg))] p-4 hover:bg-ink-800/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-sans text-sm font-medium text-ink-100 group-hover:text-amber-300 transition-colors">
                                {f.name}
                              </span>
                              <span className="font-mono text-[9px] uppercase tracking-ultra-wide text-terminal-cyan border border-terminal-cyan/30 px-1.5 py-px">
                                {ECOSYSTEM_TYPE_LABEL[f.type]}
                              </span>
                            </div>
                            <p className="font-mono text-[11px] text-ink-400 leading-relaxed">
                              {f.thesis}
                            </p>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="font-mono text-[11px] text-ink-500">
                        No fund mapped here yet — an open lane.{' '}
                        <Link
                          href={`/p/${g.problemSlug}`}
                          className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                        >
                          see the demand · capital · prize →
                        </Link>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
