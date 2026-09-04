/**
 * The board: three lists under the research on every problem page.
 *
 * Server component. Renders approved commitments beside the curated starter
 * packs and companies already in the ledger, so an empty column still shows a
 * real opportunity rather than a void. Every user-generated row carries a
 * "user-submitted" marker, because the research above it is sourced and these
 * are not, and blending the two would cost the ledger its credibility.
 */
import Link from 'next/link'
import {
  BAND_LABEL,
  type Commitment,
  type ProblemCounts,
} from '@/lib/commitments'

export type BoardCompany = { slug: string; name: string; url?: string; stage: string }
export type BoardQuest = { slug: string; title: string; crowded: boolean }

type Props = {
  problemName: string
  counts: ProblemCounts | undefined
  commitments: Commitment[]
  /** Curated starter-pack quests for this problem, from the research ledger. */
  quests: BoardQuest[]
  /** Companies already tracked on this problem. */
  companies: BoardCompany[]
  /** False when DATABASE_URL is unset: the board cannot load, and says so. */
  boardAvailable: boolean
}

const SUBMITTED = (
  <span className="font-mono text-[9px] uppercase tracking-wider text-ink-600 border border-hair px-1 py-0.5">
    user-submitted
  </span>
)

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-ink-500 leading-relaxed border border-dashed border-hair px-4 py-4">
      {children}
    </p>
  )
}

function Column({
  kicker,
  count,
  countLabel,
  children,
}: {
  kicker: string
  count: number
  countLabel: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-hair">
      <div className="border-b border-hair px-4 py-3 bg-ink-900/40">
        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
          {kicker}
        </p>
        <p className="font-mono text-[11px] text-ink-500 mt-1 tabular-nums">
          <span className={count > 0 ? 'text-ink-200' : 'text-ink-600'}>{count}</span> {countLabel}
        </p>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  )
}

export default function CoordinationBoard({
  problemName,
  counts,
  commitments,
  quests,
  companies,
  boardAvailable,
}: Props) {
  const starts = commitments.filter((c) => c.intent === 'start')
  const joins = commitments.filter((c) => c.intent === 'join')
  const capital = commitments.filter((c) => c.intent === 'fund')
  const needs = commitments.filter((c) => c.intent === 'hire' || c.intent === 'raise')

  const nameOf = (slug: string | null) =>
    companies.find((c) => c.slug === slug)?.name ?? slug ?? 'a company'

  return (
    <section className="px-6 py-12 max-w-5xl mx-auto border-t border-hair-strong">
      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
        The board
      </p>
      <h2 className="font-serif text-2xl md:text-3xl text-ink-100 mb-3">
        Who is actually moving on {problemName}.
      </h2>
      <p className="text-ink-400 text-[13px] leading-relaxed max-w-2xl mb-8">
        Everything above this line is the research ledger: sourced, dated, and open to refutation.
        Everything below it is the market: real people committing, each one confirmed by email and
        read by a human. Nobody can buy a place here.
      </p>

      {!boardAvailable && (
        <p className="border border-amber-300/40 bg-amber-300/[0.04] px-4 py-3 text-[13px] text-ink-300 mb-6">
          The board is not connected on this deployment, so only the curated rows show. Set{' '}
          <code className="text-amber-300">DATABASE_URL</code> and run{' '}
          <code className="text-amber-300">scripts/db/0005_commitments.sql</code>.
        </p>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Open starts */}
        <Column
          kicker="Open starts"
          count={counts?.willingToStart ?? 0}
          countLabel="willing to start"
        >
          {quests.map((q) => (
            <div key={q.slug} className="border-b border-hair pb-3 last:border-b-0 last:pb-0">
              <p className="text-ink-100 text-[13px] font-medium leading-snug">{q.title}</p>
              <p className="font-mono text-[10px] text-ink-600 mt-1">
                {q.crowded ? 'contested · check who is already here' : 'open · nobody funded yet'}
              </p>
              <Link
                href="#coordinate"
                className="inline-block mt-2 font-mono text-[10px] uppercase tracking-wider text-amber-300 hover:underline"
              >
                Claim this start
              </Link>
            </div>
          ))}
          {starts.map((c) => (
            <div key={c.id} className="border-b border-hair pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-ink-200 text-[13px] font-medium">
                  {c.name ?? 'Anonymous builder'}
                </p>
                {SUBMITTED}
              </div>
              <p className="text-ink-400 text-[13px] leading-relaxed">{c.proof}</p>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer nofollow"
                  className="font-mono text-[10px] text-amber-300 hover:underline"
                >
                  proof
                </a>
              )}
            </div>
          ))}
          {quests.length === 0 && starts.length === 0 && (
            <Empty>
              0 people willing to start. Be first, and the next person who lands here sees that
              somebody already moved.
            </Empty>
          )}
        </Column>

        {/* Open joins */}
        <Column kicker="Open joins" count={counts?.willingToJoin ?? 0} countLabel="want in">
          {companies.slice(0, 6).map((co) => {
            const n = joins.filter((j) => j.companySlug === co.slug).length
            return (
              <div key={co.slug} className="border-b border-hair pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-ink-100 text-[13px] font-medium leading-snug">{co.name}</p>
                  <span className="font-mono text-[10px] text-ink-600 whitespace-nowrap">
                    {co.stage}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-ink-600 mt-1 tabular-nums">
                  {n} {n === 1 ? 'person wants' : 'people want'} in
                </p>
                <Link
                  href="#coordinate"
                  className="inline-block mt-2 font-mono text-[10px] uppercase tracking-wider text-amber-300 hover:underline"
                >
                  I want in
                </Link>
              </div>
            )
          })}
          {companies.length === 0 && (
            <Empty>
              No company is tracked on this problem yet. That is a coverage gap in the ledger, not
              proof the field is empty. Use the contribute path to name one.
            </Empty>
          )}
        </Column>

        {/* Open capital */}
        <Column
          kicker="Open capital"
          count={counts?.allocatorsWatching ?? 0}
          countLabel="allocators watching"
        >
          {capital.map((c) => (
            <div key={c.id} className="border-b border-hair pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-ink-200 text-[13px] font-medium">
                  {c.name ?? 'Anonymous allocator'}
                </p>
                {SUBMITTED}
              </div>
              <p className="font-mono text-[10px] text-amber-300 mb-1">
                {c.checkSizeBand ? BAND_LABEL[c.checkSizeBand] : 'band not given'}
                {c.stage ? ` · ${c.stage}` : ''}
              </p>
              <p className="text-ink-400 text-[13px] leading-relaxed">{c.proof}</p>
            </div>
          ))}
          {needs.map((c) => (
            <div key={c.id} className="border-b border-hair pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-ink-200 text-[13px] font-medium">
                  {nameOf(c.companySlug)} · {c.intent === 'hire' ? 'hiring' : 'raising'}
                </p>
                {SUBMITTED}
              </div>
              <p className="text-ink-400 text-[13px] leading-relaxed">{c.proof}</p>
            </div>
          ))}
          {capital.length === 0 && needs.length === 0 && (
            <Empty>
              0 allocators watching. An anonymous band and a one-line thesis is enough to be the
              first, and it stays anonymous.
            </Empty>
          )}
        </Column>
      </div>
    </section>
  )
}
