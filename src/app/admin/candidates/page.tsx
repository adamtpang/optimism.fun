/**
 * /admin/candidates — human-in-the-loop review of cron-sourced problems.
 *
 * Reads from problem_candidates (Neon). When DATABASE_URL isn't set, the page
 * renders a clear "configure infrastructure" panel instead of breaking.
 */
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { isDbConfigured } from '@/lib/db'
import { listCandidates, countCandidatesByStatus } from '@/lib/candidates'
import CandidateRow from './CandidateRow'
import type { CandidateStatus } from '@/data/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Candidates · admin',
  robots: { index: false, follow: false },
}

const STATUS_TABS: { key: CandidateStatus | 'all'; label: string }[] = [
  { key: 'draft', label: 'draft' },
  { key: 'promoted', label: 'promoted' },
  { key: 'rejected', label: 'rejected' },
  { key: 'all', label: 'all' },
]

function ConfigPanel() {
  return (
    <div className="border border-amber-300/40 bg-amber-300/[0.04] p-6">
      <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
        infrastructure not configured
      </p>
      <h2 className="font-serif text-xl text-ink-100 mb-3">
        Wire the candidates pipeline.
      </h2>
      <p className="text-sm text-ink-300 leading-relaxed mb-4">
        The daily cron + admin review depend on three env vars and one SQL
        migration. Set these in Vercel and re-deploy:
      </p>
      <ol className="font-mono text-[12px] text-ink-300 space-y-1 list-decimal list-inside mb-4">
        <li>
          <span className="text-amber-300">DATABASE_URL</span> — Neon connection
          string
        </li>
        <li>
          <span className="text-amber-300">ANTHROPIC_API_KEY</span> — for
          scoring candidates
        </li>
        <li>
          <span className="text-amber-300">GNEWS_API_KEY</span> — gnews.io free
          tier is fine to start
        </li>
        <li>
          <span className="text-amber-300">CRON_SECRET</span> — Bearer token
          Vercel Cron uses to call /api/cron/problem-sourcing
        </li>
        <li>
          <span className="text-amber-300">ADMIN_PASSWORD</span> — protects
          /admin/* via HTTP Basic Auth
        </li>
      </ol>
      <p className="text-sm text-ink-300 leading-relaxed mb-2">
        Then run the schema once in Neon:
      </p>
      <pre className="font-mono text-[11px] text-ink-300 bg-ink-900 border border-hair p-3 overflow-x-auto">
        psql $DATABASE_URL -f scripts/db/0001_problem_candidates.sql
      </pre>
    </div>
  )
}

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: statusParam } = await searchParams
  const status =
    statusParam && ['draft', 'promoted', 'rejected', 'all'].includes(statusParam)
      ? (statusParam as CandidateStatus | 'all')
      : 'draft'

  const configured = isDbConfigured()
  const [candidates, counts] = configured
    ? await Promise.all([
        listCandidates({ status }),
        countCandidatesByStatus(),
      ])
    : [[], { draft: 0, promoted: 0, rejected: 0 } as Record<CandidateStatus, number>]

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-6 border-b border-hair">
          <div className="max-w-5xl mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-ultra-wide text-ink-500 hover:text-amber-300 transition-colors mb-6"
            >
              <span>&larr;</span> back
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
              admin &middot; candidate inbox
            </p>
            <h1 className="font-serif text-3xl md:text-5xl text-ink-100 leading-tight mb-3">
              Review the cron&rsquo;s picks.
            </h1>
            <p className="text-sm text-ink-400 leading-relaxed max-w-2xl">
              Every day{' '}
              <code className="font-mono text-[12px] text-ink-300">
                /api/cron/problem-sourcing
              </code>{' '}
              pulls fresh signal, asks Claude to draft a candidate, and writes
              the result here. Promote what fits the leaderboard; reject what
              doesn&rsquo;t. Promoted candidates still need a human hand to copy
              into <code className="font-mono text-[12px] text-ink-300">src/data/problems.ts</code>.
            </p>
          </div>
        </section>

        <section className="px-6 py-10 max-w-5xl mx-auto">
          {!configured && (
            <div className="mb-6">
              <ConfigPanel />
            </div>
          )}

          <div className="mb-6 flex flex-wrap items-center gap-1.5">
            {STATUS_TABS.map((t) => {
              const count =
                t.key === 'all'
                  ? counts.draft + counts.promoted + counts.rejected
                  : counts[t.key]
              const isActive = status === t.key
              return (
                <Link
                  key={t.key}
                  href={`/admin/candidates?status=${t.key}`}
                  className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                    isActive
                      ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                      : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
                  }`}
                >
                  {t.label}{' '}
                  <span className="tabular-nums text-ink-500">{count}</span>
                </Link>
              )
            })}
          </div>

          {configured && candidates.length === 0 && (
            <p className="font-mono text-[11px] text-ink-500">
              {status === 'draft'
                ? 'no draft candidates. the next cron run will populate this.'
                : `no ${status} candidates.`}
            </p>
          )}

          <div className="space-y-4">
            {candidates.map((c) => (
              <CandidateRow key={c.id} c={c} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
