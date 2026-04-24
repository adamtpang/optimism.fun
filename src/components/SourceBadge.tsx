import type { Confidence } from '@/data/types'

const CONFIDENCE_STYLE: Record<Confidence, string> = {
  high: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  med: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  low: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
}

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: 'high',
  med: 'med',
  low: 'low',
}

type Props = {
  confidence: Confidence
  source?: string
  asOf?: string
  className?: string
}

export default function SourceBadge({
  confidence,
  source,
  asOf,
  className = '',
}: Props) {
  const title = source ? `${source}${asOf ? ` · as of ${asOf}` : ''}` : undefined
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${CONFIDENCE_STYLE[confidence]} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          confidence === 'high'
            ? 'bg-emerald-400'
            : confidence === 'med'
              ? 'bg-amber-400'
              : 'bg-rose-400'
        }`}
      />
      {CONFIDENCE_LABEL[confidence]}
    </span>
  )
}
