'use client'

/**
 * The dams — capital that wants to flow somewhere and cannot, grouped by the
 * blocker holding it back. Position encodes the blocker (the category), bar
 * length encodes how much is waiting, and a single accent hue carries
 * magnitude. The amber rows are the ones a solo builder with code and media
 * can actually attack; everything else needs policy, patient capital, or atoms.
 */
import { useState } from 'react'
import Link from 'next/link'
import type { DammedFlow, BlockerType, AttackableBy } from '@/data/types'
import { BLOCKER_META, blockedByType } from '@/data/capital-map'
import { fmtUsdCompact } from '@/lib/allocation'

const ATTACK_META: Record<AttackableBy, { label: string; tone: string }> = {
  code: { label: 'code can fix this', tone: 'text-amber-300 bg-amber-300/10' },
  capital: { label: 'needs patient capital', tone: 'text-terminal-cyan bg-terminal-cyan/10' },
  policy: { label: 'needs policy', tone: 'text-ink-300 bg-ink-800/60' },
  atoms: { label: 'needs atoms built', tone: 'text-ink-400 bg-ink-800/40' },
}

const ORDER: BlockerType[] = [
  'permitting',
  'queue',
  'legibility',
  'no-buyer',
  'horizon',
  'jurisdiction',
  'mandate',
]

function FlowRow({ flow, max }: { flow: DammedFlow; max: number }) {
  const [open, setOpen] = useState(false)
  const width = Math.sqrt(flow.waiting.value / max) * 100
  const attack = ATTACK_META[flow.attackableBy]
  const isWedge = flow.attackableBy === 'code'

  return (
    <div className="border-b border-hair last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left px-3 py-3 hover:bg-ink-800/30 transition-colors"
      >
        <div className="flex items-baseline justify-between gap-3 mb-1.5">
          <span
            className={`font-sans text-[13.5px] ${isWedge ? 'text-amber-300' : 'text-ink-100'}`}
          >
            {flow.destination}
          </span>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-200">
            {fmtUsdCompact(flow.waiting.value)}
            <span className="text-ink-600">
              {flow.waiting.unit?.includes('/yr') ? '/yr' : ''} waiting
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2.5">
            <div
              className="h-2.5 rounded-sm"
              style={{
                width: `${width}%`,
                backgroundColor: isWedge ? '#fcd34d' : '#0ea5e9',
                opacity: isWedge ? 0.9 : 0.75,
              }}
            />
          </div>
          <span
            className={`shrink-0 font-mono text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded ${attack.tone}`}
          >
            {attack.label}
          </span>
        </div>
      </button>

      {open && (
        <div className="px-3 pb-4 space-y-2.5 bg-ink-900/40">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-rose mb-1">
              The blocker
            </p>
            <p className="text-ink-300 text-[13px] leading-relaxed">{flow.blockerDetail}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-green mb-1">
              The unlock
            </p>
            <p className="text-ink-300 text-[13px] leading-relaxed">{flow.unlock}</p>
          </div>
          <p className="font-mono text-[10px] text-ink-600 leading-relaxed">
            <span className="text-ink-500">scope:</span> {flow.scope}
          </p>
          <p className="font-mono text-[9.5px] text-ink-700 leading-relaxed">
            {flow.waiting.source} · confidence {flow.waiting.confidence}
          </p>
          {flow.problemSlug && (
            <Link
              href={`/p/${flow.problemSlug}`}
              className="inline-block font-mono text-[10px] text-amber-300 hover:underline"
            >
              the problem downstream of this dam →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function CapitalDams({ flows }: { flows: DammedFlow[] }) {
  const max = Math.max(...flows.map((f) => f.waiting.value), 1)
  const byType = blockedByType()
  const maxType = Math.max(...byType.map((t) => t.usd), 1)

  const groups = ORDER.map((type) => ({
    type,
    flows: flows.filter((f) => f.blocker === type).sort((a, b) => b.waiting.value - a.waiting.value),
  })).filter((g) => g.flows.length > 0)

  return (
    <div className="space-y-8">
      {/* summary: which blocker dams the most */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500 mb-2">
          Which blocker dams the most capital
        </p>
        <div className="space-y-1.5">
          {byType.map((t) => (
            <div key={t.type} className="flex items-center gap-2">
              <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-wide text-ink-400">
                {BLOCKER_META[t.type].label}
              </span>
              <div className="flex-1 h-2.5">
                <div
                  className="h-2.5 rounded-sm"
                  style={{
                    width: `${Math.sqrt(t.usd / maxType) * 100}%`,
                    backgroundColor: '#0ea5e9',
                    opacity: 0.8,
                  }}
                />
              </div>
              <span className="w-16 shrink-0 text-right font-mono text-[10px] tabular-nums text-ink-300">
                {fmtUsdCompact(t.usd)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[9.5px] text-ink-700 leading-relaxed">
          Mixes stocks and annual flows, so read it as relative weight rather than a single
          balance-sheet total. Each row&apos;s scope note states exactly what is counted.
        </p>
      </div>

      {/* the dams themselves, grouped by blocker */}
      {groups.map(({ type, flows: groupFlows }) => (
        <div key={type}>
          <div className="mb-2">
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-100">
              {BLOCKER_META[type].label}
            </p>
            <p className="text-ink-400 text-[12px] leading-snug">{BLOCKER_META[type].short}</p>
            <p className="font-mono text-[10px] text-ink-600 mt-0.5">
              unblocked by: {BLOCKER_META[type].who}
            </p>
          </div>
          <div className="border border-hair rounded-lg overflow-hidden">
            {groupFlows.map((f) => (
              <FlowRow key={f.slug} flow={f} max={max} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
