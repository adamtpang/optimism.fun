import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import { problems } from '@/data/problems'
import { isDbConfigured } from '@/lib/db'
import { countsByProblem, listRecentPublic } from '@/lib/commitments'

export const metadata: Metadata = {
  title: 'How the board works | optimism.fun',
  description:
    'The map is the research: ranked problems with sourced numbers. The board is the market: real people committing to start, join, fund or hire. Nobody can buy a place on either.',
}

export const dynamic = 'force-dynamic'

export default async function CoordinatePage({
  searchParams,
}: {
  searchParams: Promise<{ confirm?: string }>
}) {
  const { confirm } = await searchParams
  const [counts, recent] = await Promise.all([countsByProblem(), listRecentPublic(5)])
  const total = [...counts.values()].reduce((s, c) => s + c.total, 0)

  return (
    <>
      <Navbar />
      <main>
        {confirm === 'invalid' && (
          <div className="pt-24 px-6">
            <p className="max-w-3xl mx-auto border border-terminal-rose/40 bg-terminal-rose/[0.05] px-4 py-3 text-[13px] text-terminal-rose">
              That confirmation link is not valid, or it was already used. Submit again if you think
              this is wrong.
            </p>
          </div>
        )}

        <section className={`${confirm ? 'pt-8' : 'pt-28'} pb-8 border-b border-hair`}>
          <div className="max-w-3xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              How this works
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              The map is research.
              <span className="block text-amber-300">The board is the market.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed text-base">
              Two datasets live on this site and they are deliberately not the same thing. Confusing
              them would cost the research its credibility, so every page keeps them apart.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-12 space-y-12">
          <div className="grid md:grid-cols-2 gap-px bg-hair border border-hair">
            <div className="bg-ink-900/40 px-5 py-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                The map
              </p>
              <p className="text-ink-100 text-sm font-medium mb-2">
                {problems.length} ranked problems, curated
              </p>
              <p className="text-ink-400 text-[13px] leading-relaxed">
                Every number is sourced, dated and carries a visible confidence tag, or it is left
                null rather than guessed. Attention is weighted zero, because it measures crowding,
                not need. Nothing on the map can be bought, and no company can pay for a rank.
              </p>
            </div>
            <div className="bg-ink-900/40 px-5 py-6">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
                The board
              </p>
              <p className="text-ink-100 text-sm font-medium mb-2">
                {total} live commitments, user-submitted
              </p>
              <p className="text-ink-400 text-[13px] leading-relaxed">
                Real people saying they will start, join, fund or hire against a specific problem.
                Every row is marked user-submitted so it is never mistaken for research, and a
                commitment never changes a rank or feeds a demand score.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink-100 mb-4">The two gates</h2>
            <ol className="space-y-4">
              <li className="border-l-2 border-hair pl-4">
                <p className="text-ink-100 text-sm font-medium mb-1">1. Email confirmation</p>
                <p className="text-ink-400 text-[13px] leading-relaxed">
                  Proves the address exists. Confirming publishes nothing. Your address is never
                  shown on the board, and never given to anyone without you asking for an intro.
                </p>
              </li>
              <li className="border-l-2 border-hair pl-4">
                <p className="text-ink-100 text-sm font-medium mb-1">2. Human review</p>
                <p className="text-ink-400 text-[13px] leading-relaxed">
                  Proves someone read it. Both gates must pass. This is slower than an open board
                  and it is the only reason the board is worth reading.
                </p>
              </li>
            </ol>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink-100 mb-4">What this deliberately is not</h2>
            <ul className="space-y-2 text-[13px] text-ink-400 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-terminal-rose">Not</span> a feed, a DM inbox, or a karma
                score. There is nothing here to farm.
              </li>
              <li className="flex gap-2">
                <span className="text-terminal-rose">Not</span> an applicant tracking system or a
                CRM. One role or one raise per company, and the conversation moves off-site.
              </li>
              <li className="flex gap-2">
                <span className="text-terminal-rose">Not</span> for sale. No company can pay for
                placement on the board or a position in the rankings, and there is no tier that
                changes that.
              </li>
              <li className="flex gap-2">
                <span className="text-terminal-rose">Not</span> automatic. Intros are brokered by
                hand, which does not scale and is the correct trade at this size.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink-100 mb-4">Correcting the research</h2>
            <p className="text-ink-400 text-[13px] leading-relaxed mb-3">
              A wrong number is worse than a missing one. Every problem page takes a contribute
              commitment, which is the path for a correction, a better source, or an introduction.
              Corrections are reviewed like everything else, and a good one changes the ledger.
            </p>
            <Link
              href={`/p/${problems[0].slug}#coordinate`}
              className="font-mono text-[11px] uppercase tracking-wider text-amber-300 hover:underline"
            >
              Correct a number &rarr;
            </Link>
          </div>

          {recent.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-ink-100 mb-4">Latest on the board</h2>
              <div className="border border-hair divide-y divide-hair">
                {recent.map((c) => (
                  <Link
                    key={c.id}
                    href={`/p/${c.problemSlug}`}
                    className="block px-4 py-3 hover:bg-ink-900/40 transition-colors"
                  >
                    <p className="text-ink-200 text-[13px]">
                      {c.name ?? 'Anonymous'} · {c.intent} ·{' '}
                      {problems.find((p) => p.slug === c.problemSlug)?.name ?? c.problemSlug}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!isDbConfigured() && (
            <p className="border border-amber-300/40 bg-amber-300/[0.04] px-4 py-3 text-[13px] text-ink-300">
              The board is not connected on this deployment. Set{' '}
              <code className="text-amber-300">DATABASE_URL</code> and run{' '}
              <code className="text-amber-300">scripts/db/0005_commitments.sql</code>.
            </p>
          )}
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
