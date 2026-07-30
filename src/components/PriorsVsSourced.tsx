'use client'

/**
 * Priors vs sourced — a dumbbell, the form for before→after per item.
 *
 * Colour job is ONE HUE IN TWO SHADES, not a diverging red/green: the reader's
 * question is "did it move, and which way", and position already answers the
 * direction. Both steps were validated against the light (#ffffff) and dark
 * (#08080a) surfaces with the palette validator — an earlier, prettier pick
 * (#bae6fd) failed the light-mode contrast floor at 1.33:1 and was replaced.
 *
 * Rows are sorted by size of error, so the systematic direction of the bias is
 * the first thing the eye gets. Correct rows collapse to a single ringed dot,
 * which reads as "no change" without needing a label.
 */
import { useState } from 'react'
import { CROWDING_ORDER, type PriorComparison } from '@/lib/prior-accuracy'

/** Validated ordinal pair: light end clears white, dark end clears near-black. */
const PRIOR_HUE = '#38bdf8'
const SOURCED_HUE = '#075985'

const W = 720
const ROW_H = 24 // also the hover hit-target height
const PAD = { l: 208, r: 56, t: 26, b: 34 } // b includes the axis band

const BAND_X = [0.15, 0.5, 0.85] // ordinal positions across the plot

export default function PriorsVsSourced({ rows }: { rows: PriorComparison[] }) {
  const [hover, setHover] = useState<string | null>(null)

  if (rows.length === 0) return null

  const plotW = W - PAD.l - PAD.r
  const H = PAD.t + rows.length * ROW_H + PAD.b
  const x = (band: string) => PAD.l + BAND_X[CROWDING_ORDER.indexOf(band as never)] * plotW
  const rowY = (i: number) => PAD.t + i * ROW_H + ROW_H / 2

  // Label only the single most extreme error; the rest live in hover + table.
  const extreme = rows.find((r) => !r.correct) ?? null

  const hovered = hover ? rows.find((r) => r.slug === hover) : null

  return (
    <div className="w-full">
      {/* legend — mandatory for two series */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-2 font-mono text-[10px] text-ink-400">
        <span className="flex items-center gap-1.5">
          <svg width="10" height="10" aria-hidden="true">
            <circle cx="5" cy="5" r="4.5" fill={PRIOR_HUE} />
          </svg>
          my guess
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="10" height="10" aria-hidden="true">
            <circle cx="5" cy="5" r="4.5" fill={SOURCED_HUE} />
          </svg>
          what the data found
        </span>
        <span className="text-ink-600">a single ringed dot means the guess was right</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Editorial crowding guesses compared with sourced competitor counts, per quest"
      >
        {/* band gridlines — hairline, solid, recessive */}
        {CROWDING_ORDER.map((band) => (
          <g key={band}>
            <line
              x1={x(band)}
              y1={PAD.t - 8}
              x2={x(band)}
              y2={H - PAD.b}
              stroke="rgb(var(--line))"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
            <text
              x={x(band)}
              y={H - PAD.b + 16}
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-mono, monospace)"
              className="fill-current text-ink-500"
            >
              {band}
            </text>
          </g>
        ))}

        {rows.map((r, i) => {
          const y = rowY(i)
          const xp = x(r.prior)
          const xs = x(r.sourced)
          const active = hover === r.slug
          return (
            <g
              key={r.slug}
              onMouseEnter={() => setHover(r.slug)}
              onMouseLeave={() => setHover(null)}
            >
              {/* full-row hit target, taller than the marks */}
              <rect x={0} y={y - ROW_H / 2} width={W} height={ROW_H} fill="transparent" />

              <text
                x={PAD.l - 14}
                y={y + 3.5}
                textAnchor="end"
                fontSize="11"
                className={active ? 'fill-current text-ink-100' : 'fill-current text-ink-400'}
              >
                {r.title.length > 30 ? `${r.title.slice(0, 29)}…` : r.title}
              </text>

              {/* connector — 2px, only when the guess moved */}
              {!r.correct && (
                <line
                  x1={xp}
                  y1={y}
                  x2={xs}
                  y2={y}
                  stroke={SOURCED_HUE}
                  strokeWidth="2"
                  strokeOpacity={active ? 0.9 : 0.5}
                  strokeLinecap="round"
                />
              )}

              {/* prior dot, with a surface ring so it stays legible where it overlaps */}
              <circle cx={xp} cy={y} r={4.5} fill={PRIOR_HUE} stroke="rgb(var(--bg))" strokeWidth="2" />
              {/* sourced dot — drawn last so it wins the overlap on correct rows */}
              <circle cx={xs} cy={y} r={4.5} fill={SOURCED_HUE} stroke="rgb(var(--bg))" strokeWidth="2" />

              {/* one selective direct label, on the single worst miss */}
              {extreme?.slug === r.slug && (
                <text
                  x={xs + 12}
                  y={y + 3.5}
                  fontSize="10"
                  fontFamily="var(--font-mono, monospace)"
                  className="fill-current text-ink-300"
                >
                  {r.competitorCount} already building
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* hover readout — never the only way to a value; the table has them all */}
      <p className="mt-2 font-mono text-[11px] text-ink-400 min-h-[1.25rem]">
        {hovered ? (
          <>
            <span className="text-ink-100">{hovered.title}</span>
            {' — guessed '}
            <span className="text-ink-200">{hovered.prior}</span>
            {', found '}
            <span className="text-ink-200">{hovered.sourced}</span>
            {` (${hovered.competitorCount} building)`}
            {hovered.correct ? ' · guess held' : ' · guess overturned'}
          </>
        ) : (
          'hover a row for the counts'
        )}
      </p>
    </div>
  )
}

/** The WCAG-clean twin. Every value here, nothing gated behind hover. */
export function PriorsVsSourcedTable({ rows }: { rows: PriorComparison[] }) {
  return (
    <table className="w-full border-collapse font-mono text-[11px]">
      <thead>
        <tr className="text-ink-500 text-left">
          <th className="py-1 pr-3 font-normal">Quest</th>
          <th className="py-1 pr-3 font-normal">Guessed</th>
          <th className="py-1 pr-3 font-normal">Found</th>
          <th className="py-1 pr-3 font-normal text-right">Building</th>
          <th className="py-1 font-normal">Verdict</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.slug} className="border-t border-hair">
            <td className="py-1 pr-3 text-ink-300">{r.title}</td>
            <td className="py-1 pr-3 text-ink-400">{r.prior}</td>
            <td className="py-1 pr-3 text-ink-200">{r.sourced}</td>
            <td className="py-1 pr-3 text-ink-200 text-right tabular-nums">
              {r.competitorCount}
            </td>
            <td className="py-1 text-ink-500">{r.correct ? 'held' : 'overturned'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
