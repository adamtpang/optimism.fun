'use client'

import { useTransition } from 'react'
import type { ProblemCandidate } from '@/data/types'
import { TIER_LABEL } from '@/data/types'
import { updateStatusAction } from './actions'

export default function CandidateRow({ c }: { c: ProblemCandidate }) {
  const [pending, startTransition] = useTransition()

  function setStatus(next: 'promoted' | 'rejected' | 'draft') {
    startTransition(async () => {
      await updateStatusAction(c.id, next)
    })
  }

  return (
    <div className="border border-hair bg-ink-900 p-5">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
            {TIER_LABEL[c.tier] ?? c.tier} &middot; {c.slug}
          </p>
          <h3 className="font-serif text-xl text-ink-100">{c.name}</h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
          {new Date(c.createdAt).toISOString().slice(0, 10)}
        </span>
      </div>
      <p className="text-sm text-ink-300 leading-relaxed mb-3">{c.tagline}</p>
      <p className="font-serif text-ink-200 leading-relaxed mb-3 whitespace-pre-line">
        {c.description}
      </p>

      {c.rationale && (
        <p className="font-mono text-[11px] text-ink-500 mb-3 border-l-2 border-amber-300/40 pl-3">
          {c.rationale}
        </p>
      )}

      {c.signalUrl && (
        <p className="font-mono text-[11px] text-ink-500 mb-3">
          <span className="text-ink-600">signal: </span>
          <a
            href={c.signalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
          >
            {c.signalTitle ?? c.signalUrl}
          </a>
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 font-mono text-[11px] text-ink-400">
        {c.humansAffected !== null && (
          <div>
            <span className="text-ink-600">humans </span>
            <span className="tabular-nums text-ink-200">
              {c.humansAffected.toLocaleString()}
            </span>
          </div>
        )}
        {c.severity !== null && (
          <div>
            <span className="text-ink-600">severity </span>
            <span className="tabular-nums text-ink-200">{c.severity.toFixed(2)}</span>
          </div>
        )}
        {c.welfareBCR !== null && (
          <div>
            <span className="text-ink-600">bcr </span>
            <span className="tabular-nums text-ink-200">{c.welfareBCR.toFixed(1)}x</span>
          </div>
        )}
        {c.xriskITN !== null && (
          <div>
            <span className="text-ink-600">itn </span>
            <span className="tabular-nums text-ink-200">{c.xriskITN.toFixed(1)}</span>
          </div>
        )}
        {c.utilityDelta !== null && (
          <div>
            <span className="text-ink-600">util </span>
            <span className="tabular-nums text-ink-200">
              {(c.utilityDelta * 100).toFixed(0)}%
            </span>
          </div>
        )}
        {c.marketSize !== null && (
          <div>
            <span className="text-ink-600">tam </span>
            <span className="tabular-nums text-ink-200">
              ${c.marketSize.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setStatus('promoted')}
          disabled={pending || c.status === 'promoted'}
          className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider border border-terminal-green/40 text-terminal-green hover:bg-terminal-green/[0.08] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {c.status === 'promoted' ? 'promoted' : 'promote'}
        </button>
        <button
          onClick={() => setStatus('rejected')}
          disabled={pending || c.status === 'rejected'}
          className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider border border-terminal-rose/40 text-terminal-rose hover:bg-terminal-rose/[0.08] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {c.status === 'rejected' ? 'rejected' : 'reject'}
        </button>
        {c.status !== 'draft' && (
          <button
            onClick={() => setStatus('draft')}
            disabled={pending}
            className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider border border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400 transition-colors"
          >
            reset
          </button>
        )}
        {pending && (
          <span className="font-mono text-[11px] text-ink-500">saving&hellip;</span>
        )}
      </div>
    </div>
  )
}
