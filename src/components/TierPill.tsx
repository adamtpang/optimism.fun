import { TIER_LABEL, type Tier } from '@/data/types'

const STYLE: Record<Tier, string> = {
  welfare: 'text-terminal-green/90 border-terminal-green/30',
  'x-risk': 'text-terminal-rose/90 border-terminal-rose/30',
  'hard-tech': 'text-amber-300/90 border-amber-300/30',
  progress: 'text-terminal-cyan/90 border-terminal-cyan/30',
  emerging: 'text-terminal-violet/90 border-terminal-violet/30',
}

type Props = {
  tier: Tier
  className?: string
}

export default function TierPill({ tier, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-px font-mono text-[10px] uppercase tracking-ultra-wide ${STYLE[tier]} ${className}`}
    >
      {TIER_LABEL[tier].toLowerCase()}
    </span>
  )
}
