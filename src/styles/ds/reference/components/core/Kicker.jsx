import React from 'react'

/**
 * Kicker — the brand's signature micro-label. Mono, UPPERCASE, ultra-wide
 * tracking (0.25em), tiny and muted. Optionally numbered (e.g. "05 · the white
 * mirror") with the number in the accent, and optionally led by the ◆ diamond.
 */
export function Kicker({
  children,
  number,
  diamond = false,
  tone = 'muted',
  style = {},
  ...rest
}) {
  const numberColor =
    tone === 'muted' ? 'var(--accent)' : `var(--signal-${tone})`
  const textColor =
    tone === 'muted' ? 'var(--text-muted)'
    : tone === 'accent' ? 'var(--accent)'
    : `var(--signal-${tone})`

  return (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-label-sm)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-ultra-wide)',
        color: tone === 'accent' || tone !== 'muted' ? textColor : 'var(--text-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        ...style,
      }}
      {...rest}
    >
      {diamond && <span style={{ color: 'var(--accent)' }}>◆</span>}
      {number != null && (
        <span style={{ color: numberColor }}>{number}</span>
      )}
      {number != null && <span style={{ color: 'var(--text-faint)' }}>·</span>}
      <span>{children}</span>
    </p>
  )
}
