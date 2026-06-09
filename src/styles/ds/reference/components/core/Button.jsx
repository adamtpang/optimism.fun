import React from 'react'

/**
 * optimism.fun Button — mono, uppercase, mostly bordered-ghost. The primary
 * variant is a solid sky fill with near-black text. Corners are sharp; press is
 * a darker accent, never a shrink.
 */
export function Button({
  children,
  variant = 'ghost',
  size = 'md',
  tone = 'accent',
  disabled = false,
  as = 'button',
  href,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) {
  const toneColor =
    tone === 'accent' ? 'var(--accent)'
    : tone === 'neutral' ? 'rgb(var(--line) / 0.5)'
    : `var(--signal-${tone})`
  const toneText = tone === 'accent' ? 'var(--accent)' : `var(--signal-${tone})`

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '10px' },
    md: { padding: '8px 16px', fontSize: '11px' },
    lg: { padding: '12px 24px', fontSize: '13px' },
  }

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: variant === 'primary' ? 600 : 400,
    lineHeight: 1,
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard)',
    ...sizes[size],
  }

  const variants = {
    ghost: {
      background: 'transparent',
      color: toneText,
      border: `1px solid color-mix(in srgb, ${toneColor} 40%, transparent)`,
    },
    primary: {
      background: 'var(--accent)',
      color: '#08080a',
      border: '1px solid var(--accent)',
    },
    quiet: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid rgb(var(--line) / var(--line-opacity))',
    },
  }

  const [hover, setHover] = React.useState(false)
  const hoverStyle = !disabled && hover ? (
    variant === 'primary' ? { background: 'var(--accent-300)' }
    : variant === 'quiet' ? { color: 'var(--text-primary)', borderColor: 'rgb(var(--line) / var(--line-strong-opacity))' }
    : { background: `color-mix(in srgb, ${toneColor} 8%, transparent)`, borderColor: `color-mix(in srgb, ${toneColor} 60%, transparent)` }
  ) : {}

  const props = {
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: { ...base, ...variants[variant], ...hoverStyle, ...style },
    ...rest,
  }

  if (as === 'a') {
    return <a href={href} {...props}>{children}</a>
  }
  return <button type={type} disabled={disabled} {...props}>{children}</button>
}
