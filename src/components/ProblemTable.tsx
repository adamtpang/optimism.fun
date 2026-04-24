'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Problem } from '@/data/types'
import { companies } from '@/data/companies'
import { voices } from '@/data/voices'
import { formatHumans, formatScore } from '@/lib/format'
import TierPill from './TierPill'

type Lens = 'balanced' | 'welfare' | 'xrisk' | 'utility'
type SortKey = 'composite' | 'humans' | 'welfare' | 'xrisk' | 'utility'

const LENS_META: Record<Lens, { label: string; desc: string }> = {
  balanced: { label: 'balanced', desc: 'equal weight across all three lenses' },
  welfare: { label: 'EA / welfare', desc: 'copenhagen BCR is the headline' },
  xrisk: { label: 'x-risk', desc: '80k hours ITN is the headline' },
  utility: { label: 'e/acc / utility delta', desc: 'state-of-art vs physics limit' },
}

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
    case 'balanced':
    default:
      return (wNorm + xNorm + uNorm) / 3
  }
}

export default function ProblemTable({ problems }: { problems: Problem[] }) {
  const [lens, setLens] = useState<Lens>('balanced')
  const [sortKey, setSortKey] = useState<SortKey>('composite')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')

  const companyCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of companies) {
      for (const p of c.problemSlugs) {
        m.set(p, (m.get(p) ?? 0) + 1)
      }
    }
    return m
  }, [])

  const voiceCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const v of voices) {
      for (const pos of v.positions) {
        m.set(pos.problemSlug, (m.get(pos.problemSlug) ?? 0) + 1)
      }
    }
    return m
  }, [])

  const rows = useMemo(() => {
    const decorated = problems.map((p) => ({
      p,
      composite: compositeScore(p, lens),
      companyCount: companyCounts.get(p.slug) ?? 0,
      voiceCount: voiceCounts.get(p.slug) ?? 0,
    }))
    decorated.sort((a, b) => {
      let aVal = 0
      let bVal = 0
      switch (sortKey) {
        case 'composite':
          aVal = a.composite
          bVal = b.composite
          break
        case 'humans':
          aVal = a.p.humansAffected.value
          bVal = b.p.humansAffected.value
          break
        case 'welfare':
          aVal = a.p.scores.welfareBCR?.value ?? -1
          bVal = b.p.scores.welfareBCR?.value ?? -1
          break
        case 'xrisk':
          aVal = a.p.scores.xriskITN?.value ?? -1
          bVal = b.p.scores.xriskITN?.value ?? -1
          break
        case 'utility':
          aVal = a.p.scores.utilityDelta?.value ?? -1
          bVal = b.p.scores.utilityDelta?.value ?? -1
          break
      }
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal
    })
    return decorated
  }, [problems, lens, sortKey, sortDir, companyCounts, voiceCounts])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return <span className="text-slate-600">↕</span>
    return sortDir === 'desc' ? (
      <span className="text-indigo-400">↓</span>
    ) : (
      <span className="text-indigo-400">↑</span>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(LENS_META) as Lens[]).map((l) => (
            <button
              key={l}
              onClick={() => setLens(l)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                lens === l
                  ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/[0.16] hover:text-slate-200'
              }`}
            >
              {LENS_META[l].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">{LENS_META[lens].desc}</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.01]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-medium">
                <button
                  onClick={() => toggleSort('composite')}
                  className="flex items-center gap-1 hover:text-slate-300"
                >
                  #
                </button>
              </th>
              <th className="px-4 py-3 font-medium">Problem</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium text-right">
                <button
                  onClick={() => toggleSort('humans')}
                  className="flex items-center gap-1 hover:text-slate-300 ml-auto"
                >
                  Humans {sortIcon('humans')}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-right">
                <button
                  onClick={() => toggleSort('welfare')}
                  className="flex items-center gap-1 hover:text-slate-300 ml-auto"
                >
                  Welfare BCR {sortIcon('welfare')}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-right">
                <button
                  onClick={() => toggleSort('xrisk')}
                  className="flex items-center gap-1 hover:text-slate-300 ml-auto"
                >
                  X-risk ITN {sortIcon('xrisk')}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-right">
                <button
                  onClick={() => toggleSort('utility')}
                  className="flex items-center gap-1 hover:text-slate-300 ml-auto"
                >
                  Utility Δ {sortIcon('utility')}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-right" title="Companies mapped">Co.</th>
              <th className="px-4 py-3 font-medium text-right" title="Voices (thinkers) citing this problem">V.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, companyCount, voiceCount }, i) => (
              <tr
                key={p.slug}
                className="group border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-4 text-slate-600 tabular-nums">
                  {(i + 1).toString().padStart(2, '0')}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/p/${p.slug}`}
                    className="block font-display font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors"
                  >
                    {p.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 max-w-md">
                    {p.tagline}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <TierPill tier={p.tier} />
                </td>
                <td className="px-4 py-4 text-right tabular-nums">
                  {formatHumans(p.humansAffected.value)}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-amber-300/90">
                  {p.scores.welfareBCR
                    ? `${formatScore(p.scores.welfareBCR.value)}×`
                    : '·'}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-rose-300/90">
                  {p.scores.xriskITN
                    ? `${formatScore(p.scores.xriskITN.value)}/10`
                    : '·'}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-indigo-300/90">
                  {p.scores.utilityDelta
                    ? `${(p.scores.utilityDelta.value * 100).toFixed(0)}%`
                    : '·'}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-slate-500">
                  {companyCount}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-purple-300/80">
                  {voiceCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        welfare = copenhagen consensus BCR. x-risk = 80k hours ITN composite. utility Δ = current state-of-the-art divided by physically-possible ceiling. every number carries a confidence tag. see{' '}
        <Link href="/methodology" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
          methodology
        </Link>
        .
      </p>
    </div>
  )
}
