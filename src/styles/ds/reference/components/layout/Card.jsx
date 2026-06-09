import React from 'react'

/**
 * Card — a hairline-bordered surface, the workhorse container of optimism.fun.
 * Structure comes from the 1px rule, not a shadow. `interactive` warms the
 * border + lifts the surface on hover (use for clickable cards). `paper` swaps
 * to the warmer feature surface.
 */
export function Card({
  children,
  interactive = false,
  paper = false,
  padding = '24px',
  as = 'div',
  href,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false)

  const base = {
    background: paper
      ? 'linear-gradient(180deg, rgba(14,165,233,0.025) 0%, transparent 50%), rgb(var(--paper))'
      : 'var(--surface-raised)',
    border: '1px solid rgb(var(--line) / var(--line-opacity))',
    borderRadius: 'var(--radius-sm)',
    padding,
    transition: 'background var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    cursor: interactive || onClick ? 'pointer' : 'default',
    ...(interactive && hover ? {
      background: 'var(--surface-hover)',
      borderColor: 'color-mix(in srgb, var(--accent) 50%, transparent)',
    } : {}),
    ...style,
  }

  const props = {
    style: base,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    ...rest,
  }

  if (as === 'a') return <a href={href} {...props}>{children}</a>
  return <div {...props}>{children}</div>
}
