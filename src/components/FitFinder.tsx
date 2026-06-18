'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import posthog from 'posthog-js'
import type { Domain } from '@/data/types'
import { problems, DOMAIN_LABEL } from '@/data/problems'
import { ARCHETYPES, DISPOSITIONS, type ArchetypeKey } from '@/data/archetypes'
import { scoreFit } from '@/lib/fit'
import { getRequestsForProblem } from '@/data/rfs'
import { getInLimitCap } from '@/data/in-limit'
import { fmtUsdCompact } from '@/lib/allocation'

function track(event: string, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props)
  } catch {
    // best-effort
  }
}

// Domains that actually have a ranked problem behind them.
const PRESENT_DOMAINS: Domain[] = Array.from(
  new Set(problems.map((p) => p.domain).filter(Boolean) as Domain[]),
)

type Step = 'domains' | 'disposition' | 'results'

export default function FitFinder() {
  const [step, setStep] = useState<Step>('domains')
  const [domains, setDomains] = useState<Set<Domain>>(new Set())
  const [archetype, setArchetype] = useState<ArchetypeKey | null>(null)

  const toggleDomain = (d: Domain) =>
    setDomains((prev) => {
      const next = new Set(prev)
      if (next.has(d)) next.delete(d)
      else next.add(d)
      return next
    })

  const results = useMemo(() => {
    if (step !== 'results' || !archetype) return []
    return scoreFit({ domains: Array.from(domains), archetype }).slice(0, 3)
  }, [step, archetype, domains])

  const arch = archetype ? ARCHETYPES[archetype] : null

  // ---- Step 1: domains ----
  if (step === 'domains') {
    return (
      <Shell stepLabel="01 / what pulls you">
        <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-2">
          Which of these can you not stop thinking about?
        </h2>
        <p className="text-ink-400 text-sm mb-6 max-w-xl">
          Founder-problem fit starts with obsession. Pick the worlds you already fall down rabbit
          holes in — honesty beats ambition here.
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {PRESENT_DOMAINS.map((d) => {
            const on = domains.has(d)
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDomain(d)}
                aria-pressed={on}
                className={`px-3 py-2 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                  on
                    ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                    : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
                }`}
              >
                {DOMAIN_LABEL[d]}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          disabled={domains.size === 0}
          onClick={() => {
            track('fit_domains', { domains: Array.from(domains) })
            setStep('disposition')
          }}
          className="font-mono text-[11px] uppercase tracking-ultra-wide text-paper bg-amber-300 hover:bg-amber-200 disabled:opacity-30 disabled:cursor-not-allowed px-5 py-3 rounded transition-colors"
        >
          Next &rarr;
        </button>
      </Shell>
    )
  }

  // ---- Step 2: disposition → archetype ----
  if (step === 'disposition') {
    return (
      <Shell stepLabel="02 / how you build">
        <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-2">
          When you imagine the work, what pulls hardest?
        </h2>
        <p className="text-ink-400 text-sm mb-6 max-w-xl">
          There is no single founder mold. Pick the one that feels like you, not the one that
          sounds best.
        </p>
        <div className="grid sm:grid-cols-2 gap-2 mb-8">
          {DISPOSITIONS.map((d) => (
            <button
              key={d.archetype}
              type="button"
              onClick={() => {
                setArchetype(d.archetype)
                track('fit_archetype', { archetype: d.archetype })
                setStep('results')
              }}
              className="text-left border border-hair hover:border-amber-300/60 hover:bg-amber-300/[0.04] p-4 transition-colors group"
            >
              <p className="font-sans text-sm font-medium text-ink-100 group-hover:text-amber-300 transition-colors mb-1">
                {d.label}
              </p>
              <p className="text-[12px] text-ink-500 leading-relaxed">{d.sub}</p>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStep('domains')}
          className="font-mono text-[11px] uppercase tracking-wider text-ink-500 hover:text-ink-300 transition-colors"
        >
          &larr; back
        </button>
      </Shell>
    )
  }

  // ---- Results ----
  return (
    <Shell stepLabel="your quests">
      {arch && (
        <div className="mb-8 border border-amber-300/30 bg-amber-300/[0.03] p-5">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
            Your archetype
          </p>
          <h2 className="font-serif text-2xl text-ink-100">{arch.name}</h2>
          <p className="text-ink-300 text-sm mt-1">{arch.essence}</p>
          <p className="text-ink-400 text-sm mt-3 leading-relaxed">
            <span className="text-ink-200">Your edge:</span> {arch.edge}
          </p>
        </div>
      )}

      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-4">
        The problems that could be your life&rsquo;s work — most-fit first
      </p>

      <div className="space-y-5">
        {results.map((r, i) => {
          const rfs = getRequestsForProblem(r.slug)[0]
          const prize = getInLimitCap(r.slug)
          return (
            <article key={r.slug} className="border border-hair p-6">
              <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm tabular-nums text-ink-600">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl text-ink-100">{r.name}</h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-ultra-wide">
                  {prize && (
                    <span className="text-amber-300 border border-amber-300/40 px-2 py-1">
                      {fmtUsdCompact(prize.marketCap.value)} prize
                    </span>
                  )}
                  <span className="text-ink-500 border border-hair px-2 py-1">
                    fit {r.score}
                  </span>
                </div>
              </div>

              <div className="border-l-2 border-amber-300/50 pl-4 mb-5">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1.5">
                  Why this is your quest
                </p>
                <ul className="space-y-1">
                  {r.reasons.map((why, j) => (
                    <li key={j} className="text-sm text-ink-300 leading-relaxed">
                      {why}
                    </li>
                  ))}
                </ul>
              </div>

              {rfs && (
                <div className="mb-5">
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                    The company to build
                  </p>
                  <p className="font-serif text-lg text-ink-100">{rfs.title}</p>
                  <p className="text-sm text-ink-400 leading-relaxed mt-1">{rfs.pitch}</p>
                </div>
              )}

              <div className="mb-5">
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                  Your first three moves
                </p>
                <ol className="space-y-1.5">
                  {[
                    <>
                      Read the{' '}
                      <Link href={`/p/${r.slug}/whitepaper`} className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2">
                        {r.name} whitepaper
                      </Link>{' '}
                      and its{' '}
                      <Link href="/rfs" className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2">
                        Requests for Startups
                      </Link>
                      . Get to the frontier of what is already known.
                    </>,
                    <>Talk to ten people living this problem this week. Founder-problem fit is earned in conversation, not theory.</>,
                    <>Write your one-paragraph thesis — why this problem, why you, why now — then start the full quest below.</>,
                  ].map((move, j) => (
                    <li key={j} className="flex gap-3 text-sm text-ink-300 leading-relaxed">
                      <span className="font-mono text-ink-600 mt-px shrink-0">{j + 1}.</span>
                      <span>{move}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/journey"
                  className="font-mono text-[10px] uppercase tracking-wider text-paper bg-amber-300 hover:bg-amber-200 px-3 py-2 rounded transition-colors"
                >
                  Open the full quest &rarr;
                </Link>
                <Link
                  href={`/p/${r.slug}`}
                  className="font-mono text-[10px] uppercase tracking-wider text-ink-300 border border-hair hover:border-amber-300 px-3 py-2 rounded transition-colors"
                >
                  See the problem &rarr;
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {arch && (
        <div className="mt-8 border-t border-hair pt-6">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
            Founders who share your shape — copy the move, not the outcome
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {arch.exemplars.map((e) => (
              <div key={e.name} className="border border-hair p-4">
                <p className="font-sans text-sm font-medium text-ink-100">{e.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-amber-300 mb-1.5">
                  {e.company}
                </p>
                <p className="text-[12px] text-ink-400 leading-relaxed">{e.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setStep('domains')
          setArchetype(null)
        }}
        className="mt-8 font-mono text-[11px] uppercase tracking-wider text-ink-500 hover:text-ink-300 transition-colors"
      >
        &larr; start over
      </button>
    </Shell>
  )
}

function Shell({ stepLabel, children }: { stepLabel: string; children: React.ReactNode }) {
  return (
    <div className="border border-hair bg-[rgb(var(--bg))] p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-5">
        {stepLabel}
      </p>
      {children}
    </div>
  )
}
