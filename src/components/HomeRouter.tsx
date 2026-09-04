/**
 * The homepage router: three doors, the most under-coordinated problems, and
 * the live ticker.
 *
 * The site's failure mode was that every route led to another view of the same
 * table. This block exists to send a visitor somewhere they can act, before
 * they reach the leaderboard. Server component, so it can read the board.
 */
import Link from 'next/link'
import { INTENT_LABEL, type Commitment } from '@/lib/commitments'
import type { UnderCoordinatedRow } from '@/lib/coordination'
import { problems } from '@/data/problems'

type Props = {
  underCoordinated: UnderCoordinatedRow[]
  recent: Commitment[]
  boardAvailable: boolean
}

const DOORS = [
  {
    href: '/paths',
    label: 'I build',
    body: 'Start something nobody is racing you on, or join one of the teams already funded.',
  },
  {
    href: '/marketcap',
    label: 'I fund',
    body: 'See what each problem is worth at the limit, and how much of it is still unclaimed.',
  },
  {
    href: '/companies',
    label: 'I hire',
    body: 'Post one open role or one raise against the problem your company already works on.',
  },
]

const nameOf = (slug: string) => problems.find((p) => p.slug === slug)?.name ?? slug

const ago = (iso: string): string => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function HomeRouter({ underCoordinated, recent, boardAvailable }: Props) {
  return (
    <section className="border-b border-hair bg-ink-900/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
          The loop
        </p>
        <h2 className="font-serif text-2xl md:text-4xl text-ink-100 mb-8 max-w-3xl leading-[1.1]">
          Rank the work. Then route people and money to it.
        </h2>

        {/* Three doors */}
        <div className="grid md:grid-cols-3 gap-px bg-hair border border-hair mb-10">
          {DOORS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="group bg-ink-900/40 px-5 py-6 hover:bg-ink-800/40 transition-colors"
            >
              <p className="font-serif text-xl text-ink-100 group-hover:text-amber-300 transition-colors mb-2">
                {d.label} &rarr;
              </p>
              <p className="text-ink-400 text-[13px] leading-relaxed">{d.body}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Most under-coordinated */}
          <div className="lg:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
              Most under-coordinated this week
            </p>
            <p className="text-ink-500 text-[12px] leading-relaxed mb-4 max-w-xl">
              Not the biggest problems, and not the biggest prizes. These are where real need meets
              thin effort and an empty board. Every commitment made here moves a row off this list.
            </p>
            <div className="space-y-px bg-hair border border-hair">
              {underCoordinated.map((r, i) => (
                <div key={r.slug} className="bg-ink-900/40 px-4 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-ink-600 tabular-nums">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/p/${r.slug}`}
                        className="text-ink-100 text-sm font-medium hover:text-amber-300 transition-colors"
                      >
                        {r.name}
                      </Link>
                      <p className="text-ink-500 text-[12px] leading-relaxed mt-1">{r.because}</p>
                    </div>
                    <Link
                      href={`/p/${r.slug}#coordinate`}
                      className="font-mono text-[10px] uppercase tracking-wider text-amber-300 hover:underline whitespace-nowrap"
                    >
                      Act
                    </Link>
                  </div>
                </div>
              ))}
              {underCoordinated.length === 0 && (
                <div className="bg-ink-900/40 px-4 py-4">
                  <p className="text-ink-500 text-[13px]">
                    Supply and demand data is still loading its first pass.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Live ticker */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
              Latest commitments
            </p>
            <p className="text-ink-500 text-[12px] leading-relaxed mb-4">
              The one live dataset here. Each row was confirmed by email and approved by a human.
            </p>
            <div className="border border-hair divide-y divide-hair">
              {recent.map((c) => (
                <div key={c.id} className="px-4 py-3">
                  <p className="font-mono text-[11px] text-amber-300">
                    {INTENT_LABEL[c.intent]}
                  </p>
                  <Link
                    href={`/p/${c.problemSlug}`}
                    className="text-ink-200 text-[13px] hover:text-amber-300 transition-colors block mt-0.5 leading-snug"
                  >
                    {nameOf(c.problemSlug)}
                  </Link>
                  <p className="font-mono text-[10px] text-ink-600 mt-1">
                    {c.name ?? 'anonymous'} · {ago(c.createdAt)}
                  </p>
                </div>
              ))}
              {recent.length === 0 && (
                <div className="px-4 py-5">
                  <p className="text-ink-400 text-[13px] leading-relaxed">
                    {boardAvailable
                      ? '0 commitments so far. Be the first, and this column stops being empty for everyone who lands here after you.'
                      : 'The board is not connected on this deployment yet.'}
                  </p>
                  <Link
                    href="/coordinate"
                    className="inline-block mt-3 font-mono text-[10px] uppercase tracking-wider text-amber-300 hover:underline"
                  >
                    How the board works &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
