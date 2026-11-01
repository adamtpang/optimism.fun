import { formatMeasure, lineLayout, type SeriesPoint } from '@/lib/charts'
import Figure from '@/components/charts/Figure'

/** Mobile tick text only. Three significant figures, same units as formatMeasure. */
function formatMobileTick(n: number): string {
  if (!Number.isFinite(n)) return ''
  if (n === 0) return '0'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  const exp = Math.floor(Math.log10(abs))
  const pow = 10 ** (exp - 2)
  const rounded = Math.round(abs / pow) * pow
  return sign + formatMeasure(rounded)
}

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

  // Phone width is about 320px of plot. A 640-wide viewBox scaled into that
  // box draws 14px type at about 7px, so the narrow layout uses its own box.
  const mobileWidth = 320
  const mobileHeight = 220
  const mobile = lineLayout(series, mobileWidth, mobileHeight, { l: 72, r: 72, t: 16, b: 44 })
  const mobileLine = mobile.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const mobileLast = mobile.points[mobile.points.length - 1]
  const mobileYearCandidates = Array.from({ length: 4 }, (_, i) => {
    const year = Math.round(mobile.minX + ((mobile.maxX - mobile.minX) * i) / 3)
    return year
  }).filter((year, index, all) => all.indexOf(year) === index)
  // Four labels crowd a short span (2022 sits on 2023). Fall back to the ends and the middle.
  const mobileYearsCrowded = mobileYearCandidates.some(
    (year, index) => index > 0 && mobile.px(year) - mobile.px(mobileYearCandidates[index - 1]) < 48,
  )
  const mobileYears = mobileYearsCrowded
    ? [mobile.minX, Math.round((mobile.minX + mobile.maxX) / 2), mobile.maxX].filter(
        (year, index, all) => all.indexOf(year) === index,
      )
    : mobileYearCandidates
  const mobileYTicks =
    mobile.dataMin === mobile.dataMax
      ? [mobile.dataMin]
      : [0, 1, 2].map((i) => mobile.dataMin + ((mobile.dataMax - mobile.dataMin) * i) / 2)
  const endLabel = formatMobileTick(last.value)
  // Bold 16px digits are about 10 user units wide. The right margin is the room beside the final dot.
  const endWidth = endLabel.length * 10
  const endGap = 12
  const fitsRight = mobileLast.x + endGap + endWidth <= mobileWidth - 4
  const endX = fitsRight ? mobileLast.x + endGap : Math.max(endWidth + 2, mobileLast.x - endGap)
  const endAnchor = fitsRight ? 'start' : 'end'
  // Same row as the final dot, so the value is not read as an earlier year.
  const endY = mobileLast.y

  return (
    <Figure title={title} subtitle={unit} source={caption}>
      <svg viewBox={`0 0 ${mobileWidth} ${mobileHeight}`} role="img" aria-label={label} className="md:hidden w-full h-auto">
        {mobileYTicks.map((tick) => {
          const y = mobile.py(tick)
          return (
            <g key={tick}>
              <line
                x1={mobile.pad.l}
                x2={mobileWidth - mobile.pad.r}
                y1={y}
                y2={y}
                stroke="var(--chart-grid)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text x={mobile.pad.l - 6} y={y} textAnchor="end" dominantBaseline="middle" className="fill-neutral-600" style={{ fontSize: '16px' }}>
                {formatMobileTick(tick)}
              </text>
            </g>
          )
        })}
        <polyline
          points={mobileLine}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {(series.length > 40 ? [mobile.points[0], mobile.points[mobile.points.length - 1]] : mobile.points).map(
          (p) => (
            <circle key={p.year} cx={p.x} cy={p.y} r={p.year === last.year ? 4 : 2.5} fill="var(--chart-1)" />
          ),
        )}
        {!fitsRight && (
          <line
            x1={mobileLast.x + 5}
            y1={mobileLast.y}
            x2={endAnchor === 'end' ? endX + 2 : endX - 2}
            y2={endY}
            stroke="var(--chart-1)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        )}
        <text
          x={endX}
          y={endY}
          textAnchor={endAnchor}
          dominantBaseline="middle"
          fill="var(--chart-1)"
          style={{ fontSize: '16px', fontWeight: 600 }}
        >
          {endLabel}
        </text>
        {mobileYears.map((year) => (
          <text
            key={year}
            x={mobile.px(year)}
            y={mobileHeight - 14}
            textAnchor="middle"
            className="fill-neutral-600"
            style={{ fontSize: '16px' }}
          >
            {year}
          </text>
        ))}
      </svg>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="hidden md:block w-full h-auto">
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
