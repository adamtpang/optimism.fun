'use client'

/**
 * The power law of demand — every problem ranked by composite demand score.
 * The visual argument: measured demand is not uniform, it falls off a cliff,
 * and the head of the curve is where a founder's attention belongs.
 *
 * Dependency-free SVG, same idiom as AllocationQuadrant. Magnitude of a
 * single measure → one hue (the accent), never a rainbow; identity lives in
 * the row labels, not in color.
 */
import { useState } from 'react'
import Link from 'next/link'

export type PowerLawRow = {
  slug: string
  name: string
  score: number // 0..100
  corroboration: number
  considered: number
}

const ROW_H = 30
const BAR_H = 16
const PAD = { l: 180, r: 56, t: 8, b: 26 }
const W = 720

export default function DemandPowerLaw({ rows }: { rows: PowerLawRow[] }) {
  const [hover, setHover] = useState<string | null>(null)

  if (rows.length === 0) return null
  const H = PAD.t + rows.length * ROW_H + PAD.b
  const max = Math.max(...rows.map((r) => r.score), 1)
  const x = (v: number) => PAD.l + (v / max) * (W - PAD.l - PAD.r)

  const total = rows.reduce((s, r) => s + r.score, 0)
  const top3Share = total > 0
    ? Math.round((rows.slice(0, 3).reduce((s, r) => s + r.score, 0) / total) * 100)
    : 0

  const hovered = hover ? rows.find((r) => r.slug === hover) : null

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Problems ranked by composite demand score"
      >
        {/* recessive grid */}
        {[0, 25, 50, 75, 100].map((t) =>
          t <= max ? (
            <g key={t}>
              <line
                x1={x(t)}
                y1={PAD.t}
                x2={x(t)}
                y2={H - PAD.b}
                stroke="rgb(var(--line))"
                strokeOpacity="0.12"
              />
              <text
                x={x(t)}
                y={H - PAD.b + 16}
                textAnchor="middle"
                className="fill-current text-ink-600"
                fontSize="9"
                fontFamily="var(--font-mono, monospace)"
              >
                {t}
              </text>
            </g>
          ) : null,
        )}

        {rows.map((r, i) => {
          const yTop = PAD.t + i * ROW_H + (ROW_H - BAR_H) / 2
          const active = hover === r.slug
          return (
            <a
              key={r.slug}
              href={`/p/${r.slug}`}
              aria-label={`${r.name}, demand ${r.score} — open problem page`}
              onMouseEnter={() => setHover(r.slug)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(r.slug)}
              onBlur={() => setHover(null)}
              className="cursor-pointer"
            >
              {/* row-wide hit target, bigger than the mark */}
              <rect
                x={0}
                y={PAD.t + i * ROW_H}
                width={W}
                height={ROW_H}
                fill="transparent"
              />
              <text
                x={PAD.l - 10}
                y={yTop + BAR_H / 2 + 3.5}
                textAnchor="end"
                fontSize="11"
                className={active ? 'fill-current text-ink-100' : 'fill-current text-ink-300'}
              >
                {r.name.length > 26 ? `${r.name.slice(0, 25)}…` : r.name}
              </text>
              <rect
                x={PAD.l}
                y={yTop}
                width={Math.max(2, x(r.score) - PAD.l)}
                height={BAR_H}
                rx={3}
                fill="#0ea5e9"
                fillOpacity={active ? 1 : 0.82}
              />
              <text
                x={x(r.score) + 8}
                y={yTop + BAR_H / 2 + 3.5}
                fontSize="10.5"
                fontFamily="var(--font-mono, monospace)"
                className="fill-current text-ink-200 tabular-nums"
              >
                {r.score}
              </text>
            </a>
          )
        })}
      </svg>

      {/* hover inspector + the power-law annotation */}
      <div className="mt-2 flex items-baseline justify-between gap-4 font-mono text-[11px]">
        <span className="text-ink-400 min-h-[1.25rem]">
          {hovered ? (
            <>
              <Link href={`/p/${hovered.slug}`} className="text-amber-300 hover:underline">
                {hovered.name}
              </Link>
              {' — demand '}
              <span className="text-ink-100 tabular-nums">{hovered.score}</span>
              {', corroborated by '}
              <span className="text-ink-100 tabular-nums">{hovered.corroboration}</span>
              {` of ${hovered.considered} signal classes`}
            </>
          ) : (
            'hover a bar · click it to open the problem'
          )}
        </span>
        <span className="text-ink-500 whitespace-nowrap">
          top 3 = <span className="text-amber-300 tabular-nums">{top3Share}%</span> of measured demand
        </span>
      </div>
    </div>
  )
}
