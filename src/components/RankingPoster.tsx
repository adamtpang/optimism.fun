import Link from 'next/link'
import { problems } from '@/data/problems'
import { computeRadarRows } from '@/lib/radar'
import { formatMeasure, logBarPercent, neglectColor } from '@/lib/charts'

/**
 * The whole ranking as one poster. Bar length is humans affected, log scale.
 * Color is neglectedness. Rank matches the homepage. No new numbers.
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

  const values = rows.map((row) => row.people)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const updated = [...problems.map((p) => p.lastUpdated ?? p.asOf)].sort().at(-1)

  return (
    <figure className="bg-[#f4f1ea] text-[#161616] px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-[#0369a1]">
          optimism.fun
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-black/50">CC BY 4.0</p>
      </div>
      <h2 className="font-serif text-3xl sm:text-5xl leading-[1.05] mt-3 text-[#121212]">
        Humanity&rsquo;s hardest problems, by how many people they reach.
      </h2>
      <p className="mt-3 text-sm sm:text-base text-black/70 max-w-2xl">
        Longer bar, more people, on a log scale. Color runs from funded to neglected. The order is the site ranking.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-black/70">
        <span>Funded</span>
        <span
          className="h-2 w-28 sm:w-40"
          style={{ background: 'linear-gradient(90deg, rgb(8, 145, 178), rgb(190, 18, 60))' }}
          aria-hidden
        />
        <span>Neglected</span>
        <span className="font-mono text-[10px] uppercase tracking-wider">Score is out of 10</span>
      </div>

      <ol className="mt-6">
        {rows.map((row) => {
          const width = logBarPercent(row.people, min, max)
          const color = neglectColor(row.neglectedness)
          const score = row.neglectedness == null ? 'unscored' : `${row.neglectedness}/10 neglected`
          return (
            <li key={row.slug} className="border-t border-black/10">
              <Link
                href={`/p/${row.slug}`}
                className="block py-3 hover:bg-black/[0.03] focus-visible:bg-black/[0.04]"
                aria-label={`${row.rank}. ${row.name}. ${formatMeasure(row.people)} ${row.unit}. ${score}.`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs tabular-nums text-black/45 w-6">{String(row.rank).padStart(2, '0')}</span>
                  <span className="font-serif text-lg sm:text-2xl leading-tight flex-1 min-w-0">{row.name}</span>
                  <span className="font-mono text-sm sm:text-base tabular-nums">{formatMeasure(row.people)}</span>
                </div>
                <p className="text-xs text-black/55 mt-1 pl-9">{row.unit}</p>
                <div className="mt-2 ml-9 h-2.5 bg-black/[0.06]" aria-hidden>
                  <div className="h-full" style={{ width: `${width}%`, background: color }} />
                </div>
              </Link>
            </li>
          )
        })}
      </ol>

      <figcaption className="mt-4 pt-4 border-t border-black/10 text-xs text-black/60 leading-relaxed">
        Each count is the humans-affected figure on that problem, with its own source and unit. Neglectedness is the stored 0 to 10 score.
        {updated ? ` Figures reviewed through ${updated}.` : ''}{' '}
        <Link href="/data" className="underline decoration-dotted text-[#0369a1]">
          Download the data
        </Link>
        .
      </figcaption>
    </figure>
  )
}
