import { formatMeasure, lineLayout, type SeriesPoint } from '@/lib/charts'

/**
 * One sourced series. The line is the stored points only. The source
 * sentence sits under the chart, including any caveat the file already states.
 */
export default function MetricChart({
  title,
  unit,
  series,
  source,
  sourceUrl,
  asOf,
}: {
  title: string
  unit: string
  series: SeriesPoint[]
  source: string
  sourceUrl?: string
  asOf: string
}) {
  if (series.length < 2) return null
  const width = 640
  const height = 280
  const layout = lineLayout(series, width, height)
  const line = layout.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const first = series[0]
  const last = series[series.length - 1]
  const label = `${title}. ${formatMeasure(first.value)} in ${first.year} to ${formatMeasure(last.value)} in ${last.year}. ${unit}`

  return (
    <figure className="border border-hair">
      <figcaption className="px-4 pt-4 pb-2">
        <p className="font-serif text-xl text-ink-100">{title}</p>
        <p className="text-sm text-ink-400 mt-1">{unit}</p>
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="w-full h-auto px-2"
      >
        {layout.ticks.map((tick) => {
          const y = layout.py(tick)
          return (
            <g key={tick}>
              <line
                x1={layout.pad.l}
                x2={width - layout.pad.r}
                y1={y}
                y2={y}
                className="stroke-ink-700"
                strokeWidth="1"
              />
              <text
                x={layout.pad.l - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-ink-500"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
              >
                {formatMeasure(tick)}
              </text>
            </g>
          )
        })}
        <polyline
          points={line}
          fill="none"
          className="stroke-amber-300"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {(series.length > 40 ? [layout.points[0], layout.points[layout.points.length - 1]] : layout.points).map(
          (p) => (
            <circle key={p.year} cx={p.x} cy={p.y} r="3.5" className="fill-amber-300" />
          ),
        )}
        {[first, last].map((p) => (
          <text
            key={p.year}
            x={layout.px(p.year)}
            y={height - 8}
            textAnchor="middle"
            className="fill-ink-500"
            fontSize="12"
            fontFamily="ui-monospace, monospace"
          >
            {p.year}
          </text>
        ))}
      </svg>
      <figcaption className="px-4 pb-4 text-sm text-ink-400 leading-relaxed">
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 underline decoration-dotted underline-offset-2 hover:text-amber-200"
          >
            {source}
          </a>
        ) : (
          source
        )}
        <span className="block font-mono text-[11px] text-ink-500 mt-2">As of {asOf}</span>
      </figcaption>
      <details className="border-t border-hair px-4 py-3">
        <summary className="font-mono text-[11px] uppercase tracking-wider text-ink-500 cursor-pointer">
          Data table
        </summary>
        <table className="w-full text-sm mt-3">
          <thead>
            <tr className="font-mono text-[11px] uppercase tracking-wider text-ink-500 text-left">
              <th className="py-1 pr-4">Year</th>
              <th className="py-1 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {series.map((point) => (
              <tr key={point.year} className="border-t border-hair">
                <td className="py-1.5 pr-4 font-mono tabular-nums">{point.year}</td>
                <td className="py-1.5 text-right font-mono tabular-nums">{point.value.toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}
