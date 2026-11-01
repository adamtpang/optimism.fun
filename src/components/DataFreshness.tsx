import { liveSources } from '@/data/data-sources'
import { fetchWdiLastUpdated } from '@/lib/sources/worldbank'

/**
 * "Data last updated" strip. The World Bank date is that API's own
 * meta.lastupdated, read when the page renders and cached for a day.
 */
export default async function DataFreshness({ className = '' }: { className?: string }) {
  const published = await fetchWdiLastUpdated()
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-ink-500 ${className}`}
    >
      <span className="inline-flex items-center gap-1.5 uppercase tracking-ultra-wide text-terminal-green">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-terminal-green" />
        live data
      </span>
      {liveSources.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-300 transition-colors"
          title={`${s.indicators.length} indicators`}
        >
          {s.name}
          {s.id === 'worldbank-wdi' && (
            <span className="text-ink-600"> · updated {published ?? 'unavailable'}</span>
          )}
        </a>
      ))}
    </div>
  )
}
