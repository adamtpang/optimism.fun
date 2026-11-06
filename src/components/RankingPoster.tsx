import Link from 'next/link'
import { problems } from '@/data/problems'
import { computeRadarRows } from '@/lib/radar'
import { formatMeasure, decadeBarPercent } from '@/lib/charts'
import NeglectMeter from '@/components/charts/NeglectMeter'

/**
 * The whole ranking as one poster. Bar length is humans affected, log scale.
 * Neglectedness is the meter beside the bar. Rank matches the homepage.
 */
export default function RankingPoster() {
  const ranked = computeRadarRows()
  const bySlug = new Map(problems.map((p) => [p.slug, p]))
  const rows = ranked
    .map((row, index) => {
      const problem = bySlug.get(row.slug)
      const people = problem?.humansAffected?.value
      if (!problem || people == null) return null
      return {
        rank: index + 1,
        slug: row.slug,
        name: row.name,
        people,
        unit: problem.humansAffected.unit,
        neglectedness: problem.neglectedness?.score ?? null,
      }
    })
    .filter((row): row is NonNullable<typeof row> => row != null)

  const updated = [...problems.map((p) => p.lastUpdated ?? p.asOf)].sort().at(-1)

  return (
    <figure className="bg-neutral-50 text-neutral-900 px-4 py-6 sm:px-8 sm:py-8 rounded-xl border border-neutral-200">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-small font-medium text-primary">optimism.fun</p>
        <p className="text-small text-neutral-600">CC BY 4.0</p>
      </div>
      <h2 className="text-h1 mt-3 text-neutral-900">
        Humanity&rsquo;s hardest problems, in rank order.
      </h2>
      <p className="mt-3 text-body text-neutral-700 max-w-[68ch]">
        The order is need against how well each problem is served. Bar length is the stored headline count on a log scale. Those counts are not the same kind of number.
      </p>

      <ol className="mt-6">
        {rows.map((row) => {
          const width = decadeBarPercent(row.people)
          const score = row.neglectedness == null ? 'unscored' : `${row.neglectedness}/10 neglected`
          return (
            <li key={row.slug} className="border-t border-neutral-200">
              <Link
                href={`/p/${row.slug}`}
                className="block py-3 min-h-11 hover:bg-neutral-100 focus-visible:bg-neutral-100"
                aria-label={`${row.rank}. ${row.name}. ${formatMeasure(row.people)} ${row.unit}. ${score}.`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-small tabular-nums text-neutral-600 w-6">{String(row.rank).padStart(2, '0')}</span>
                  <span className="text-h3 leading-tight flex-1 min-w-0">{row.name}</span>
                  <span className="text-body font-semibold tabular-nums text-blue-700">{formatMeasure(row.people)}</span>
                </div>
                <p className="text-small text-neutral-600 mt-1 pl-9">{row.unit}</p>
                <div className="mt-2 ml-9 flex items-center gap-4">
                  <div className="h-3 flex-1 bg-neutral-100 rounded-full overflow-hidden" aria-hidden>
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${width}%` }} />
                  </div>
                  <NeglectMeter score={row.neglectedness} />
                </div>
              </Link>
            </li>
          )
        })}
      </ol>

      <figcaption className="mt-4 pt-4 border-t border-neutral-200 text-small text-neutral-600 leading-relaxed">
        Each count is the humans-affected figure on that problem, with its own source and unit. Neglectedness is the stored 0 to 10 score.
        {updated ? ` Figures reviewed through ${updated}.` : ''}{' '}
        <Link href="/data" className="underline decoration-dotted text-primary">
          Download the data
        </Link>
        .
      </figcaption>
    </figure>
  )
}
