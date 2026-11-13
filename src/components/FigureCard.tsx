import type { FeaturedFigure } from '@/data/featured-figure'

/**
 * A figure: one finding, its chart on the gridded plot surface, the facts as
 * a ledger, and the sources. The grid appears only behind data. Numbers are
 * set in the figure face; words stay in Inter.
 */
export default function FigureCard({
  figure,
  children,
  titleAs: Title = 'h2',
  href,
}: {
  figure: FeaturedFigure
  children?: React.ReactNode
  /** h1 on the figure's own page, h2 where it is embedded. */
  titleAs?: 'h1' | 'h2'
  /** When set, the title links to the figure's own page. */
  href?: string
}) {
  const max = Math.max(...figure.bars.map((b) => b.value))
  return (
    <figure className="border border-neutral-300 rounded bg-background p-5 md:p-8">
      <p className="font-figure text-small text-ink-500">
        Fig. {figure.number} &middot; {figure.topic} &middot; updated {figure.updated}
      </p>
      <Title className="text-h2 md:text-h1 text-ink-100 mt-2 max-w-[24ch]">
        {href ? (
          <a href={href} className="hover:underline underline-offset-4">
            {figure.finding}
          </a>
        ) : (
          figure.finding
        )}
      </Title>

      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] mt-6 items-start">
        <div className="plot-grid border border-neutral-300 p-4 md:p-6">
          <table className="w-full font-figure text-small text-ink-100">
            <caption className="caption-bottom text-left text-ink-500 pt-4">{figure.chartCaption}</caption>
            <tbody>
              {figure.bars.map((b) => (
                <tr key={b.label}>
                  <th scope="row" className="font-normal text-left pr-3 py-2 whitespace-nowrap w-px">
                    {b.label}
                  </th>
                  <td className="py-2 w-full">
                    <div
                      className={`h-5 ${b.value === max ? 'bg-ink-100' : 'bg-ink-500'}`}
                      style={{ width: `${(b.value / max) * 100}%` }}
                      aria-hidden="true"
                    />
                  </td>
                  <td className="pl-3 py-2 text-right whitespace-nowrap">{b.display}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="border-t border-neutral-200">
          {figure.facts.map((f) => (
            <div key={f.label} className="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-2.5">
              <dt className="text-small text-ink-400">{f.label}</dt>
              <dd className="font-figure text-body text-ink-100 whitespace-nowrap">{f.value}</dd>
            </div>
          ))}
          <div className="py-2.5">
            <dt className="text-small text-ink-400">Sources</dt>
            <dd className="text-small">
              {figure.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center min-h-11 text-info underline">
                  {s.label}
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      {children && <div className="mt-6 pt-5 border-t border-neutral-200">{children}</div>}
    </figure>
  )
}
