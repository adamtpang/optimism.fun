/**
 * An instrument-style metric readout: label, tabular value, optional confidence
 * badge, and a 1px-tall colored fill track.
 */
export interface ScoreBarProps {
  label: string
  /** null/undefined renders an "n/a" row */
  value?: number | null
  max?: number
  color?: 'accent' | 'green' | 'rose' | 'cyan' | 'violet'
  /** format the value, e.g. (n) => `${n}×` */
  format?: (n: number) => string
  confidence?: 'high' | 'med' | 'low'
  source?: string
  asOf?: string
  style?: React.CSSProperties
}

export function ScoreBar(props: ScoreBarProps): JSX.Element
