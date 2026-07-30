/**
 * Annotated figure — the wrapper that turns a chart into an argument.
 *
 * A chart that only presents data makes the reader find the point. An essay
 * chart states it. This wraps any of the site's SVG charts and adds:
 *   - a title that is the CLAIM, not the dataset name
 *   - callouts pinned over the plot, with a hairline leader
 *   - a source line
 *   - a table-view slot, so no value is reachable only by hover
 *
 * Annotation text wears text tokens, never a data colour: the mark carries
 * identity, the words stay ink. Keep callouts sparing — two or three. Flood
 * them and they stop working, the same way direct labels do.
 */
import type { ReactNode } from 'react'

export type Callout = {
  /** Position over the plot area, in percent. */
  x: number
  y: number
  text: string
  /** Which side the hairline leader extends toward the mark. */
  leader?: 'left' | 'right' | 'up' | 'down' | 'none'
}

const LEADER: Record<
  NonNullable<Callout['leader']>,
  { cls: string; style: React.CSSProperties }
> = {
  left: { cls: 'right-full top-1/2 -translate-y-1/2', style: { width: 18, height: 1 } },
  right: { cls: 'left-full top-1/2 -translate-y-1/2', style: { width: 18, height: 1 } },
  up: { cls: 'bottom-full left-3', style: { width: 1, height: 16 } },
  down: { cls: 'top-full left-3', style: { width: 1, height: 16 } },
  none: { cls: 'hidden', style: {} },
}

export default function AnnotatedFigure({
  claim,
  standfirst,
  children,
  callouts = [],
  source,
  tableView,
  className = '',
}: {
  /** The claim the chart makes. Not "Demand by problem" but what to notice. */
  claim: string
  /** Optional one or two sentences of setup under the claim. */
  standfirst?: string
  children: ReactNode
  callouts?: Callout[]
  source?: string
  /** The WCAG-clean twin. Rendered in a <details>, collapsed. */
  tableView?: ReactNode
  className?: string
}) {
  return (
    <figure className={className}>
      <figcaption className="mb-4">
        <h3 className="font-serif text-xl md:text-2xl text-ink-100 leading-snug">{claim}</h3>
        {standfirst && (
          <p className="mt-1.5 text-ink-400 text-sm leading-relaxed max-w-2xl">{standfirst}</p>
        )}
      </figcaption>

      {/* plot + annotation layer */}
      <div className="relative">
        {children}
        {callouts.map((c, i) => (
          <div
            key={i}
            className="absolute pointer-events-none max-w-[190px]"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <div className="relative">
              {c.leader && c.leader !== 'none' && (
                <span
                  aria-hidden="true"
                  className={`absolute bg-current text-ink-500 ${LEADER[c.leader].cls}`}
                  style={LEADER[c.leader].style}
                />
              )}
              <p className="font-mono text-[10px] leading-snug text-ink-300 bg-ink/85 backdrop-blur-sm px-1.5 py-1 rounded">
                {c.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {source && (
        <p className="mt-3 font-mono text-[9.5px] text-ink-600 leading-relaxed">{source}</p>
      )}

      {tableView && (
        <details className="mt-3 group">
          <summary className="font-mono text-[10px] text-ink-500 hover:text-ink-300 cursor-pointer list-none">
            <span className="group-open:hidden">▸ show the numbers</span>
            <span className="hidden group-open:inline">▾ hide the numbers</span>
          </summary>
          <div className="mt-2 overflow-x-auto">{tableView}</div>
        </details>
      )}
    </figure>
  )
}
