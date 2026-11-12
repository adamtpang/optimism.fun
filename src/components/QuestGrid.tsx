'use client'

/**
 * The live good×hard quest grid — every ranked quest plotted on Stephens &
 * Wagner's axes. Click a point to open it; the top-right quadrant is the one
 * the essay says your best people owe the world.
 */
import { useState } from 'react'
import Link from 'next/link'
import type { PlottedQuest } from '@/lib/quest-grid'

const BAND_DOT: Record<PlottedQuest['band'], { r: number; className: string }> = {
  top: { r: 2.6, className: 'fill-blue-600' },
  strong: { r: 2.2, className: 'fill-terminal-cyan' },
  consider: { r: 1.8, className: 'fill-ink-300' },
  watch: { r: 1.5, className: 'fill-ink-500' },
}

export default function QuestGrid({
  quests,
  you = null,
}: {
  quests: PlottedQuest[]
  /** The visitor's own current quest, self-placed. */
  you?: { good: number; hard: number } | null
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(quests[0]?.slug ?? null)
  const active = quests.find((q) => q.slug === activeSlug) ?? null

  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] gap-6 items-start">
      {/* the grid itself */}
      <div className="relative border border-hair rounded-lg overflow-hidden bg-ink-900/30">
        <svg viewBox="0 0 100 100" className="w-full aspect-square" role="img" aria-label="Every quest plotted by good and hard">
          {/* quadrant fills */}
          <rect x={0} y={0} width={50} height={50} className="fill-ink-800/40" />
          <rect x={50} y={0} width={50} height={50} className="fill-blue-600/[0.07]" />
          <rect x={0} y={50} width={50} height={50} className="fill-ink-900" />
          <rect x={50} y={50} width={50} height={50} className="fill-ink-900" />
          {/* top-right (hard+good) glow border */}
          <rect x={50} y={0} width={50} height={50} className="fill-none stroke-blue-600/40" strokeWidth={0.4} />

          {/* midlines */}
          <line x1={50} y1={0} x2={50} y2={100} className="stroke-ink-700" strokeWidth={0.2} />
          <line x1={0} y1={50} x2={100} y2={50} className="stroke-ink-700" strokeWidth={0.2} />

          {/* quadrant labels */}
          <text x={97} y={6} textAnchor="end" className="fill-blue-600" style={{ fontSize: '3.1px', fontFamily: 'var(--font-plex-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            hard + good: build here
          </text>
          <text x={3} y={6} textAnchor="start" className="fill-ink-500" style={{ fontSize: '3.1px', fontFamily: 'var(--font-plex-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            hard + bad
          </text>
          <text x={97} y={97} textAnchor="end" className="fill-ink-500" style={{ fontSize: '3.1px', fontFamily: 'var(--font-plex-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            easy + good
          </text>
          <text x={3} y={97} textAnchor="start" className="fill-ink-600" style={{ fontSize: '3.1px', fontFamily: 'var(--font-plex-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            easy + bad
          </text>

          {/* points */}
          {quests.map((q) => {
            const dot = BAND_DOT[q.band]
            const isActive = q.slug === activeSlug
            return (
              <g key={q.slug}>
                {isActive && (
                  <circle
                    cx={q.good}
                    cy={100 - q.hard}
                    r={dot.r + 1.6}
                    className="fill-none stroke-blue-600"
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

          {/* the visitor's own quest */}
          {you && (
            <g aria-label="Your current quest">
              <circle cx={you.good} cy={100 - you.hard} r={4} className="fill-none stroke-primary" strokeWidth={0.9} />
              <circle cx={you.good} cy={100 - you.hard} r={1.1} className="fill-primary" />
              <text
                x={you.good}
                y={100 - you.hard - 5.5}
                textAnchor="middle"
                className="fill-primary"
                style={{ fontSize: '3.1px', fontFamily: 'var(--font-plex-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                you
              </text>
            </g>
          )}
        </svg>

        {/* axis labels */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-hair font-mono text-small uppercase tracking-wide text-ink-500">
          <span>&larr; bad</span>
          <span className="text-ink-400">good half, ordered by opportunity</span>
          <span>bigger opportunity &rarr;</span>
        </div>
        <div className="absolute left-2 top-2 flex flex-col items-start font-mono text-small uppercase tracking-wide text-ink-500 [writing-mode:vertical-rl]">
          <span className="rotate-180">easy &rarr; hard, by tractability, time, capital</span>
        </div>
      </div>

      {/* detail panel */}
      <div className="border border-hair rounded-lg p-5 bg-ink-900/40 min-h-[16rem]">
        {active ? (
          <>
            <p className="font-mono text-small uppercase text-primary mb-1.5">
              {active.band} opportunity &middot; score {active.score}
            </p>
            <h3 className="font-serif text-lg text-ink-100 leading-snug mb-2">{active.title}</h3>
            <p className="text-ink-400 text-small leading-relaxed mb-4">
              Attacks{' '}
              <Link href={`/p/${active.problemSlug}`} className="text-primary hover:underline">
                {active.problemName}
              </Link>
              . Opportunity {active.opportunity}/100, hard {active.hard}/100.
            </p>
            <p className="font-mono text-small text-ink-500 leading-relaxed mb-4">Hard from: {active.hardWhy}.</p>
            <Link
              href={`/p/${active.problemSlug}#coordinate`}
              className="inline-flex items-center gap-1.5 font-mono text-small uppercase tracking-wide text-paper bg-primary hover:bg-primary/90 rounded px-3 py-2 transition-colors"
            >
              Commit to this problem &rarr;
            </Link>
          </>
        ) : (
          <p className="text-ink-500 text-sm">Click a point to open the quest.</p>
        )}
      </div>
    </div>
  )
}
