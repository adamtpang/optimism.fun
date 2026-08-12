'use client'

/**
 * The power-ranking board — tier bands (S/A/B/C), ranked quests within each,
 * every row backed by the demand-gap data that earned its rank. vS Data Reaper
 * for startup ideas. Dependency-free; click a row to expand the why-now + the
 * Choose-Good-Quests test.
 */
import { useState } from 'react'
import Link from 'next/link'
import type { RankedQuest, QuestTier } from '@/lib/rankings'
import type { Crowding } from '@/data/types'
import { fmtUsdCompact } from '@/lib/allocation'
import StarterPackBlock from '@/components/StarterPackBlock'
import { getStarterPack, buildClaudeCodePrompt } from '@/data/starter-packs'

// Quest-level supply signal. open = wide-open frontier (the opportunity),
// crowded = contested. Ordinal good→bad, so a diverging green→rose hue.
const CROWDING_META: Record<Crowding, { label: string; tone: string }> = {
  open: { label: 'open field', tone: 'text-terminal-green' },
  contested: { label: 'contested', tone: 'text-amber-300' },
  crowded: { label: 'crowded', tone: 'text-terminal-rose' },
}

const TIER_META: Record<
  QuestTier,
  { label: string; text: string; ring: string; chip: string }
> = {
  S: {
    label: 'Build this now',
    text: 'text-amber-300',
    ring: 'ring-amber-300/40',
    chip: 'bg-amber-300/10 text-amber-300',
  },
  A: {
    label: 'Strong quest',
    text: 'text-terminal-cyan',
    ring: 'ring-terminal-cyan/30',
    chip: 'bg-terminal-cyan/10 text-terminal-cyan',
  },
  B: {
    label: 'Worth a look',
    text: 'text-ink-200',
    ring: 'ring-hair',
    chip: 'bg-ink-800/60 text-ink-200',
  },
  C: {
    label: 'On the radar',
    text: 'text-ink-500',
    ring: 'ring-hair',
    chip: 'bg-ink-800/40 text-ink-500',
  },
}

const MOMENTUM: Record<string, { arrow: string; tone: string; label: string }> = {
  rising: { arrow: '↗', tone: 'text-terminal-green', label: 'capital rising' },
  falling: { arrow: '↘', tone: 'text-terminal-rose', label: 'capital falling' },
  flat: { arrow: '→', tone: 'text-ink-500', label: 'capital flat' },
}

function MiniBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center gap-1.5" title={`${label} ${value}/100`}>
      <span className="font-mono text-[9px] uppercase text-ink-500 w-7">{label}</span>
      <div className="h-1 w-12 bg-ink-800 rounded-full overflow-hidden">
        <div className={`h-1 ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function QuestRow({ q }: { q: RankedQuest }) {
  const [open, setOpen] = useState(false)
  const mo = q.momentum ? MOMENTUM[q.momentum] : null
  const pack = getStarterPack(q.slug)

  return (
    <div className="border-b border-hair last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left px-3 py-3 flex items-start gap-3 hover:bg-ink-800/30 transition-colors"
      >
        {/* rank */}
        <span className="font-mono text-sm tabular-nums text-ink-500 w-7 pt-0.5 shrink-0">
          {q.rank}
        </span>

        {/* identity + pitch */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans text-[15px] font-medium text-ink-100">{q.title}</span>
            {q.domainLabel && (
              <span className="font-mono text-[9px] uppercase tracking-wide text-ink-500 border border-hair px-1.5 py-0.5 rounded">
                {q.domainLabel}
              </span>
            )}
            {q.allocationVerdict === 'underallocated' && (
              <span className="font-mono text-[9px] uppercase tracking-wide text-amber-300 bg-amber-300/10 px-1.5 py-0.5 rounded">
                underfunded
              </span>
            )}
            <span
              className={`font-mono text-[9px] uppercase tracking-wide ${CROWDING_META[q.crowding].tone} border border-hair px-1.5 py-0.5 rounded`}
              title={
                q.crowdingSource === 'sourced'
                  ? `${q.competitorCount} companies found building this (live sourced)`
                  : 'Editorial estimate, not yet sourced'
              }
            >
              {CROWDING_META[q.crowding].label}
              {q.crowdingSource === 'sourced' && q.competitorCount != null && (
                <span className="ml-1 text-ink-400">n={q.competitorCount}</span>
              )}
            </span>
          </div>
          <p className="mt-1 text-ink-400 text-[12.5px] leading-snug line-clamp-2">{q.pitch}</p>
        </div>

        {/* metrics */}
        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
          <MiniBar label="dem" value={q.demand} tone="bg-amber-300" />
          <MiniBar label="gap" value={q.gap} tone="bg-terminal-cyan" />
        </div>

        {/* prize + momentum + score */}
        <div className="flex flex-col items-end gap-0.5 shrink-0 w-20">
          <span className="font-mono text-lg tabular-nums text-ink-100 leading-none">{q.score}</span>
          {q.prizeUsd != null && (
            <span className="font-mono text-[10px] tabular-nums text-ink-400" title="Prize at the limit">
              {fmtUsdCompact(q.prizeUsd)}
            </span>
          )}
          {mo && (
            <span className={`font-mono text-[10px] ${mo.tone}`} title={mo.label}>
              {mo.arrow} {q.confidence}
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="px-3 pb-4 pl-[2.75rem] space-y-3 bg-ink-900/40">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-cyan mb-1">
              Why now
            </p>
            <p className="text-ink-300 text-[13px] leading-relaxed">{q.whyNow}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-amber-300 mb-1">
              Why it&apos;s a good quest
            </p>
            <p className="text-ink-300 text-[13px] leading-relaxed">{q.goodQuest}</p>
          </div>
          {q.crowdingSource === 'sourced' && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-400 mb-1">
                Already building this ({q.competitorCount} found)
              </p>
              <p className="text-ink-300 text-[13px] leading-relaxed">
                {q.exampleCompetitors.length > 0
                  ? q.exampleCompetitors.join(' · ')
                  : 'No named competitors found. Open field.'}
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-[10px] text-ink-500">
            <span>
              attacks{' '}
              <Link href={`/p/${q.problemSlug}`} className="text-amber-300 hover:underline">
                {q.problemName}
              </Link>
            </span>
            <span>demand {q.demand}</span>
            <span title="Problem supply blended with this quest's crowding">
              quest supply {q.questSupply} ({CROWDING_META[q.crowding].label})
            </span>
            <span>gap {q.gap}</span>
            <span>opportunity {q.opportunity}</span>
            <span>confidence {q.confidence}</span>
          </div>
          {pack && (
            <StarterPackBlock
              pack={pack}
              prompt={buildClaudeCodePrompt(pack, {
                title: q.title,
                problemName: q.problemName,
                demand: q.demand,
                gap: q.gap,
                competitorCount: q.competitorCount,
                exampleCompetitors: q.exampleCompetitors,
              })}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default function QuestRankings({
  bands,
}: {
  bands: { tier: QuestTier; quests: RankedQuest[] }[]
}) {
  return (
    <div className="space-y-6">
      {bands.map(({ tier, quests }) => {
        const meta = TIER_META[tier]
        return (
          <div key={tier} className="flex flex-col md:flex-row gap-3">
            {/* tier rail */}
            <div className="md:w-40 shrink-0 flex md:flex-col items-center md:items-start gap-3 md:gap-1 md:pt-3">
              <div
                className={`font-serif text-4xl md:text-5xl ${meta.text} font-normal leading-none w-12 text-center ring-1 ${meta.ring} rounded-lg py-2`}
              >
                {tier}
              </div>
              <div>
                <p className={`font-mono text-[11px] uppercase tracking-wide ${meta.text}`}>
                  {meta.label}
                </p>
                <p className="font-mono text-[10px] text-ink-600 tabular-nums">
                  {quests.length} quest{quests.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {/* rows */}
            <div className={`flex-1 border border-hair rounded-lg overflow-hidden ring-1 ${meta.ring}`}>
              {quests.map((q) => (
                <QuestRow key={q.slug} q={q} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
