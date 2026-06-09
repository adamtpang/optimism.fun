import React from 'react'
import { ConfidenceBadge } from '../badges/ConfidenceBadge.jsx'

const COLOR = {
  accent: 'var(--accent)',
  green: 'var(--signal-green)',
  rose: 'var(--signal-rose)',
  cyan: 'var(--signal-cyan)',
  violet: 'var(--signal-violet)',
}

/**
 * ScoreBar — an instrument-like readout: a mono label, a tabular value, an
 * optional confidence badge, and a literal 1px-tall track with a colored fill.
 * Minimal by design; structure comes from the hairline, not a chunky bar.
 */
export function ScoreBar({
  label,
  value,
  max = 100,
  color = 'accent',
  format = (n) => n.toFixed(1),
  confidence,
  source,
  asOf,
  style = {},
}) {
  const fill = COLOR[color] ?? COLOR.accent

  if (value == null) {
    return (
      <div style={{ padding: '10px 0', fontFamily: 'var(--font-mono)', borderBottom: '1px solid rgb(var(--line) / var(--line-opacity))', ...style }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <span style={labelStyle}>{label}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>n/a</span>
        </div>
        <div style={{ height: '1px', background: 'rgb(var(--ink-700))' }} />
      </div>
    )
  }

  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div style={{ padding: '10px 0', fontFamily: 'var(--font-mono)', borderBottom: '1px solid rgb(var(--line) / var(--line-opacity))', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px', gap: '8px' }}>
        <span style={labelStyle}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: fill, fontVariantNumeric: 'tabular-nums' }}>
            {format(value)}
          </span>
          {confidence && <ConfidenceBadge confidence={confidence} source={source} asOf={asOf} />}
        </div>
      </div>
      <div style={{ height: '1px', background: 'rgb(var(--ink-700))', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: fill }} />
      </div>
    </div>
  )
}

const labelStyle = {
  fontSize: 'var(--text-label-sm)',
  textTransform: 'uppercase',
  letterSpacing: 'var(--tracking-ultra-wide)',
  color: 'var(--text-muted)',
}
