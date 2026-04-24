import type { SourcedNumber } from '@/data/types'
import SourceBadge from './SourceBadge'

type Props = {
  label: string
  score: SourcedNumber | null
  max: number
  color: 'amber' | 'rose' | 'indigo' | 'emerald'
  format?: (n: number) => string
}

const BAR_COLOR: Record<Props['color'], string> = {
  amber: 'bg-amber-500/70',
  rose: 'bg-rose-500/70',
  indigo: 'bg-indigo-500/70',
  emerald: 'bg-emerald-500/70',
}

const TEXT_COLOR: Record<Props['color'], string> = {
  amber: 'text-amber-300',
  rose: 'text-rose-300',
  indigo: 'text-indigo-300',
  emerald: 'text-emerald-300',
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
      <div className="py-2">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs uppercase tracking-wider text-slate-500">
            {label}
          </span>
          <span className="text-sm text-slate-600">not applicable</span>
        </div>
        <div className="h-1 rounded-full bg-white/[0.04]" />
      </div>
    )
  }

  const pct = Math.min(100, Math.max(0, (score.value / max) * 100))

  return (
    <div className="py-2">
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${TEXT_COLOR[color]}`}>
            {format(score.value)}
          </span>
          <SourceBadge
            confidence={score.confidence}
            source={score.source}
            asOf={score.asOf}
          />
        </div>
      </div>
      <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className={`h-full ${BAR_COLOR[color]} rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
