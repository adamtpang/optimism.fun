import * as React from 'react'

/**
 * optimism.fun primary button. Mono, uppercase, sharp corners. Ghost is the
 * default resting state; `primary` is the solid sky fill for the one key action.
 *
 * @startingPoint section="Core" subtitle="Mono uppercase button — ghost / primary / quiet" viewport="700x160"
 */
export interface ButtonProps {
  children: React.ReactNode
  /** ghost = bordered (default), primary = solid sky fill, quiet = neutral bordered */
  variant?: 'ghost' | 'primary' | 'quiet'
  size?: 'sm' | 'md' | 'lg'
  /** colors the ghost border/text; ignored by primary */
  tone?: 'accent' | 'neutral' | 'green' | 'rose' | 'violet' | 'cyan'
  disabled?: boolean
  /** render as an anchor instead of a button */
  as?: 'button' | 'a'
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  style?: React.CSSProperties
}

export function Button(props: ButtonProps): JSX.Element
