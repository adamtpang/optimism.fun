/**
 * A mono label paired with a tabular value — the atom of every stat rail.
 */
export interface StatPairProps {
  label: string
  value: string | number
  tone?: 'default' | 'accent' | 'green' | 'rose' | 'violet' | 'cyan'
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export function StatPair(props: StatPairProps): JSX.Element
