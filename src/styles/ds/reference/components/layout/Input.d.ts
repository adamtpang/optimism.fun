import * as React from 'react'

/**
 * A sharp-cornered text field; hairline border warms to the accent on focus.
 */
export interface InputProps {
  type?: 'text' | 'email' | 'search' | 'password'
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  style?: React.CSSProperties
}

export function Input(props: InputProps): JSX.Element
