import SourceBadge from './SourceBadge'
import type { Confidence } from '@/data/types'

export type MarketColumn = {
  key: string
  label: string
  align?: 'left' | 'right'
  className?: string
  render: (row: Record<string, unknown>, i: number) => React.ReactNode
}

type Props<T extends Record<string, unknown>> = {
  rows: T[]
  columns: MarketColumn[]
  footerNote?: React.ReactNode
  footerSource?: { label: string; url?: string; asOf?: string; confidence?: Confidence }
}

export default function MarketTable<T extends Record<string, unknown>>({
  rows,
  columns,
  footerNote,
  footerSource,
}: Props<T>) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-hair">
        <table className="min-w-full font-mono text-xs">
          <thead>
            <tr className="border-b border-hair-strong bg-ink-800/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2.5 font-medium text-[10px] uppercase tracking-ultra-wide text-ink-400 ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  } ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-2.5 ${
                      col.align === 'right' ? 'text-right tabular-nums' : ''
                    } ${col.className ?? ''}`}
                  >
                    {col.render(row as Record<string, unknown>, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(footerNote || footerSource) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-500">
          {footerSource && (
            <span className="flex items-center gap-1.5">
              <span className="text-ink-600">source:</span>
              {footerSource.url ? (
                <a
                  href={footerSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                >
                  {footerSource.label}
                </a>
              ) : (
                <span>{footerSource.label}</span>
              )}
              {footerSource.asOf && (
                <span className="text-ink-600">· as of {footerSource.asOf}</span>
              )}
              {footerSource.confidence && (
                <SourceBadge confidence={footerSource.confidence} />
              )}
            </span>
          )}
          {footerNote && <span className="text-ink-500">{footerNote}</span>}
        </div>
      )}
    </div>
  )
}
