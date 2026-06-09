import type { Trend } from '@/data/types'

/**
 * The direction-of-travel chip. Optimism signal: improving is green and up,
 * worsening is rose and down, flat is neutral. Compact mono label to match
 * the data aesthetic.
 */
const META: Record<Trend, { arrow: string; label: string; cls: string }> = {
  improving: { arrow: '↗', label: 'improving', cls: 'text-terminal-green' },
  worsening: { arrow: '↘', label: 'worsening', cls: 'text-terminal-rose' },
  flat: { arrow: '→', label: 'flat', cls: 'text-ink-400' },
}

export default function TrendBadge({
  trend,
  showLabel = true,
  className = '',
}: {
  trend: Trend
  showLabel?: boolean
  className?: string
}) {
  const m = META[trend]
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[11px] tabular-nums ${m.cls} ${className}`}
      title={`Trend: ${m.label}`}
    >
      <span aria-hidden>{m.arrow}</span>
      {showLabel ? <span>{m.label}</span> : null}
    </span>
  )
}
