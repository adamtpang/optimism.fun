import type { Trend } from '@/data/types'

/**
 * A dependency-free inline-SVG sparkline for a problem's scale series.
 * Our-World-in-Data feel: a thin line, a soft area wash, an endpoint dot.
 * Colored by trend so direction reads at a glance. Pure static SVG, so it
 * costs nothing at runtime and renders fine inside an OG image too.
 */

const TREND_COLOR: Record<Trend, string> = {
  improving: 'rgb(var(--terminal-green))',
  worsening: 'rgb(var(--terminal-rose))',
  flat: 'rgb(var(--ink-400))',
}

export default function Sparkline({
  series,
  trend = 'flat',
  width = 132,
  height = 36,
  strokeWidth = 1.5,
  className = '',
  ariaLabel,
}: {
  series: { year: number; value: number }[]
  trend?: Trend
  width?: number
  height?: number
  strokeWidth?: number
  className?: string
  ariaLabel?: string
}) {
  if (!series || series.length < 2) return null

  const pad = strokeWidth + 1
  const xs = series.map((d) => d.year)
  const ys = series.map((d) => d.value)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1

  const px = (x: number) => pad + ((x - minX) / spanX) * (width - pad * 2)
  // Higher value plots higher on screen (smaller y).
  const py = (y: number) => pad + (1 - (y - minY) / spanY) * (height - pad * 2)

  const pts = series.map((d) => `${px(d.year).toFixed(1)},${py(d.value).toFixed(1)}`)
  const line = pts.join(' ')
  const area = `${px(minX).toFixed(1)},${(height - pad).toFixed(1)} ${line} ${px(maxX).toFixed(1)},${(height - pad).toFixed(1)}`
  const last = series[series.length - 1]
  const color = TREND_COLOR[trend]
  const gid = `spark-${minX}-${maxX}-${Math.round(maxY)}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={
        ariaLabel ??
        `Trend ${trend}, from ${minY.toLocaleString()} in ${minX} to ${last.value.toLocaleString()} in ${last.year}`
      }
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={px(last.year)} cy={py(last.value)} r={strokeWidth + 0.6} fill={color} />
    </svg>
  )
}
