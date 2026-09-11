/**
 * The burden block on a problem page: the deaths that sit behind the problem,
 * by cause, with the mechanism and the source. Part of the map, not the board.
 *
 * Renders nothing when no cause is mapped to the problem, so a problem with no
 * mortality dimension (pedagogy, loneliness) does not get an empty section.
 */
import { burdenForProblem, DISCLOSURE } from '@/lib/burden'
import { formatHumans } from '@/lib/format'

export default function BurdenBlock({ problemSlug }: { problemSlug: string }) {
  const b = burdenForProblem(problemSlug)
  if (!b) return null

  const sourceUrls = new Map<string, string>()
  for (const c of [...b.counted, ...b.unmeasured, ...b.aggregates]) {
    sourceUrls.set(c.deaths.source, c.deaths.sourceUrl)
  }

  return (
    <section className="border-b border-hair">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
              The burden behind it
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-4xl md:text-5xl tabular-nums text-ink-100">
                {b.deaths > 0 ? formatHumans(b.deaths) : 'unmeasured'}
              </span>
              {b.deaths > 0 && (
                <span className="text-sm text-ink-400">deaths a year in the causes this problem addresses</span>
              )}
            </div>
          </div>
          {b.aggregates.length > 0 && (
            <p className="font-mono text-[11px] text-ink-500 max-w-xs text-right">
              {b.aggregates.map((a) => (
                <span key={a.slug} className="block">
                  {a.name}: {a.deaths.value ? formatHumans(a.deaths.value) : 'n/a'} ({a.deaths.year}
                  ), shown for scale, not summed
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="border border-hair divide-y divide-hair">
          {b.counted.map((c) => (
            <div key={c.slug} className="px-4 py-3 grid md:grid-cols-[minmax(0,1fr)_7rem] gap-3">
              <div className="min-w-0">
                <p className="text-ink-100 text-sm font-medium">
                  {c.name}
                  {c.whoRank2021 && (
                    <span className="font-mono text-[10px] text-ink-600 ml-2">
                      WHO #{c.whoRank2021} in {c.deaths.year}
                    </span>
                  )}
                </p>
                <p className="text-ink-400 text-[13px] leading-relaxed mt-1">{c.mechanism}</p>
                {c.mappingNote && (
                  <p className="font-mono text-[10px] text-ink-600 mt-1.5">{c.mappingNote}</p>
                )}
              </div>
              <p className="font-mono text-sm text-amber-300 tabular-nums md:text-right">
                {formatHumans(c.deaths.value ?? 0)}
                <span className="block font-mono text-[10px] text-ink-600">
                  {c.deaths.shareOfDeaths ? `${Math.round(c.deaths.shareOfDeaths * 100)}% of all deaths` : `${c.deaths.year}`}
                </span>
              </p>
            </div>
          ))}
          {b.unmeasured.map((c) => (
            <div key={c.slug} className="px-4 py-3 grid md:grid-cols-[minmax(0,1fr)_7rem] gap-3">
              <div className="min-w-0">
                <p className="text-ink-200 text-sm font-medium">
                  {c.name}
                  {(c.whoRank2021 || c.gbdRank2023) && (
                    <span className="font-mono text-[10px] text-ink-600 ml-2">
                      {c.whoRank2021 ? `WHO #${c.whoRank2021}` : `GBD #${c.gbdRank2023} in 2023`}
                    </span>
                  )}
                </p>
                <p className="text-ink-400 text-[13px] leading-relaxed mt-1">{c.mechanism}</p>
                {c.mappingNote && (
                  <p className="font-mono text-[10px] text-ink-600 mt-1.5">{c.mappingNote}</p>
                )}
              </div>
              <p className="font-mono text-[11px] text-ink-500 md:text-right leading-snug">
                ranked, count not stated in source
              </p>
            </div>
          ))}
        </div>

        <p className="font-mono text-[10px] text-ink-600 leading-relaxed mt-3 max-w-3xl">{DISCLOSURE}</p>
        <p className="font-mono text-[10px] text-ink-600 mt-1">
          Sources:{' '}
          {[...sourceUrls.entries()].map(([name, url], i) => (
            <span key={url}>
              {i > 0 && ' · '}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
              >
                {name}
              </a>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
