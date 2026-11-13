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
  <span className="text-small text-ink-600 border border-hair px-1 py-0.5">
    user-submitted
  </span>
)

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-small text-ink-500 leading-relaxed border border-dashed border-hair px-4 py-4">
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
        <p className="text-small text-primary">
          {kicker}
        </p>
        <p className="font-figure text-small text-ink-500 mt-1 tabular-nums">
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
    <section className="px-6 py-12 max-w-7xl mx-auto border-t border-hair-strong">
      <h2 className="text-h2 md:text-h1 text-ink-100 mb-2">
        Who is moving on {problemName}
      </h2>
      <p className="text-ink-500 text-small mb-8">A human checks every entry. Nothing here can be bought.</p>

      {!boardAvailable && (
        <p className="border border-primary/40 bg-primary/[0.04] px-4 py-3 text-small text-ink-300 mb-6">
          The board is not connected on this deployment, so only the curated rows show. Set{' '}
          <code className="text-primary">DATABASE_URL</code> and run{' '}
          <code className="text-primary">scripts/db/0005_commitments.sql</code>.
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
              <p className="text-ink-100 text-small font-medium leading-snug">{q.title}</p>
              <p className="text-small text-ink-600 mt-1">
                {q.crowded ? 'contested · check who is already here' : 'open · nobody funded yet'}
              </p>
              <Link
                href="#coordinate"
                className="inline-block mt-2 text-small text-primary hover:underline"
              >
                Claim this start
              </Link>
            </div>
          ))}
          {starts.map((c) => (
            <div key={c.id} className="border-b border-hair pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-ink-200 text-small font-medium">
                  {c.name ?? 'Anonymous builder'}
                </p>
                {SUBMITTED}
              </div>
              <p className="text-ink-400 text-small leading-relaxed">{c.proof}</p>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer nofollow"
                  className="text-small text-primary hover:underline"
                >
                  proof
                </a>
              )}
            </div>
          ))}
          {quests.length === 0 && starts.length === 0 && (
            <Empty>
0 so far. Be first.
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
                  <p className="text-ink-100 text-small font-medium leading-snug">{co.name}</p>
                  <span className="text-small text-ink-600 whitespace-nowrap">
                    {co.stage}
                  </span>
                </div>
                <p className="font-figure text-small text-ink-600 mt-1 tabular-nums">
                  {n} {n === 1 ? 'person wants' : 'people want'} in
                </p>
                <Link
                  href="#coordinate"
                  className="inline-block mt-2 text-small text-primary hover:underline"
                >
                  I want in
                </Link>
              </div>
            )
          })}
          {companies.length === 0 && (
            <Empty>
No companies tracked yet.
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
                <p className="text-ink-200 text-small font-medium">
                  {c.name ?? 'Anonymous allocator'}
                </p>
                {SUBMITTED}
              </div>
              <p className="text-small text-primary mb-1">
                {c.checkSizeBand ? BAND_LABEL[c.checkSizeBand] : 'band not given'}
                {c.stage ? ` · ${c.stage}` : ''}
              </p>
              <p className="text-ink-400 text-small leading-relaxed">{c.proof}</p>
            </div>
          ))}
          {needs.map((c) => (
            <div key={c.id} className="border-b border-hair pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-ink-200 text-small font-medium">
                  {nameOf(c.companySlug)} · {c.intent === 'hire' ? 'hiring' : 'raising'}
                </p>
                {SUBMITTED}
              </div>
              <p className="text-ink-400 text-small leading-relaxed">{c.proof}</p>
            </div>
          ))}
          {capital.length === 0 && needs.length === 0 && (
            <Empty>
0 so far. You can stay anonymous.
            </Empty>
          )}
        </Column>
      </div>
    </section>
  )
}
