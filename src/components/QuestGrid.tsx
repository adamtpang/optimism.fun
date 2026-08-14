'use client'

/**
 * The live good×hard quest grid — every ranked quest plotted on Stephens &
 * Wagner's axes. Click a point to open it; the top-right quadrant is the one
 * the essay says your best people owe the world.
 */
import { useState } from 'react'
import Link from 'next/link'
import type { PlottedQuest } from '@/lib/quest-grid'

const TIER_DOT: Record<PlottedQuest['tier'], { r: number; className: string }> = {
  S: { r: 2.6, className: 'fill-amber-300' },
  A: { r: 2.2, className: 'fill-terminal-cyan' },
  B: { r: 1.8, className: 'fill-ink-300' },
  C: { r: 1.5, className: 'fill-ink-500' },
}

export default function QuestGrid({ quests }: { quests: PlottedQuest[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(quests[0]?.slug ?? null)
  const active = quests.find((q) => q.slug === activeSlug) ?? null

  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] gap-6 items-start">
      {/* the grid itself */}
      <div className="relative border border-hair rounded-lg overflow-hidden bg-ink-900/30">
        <svg viewBox="0 0 100 100" className="w-full aspect-square" role="img" aria-label="Every quest plotted by good and hard">
          {/* quadrant fills */}
          <rect x={0} y={0} width={50} height={50} className="fill-ink-800/40" />
          <rect x={50} y={0} width={50} height={50} className="fill-amber-300/[0.07]" />
          <rect x={0} y={50} width={50} height={50} className="fill-ink-900" />
          <rect x={50} y={50} width={50} height={50} className="fill-ink-900" />
          {/* top-right (hard+good) glow border */}
          <rect x={50} y={0} width={50} height={50} className="fill-none stroke-amber-300/40" strokeWidth={0.4} />

          {/* midlines */}
          <line x1={50} y1={0} x2={50} y2={100} className="stroke-ink-700" strokeWidth={0.2} />
          <line x1={0} y1={50} x2={100} y2={50} className="stroke-ink-700" strokeWidth={0.2} />

          {/* quadrant labels */}
          <text x={97} y={6} textAnchor="end" className="fill-amber-300" style={{ font: '3.1px var(--font-plex-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            hard + good — build here
          </text>
          <text x={3} y={6} textAnchor="start" className="fill-ink-500" style={{ font: '3.1px var(--font-plex-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            hard + bad
          </text>
          <text x={97} y={97} textAnchor="end" className="fill-ink-500" style={{ font: '3.1px var(--font-plex-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            easy + good
          </text>
          <text x={3} y={97} textAnchor="start" className="fill-ink-600" style={{ font: '3.1px var(--font-plex-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            easy + bad — not tracked here
          </text>

          {/* points */}
          {quests.map((q) => {
            const dot = TIER_DOT[q.tier]
            const isActive = q.slug === activeSlug
            return (
              <g key={q.slug}>
                {isActive && (
                  <circle
                    cx={q.good}
                    cy={100 - q.hard}
                    r={dot.r + 1.6}
                    className="fill-none stroke-amber-300"
                    strokeWidth={0.5}
                  />
                )}
                <circle
                  cx={q.good}
                  cy={100 - q.hard}
                  r={dot.r}
                  className={`${dot.className} cursor-pointer transition-opacity ${!isActive ? 'opacity-70 hover:opacity-100' : ''}`}
                  onClick={() => setActiveSlug(q.slug)}
                >
                  <title>{q.title}</title>
                </circle>
              </g>
            )
          })}
        </svg>

        {/* axis labels */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-hair font-mono text-[9px] uppercase tracking-wide text-ink-500">
          <span>&larr; less urgent</span>
          <span className="text-ink-400">good, by opportunity</span>
          <span>screaming opportunity &rarr;</span>
        </div>
        <div className="absolute left-2 top-2 flex flex-col items-start font-mono text-[9px] uppercase tracking-wide text-ink-500 [writing-mode:vertical-rl]">
          <span className="rotate-180">easy &rarr; hard, by frontier confidence</span>
        </div>
      </div>

      {/* detail panel */}
      <div className="border border-hair rounded-lg p-5 bg-ink-900/40 min-h-[16rem]">
        {active ? (
          <>
            <p className="font-mono text-[9px] uppercase tracking-ultra-wide text-amber-300 mb-1.5">
              tier {active.tier} &middot; score {active.score}
            </p>
            <h3 className="font-serif text-lg text-ink-100 leading-snug mb-2">{active.title}</h3>
            <p className="text-ink-400 text-[12.5px] leading-relaxed mb-4">
              Attacks{' '}
              <Link href={`/p/${active.problemSlug}`} className="text-amber-300 hover:underline">
                {active.problemName}
              </Link>
              . Plotted at good {active.good}/100, hard {active.hard}/100.
            </p>
            <Link
              href="/rankings"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-paper bg-amber-300 hover:bg-amber-200 rounded px-3 py-2 transition-colors"
            >
              See it on the power rankings &rarr;
            </Link>
          </>
        ) : (
          <p className="text-ink-500 text-sm">Click a point to open the quest.</p>
        )}
      </div>
    </div>
  )
}
