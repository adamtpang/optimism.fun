import type { Problem } from '@/data/types'
import { problemDataset } from '@/lib/open-data'
import { formatMeasure } from '@/lib/charts'
import { loadProblemOwidChart } from '@/lib/owid-chart'
import MetricChart from '@/components/MetricChart'

function SourceLink({ source, href }: { source: string; href: string | null }) {
  if (!href) return <p className="text-xs text-ink-500 mt-2 leading-snug">{source}</p>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-xs text-primary underline decoration-dotted underline-offset-2 mt-2 leading-snug hover:text-primary"
    >
      {source}
    </a>
  )
}

export default async function ProblemNumbers({ problem }: { problem: Problem }) {
  const data = problemDataset(problem.slug)
  if (!data) return null
  const scale = problem.scale
  const hasSeries = (scale?.series?.length ?? 0) >= 2
  const blocks = data.metrics.filter((metric) => metric.id !== 'scale' && metric.id !== 'humans_affected' && metric.id !== 'related_deaths')
  const owid = await loadProblemOwidChart(problem.slug)

  return (
    <section className="site-shell py-10 border-b border-hair">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
        <h2 className="font-serif text-2xl text-ink-100">The numbers</h2>
        <p className="font-mono text-small text-ink-500">
          Updated {data.lastUpdated}
          {' · '}
          <a className="text-primary hover:underline" href={`/api/problems/${problem.slug}/csv`}>
            CSV
          </a>
          {' · '}
          <a className="text-primary hover:underline" href={`/api/problems/${problem.slug}`}>
            JSON
          </a>
        </p>
      </div>

      {hasSeries && scale?.series ? (
        <MetricChart
          title={problem.name}
          unit={scale.unit}
          series={scale.series}
          source={scale.source}
          sourceUrl={scale.sourceUrl}
          asOf={scale.asOf}
        />
      ) : (
        <div className="border border-hair p-4">
          <p className="font-mono text-3xl tabular-nums text-ink-100">
            {scale ? formatMeasure(scale.value) : '·'}
          </p>
          <p className="text-sm text-ink-400 mt-1">{scale?.unit ?? 'No headline measure is stored.'}</p>
          <p className="text-sm text-ink-500 mt-3">No time series is stored for this measure.</p>
          {scale && <SourceLink source={scale.source} href={scale.sourceUrl ?? null} />}
        </div>
      )}

      {owid.state === 'ok' && (
        <div className="mt-3">
          <p className="font-mono text-sm uppercase tracking-wider text-ink-500 mb-2">
            Live trend · Our World in Data
          </p>
          <MetricChart
            title={owid.chart.title}
            unit={owid.chart.unit}
            series={owid.chart.series}
            source={`${owid.chart.citation} CC BY 4.0.`}
            sourceUrl={owid.chart.url}
            asOf={owid.chart.asOf}
          />
        </div>
      )}
      {owid.state === 'unavailable' && (
        <p className="text-sm text-ink-500 mt-3">Our World in Data trend unavailable right now.</p>
      )}

      {blocks.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {blocks.map((metric) => (
            <div key={metric.id} className="border border-hair p-4">
              <p className="font-mono text-small uppercase tracking-wider text-ink-500">{metric.label}</p>
              <p className="font-mono text-3xl tabular-nums text-ink-100 mt-1">{formatMeasure(metric.value)}</p>
              <p className="text-sm text-ink-400 mt-1">{metric.unit}</p>
              <SourceLink source={metric.source} href={metric.sourceUrl} />
              <p className="font-mono text-small text-ink-500 mt-2">As of {metric.asOf}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
