import React from 'react'

/**
 * Input — a sharp-cornered text field on the canvas surface with a hairline
 * border that warms to the accent on focus. Sans body type. Pairs with the
 * primary Button in the email-capture pattern.
 */
export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  size = 'md',
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false)
  const sizes = {
    sm: { padding: '8px 12px', fontSize: 'var(--text-sm)' },
    md: { padding: '12px 16px', fontSize: 'var(--text-base)' },
  }
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        background: 'var(--surface-canvas)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        border: `1px solid ${focus ? 'color-mix(in srgb, var(--accent) 60%, transparent)' : 'rgb(var(--line) / var(--line-strong-opacity))'}`,
        borderRadius: 'var(--radius-sm)',
        outline: 'none',
        opacity: disabled ? 0.4 : 1,
        transition: 'border-color var(--duration-base) var(--ease-standard)',
        ...sizes[size],
        ...style,
      }}
      {...rest}
    />
  )
}
