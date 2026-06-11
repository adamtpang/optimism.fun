'use client'

/**
 * The Allocation Quadrant — Gartner-Magic-Quadrant move, applied to humanity:
 * every problem plotted by demand (y) against the capital actually flowing at
 * it (x, log scale). Median splits make four quadrants; the top-left is the
 * product: THE GAPS — high demand, thin capital. Dependency-free SVG.
 */
import { useState } from 'react'
import type { AllocationVerdict, CapitalMomentum } from '@/data/types'
import { fmtUsdCompact } from '@/lib/allocation'

export type QuadrantPoint = {
  slug: string
  name: string
  demand: number // 0..100
  capitalUsd: number
  verdict: AllocationVerdict | null
  momentum: CapitalMomentum | null
}

const VERDICT_COLOR: Record<AllocationVerdict, string> = {
  underallocated: '#0ea5e9', // the accent — underallocation IS the opportunity
  balanced: 'rgb(var(--ink-400))',
  overallocated: 'rgb(var(--terminal-rose))',
}

const MOMENTUM_ARROW: Record<CapitalMomentum, string> = {
  rising: '↗',
  falling: '↘',
  flat: '→',
}

const W = 720
const H = 430
const PAD = { l: 56, r: 24, t: 30, b: 46 }

export default function AllocationQuadrant({ points }: { points: QuadrantPoint[] }) {
  const [hover, setHover] = useState<string | null>(null)

  const pts = points.filter((p) => p.capitalUsd > 0)
  if (pts.length < 3) return null

  const logs = pts.map((p) => Math.log10(p.capitalUsd))
  const xMin = Math.min(...logs) - 0.4
  const xMax = Math.max(...logs) + 0.4
  const x = (usd: number) =>
    PAD.l + ((Math.log10(usd) - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r)
  const y = (demand: number) => PAD.t + (1 - demand / 100) * (H - PAD.t - PAD.b)

  const sortedLog = [...logs].sort((a, b) => a - b)
  const sortedDem = pts.map((p) => p.demand).sort((a, b) => a - b)
  const median = (arr: number[]) =>
    arr.length % 2 ? arr[(arr.length - 1) / 2] : (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2
  const xSplit = PAD.l + ((median(sortedLog) - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r)
  const ySplit = y(median(sortedDem))

  const hovered = hover ? pts.find((p) => p.slug === hover) : null

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Allocation quadrant: demand versus capital flowing per problem"
      >
        {/* frame */}
        <rect
          x={PAD.l}
          y={PAD.t}
          width={W - PAD.l - PAD.r}
          height={H - PAD.t - PAD.b}
          fill="none"
          stroke="rgb(var(--line))"
          strokeOpacity="0.14"
        />
        {/* median split lines */}
        <line
          x1={xSplit}
          y1={PAD.t}
          x2={xSplit}
          y2={H - PAD.b}
          stroke="rgb(var(--line))"
          strokeOpacity="0.14"
          strokeDasharray="4 4"
        />
        <line
          x1={PAD.l}
          y1={ySplit}
          x2={W - PAD.r}
          y2={ySplit}
          stroke="rgb(var(--line))"
          strokeOpacity="0.14"
          strokeDasharray="4 4"
        />

        {/* quadrant labels */}
        <text x={PAD.l + 10} y={PAD.t + 18} fontSize="11" fill="#0ea5e9" fontFamily="ui-monospace,monospace" letterSpacing="0.12em">
          THE GAPS · high demand, thin capital
        </text>
        <text x={W - PAD.r - 10} y={PAD.t + 18} fontSize="10" fill="rgb(var(--ink-500))" fontFamily="ui-monospace,monospace" textAnchor="end" letterSpacing="0.1em">
          BACKED PRIORITIES
        </text>
        <text x={PAD.l + 10} y={H - PAD.b - 10} fontSize="10" fill="rgb(var(--ink-500))" fontFamily="ui-monospace,monospace" letterSpacing="0.1em">
          WATCHLIST
        </text>
        <text x={W - PAD.r - 10} y={H - PAD.b - 10} fontSize="10" fill="rgb(var(--terminal-rose))" fontFamily="ui-monospace,monospace" textAnchor="end" letterSpacing="0.1em">
          CONSENSUS-CROWDED
        </text>

        {/* axes labels */}
        <text x={(PAD.l + W - PAD.r) / 2} y={H - 12} fontSize="10" fill="rgb(var(--ink-500))" fontFamily="ui-monospace,monospace" textAnchor="middle" letterSpacing="0.1em">
          CAPITAL FLOWING AT IT ($/YR, LOG) →
        </text>
        <text x={16} y={(PAD.t + H - PAD.b) / 2} fontSize="10" fill="rgb(var(--ink-500))" fontFamily="ui-monospace,monospace" textAnchor="middle" letterSpacing="0.1em" transform={`rotate(-90 16 ${(PAD.t + H - PAD.b) / 2})`}>
          DEMAND →
        </text>

        {/* x tick labels at decades */}
        {Array.from({ length: Math.floor(xMax) - Math.ceil(xMin) + 1 }, (_, i) => Math.ceil(xMin) + i)
          .filter((d) => d >= 8 && d <= 13)
          .map((d) => (
            <text
              key={d}
              x={PAD.l + ((d - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r)}
              y={H - PAD.b + 16}
              fontSize="9"
              fill="rgb(var(--ink-600))"
              fontFamily="ui-monospace,monospace"
              textAnchor="middle"
            >
              {fmtUsdCompact(10 ** d)}
            </text>
          ))}

        {/* points */}
        {pts.map((p) => {
          const cx = x(p.capitalUsd)
          const cy = y(p.demand)
          const color = p.verdict ? VERDICT_COLOR[p.verdict] : 'rgb(var(--ink-400))'
          const isHover = hover === p.slug
          return (
            // SVG-native anchor: Next <Link> renders an HTML <a>, invalid inside <svg>.
            <a key={p.slug} href={`/p/${p.slug}`}>
              <g
                onMouseEnter={() => setHover(p.slug)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={cx} cy={cy} r={isHover ? 7 : 5} fill={color} fillOpacity={isHover ? 1 : 0.85} />
                <circle cx={cx} cy={cy} r={11} fill="transparent" />
                <text
                  x={cx + 10}
                  y={cy + 3.5}
                  fontSize="10.5"
                  fill={isHover ? 'rgb(var(--ink-100))' : 'rgb(var(--ink-300))'}
                  fontFamily="ui-monospace,monospace"
                >
                  {p.name}
                  {p.momentum ? ` ${MOMENTUM_ARROW[p.momentum]}` : ''}
                </text>
              </g>
            </a>
          )
        })}
      </svg>

      {/* hover detail + legend */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-ink-500">
        <span className="min-h-[1.2em]">
          {hovered ? (
            <>
              <span className="text-ink-100">{hovered.name}</span> · demand {hovered.demand} ·{' '}
              {fmtUsdCompact(hovered.capitalUsd)}/yr
              {hovered.verdict && (
                <>
                  {' '}
                  ·{' '}
                  <span
                    style={{
                      color: VERDICT_COLOR[hovered.verdict],
                    }}
                  >
                    {hovered.verdict}
                  </span>
                </>
              )}
            </>
          ) : (
            'hover a problem · arrows show capital momentum (3y)'
          )}
        </span>
        <span className="flex items-center gap-3">
          <span><span style={{ color: '#0ea5e9' }}>●</span> underallocated</span>
          <span><span className="text-ink-400">●</span> balanced</span>
          <span><span style={{ color: 'rgb(var(--terminal-rose))' }}>●</span> overallocated</span>
        </span>
      </div>
    </div>
  )
}
