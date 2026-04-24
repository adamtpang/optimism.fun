import { TIER_LABEL, type Tier } from '@/data/types'

const TIER_STYLE: Record<Tier, string> = {
  welfare: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  'x-risk': 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  'hard-tech': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  progress: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  emerging: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
}

type Props = {
  tier: Tier
  className?: string
}

export default function TierPill({ tier, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${TIER_STYLE[tier]} ${className}`}
    >
      {TIER_LABEL[tier]}
    </span>
  )
}
