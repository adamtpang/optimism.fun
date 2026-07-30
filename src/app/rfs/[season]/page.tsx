import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import { rfsSeasons, getSeason } from '@/data/rfs-seasons'
import { computeQuestRankings } from '@/lib/rankings'
import { computePriorAccuracy } from '@/lib/prior-accuracy'
import { fmtUsdCompact } from '@/lib/allocation'
import HeroFigure from '@/components/HeroFigure'
import AnnotatedFigure from '@/components/AnnotatedFigure'
import PriorsVsSourced, { PriorsVsSourcedTable } from '@/components/PriorsVsSourced'

export function generateStaticParams() {
  return rfsSeasons.map((s) => ({ season: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>
}): Promise<Metadata> {
  const { season } = await params
  const s = getSeason(season)
  if (!s) return { title: 'Requests for Startups | optimism.fun' }
  return {
    title: `RFS ${s.name}: ${s.title} | optimism.fun`,
    description: s.intro[0],
    authors: [{ name: s.author }],
  }
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ season: string }>
}) {
  const { season } = await params
  const s = getSeason(season)
  if (!s) notFound()

  const ranked = computeQuestRankings()
  const bySlug = new Map(ranked.map((q) => [q.slug, q]))
  const featured = s.questSlugs.map((slug) => bySlug.get(slug)).filter(Boolean)
  const accuracy = computePriorAccuracy()

  const published = new Date(s.published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <Navbar />
      <main>
        {/* masthead */}
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="max-w-3xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              Requests for Startups · {s.name}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-5">
              {s.title}
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] text-ink-500">
              <span>
                by{' '}
                <span className="text-ink-200">{s.author}</span>
              </span>
              <span>·</span>
              <time dateTime={s.published}>{published}</time>
              <span>·</span>
              <span>{featured.length} requests</span>
            </div>
          </div>
        </section>

        {/* the essay */}
        <section className="border-b border-hair">
          <div className="max-w-3xl mx-auto px-6 py-10 space-y-5">
            {s.intro.map((para, i) => (
              <p
                key={i}
                className={`text-ink-300 leading-relaxed ${
                  i === 0 ? 'text-lg text-ink-200' : 'text-[15px]'
                }`}
              >
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* the evidence — full-bleed, wider than the prose it interrupts */}
        <section className="border-b border-hair bg-ink-900/30">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
              <HeroFigure
                value={`${accuracy.wrong} of ${accuracy.compared}`}
                label="Priors the data overturned"
                caption={
                  accuracy.errorsAllOneDirection
                    ? `And every single miss went the same way: ${accuracy.tooOptimistic} of ${accuracy.wrong} guessed the field emptier than it was. That is a bias, not noise.`
                    : `${accuracy.tooOptimistic} guessed too empty, ${accuracy.tooPessimistic} too crowded.`
                }
              />

              <AnnotatedFigure
                claim="I guessed how contested each quest was. The data disagreed, and always in the same direction."
                standfirst="Each row is one quest. The light dot is what I guessed before looking; the dark dot is what a search for real companies actually found. Sorted by size of the error."
                callouts={[
                  {
                    x: 52,
                    y: 1,
                    text: 'every miss points right — busier than guessed',
                    leader: 'none',
                  },
                  {
                    x: 62,
                    y: 74,
                    text: `${accuracy.correct} guesses held`,
                    leader: 'left',
                  },
                ]}
                source="Sourced via Exa Agent against production, 2026-07-20. Bands: open = 0-1 companies found, contested = 2-4, crowded = 5+."
                tableView={<PriorsVsSourcedTable rows={accuracy.rows} />}
              >
                <PriorsVsSourced rows={accuracy.rows} />
              </AnnotatedFigure>
            </div>
          </div>
        </section>

        {/* the requests */}
        <section className="border-b border-hair">
          <div className="max-w-3xl mx-auto px-6 py-10 space-y-12">
            {featured.map((q, i) => {
              if (!q) return null
              const open = q.competitorCount === 0
              return (
                <article key={q.slug} className="scroll-mt-24" id={q.slug}>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-mono text-[11px] text-ink-600 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                      {q.title}
                    </h2>
                  </div>

                  {/* the numbers that earned it a place */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 font-mono text-[10px] text-ink-500 pl-8">
                    <span>
                      demand <span className="text-ink-200 tabular-nums">{q.demand}</span>
                    </span>
                    <span>
                      gap <span className="text-ink-200 tabular-nums">{q.gap}</span>
                    </span>
                    <span className={open ? 'text-terminal-green' : 'text-amber-300'}>
                      {q.competitorCount === 0
                        ? 'nobody building this'
                        : `${q.competitorCount} already building`}
                    </span>
                    {q.prizeUsd != null && (
                      <span>
                        prize{' '}
                        <span className="text-ink-200 tabular-nums">
                          {fmtUsdCompact(q.prizeUsd)}
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="pl-8 space-y-4">
                    <p className="text-ink-200 text-[15px] leading-relaxed">{q.pitch}</p>

                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wide text-terminal-cyan mb-1">
                        Why now
                      </p>
                      <p className="text-ink-400 text-[14px] leading-relaxed">{q.whyNow}</p>
                    </div>

                    {q.exampleCompetitors.length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500 mb-1">
                          Who is already in it
                        </p>
                        <p className="text-ink-400 text-[14px] leading-relaxed">
                          {q.exampleCompetitors.join(' · ')}
                        </p>
                      </div>
                    )}

                    <p className="font-mono text-[10px] text-ink-600">
                      attacks{' '}
                      <Link
                        href={`/p/${q.problemSlug}`}
                        className="text-amber-300 hover:underline"
                      >
                        {q.problemName}
                      </Link>
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* the close, in the author's voice */}
        <section className="border-b border-hair">
          <div className="max-w-3xl mx-auto px-6 py-10">
            <p className="text-ink-300 text-[15px] leading-relaxed">{s.outro}</p>
            <p className="mt-5 font-mono text-[11px] text-ink-500">
              — {s.author}, {published}
            </p>
          </div>
        </section>

        {/* where the numbers come from */}
        <section className="border-b border-hair">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <p className="font-mono text-[11px] text-ink-500 leading-relaxed">
              Every request above is drawn from the live{' '}
              <Link href="/rankings" className="text-amber-300 hover:underline">
                power rankings
              </Link>
              , scored as demand × quest-gap × readiness. Demand comes from the{' '}
              <Link href="/demand" className="text-amber-300 hover:underline">
                demand map
              </Link>{' '}
              (burden, willingness to pay, capital, research, queues). Competitor counts are
              sourced, not estimated. Who might fund it is on the{' '}
              <Link href="/capital" className="text-amber-300 hover:underline">
                capital map
              </Link>
              .
            </p>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
