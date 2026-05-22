import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import EmailCapture from '@/components/EmailCapture'
import { problems } from '@/data/problems'
import { voices } from '@/data/voices'
import { founders } from '@/data/founders'
import { ecosystem } from '@/data/ecosystem'
import { progress } from '@/data/progress'
import { requestsForStartups } from '@/data/rfs'

/**
 * Play optimism.fun — the homepage as a three-level game.
 * Level 01 pick your problem · Level 02 build your team · Level 03 get the capital.
 * Everything else (thesis, history, methodology) lives one click away.
 */
const levels = [
  {
    n: '01',
    kicker: 'pick your problem',
    title: 'Find a quest worth your life.',
    desc: `${problems.length} ranked problems, scored on quantity × severity × current-solution-quality × market-size. ${requestsForStartups.length} concrete companies someone should build.`,
    links: [
      { href: '/', label: 'Browse problems' },
      { href: '/rfs', label: 'Browse requests' },
    ],
    tone: 'amber',
  },
  {
    n: '02',
    kicker: 'build your team',
    title: 'Find your people.',
    desc: `${voices.length} thinkers explaining the problems. ${founders.length} of the biggest builders already on them. Find your cofounders, your operators, your council.`,
    links: [
      { href: '/voices', label: 'See thinkers' },
      { href: '/founders', label: 'See builders' },
    ],
    tone: 'violet',
  },
  {
    n: '03',
    kicker: 'get the capital',
    title: 'Raise the money.',
    desc: `${ecosystem.length} capital allocators — grants, fellowships, FROs, studios, VCs — tagged by quest. The money already chasing this work.`,
    links: [{ href: '/ecosystem', label: 'See the capital stack' }],
    tone: 'cyan',
  },
] as const

const TONE: Record<'amber' | 'violet' | 'cyan', string> = {
  amber: 'text-amber-300',
  violet: 'text-terminal-violet',
  cyan: 'text-terminal-cyan',
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="play · v0.1"
          title="Be the next Elon."
          lede="Humanity has problems. Pick one. Build the team. Get the capital. Ship the future. Three moves below."
          rightStats={[
            { label: 'problems', value: problems.length, tone: 'amber' },
            { label: 'requests', value: requestsForStartups.length, tone: 'amber' },
            { label: 'capital', value: ecosystem.length, tone: 'cyan' },
            { label: 'progress', value: progress.length, tone: 'green' },
          ]}
        />

        {/* The game board — three levels, in order */}
        <section className="border-b border-hair">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
              How to play
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-100 leading-tight mb-8">
              Three moves. In order.
            </h2>
            <ol className="grid md:grid-cols-3 gap-px bg-ink-700/50 border border-hair">
              {levels.map((lv) => (
                <li key={lv.n} className="bg-ink-900 p-6 flex flex-col">
                  <span
                    className={`font-mono text-[11px] tabular-nums tracking-ultra-wide mb-4 ${TONE[lv.tone]}`}
                  >
                    LEVEL {lv.n}
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                    {lv.kicker}
                  </p>
                  <h3 className="font-serif text-2xl text-ink-100 mb-3 leading-tight">
                    {lv.title}
                  </h3>
                  <p className="text-sm text-ink-400 leading-relaxed mb-5 flex-1">
                    {lv.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lv.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-3 py-1.5 hover:bg-amber-300/[0.08] transition-colors"
                      >
                        {l.label} →
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Receipts — compressed. The game has been won before. */}
        <section className="border-b border-hair surface-paper">
          <div className="max-w-3xl mx-auto px-6 py-14">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-paper-copper mb-3">
              The game has been won before
            </p>
            <p className="font-serif text-xl md:text-2xl text-ink-100 leading-snug mb-5">
              Extreme poverty halved since 1990. Child mortality down 60%. Literacy
              near-universal. Internet adoption — luxury to utility in a generation.
              <span className="block mt-3 text-amber-300">Pick what&rsquo;s next.</span>
            </p>
            <Link
              href="/progress"
              className="font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-4 py-2 hover:bg-amber-300/[0.08] transition-colors inline-block"
            >
              See the receipts →
            </Link>
          </div>
        </section>

        {/* Weekly whitepaper drop (newsletter) */}
        <EmailCapture />

        {/* Closer */}
        <section className="border-t border-hair">
          <div className="max-w-5xl mx-auto px-6 py-10 flex flex-wrap items-baseline justify-between gap-4">
            <p className="font-mono text-[11px] text-ink-500">
              v0.1 · solo-built · refined weekly · criticism welcome
            </p>
            <Link
              href="/methodology"
              className="font-mono text-[11px] uppercase tracking-wider text-amber-300 hover:text-amber-200 border border-amber-300/30 px-4 py-2 hover:bg-amber-300/[0.05] transition-colors"
            >
              methodology →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
