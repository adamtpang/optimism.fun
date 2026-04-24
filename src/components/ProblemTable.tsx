'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Problem } from '@/data/types'
import { companies } from '@/data/companies'
import { voices } from '@/data/voices'
import { formatHumans, formatScore } from '@/lib/format'
import TierPill from './TierPill'

type Lens = 'balanced' | 'welfare' | 'xrisk' | 'utility'
type SortKey = 'composite' | 'humans' | 'welfare' | 'xrisk' | 'utility' | 'voices'

const LENS_META: Record<Lens, { label: string; desc: string }> = {
  balanced: { label: 'balanced', desc: 'equal weight, all lenses' },
  welfare: { label: 'ea · welfare', desc: 'copenhagen BCR dominant' },
  xrisk: { label: 'x-risk', desc: '80k hours ITN dominant' },
  utility: { label: 'e/acc · utility δ', desc: 'physics-gap dominant' },
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

  const rows = useMemo(() => {
    const decorated = problems.map((p) => ({
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
  }, [problems, lens, sortKey, sortDir, companyCounts, voiceCounts])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const icon = (key: SortKey) =>
    sortKey !== key ? (
      <span className="text-ink-600">·</span>
    ) : sortDir === 'desc' ? (
      <span className="text-amber-300">▾</span>
    ) : (
      <span className="text-amber-300">▴</span>
    )

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="overflow-x-auto border border-hair">
        <table className="min-w-full font-mono text-xs">
          <thead>
            <tr className="border-b border-hair-strong bg-ink-800/40 text-left text-[10px] uppercase tracking-ultra-wide text-ink-400">
              <th className="px-3 py-2.5 font-medium w-10">#</th>
              <th className="px-3 py-2.5 font-medium">problem</th>
              <th className="px-3 py-2.5 font-medium">tier</th>
              <th className="px-3 py-2.5 font-medium text-right">
                <button
                  onClick={() => toggleSort('humans')}
                  className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                >
                  humans {icon('humans')}
                </button>
              </th>
              <th className="px-3 py-2.5 font-medium text-right">
                <button
                  onClick={() => toggleSort('welfare')}
                  className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                >
                  bcr {icon('welfare')}
                </button>
              </th>
              <th className="px-3 py-2.5 font-medium text-right">
                <button
                  onClick={() => toggleSort('xrisk')}
                  className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                >
                  itn {icon('xrisk')}
                </button>
              </th>
              <th className="px-3 py-2.5 font-medium text-right">
                <button
                  onClick={() => toggleSort('utility')}
                  className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                >
                  util δ {icon('utility')}
                </button>
              </th>
              <th className="px-3 py-2.5 font-medium text-right">co</th>
              <th className="px-3 py-2.5 font-medium text-right">
                <button
                  onClick={() => toggleSort('voices')}
                  className="inline-flex items-center gap-1 hover:text-ink-100 ml-auto"
                >
                  v {icon('voices')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, companyCount, voiceCount }, i) => (
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
                <td className="px-3 py-3 text-right tabular-nums text-ink-200">
                  {formatHumans(p.humansAffected.value)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-terminal-green">
                  {p.scores.welfareBCR ? `${formatScore(p.scores.welfareBCR.value)}×` : <span className="text-ink-500/70">·</span>}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-terminal-rose">
                  {p.scores.xriskITN ? formatScore(p.scores.xriskITN.value) : <span className="text-ink-500/70">·</span>}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-amber-300">
                  {p.scores.utilityDelta ? `${(p.scores.utilityDelta.value * 100).toFixed(0)}%` : <span className="text-ink-500/70">·</span>}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-ink-500">
                  {companyCount}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-terminal-violet/80">
                  {voiceCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 font-mono text-[11px] text-ink-500 leading-relaxed">
        <span className="text-ink-600">bcr</span> copenhagen consensus benefit-cost ratio ·
        <span className="text-ink-600"> itn</span> 80,000 hours importance × tractability × neglectedness ·
        <span className="text-ink-600"> util δ</span> state-of-the-art vs physics-possible ceiling ·
        <span className="text-ink-600"> co</span> companies mapped ·
        <span className="text-ink-600"> v</span> voices citing. full method in{' '}
        <Link href="/methodology" className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2">
          methodology
        </Link>
        .
      </p>
    </div>
  )
}
