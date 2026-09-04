'use client'

import { useState, useTransition } from 'react'
import type { CommitmentAdminRow } from '@/lib/commitments'
import { BAND_LABEL, INTENT_LABEL } from '@/lib/commitments'
import { reviewCommitmentAction } from './actions'

export default function CommitmentReviewRow({ row }: { row: CommitmentAdminRow }) {
  const [pending, startTransition] = useTransition()
  const [note, setNote] = useState(row.reviewNote ?? '')

  const confirmed = Boolean(row.confirmedAt)
  const decided = row.status === 'approved' || row.status === 'listed' || row.status === 'rejected'

  const statusTone =
    row.status === 'rejected'
      ? 'text-terminal-rose border-terminal-rose/40'
      : row.status === 'pending'
        ? 'text-ink-400 border-hair'
        : 'text-terminal-green border-terminal-green/40'

  function act(status: 'approved' | 'listed' | 'rejected') {
    startTransition(async () => {
      await reviewCommitmentAction(row.id, status, row.problemSlug, note || undefined)
    })
  }

  return (
    <div className="border border-hair">
      <div className="border-b border-hair px-4 py-3 bg-ink-900/40 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-[11px] text-amber-300">
            {row.actorType} · {INTENT_LABEL[row.intent]}
            {row.companySlug ? ` · ${row.companySlug}` : ''}
            {row.roleType ? ` · ${row.roleType}` : ''}
          </p>
          <p className="font-mono text-[10px] text-ink-500 mt-1">
            {row.problemSlug} · {new Date(row.createdAt).toISOString().slice(0, 10)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border ${
              confirmed
                ? 'text-terminal-green border-terminal-green/40'
                : 'text-terminal-rose border-terminal-rose/40'
            }`}
          >
            {confirmed ? 'email confirmed' : 'unconfirmed'}
          </span>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border ${statusTone}`}
          >
            {row.status}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="font-mono text-[11px] text-ink-300">
          {row.name} &lt;{row.email}&gt;
          {row.visibility === 'anon' && (
            <span className="text-terminal-violet"> · will render anonymously</span>
          )}
          {row.wantsIntro && <span className="text-amber-300"> · asked for an intro</span>}
        </p>
        {row.checkSizeBand && (
          <p className="font-mono text-[11px] text-amber-300">
            {BAND_LABEL[row.checkSizeBand]}
            {row.stage ? ` · ${row.stage}` : ''}
          </p>
        )}
        <p className="text-[13px] leading-relaxed text-ink-200 whitespace-pre-wrap">{row.proof}</p>
        {row.url && (
          <a
            href={row.url}
            target="_blank"
            rel="noreferrer nofollow"
            className="font-mono text-[11px] text-amber-300 hover:underline break-all"
          >
            {row.url}
          </a>
        )}

        {!confirmed && (
          <p className="font-mono text-[10px] text-ink-600">
            Not email-confirmed yet. Approving anyway publishes an unverified address.
          </p>
        )}

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Review note (optional, never public)"
          className="w-full bg-ink-900/60 border border-hair px-3 py-2 text-[13px] text-ink-100 placeholder:text-ink-600 focus:border-amber-300 focus:outline-none"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => act('approved')}
            className="px-3 py-1.5 font-mono text-[11px] border border-terminal-green/40 text-terminal-green hover:bg-terminal-green/10 disabled:opacity-50"
          >
            Approve to board
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => act('listed')}
            className="px-3 py-1.5 font-mono text-[11px] border border-amber-300/40 text-amber-300 hover:bg-amber-300/10 disabled:opacity-50"
          >
            Approve + include in digest
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => act('rejected')}
            className="px-3 py-1.5 font-mono text-[11px] border border-terminal-rose/40 text-terminal-rose hover:bg-terminal-rose/10 disabled:opacity-50"
          >
            Reject
          </button>
          {decided && (
            <span className="font-mono text-[10px] text-ink-600 self-center">
              already reviewed; acting again overwrites the decision
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
