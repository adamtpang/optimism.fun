import React from 'react'

const TONE = {
  default: 'var(--text-primary)',
  accent: 'var(--accent)',
  green: 'var(--signal-green)',
  rose: 'var(--signal-rose)',
  violet: 'var(--signal-violet)',
  cyan: 'var(--signal-cyan)',
}

/**
 * StatPair — a mono label + tabular value, baseline-aligned. The atom of every
 * stat rail and header readout on optimism.fun. Lay several in a column.
 */
export function StatPair({ label, value, tone = 'default', size = 'md', style = {}, ...rest }) {
  const valueColor = TONE[tone] ?? TONE.default
  const valueSize = size === 'lg' ? '1.5rem' : size === 'sm' ? '1rem' : '1.25rem'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '16px',
        minWidth: '10rem',
        fontFamily: 'var(--font-mono)',
        ...style,
      }}
      {...rest}
    >
      <span style={{
        fontSize: 'var(--text-label-sm)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-ultra-wide)',
        color: 'var(--text-muted)',
      }}>
        {label}
      </span>
      <span style={{ fontSize: valueSize, color: valueColor, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {value}
      </span>
    </div>
  )
}
