'use client'

/**
 * The supply-demand index — every problem ranked by how far its share of the
 * world's effort falls short of its share of the world's need.
 *
 * Encoding: position carries the ranking, one accent hue carries magnitude,
 * and the verdict is stated in words as well as colour so it never depends on
 * hue alone. The ratio is the mark; the per-signal breakdown expands.
 */
import { useState } from 'react'
import Link from 'next/link'
import type { SupplyDemandRow } from '@/lib/supply-demand'
import type { AllocationVerdict } from '@/data/types'
import { fmtRatio } from '@/lib/allocation'

const VERDICT: Record<AllocationVerdict, { label: string; tone: string }> = {
  underallocated: { label: 'under-supplied', tone: 'text-amber-300' },
  balanced: { label: 'proportional', tone: 'text-ink-400' },
  overallocated: { label: 'over-supplied', tone: 'text-terminal-rose' },
}

/** Log position of a ratio on a 0.01x -> 100x track, as a percentage. */
function trackPct(ratio: number): number {
  const clamped = Math.min(100, Math.max(0.01, ratio))
  return ((Math.log10(clamped) + 2) / 4) * 100
}

function Row({ row }: { row: SupplyDemandRow }) {
  const [open, setOpen] = useState(false)
  if (row.meanRatio == null) return null
  const v = VERDICT[row.verdict ?? 'balanced']
  const pct = trackPct(row.meanRatio)
  const under = row.meanRatio < 1

  return (
    <div className="border-b border-hair last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left px-3 py-3 hover:bg-ink-800/30 transition-colors"
      >
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <span className="font-sans text-[14px] text-ink-100">{row.name}</span>
          <span className="shrink-0 font-mono text-[11px]">
            <span className={v.tone}>{fmtRatio(row.meanRatio)}</span>
            <span className="text-ink-600"> {v.label}</span>
          </span>
        </div>

        {/* log track, 0.01x -> 100x, with parity marked */}
        <div className="relative h-2.5">
          <div className="absolute inset-x-0 top-1 h-0.5 bg-ink-800 rounded-full" />
          {/* parity line at 1x */}
          <div
            className="absolute top-0 h-2.5 w-px bg-ink-600"
            style={{ left: '50%' }}
            aria-hidden="true"
          />
          <div
            className="absolute top-0 h-2.5 w-1.5 rounded-sm"
            style={{
              left: `calc(${pct}% - 3px)`,
              backgroundColor: under ? '#fcd34d' : '#0ea5e9',
            }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] text-ink-700 mt-0.5">
          <span>0.01×</span>
          <span>parity</span>
          <span>100×</span>
        </div>
      </button>

      {open && (
        <div className="px-3 pb-4 space-y-2 bg-ink-900/40">
          <p className="font-mono text-[10px] text-ink-500">
            {(row.demandShare * 100).toFixed(1)}% of measured demand
          </p>
          {row.signals.map((s) => (
            <div key={s.kind} className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[11px] text-ink-300">
                {s.label}
                <span className="text-ink-600">
                  {' '}
                  {s.value.toLocaleString()} {s.unit}
                </span>
              </span>
              <span className="font-mono text-[11px] shrink-0">
                <span className="text-ink-500">{(s.share * 100).toFixed(1)}% of world </span>
                <span className={VERDICT[s.verdict].tone}>{fmtRatio(s.ratio)}</span>
              </span>
            </div>
          ))}
          <Link
            href={`/p/${row.slug}`}
            className="inline-block font-mono text-[10px] text-amber-300 hover:underline pt-1"
          >
            the problem →
          </Link>
        </div>
      )}
    </div>
  )
}

export default function SupplyDemandIndex({ rows }: { rows: SupplyDemandRow[] }) {
  return (
    <div>
      <div className="border border-hair rounded-lg overflow-hidden">
        {rows.map((r) => (
          <Row key={r.slug} row={r} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] text-ink-500">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-1.5 h-2.5 rounded-sm"
            style={{ backgroundColor: '#fcd34d' }}
          />
          under-supplied — less effort than its share of need
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-1.5 h-2.5 rounded-sm"
            style={{ backgroundColor: '#0ea5e9' }}
          />
          over-supplied
        </span>
        <span>click a row for the per-signal breakdown</span>
      </div>
    </div>
  )
}
