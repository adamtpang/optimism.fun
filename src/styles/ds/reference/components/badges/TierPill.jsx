import React from 'react'

const TIER = {
  welfare:     { label: 'welfare',   signal: 'green' },
  'x-risk':    { label: 'x-risk',    signal: 'rose' },
  'hard-tech': { label: 'hard-tech', signal: 'accent' },
  progress:    { label: 'progress',  signal: 'cyan' },
  emerging:    { label: 'emerging',  signal: 'violet' },
}

/**
 * TierPill — a 1px-bordered, signal-tinted micro pill that classifies a problem
 * by tier. Uppercase mono, ultra-wide tracking, sharp corners.
 */
export function TierPill({ tier = 'welfare', style = {}, ...rest }) {
  const meta = TIER[tier] ?? TIER.welfare
  const color = meta.signal === 'accent' ? 'var(--accent)' : `var(--signal-${meta.signal})`
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '1px 8px',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-label-sm)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-ultra-wide)',
        color: `color-mix(in srgb, ${color} 90%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        borderRadius: 'var(--radius-sm)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {meta.label}
    </span>
  )
}
