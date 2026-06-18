'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import posthog from 'posthog-js'
import type { AllocationVerdict, CapitalMomentum, Domain, Trend } from '@/data/types'
import { DOMAINS, DOMAIN_LABEL } from '@/data/problems'
import { fmtUsdCompact } from '@/lib/allocation'
import Sparkline from './Sparkline'
import TrendBadge from './TrendBadge'

export type RadarRow = {
  slug: string
  name: string
  tagline: string
  domain: Domain | null
  domainLabel: string | null
  trend: Trend | null
  series: { year: number; value: number }[] | null
  companies: number
  capital: number
  demand: number // 0..100
  supply: number // 0..100
  opportunity: number // 0..100
  demandComposite: number // 0..100, triangulated across signal classes
  demandCorroboration: number // # of demand classes with a live signal
  demandConsidered: number // # of demand classes the model considers
  capitalUsd: number | null
  capitalMomentum: CapitalMomentum | null
  allocationRatio: number | null
  allocationVerdict: AllocationVerdict | null
  inLimitUsd: number | null
}

const VERDICT_STYLE: Record<AllocationVerdict, string> = {
  underallocated: 'text-amber-300 border-amber-300/50',
  balanced: 'text-ink-400 border-hair',
  overallocated: 'text-terminal-rose border-rose-500/40',
}

const MOMENTUM_ARROW: Record<CapitalMomentum, string> = {
  rising: '↗',
  falling: '↘',
  flat: '→',
}

function track(event: string, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props)
  } catch {
    // analytics is best-effort; never block the UI
  }
}

function opportunityTone(score: number): string {
  if (score >= 40) return 'text-amber-300'
  if (score >= 25) return 'text-ink-100'
  return 'text-ink-400'
}

export default function RadarClient({ rows }: { rows: RadarRow[] }) {
  const [domain, setDomain] = useState<Domain | 'all'>('all')
  const [query, setQuery] = useState('')

  // Only show domain chips that actually exist in the data.
  const presentDomains = useMemo(() => {
    const set = new Set(rows.map((r) => r.domain).filter(Boolean) as Domain[])
    return DOMAINS.filter((d) => set.has(d))
  }, [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (domain !== 'all' && r.domain !== domain) return false
      if (q && !(`${r.name} ${r.tagline}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [rows, domain, query])

  return (
    <div className="w-full">
      {/* Controls: domain filter + search */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setDomain('all')
              track('radar_filter', { domain: 'all' })
            }}
            className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
              domain === 'all'
                ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
            }`}
          >
            all <span className="tabular-nums text-ink-500">{rows.length}</span>
          </button>
          {presentDomains.map((d) => {
            const count = rows.filter((r) => r.domain === d).length
            return (
              <button
                key={d}
                onClick={() => {
                  setDomain(d)
                  track('radar_filter', { domain: d })
                }}
                className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                  domain === d
                    ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                    : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
                }`}
              >
                {DOMAIN_LABEL[d]} <span className="tabular-nums text-ink-500">{count}</span>
              </button>
            )
          })}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => query && track('radar_search', { query })}
          placeholder="search problems"
          className="w-full lg:w-64 bg-[rgb(var(--bg))] border border-hair-strong text-ink-100 font-mono text-[12px] px-3 py-1.5 focus:outline-none focus:border-amber-300/60 placeholder:text-ink-500"
        />
      </div>

      {/* Column legend */}
      <div className="hidden md:grid grid-cols-[2.5rem_1fr_8rem_5rem_6rem] gap-4 px-3 pb-2 mb-1 border-b border-hair font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
        <span>#</span>
        <span>problem</span>
        <span>demand vs supply</span>
        <span className="text-right">trend</span>
        <span className="text-right">opportunity</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-hair border-b border-hair">
        {filtered.length === 0 ? (
          <p className="py-10 text-center font-mono text-[12px] text-ink-500">
            no problems match this filter
          </p>
        ) : (
          filtered.map((r, i) => (
            <Link
              key={r.slug}
              href={`/p/${r.slug}`}
              onClick={() => track('radar_open', { slug: r.slug })}
              className="group grid md:grid-cols-[2.5rem_1fr_8rem_5rem_6rem] gap-3 md:gap-4 px-3 py-4 items-center hover:bg-ink-800/30 transition-colors"
            >
              {/* rank */}
              <span className="font-mono text-sm tabular-nums text-ink-600">
                {(i + 1).toString().padStart(2, '0')}
              </span>

              {/* name + meta */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-sans text-sm font-medium text-ink-100 group-hover:text-amber-300 transition-colors">
                    {r.name}
                  </span>
                  {r.domainLabel && (
                    <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 border border-hair px-1.5 py-0.5">
                      {r.domainLabel}
                    </span>
                  )}
                  {r.allocationVerdict && (
                    <span
                      className={`font-mono text-[10px] uppercase tracking-ultra-wide border px-1.5 py-0.5 ${VERDICT_STYLE[r.allocationVerdict]}`}
                    >
                      {r.allocationVerdict}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-ink-500 line-clamp-1 max-w-md">{r.tagline}</p>
                <p className="mt-0.5 font-mono text-[10px] text-ink-600 tabular-nums">
                  {r.companies} cos · {r.capital} funds on it
                  {r.capitalUsd != null && (
                    <>
                      {' '}
                      · {fmtUsdCompact(r.capitalUsd)}/yr
                      {r.capitalMomentum ? ` ${MOMENTUM_ARROW[r.capitalMomentum]}` : ''}
                    </>
                  )}
                  {r.inLimitUsd != null && (
                    <>
                      {' '}
                      · <span className="text-amber-300/80">{fmtUsdCompact(r.inLimitUsd)} prize</span>
                    </>
                  )}
                </p>
              </div>

              {/* demand vs supply bars */}
              <div className="flex flex-col gap-1.5">
                <div
                  className="flex items-center justify-between font-mono text-[9px] tabular-nums text-ink-600"
                  title={`Triangulated demand: ${r.demandComposite}/100 from ${r.demandCorroboration} of ${r.demandConsidered} signal classes (burden, willingness-to-pay, capital, research, policy, expert priors)`}
                >
                  <span className="uppercase">demand {r.demandComposite}</span>
                  <span className="flex items-center gap-0.5" aria-label={`${r.demandCorroboration} of ${r.demandConsidered} demand signals`}>
                    {Array.from({ length: r.demandConsidered }).map((_, j) => (
                      <span
                        key={j}
                        className={j < r.demandCorroboration ? 'text-amber-300' : 'text-ink-700'}
                      >
                        ●
                      </span>
                    ))}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] uppercase text-ink-500 w-10">dem</span>
                  <div className="h-1 flex-1 bg-ink-800">
                    <div className="h-1 bg-amber-300" style={{ width: `${r.demand}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] uppercase text-ink-500 w-10">sup</span>
                  <div className="h-1 flex-1 bg-ink-800">
                    <div className="h-1 bg-terminal-cyan" style={{ width: `${r.supply}%` }} />
                  </div>
                </div>
              </div>

              {/* trend + sparkline */}
              <div className="flex flex-col items-start md:items-end gap-1">
                {r.trend && <TrendBadge trend={r.trend} showLabel={false} />}
                {r.series && r.series.length >= 2 && (
                  <Sparkline series={r.series} trend={r.trend ?? 'flat'} width={84} height={22} />
                )}
              </div>

              {/* opportunity score */}
              <div className="text-left md:text-right">
                <span className={`font-mono text-2xl tabular-nums ${opportunityTone(r.opportunity)}`}>
                  {r.opportunity}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      <p className="mt-4 font-mono text-[11px] text-ink-500 leading-relaxed">
        <span className="text-amber-300">opportunity</span> = demand (humans affected × severity ×
        market) divided by supply (companies, capital, and solution quality already on it), nudged
        by urgency. Higher = a bigger, more urgent, less-served gap. The{' '}
        <span className="text-amber-300">●</span> dots show how many independent demand signals
        (burden, willingness-to-pay, capital, research, policy, expert priors) corroborate the
        number — more dots = more credible.{' '}
        <span className="text-amber-300">allocation</span> compares each problem&rsquo;s share of
        real capital ($/yr, sourced estimates) to its share of demand: under half its fair share =
        underallocated, over double = overallocated. Arrows = 3-year capital momentum. Full method
        on the{' '}
        <Link
          href="/methodology"
          className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
        >
          methodology
        </Link>{' '}
        page.
      </p>
    </div>
  )
}
