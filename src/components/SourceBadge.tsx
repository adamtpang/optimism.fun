import type { Confidence } from '@/data/types'

const STYLE: Record<Confidence, string> = {
  high: 'text-terminal-green border-terminal-green/30',
  med: 'text-primary border-primary/30',
  low: 'text-terminal-rose border-terminal-rose/30',
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
      className={`inline-flex items-center gap-1 border px-1.5 py-px font-mono text-small uppercase ${STYLE[confidence]} ${className}`}
    >
      {confidence}
    </span>
  )
}
