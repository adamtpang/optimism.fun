'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import type { Problem, Tier, Confidence } from '@/data/types'
import { TIER_LABEL } from '@/data/types'
import { companies } from '@/data/companies'
import { voices } from '@/data/voices'
import { formatHumans, formatScore } from '@/lib/format'
import TierPill from './TierPill'

type Lens = 'balanced' | 'welfare' | 'xrisk' | 'utility'
type SortKey = 'composite' | 'humans' | 'welfare' | 'xrisk' | 'utility' | 'voices'
type ColKey = 'humans' | 'bcr' | 'itn' | 'util' | 'co' | 'v'

const ALL_TIERS: Tier[] = ['welfare', 'x-risk', 'hard-tech', 'progress', 'emerging']
const ALL_COLS: ColKey[] = ['humans', 'bcr', 'itn', 'util', 'co', 'v']
const COL_LABEL: Record<ColKey, string> = {
  humans: 'humans',
  bcr: 'bcr',
  itn: 'itn',
  util: 'util δ',
  co: 'co',
  v: 'v',
}

const LENS_META: Record<Lens, { label: string; desc: string }> = {
  balanced: { label: 'balanced', desc: 'equal weight, all lenses' },
  welfare: { label: 'ea · welfare', desc: 'copenhagen BCR dominant' },
  xrisk: { label: 'x-risk', desc: '80k hours ITN dominant' },
  utility: { label: 'e/acc · utility δ', desc: 'physics-gap dominant' },
}

const CONFIDENCE_DOT: Record<Confidence, string> = {
  high: 'bg-terminal-green',
  med: 'bg-amber-300',
  low: 'bg-terminal-rose',
}

const COLS_STORAGE_KEY = 'optimism.problem-table.visible-cols.v1'

function compositeScore(p: Problem, lens: Lens): number {
  const w = p.scores.welfareBCR?.value ?? 0
  const x = p.scores.xriskITN?.value ?? 0
  const u = p.scores.utilityDelta?.value ?? 0
  const wNorm = Math.min(1, w / 50)
  const xNorm = Math.min(1, x / 10)
  const uNorm = Math.min(1, u)
  switch (lens) {
    case 'welfare':
      return wNorm * 0.7 + xNorm * 0.15 + uNorm * 0.15
    case 'xrisk':
      return wNorm * 0.15 + xNorm * 0.7 + uNorm * 0.15
    case 'utility':
      return wNorm * 0.15 + xNorm * 0.15 + uNorm * 0.7
    default:
      return (wNorm + xNorm + uNorm) / 3
  }
}

export default function ProblemTable({ problems }: { problems: Problem[] }) {
  const [lens, setLens] = useState<Lens>('balanced')
  const [sortKey, setSortKey] = useState<SortKey>('composite')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')
  const [tierFilter, setTierFilter] = useState<Set<Tier>>(new Set(ALL_TIERS))
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(new Set(ALL_COLS))
  const [colsOpen, setColsOpen] = useState(false)
  const colsBtnRef = useRef<HTMLDivElement>(null)

  // Restore column visibility from localStorage on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COLS_STORAGE_KEY)
      if (!raw) return
      const arr = JSON.parse(raw) as ColKey[]
      const next = new Set<ColKey>(arr.filter((c) => ALL_COLS.includes(c)))
      if (next.size > 0) setVisibleCols(next)
    } catch {
      // ignore — defaults are fine
    }
  }, [])

  // Persist on change.
  useEffect(() => {
    try {
      window.localStorage.setItem(COLS_STORAGE_KEY, JSON.stringify([...visibleCols]))
    } catch {
      // ignore
    }
  }, [visibleCols])

  // Close column picker on click-away / Escape.
  useEffect(() => {
    if (!colsOpen) return
    function onClickAway(e: MouseEvent) {
      if (colsBtnRef.current && !colsBtnRef.current.contains(e.target as Node)) {
        setColsOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setColsOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('keydown', onKey)
    }
  }, [colsOpen])

  const companyCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of companies)
      for (const s of c.problemSlugs) m.set(s, (m.get(s) ?? 0) + 1)
    return m
  }, [])

  const voiceCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const v of voices)
      for (const pos of v.positions)
        m.set(pos.problemSlug, (m.get(pos.problemSlug) ?? 0) + 1)
    return m
  }, [])

  // Per-tier counts of the entire dataset — used in the filter chips.
  const tierCounts = useMemo(() => {
    const m = new Map<Tier, number>()
    for (const t of ALL_TIERS) m.set(t, 0)
    for (const p of problems) m.set(p.tier, (m.get(p.tier) ?? 0) + 1)
    return m
  }, [problems])

  const rows = useMemo(() => {
    const decorated = problems
      .filter((p) => tierFilter.has(p.tier))
      .map((p) => ({
        p,
        composite: compositeScore(p, lens),
        companyCount: companyCounts.get(p.slug) ?? 0,
        voiceCount: voiceCounts.get(p.slug) ?? 0,
      }))
    decorated.sort((a, b) => {
      let av = 0
      let bv = 0
      switch (sortKey) {
        case 'composite':
          av = a.composite
          bv = b.composite
          break
        case 'humans':
          av = a.p.humansAffected.value
          bv = b.p.humansAffected.value
          break
        case 'welfare':
          av = a.p.scores.welfareBCR?.value ?? -1
          bv = b.p.scores.welfareBCR?.value ?? -1
          break
        case 'xrisk':
          av = a.p.scores.xriskITN?.value ?? -1
          bv = b.p.scores.xriskITN?.value ?? -1
          break
        case 'utility':
          av = a.p.scores.utilityDelta?.value ?? -1
          bv = b.p.scores.utilityDelta?.value ?? -1
          break
        case 'voices':
          av = a.voiceCount
          bv = b.voiceCount
          break
      }
      return sortDir === 'desc' ? bv - av : av - bv
    })
    return decorated
  }, [problems, lens, sortKey, sortDir, tierFilter, companyCounts, voiceCounts])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function toggleTier(t: Tier) {
    setTierFilter((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      // Never allow the user to filter out *everything* — that just hides the table.
      if (next.size === 0) return new Set(ALL_TIERS)
      return next
    })
  }

  function setAllTiers() {
    setTierFilter(new Set(ALL_TIERS))
  }

  function toggleCol(c: ColKey) {
    setVisibleCols((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      // Never let the user hide every metric — keeps the table meaningful.
      if (next.size === 0) return new Set(ALL_COLS)
      return next
    })
  }

  const icon = (key: SortKey) =>
    sortKey !== key ? (
      <span className="text-ink-600">·</span>
    ) : sortDir === 'desc' ? (
      <span className="text-amber-300">▾</span>
    ) : (
      <span className="text-amber-300">▴</span>
    )

  const totalHumans = rows.reduce((s, r) => s + r.p.humansAffected.value, 0)
  const allTiersOn = tierFilter.size === ALL_TIERS.length
  const colShown = (c: ColKey) => visibleCols.has(c)

  return (
    <div className="w-full">
      {/* ── Headline KPI strip ─────────────────────────────────────────── */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-700/50 border border-hair">
        <div className="bg-ink-900 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
            matched
          </p>
          <p className="font-mono tabular-nums text-xl text-amber-300">
            {rows.length}
            <span className="text-ink-600 text-sm"> / {problems.length}</span>
          </p>
        </div>
        <div className="bg-ink-900 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
            humans affected
          </p>
          <p className="font-mono tabular-nums text-xl text-amber-300">
            {formatHumans(totalHumans)}
          </p>
        </div>
        <div className="bg-ink-900 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
            lens
          </p>
          <p className="font-mono text-xs text-ink-200">{LENS_META[lens].label}</p>
        </div>
        <div className="bg-ink-900 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
            sorted by
          </p>
          <p className="font-mono text-xs text-ink-200">
            {sortKey} {sortDir === 'desc' ? '▾' : '▴'}
          </p>
        </div>
      </div>

      {/* ── Lens chips + weighting label ──────────────────────────────── */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-px border border-hair">
          {(Object.keys(LENS_META) as Lens[]).map((l) => (
            <button
              key={l}
              onClick={() => setLens(l)}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                lens === l
                  ? 'bg-amber-300/10 text-amber-300'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800'
              }`}
            >
              {LENS_META[l].label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[11px] text-ink-500">
          <span className="text-ink-600">weighting: </span>
          {LENS_META[lens].desc}
        </p>
      </div>

      {/* ── Tier filter chips + column picker ─────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={setAllTiers}
            className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
              allTiersOn
                ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
            }`}
          >
            all{' '}
            <span className="tabular-nums text-ink-500">{problems.length}</span>
          </button>
          {ALL_TIERS.map((t) => {
            const active = !allTiersOn && tierFilter.has(t)
            const count = tierCounts.get(t) ?? 0
            return (
              <button
                key={t}
                onClick={() => toggleTier(t)}
                disabled={count === 0}
                className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                  count === 0
                    ? 'border-hair/40 text-ink-700 cursor-not-allowed'
                    : active
                      ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                      : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
                }`}
              >
                {TIER_LABEL[t].toLowerCase()}{' '}
                <span className="tabular-nums text-ink-500">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Column picker */}
        <div className="relative inline-flex" ref={colsBtnRef}>
          <button
            type="button"
            onClick={() => setColsOpen((v) => !v)}
            aria-expanded={colsOpen}
            className="px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border border-hair text-ink-300 hover:text-ink-100 hover:border-ink-400 transition-colors"
          >
            columns{' '}
            <span className="tabular-nums text-ink-500">
              {visibleCols.size}/{ALL_COLS.length}
            </span>{' '}
            {colsOpen ? '▴' : '▾'}
          </button>
          {colsOpen && (
            <div
              role="menu"
              className="absolute z-50 top-full mt-1 right-0 w-48 border border-hair-strong bg-ink-900 shadow-xl p-2"
            >
              {ALL_COLS.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 px-2 py-1.5 font-mono text-[11px] text-ink-200 hover:bg-ink-800/60 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={visibleCols.has(c)}
                    onChange={() => toggleCol(c)}
                    className="accent-amber-300"
                  />
                  <span>{COL_LABEL[c]}</span>
                </label>
              ))}
              <p className="px-2 pt-1 pb-0.5 font-mono text-[9px] text-ink-600 leading-relaxed">
                persisted to this browser
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto border border-hair">
        <table className="min-w-full font-mono text-xs">
          <thead>
            <tr className="border-b border-hair-strong bg-ink-800/40 text-left text-[10px] uppercase tracking-ultra-wide text-ink-400">
              <th className="px-3 py-2.5 font-medium w-10">#</th>
              <th className="px-3 py-2.5 font-medium">problem</th>
              <th className="px-3 py-2.5 font-medium">tier</th>
              {colShown('humans') && (
                <th className="px-3 py-2.5 font-medium text-right">
                  <button
                    onClick={() => toggleSort('humans')}
                    className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                  >
                    humans {icon('humans')}
                  </button>
                </th>
              )}
              {colShown('bcr') && (
                <th className="px-3 py-2.5 font-medium text-right">
                  <button
                    onClick={() => toggleSort('welfare')}
                    className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                  >
                    bcr {icon('welfare')}
                  </button>
                </th>
              )}
              {colShown('itn') && (
                <th className="px-3 py-2.5 font-medium text-right">
                  <button
                    onClick={() => toggleSort('xrisk')}
                    className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                  >
                    itn {icon('xrisk')}
                  </button>
                </th>
              )}
              {colShown('util') && (
                <th className="px-3 py-2.5 font-medium text-right">
                  <button
                    onClick={() => toggleSort('utility')}
                    className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                  >
                    util δ {icon('utility')}
                  </button>
                </th>
              )}
              {colShown('co') && (
                <th className="px-3 py-2.5 font-medium text-right">co</th>
              )}
              {colShown('v') && (
                <th className="px-3 py-2.5 font-medium text-right">
                  <button
                    onClick={() => toggleSort('voices')}
                    className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                  >
                    v {icon('voices')}
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + visibleCols.size}
                  className="px-3 py-8 text-center text-ink-500 font-mono text-xs"
                >
                  no problems match this filter
                </td>
              </tr>
            ) : (
              rows.map(({ p, companyCount, voiceCount }, i) => (
                <tr
                  key={p.slug}
                  className="group border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
                >
                  <td className="px-3 py-3 text-ink-600 tabular-nums">
                    {(i + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/p/${p.slug}`}
                      className="block font-sans text-sm font-medium text-ink-100 group-hover:text-amber-300 transition-colors"
                    >
                      {p.name}
                    </Link>
                    <p className="mt-0.5 text-[11px] text-ink-500 line-clamp-1 max-w-md">
                      {p.tagline}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <TierPill tier={p.tier} />
                  </td>
                  {colShown('humans') && (
                    <td className="px-3 py-3 text-right tabular-nums text-ink-200">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            CONFIDENCE_DOT[p.humansAffected.confidence]
                          }`}
                          title={`${p.humansAffected.confidence} confidence · ${p.humansAffected.source}`}
                        />
                        {formatHumans(p.humansAffected.value)}
                      </span>
                    </td>
                  )}
                  {colShown('bcr') && (
                    <td className="px-3 py-3 text-right tabular-nums text-terminal-green">
                      {p.scores.welfareBCR ? (
                        `${formatScore(p.scores.welfareBCR.value)}×`
                      ) : (
                        <span className="text-ink-500/70">·</span>
                      )}
                    </td>
                  )}
                  {colShown('itn') && (
                    <td className="px-3 py-3 text-right tabular-nums text-terminal-rose">
                      {p.scores.xriskITN ? (
                        formatScore(p.scores.xriskITN.value)
                      ) : (
                        <span className="text-ink-500/70">·</span>
                      )}
                    </td>
                  )}
                  {colShown('util') && (
                    <td className="px-3 py-3 text-right tabular-nums text-amber-300">
                      {p.scores.utilityDelta ? (
                        `${(p.scores.utilityDelta.value * 100).toFixed(0)}%`
                      ) : (
                        <span className="text-ink-500/70">·</span>
                      )}
                    </td>
                  )}
                  {colShown('co') && (
                    <td className="px-3 py-3 text-right tabular-nums text-ink-500">
                      {companyCount}
                    </td>
                  )}
                  {colShown('v') && (
                    <td className="px-3 py-3 text-right tabular-nums text-terminal-violet/80">
                      {voiceCount}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 font-mono text-[11px] text-ink-500 leading-relaxed">
        <span className="text-ink-600">●</span> confidence dot on humans —{' '}
        <span className="text-terminal-green">high</span>,{' '}
        <span className="text-amber-300">med</span>,{' '}
        <span className="text-terminal-rose">low</span>. full method in{' '}
        <Link
          href="/methodology"
          className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
        >
          methodology
        </Link>
        .
      </p>
    </div>
  )
}
