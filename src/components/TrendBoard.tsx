'use client'

/**
 * The trend board.
 *
 * Encoding follows the same rules as the rest of the site: position carries the
 * ranking, one accent hue carries magnitude, and state is stated in words as
 * well as colour so nothing depends on hue alone. Each row expands into the
 * "why this trend" evidence — the per-source counts and the actual links.
 */
import { useState } from 'react'
import type { ScoredTrend, TrendState } from '@/lib/trends/types'
import { SOURCES } from '@/lib/trends/scoring'

const STATE: Record<TrendState, { label: string; tone: string }> = {
  rising: { label: 'rising', tone: 'text-terminal-green' },
  cooling: { label: 'cooling', tone: 'text-terminal-rose' },
  steady: { label: 'steady', tone: 'text-ink-400' },
  quiet: { label: 'quiet', tone: 'text-ink-600' },
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2" title={`${label} ${value}/100`}>
      <span className="font-mono text-[9px] uppercase text-ink-500 w-12">{label}</span>
      <div className="h-1 flex-1 bg-ink-800 rounded-full overflow-hidden">
        <div
          className="h-1 rounded-full"
          style={{ width: `${value}%`, backgroundColor: '#0ea5e9' }}
        />
      </div>
      <span className="font-mono text-[9px] tabular-nums text-ink-500 w-6 text-right">
        {value}
      </span>
    </div>
  )
}

function Row({ trend, rank }: { trend: ScoredTrend; rank: number }) {
  const [open, setOpen] = useState(false)
  const s = STATE[trend.state]
  const delta = trend.currentTotal - trend.priorTotal

  return (
    <div className="border-b border-hair last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left px-3 py-3 flex items-start gap-3 hover:bg-ink-800/30 transition-colors"
      >
        <span className="font-mono text-sm tabular-nums text-ink-600 w-6 pt-0.5 shrink-0">
          {rank}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans text-[14px] text-ink-100">{trend.term}</span>
            <span className={`font-mono text-[9px] uppercase tracking-wide ${s.tone}`}>
              {s.label}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wide text-ink-600 border border-hair px-1.5 py-0.5 rounded">
              {trend.category}
            </span>
            {trend.sourceCount === 1 && (
              <span
                className="font-mono text-[9px] uppercase tracking-wide text-amber-300"
                title="Only one source sees this — the score is discounted"
              >
                single source
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-[10px] text-ink-500">
            {trend.currentTotal.toLocaleString()} now vs {trend.priorTotal.toLocaleString()} prior
            {delta !== 0 && (
              <span className={delta > 0 ? 'text-terminal-green' : 'text-terminal-rose'}>
                {' '}
                {delta > 0 ? '+' : ''}
                {delta.toLocaleString()}
              </span>
            )}{' '}
            · {trend.sourceCount} source{trend.sourceCount === 1 ? '' : 's'}
          </p>
        </div>

        <span className="font-mono text-lg tabular-nums text-ink-100 shrink-0">
          {trend.trendScore}
        </span>
      </button>

      {open && (
        <div className="px-3 pb-4 pl-12 space-y-3 bg-ink-900/40">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 max-w-lg">
            <Bar label="momentum" value={trend.momentumScore} />
            <Bar label="velocity" value={trend.velocityScore} />
            <Bar label="novelty" value={trend.noveltyScore} />
            <Bar label="confid." value={trend.confidenceScore} />
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500 mb-1.5">
              Why this trend
            </p>
            <div className="space-y-2">
              {trend.observations.map((o) => (
                <div key={o.source}>
                  <p className="font-mono text-[10px] text-ink-300">
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:underline"
                    >
                      {SOURCES[o.source].name} ↗
                    </a>
                    <span className="text-ink-500">
                      {' '}
                      {o.current} vs {o.prior} over {o.windowDays}d ·{' '}
                      {SOURCES[o.source].measures}
                    </span>
                  </p>
                  {o.evidence.slice(0, 2).map((e) => (
                    <a
                      key={e.url}
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block pl-3 text-ink-400 text-[12px] leading-snug hover:text-ink-200"
                    >
                      · {e.title.length > 72 ? `${e.title.slice(0, 71)}…` : e.title}
                      {e.engagement != null && (
                        <span className="text-ink-600 font-mono text-[10px]"> ({e.engagement})</span>
                      )}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrendBoard({
  ranked,
  underpriced,
}: {
  ranked: ScoredTrend[]
  underpriced: ScoredTrend[]
}) {
  const [category, setCategory] = useState<string>('all')
  const categories = ['all', ...Array.from(new Set(ranked.map((t) => t.category))).sort()]
  const shown = category === 'all' ? ranked : ranked.filter((t) => t.category === category)

  return (
    <div className="space-y-10">
      {underpriced.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
            Underpriced attention
          </p>
          <p className="text-ink-400 text-sm leading-relaxed max-w-2xl mb-3">
            Rising fast, still small. High momentum against low absolute volume — something is
            moving before the room has noticed. This is the only view here that is not just a
            better Google Trends.
          </p>
          <div className="flex flex-wrap gap-2">
            {underpriced.map((t) => (
              <span
                key={t.term}
                className="inline-flex items-baseline gap-2 border border-amber-300/30 rounded px-2.5 py-1"
              >
                <span className="font-sans text-[13px] text-amber-300">{t.term}</span>
                <span className="font-mono text-[9px] text-ink-500">
                  mom {t.momentumScore} · vol {t.velocityScore}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded border transition-colors ${
                category === c
                  ? 'border-amber-300/40 text-amber-300 bg-amber-300/[0.06]'
                  : 'border-hair text-ink-500 hover:text-ink-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="border border-hair rounded-lg overflow-hidden">
          {shown.map((t, i) => (
            <Row key={t.term} trend={t} rank={i + 1} />
          ))}
        </div>

        <p className="mt-3 font-mono text-[10px] text-ink-600 leading-relaxed">
          Score = 0.45 momentum + 0.20 novelty + 0.20 confidence + 0.15 velocity, then discounted
          40% when only one source sees it. Momentum leads because a level alone just ranks big
          evergreen topics. Click any row for the per-source counts and the actual links.
        </p>
      </div>
    </div>
  )
}
