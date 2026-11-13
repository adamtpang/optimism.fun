type Props = {
  kicker: string
  title: string
  lede: string
  rightStats?: { label: string; value: string | number; tone?: 'amber' | 'cyan' | 'rose' | 'green' | 'violet' }[]
}

const TONE: Record<NonNullable<Props['rightStats']>[number]['tone'] & string, string> = {
  amber: 'text-primary',
  cyan: 'text-ink-100',
  rose: 'text-ink-100',
  green: 'text-ink-100',
  violet: 'text-ink-100',
}

export default function PageHeader({ kicker, title, lede, rightStats }: Props) {
  return (
    <section className="pt-28 pb-10 border-b border-hair">
      <div className="site-shell">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div className="max-w-7xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-primary text-small">◆</span>
              <p className="first-letter:uppercase text-small text-ink-400">
                {kicker}
              </p>
            </div>
            <h1 className="text-h1 md:text-display-2 font-normal leading-[1.05] text-ink-100 mb-4">
              {title}
            </h1>
            <p className="text-ink-300 leading-relaxed max-w-2xl text-base">
              {lede}
            </p>
          </div>
          {rightStats && rightStats.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-3">
              {rightStats.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-4 min-w-[10rem]">
                  <span className="first-letter:uppercase text-small text-ink-500">
                    {s.label}
                  </span>
                  <span className={`text-h3 tabular-nums ${s.tone ? TONE[s.tone] : 'text-ink-100'}`}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
