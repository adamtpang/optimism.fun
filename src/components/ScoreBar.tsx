import type { SourcedNumber } from '@/data/types'
import SourceBadge from './SourceBadge'

type Props = {
  label: string
  score: SourcedNumber | null
  max: number
  color: 'amber' | 'rose' | 'green' | 'cyan' | 'violet'
  format?: (n: number) => string
}

const BAR_COLOR: Record<Props['color'], string> = {
  amber: 'bg-amber-300',
  rose: 'bg-terminal-rose',
  green: 'bg-terminal-green',
  cyan: 'bg-terminal-cyan',
  violet: 'bg-terminal-violet',
}

const TEXT_COLOR: Record<Props['color'], string> = {
  amber: 'text-amber-300',
  rose: 'text-terminal-rose',
  green: 'text-terminal-green',
  cyan: 'text-terminal-cyan',
  violet: 'text-terminal-violet',
}

export default function ScoreBar({
  label,
  score,
  max,
  color,
  format = (n) => n.toFixed(1),
}: Props) {
  if (!score) {
    return (
      <div className="py-2.5 font-mono border-b border-hair last:border-b-0">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-ultra-wide text-ink-500">
            {label}
          </span>
          <span className="text-xs text-ink-600">n/a</span>
        </div>
        <div className="h-px bg-ink-700" />
      </div>
    )
  }

  const pct = Math.min(100, Math.max(0, (score.value / max) * 100))

  return (
    <div className="py-2.5 font-mono border-b border-hair last:border-b-0">
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <span className="text-[10px] uppercase tracking-ultra-wide text-ink-500">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold tabular-nums ${TEXT_COLOR[color]}`}>
            {format(score.value)}
          </span>
          <SourceBadge
            confidence={score.confidence}
            source={score.source}
            asOf={score.asOf}
          />
        </div>
      </div>
      <div className="h-px bg-ink-700 overflow-hidden">
        <div
          className={`h-full ${BAR_COLOR[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
