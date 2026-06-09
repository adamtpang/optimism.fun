import * as React from 'react'

/**
 * The signature micro-label: mono, uppercase, ultra-wide tracking. Used as a
 * section kicker above every Fraunces headline.
 */
export interface KickerProps {
  children: React.ReactNode
  /** zero-padded section number, e.g. "05" — rendered in the accent before a · */
  number?: string | number
  /** lead with the ◆ brand diamond */
  diamond?: boolean
  /** muted (default) keeps text grey with accent number; others tint the whole label */
  tone?: 'muted' | 'accent' | 'green' | 'rose' | 'violet' | 'cyan'
  style?: React.CSSProperties
}

export function Kicker(props: KickerProps): JSX.Element
