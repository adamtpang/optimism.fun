import { RENDER_SNAPSHOT_ID, renderSnapshot } from '@/lib/render-snapshot'

/**
 * Freshness strip for the frozen capture. It does not call the World Bank.
 */
export default function DataFreshness({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-small text-ink-500 ${className}`}
    >
      <span className="uppercase text-ink-400">
        Snapshot {RENDER_SNAPSHOT_ID}
      </span>
      <span>
        WHO, Our World in Data, and World Bank figures on these pages are the capture at{' '}
        {renderSnapshot.retrievedAt}. A later live value is not shown here.
      </span>
    </div>
  )
}
