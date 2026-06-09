import { liveSources } from '@/data/data-sources'

/**
 * "Data last updated" strip. Shows the live sources feeding the index and the
 * date each one last published, so visitors can see the data is fresh and where
 * it comes from. The dates are the sources' own (e.g. World Bank meta.lastupdated).
 */
export default function DataFreshness({ className = '' }: { className?: string }) {
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
          <span className="text-ink-600"> · updated {s.lastUpdated}</span>
        </a>
      ))}
    </div>
  )
}
