import { formatMeasure, lineLayout, type SeriesPoint } from '@/lib/charts'
import Figure from '@/components/charts/Figure'

/**
 * One sourced series. The line is the stored points only. The source
 * sentence sits in the single caption, including any caveat the file already states.
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
  const height = 320
  const layout = lineLayout(series, width, height, { l: 72, r: 64, t: 28, b: 40 })
  const line = layout.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const first = series[0]
  const last = series[series.length - 1]
  const label = `${title}. ${formatMeasure(first.value)} in ${first.year} to ${formatMeasure(last.value)} in ${last.year}. ${unit}. Log scale is not used. Y axis runs from ${formatMeasure(layout.dataMin)} to ${formatMeasure(layout.dataMax)}.`
  const lastPoint = layout.points[layout.points.length - 1]
  const yearTicks = Array.from({ length: 4 }, (_, i) => {
    const year = Math.round(layout.minX + ((layout.maxX - layout.minX) * i) / 3)
    return year
  }).filter((year, index, all) => all.indexOf(year) === index)

  const caption = (
    <>
      {sourceUrl ? (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
          {source}
        </a>
      ) : (
        source
      )}
      <span> · As of {asOf}</span>
    </>
  )

  return (
    <Figure title={title} subtitle={unit} source={caption}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="w-full h-[240px] md:h-[320px]">
        {layout.ticks.map((tick) => {
          const y = layout.py(tick)
          return (
            <g key={tick}>
              <line
                x1={layout.pad.l}
                x2={width - layout.pad.r}
                y1={y}
                y2={y}
                stroke="var(--chart-grid)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text x={layout.pad.l - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-neutral-600" style={{ fontSize: '14px' }}>
                {formatMeasure(tick)}
              </text>
            </g>
          )
        })}
        <polyline
          points={line}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {(series.length > 40 ? [layout.points[0], layout.points[layout.points.length - 1]] : layout.points).map(
          (p) => (
            <circle key={p.year} cx={p.x} cy={p.y} r={p.year === last.year ? 5 : 3} fill="var(--chart-1)" />
          ),
        )}
        <text
          x={lastPoint.x + 8}
          y={lastPoint.y}
          dominantBaseline="middle"
          fill="var(--chart-1)"
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          {formatMeasure(last.value)}
        </text>
        {yearTicks.map((year) => (
          <text
            key={year}
            x={layout.px(year)}
            y={height - 12}
            textAnchor="middle"
            className="fill-neutral-600"
            style={{ fontSize: '14px' }}
          >
            {year}
          </text>
        ))}
      </svg>
      <details className="px-2">
        <summary className="text-small text-neutral-600 cursor-pointer">Data table</summary>
        <table className="w-full text-small mt-3">
          <thead>
            <tr className="text-left text-neutral-600">
              <th className="py-2 pr-4 font-medium">Year</th>
              <th className="py-2 text-right font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {series.map((point) => (
              <tr key={point.year} className="border-t border-neutral-200">
                <td className="py-2 pr-4 tabular-nums">{point.year}</td>
                <td className="py-2 text-right tabular-nums">{point.value.toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Figure>
  )
}
