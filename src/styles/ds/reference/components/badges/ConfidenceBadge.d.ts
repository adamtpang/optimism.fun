/**
 * The source/confidence tag that rides next to every sourced number.
 */
export interface ConfidenceBadgeProps {
  confidence?: 'high' | 'med' | 'low'
  /** shown on hover via title attribute */
  source?: string
  asOf?: string
  style?: React.CSSProperties
}

export function ConfidenceBadge(props: ConfidenceBadgeProps): JSX.Element
