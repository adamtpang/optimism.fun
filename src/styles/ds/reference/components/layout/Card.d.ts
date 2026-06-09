import * as React from 'react'

/**
 * A hairline-bordered surface — the workhorse container. Structure from the 1px
 * rule, not a shadow.
 *
 * @startingPoint section="Core" subtitle="Hairline-bordered surface — static / interactive / paper" viewport="700x220"
 */
export interface CardProps {
  children: React.ReactNode
  /** warms the border + lifts the surface on hover; use for clickable cards */
  interactive?: boolean
  /** swap to the warmer paper feature surface */
  paper?: boolean
  padding?: string
  as?: 'div' | 'a'
  href?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export function Card(props: CardProps): JSX.Element
