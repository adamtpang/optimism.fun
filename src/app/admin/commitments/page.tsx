import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { isDbConfigured } from '@/lib/db'
import { listForReview } from '@/lib/commitments'
import CommitmentReviewRow from './CommitmentReviewRow'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Commitment queue · admin',
  robots: { index: false, follow: false },
}

export default async function CommitmentQueuePage() {
  const configured = isDbConfigured()
  const rows = configured ? await listForReview() : []

  const awaiting = rows.filter((r) => r.status === 'pending' && r.confirmedAt)
  const unconfirmed = rows.filter((r) => r.status === 'pending' && !r.confirmedAt)
  const decided = rows.filter((r) => r.status !== 'pending')

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              href="/coordinate"
              className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 hover:text-amber-300"
            >
              &larr; how the board works
            </Link>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
              admin · commitment review queue
            </p>
            <h1 className="mt-2 font-serif text-4xl text-ink-100">Nothing lists itself.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-300">
              Every row here was submitted by a person and confirmed by email. None of it is public
              until it is approved on this page. Approving to the board makes it visible on the
              problem; the digest option also clears it for the weekly email.
            </p>
            <p className="mt-4 font-mono text-[11px] text-ink-500">
              {awaiting.length} awaiting review · {unconfirmed.length} unconfirmed ·{' '}
              {decided.length} decided
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-10 space-y-10">
          {!configured ? (
            <div className="border border-amber-300/40 bg-amber-300/[0.04] p-6 text-sm leading-relaxed text-ink-300">
              Set <code className="text-amber-300">DATABASE_URL</code>, then run{' '}
              <code className="text-amber-300">scripts/db/0005_commitments.sql</code> in Neon. The
              queue and the public board both read from that table.
            </div>
          ) : (
            <>
              <div>
                <h2 className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green mb-4">
                  Awaiting review ({awaiting.length})
                </h2>
                {awaiting.length === 0 ? (
                  <p className="text-[13px] text-ink-500 border border-dashed border-hair px-4 py-4">
                    Nothing to review. Confirmed submissions land here.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {awaiting.map((r) => (
                      <CommitmentReviewRow key={r.id} row={r} />
                    ))}
                  </div>
                )}
              </div>

              {unconfirmed.length > 0 && (
                <div>
                  <h2 className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-4">
                    Not email-confirmed ({unconfirmed.length})
                  </h2>
                  <div className="grid gap-4">
                    {unconfirmed.map((r) => (
                      <CommitmentReviewRow key={r.id} row={r} />
                    ))}
                  </div>
                </div>
              )}

              {decided.length > 0 && (
                <div>
                  <h2 className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-4">
                    Decided ({decided.length})
                  </h2>
                  <div className="grid gap-4">
                    {decided.map((r) => (
                      <CommitmentReviewRow key={r.id} row={r} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
