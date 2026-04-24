type Props = {
  kicker: string
  title: string
  lede: string
  rightStats?: { label: string; value: string | number; tone?: 'amber' | 'cyan' | 'rose' | 'green' | 'violet' }[]
}

const TONE: Record<NonNullable<Props['rightStats']>[number]['tone'] & string, string> = {
  amber: 'text-amber-300',
  cyan: 'text-terminal-cyan',
  rose: 'text-terminal-rose',
  green: 'text-terminal-green',
  violet: 'text-terminal-violet',
}

export default function PageHeader({ kicker, title, lede, rightStats }: Props) {
  return (
    <section className="pt-24 pb-10 border-b border-hair">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-300 text-[10px]">◆</span>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-400">
                {kicker}
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] text-ink-100 mb-4">
              {title}
            </h1>
            <p className="text-ink-300 leading-relaxed max-w-2xl text-base">
              {lede}
            </p>
          </div>
          {rightStats && rightStats.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-3 font-mono">
              {rightStats.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-4 min-w-[10rem]">
                  <span className="text-[10px] uppercase tracking-ultra-wide text-ink-500">
                    {s.label}
                  </span>
                  <span className={`text-xl tabular-nums ${s.tone ? TONE[s.tone] : 'text-ink-100'}`}>
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
