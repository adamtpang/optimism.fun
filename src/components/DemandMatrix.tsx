'use client'

/**
 * The demand matrix — problems × signal classes. Identity is carried by
 * position (row = problem, column = class), magnitude by a sequential fill of
 * the single accent hue; classes fed by a live API carry a green dot. No
 * categorical palette needed, which is the point: the matrix reads in
 * grayscale, print, and every kind of color vision.
 *
 * Attention is deliberately absent: it is crowding, not demand — the model's
 * core stance (see lib/demand.ts).
 */
import { useState } from 'react'
import Link from 'next/link'
import type { DemandRow, LiveDemandComponent } from '@/lib/demand-live'

const CLASS_ORDER = ['burden', 'wtp', 'capital', 'research', 'policy', 'expert', 'queues'] as const
const CLASS_SHORT: Record<(typeof CLASS_ORDER)[number], string> = {
  burden: 'Burden',
  wtp: 'WTP',
  capital: 'Capital',
  research: 'Research',
  policy: 'Policy',
  expert: 'Expert',
  queues: 'Queues',
}

function fmtLive(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 10_000) return `${Math.round(v / 1000)}k`
  if (v >= 100) return `${Math.round(v)}`
  return `${Math.round(v * 10) / 10}`
}

type CellRef = { slug: string; cls: (typeof CLASS_ORDER)[number] } | null

export default function DemandMatrix({ rows }: { rows: DemandRow[] }) {
  const [cell, setCell] = useState<CellRef>(null)

  const selected = cell
    ? {
        row: rows.find((r) => r.slug === cell.slug),
        comp: rows
          .find((r) => r.slug === cell.slug)
          ?.components.find((c) => c.class === cell.cls) as LiveDemandComponent | undefined,
      }
    : null

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="text-left font-sans text-[11px] font-medium text-ink-500 pb-2 pr-3">
                Problem
              </th>
              {CLASS_ORDER.map((c) => (
                <th
                  key={c}
                  className="font-mono text-[10px] uppercase tracking-wider text-ink-500 pb-2 px-1 text-center font-normal"
                >
                  {CLASS_SHORT[c]}
                </th>
              ))}
              <th className="font-mono text-[10px] uppercase tracking-wider text-ink-500 pb-2 pl-2 text-right font-normal">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="group">
                <td className="pr-3 py-[3px]">
                  <Link
                    href={`/p/${r.slug}`}
                    className="font-sans text-[12.5px] text-ink-300 group-hover:text-ink-100 transition-colors whitespace-nowrap"
                  >
                    {r.name}
                  </Link>
                </td>
                {CLASS_ORDER.map((clsName) => {
                  const comp = r.components.find((c) => c.class === clsName) as
                    | LiveDemandComponent
                    | undefined
                  const strength = comp?.strength ?? null
                  const live = comp?.live ?? null
                  const isSel = cell?.slug === r.slug && cell?.cls === clsName
                  return (
                    <td key={clsName} className="px-[1px] py-[3px]">
                      <button
                        type="button"
                        onMouseEnter={() => setCell({ slug: r.slug, cls: clsName })}
                        onFocus={() => setCell({ slug: r.slug, cls: clsName })}
                        className={`relative block w-full h-7 rounded-[3px] transition-shadow ${
                          isSel ? 'ring-1 ring-amber-300' : ''
                        }`}
                        style={
                          strength != null
                            ? // alpha lives in the fill, so the live dot, selection
                              // ring, and keyboard focus outline paint at full opacity
                              { backgroundColor: `rgba(14,165,233,${(0.14 + 0.72 * strength).toFixed(3)})` }
                            : { boxShadow: 'inset 0 0 0 1px rgb(var(--line) / 0.25)' }
                        }
                        aria-label={`${r.name} — ${comp?.label ?? clsName}: ${
                          strength != null ? Math.round(strength * 100) : 'no signal yet'
                        }`}
                      >
                        {live ? (
                          <span
                            className="absolute top-[3px] right-[3px] w-[5px] h-[5px] rounded-full"
                            style={{ backgroundColor: 'rgb(var(--terminal-green))' }}
                          />
                        ) : null}
                      </button>
                    </td>
                  )
                })}
                <td className="pl-2 py-[3px] text-right font-mono text-[12px] tabular-nums text-ink-100">
                  {r.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* legend + inspector */}
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] text-ink-500">
          <span className="flex items-center gap-1.5">
            {[0.15, 0.35, 0.6, 0.86].map((o) => (
              <span
                key={o}
                className="inline-block w-4 h-3 rounded-[2px]"
                style={{ backgroundColor: `rgba(14,165,233,${o})` }}
              />
            ))}
            <span className="ml-1">signal strength, weak → strong</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-[5px] h-[5px] rounded-full"
              style={{ backgroundColor: 'rgb(var(--terminal-green))' }}
            />
            live API feed
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-4 h-3 rounded-[2px]"
              style={{ boxShadow: 'inset 0 0 0 1px rgb(var(--line) / 0.35)' }}
            />
            no credible signal yet — class drops from the blend
          </span>
        </div>

        <p className="font-mono text-[11px] text-ink-400 min-h-[2.5rem] leading-relaxed">
          {selected?.row && selected.comp ? (
            <>
              <span className="text-ink-100">{selected.row.name}</span>
              {' · '}
              <span className="text-ink-200">{selected.comp.label}</span>
              {selected.comp.strength != null ? (
                <>
                  {' — strength '}
                  <span className="text-amber-300 tabular-nums">
                    {Math.round(selected.comp.strength * 100)}
                  </span>
                  /100
                </>
              ) : (
                ' — no credible signal yet; awaiting a live feed'
              )}
              {selected.comp.live ? (
                <>
                  <br />
                  <span className="text-ink-300">
                    {selected.comp.live.label}:{' '}
                    <span className="text-ink-100 tabular-nums">
                      {fmtLive(selected.comp.live.value)} {selected.comp.live.unit}
                    </span>{' '}
                    ({selected.comp.live.asOf}) ·{' '}
                    {selected.comp.live.url ? (
                      <a
                        href={selected.comp.live.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:underline"
                      >
                        {selected.comp.live.source} ↗
                      </a>
                    ) : (
                      selected.comp.live.source
                    )}
                  </span>
                </>
              ) : selected.comp.source ? (
                <>
                  <br />
                  <span className="text-ink-500">source: {selected.comp.source}</span>
                </>
              ) : null}
            </>
          ) : (
            'hover a cell to inspect the signal behind it — every number cites its source'
          )}
        </p>
      </div>
    </div>
  )
}
