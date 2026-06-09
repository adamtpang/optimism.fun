import React from 'react'

const CONF = {
  high: { color: 'var(--signal-green)' },
  med:  { color: 'var(--accent)' },
  low:  { color: 'var(--signal-rose)' },
}

/**
 * ConfidenceBadge — the source/confidence tag that rides next to every number
 * in the product. high (green) / med (sky) / low (rose). Hover surfaces the
 * source via title. The brand's promise that every number has a receipt.
 */
export function ConfidenceBadge({ confidence = 'med', source, asOf, style = {}, ...rest }) {
  const meta = CONF[confidence] ?? CONF.med
  const title = source ? `${source}${asOf ? ` · as of ${asOf}` : ''}` : undefined
  return (
    <span
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '1px 6px',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-micro)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-ultra-wide)',
        color: meta.color,
        border: `1px solid color-mix(in srgb, ${meta.color} 30%, transparent)`,
        borderRadius: 'var(--radius-sm)',
        whiteSpace: 'nowrap',
        cursor: title ? 'help' : 'default',
        ...style,
      }}
      {...rest}
    >
      {confidence}
    </span>
  )
}
