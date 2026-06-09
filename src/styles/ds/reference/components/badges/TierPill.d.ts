/**
 * Classifies a problem by tier with a signal-tinted micro pill.
 */
export interface TierPillProps {
  tier?: 'welfare' | 'x-risk' | 'hard-tech' | 'progress' | 'emerging'
  style?: React.CSSProperties
}

export function TierPill(props: TierPillProps): JSX.Element
