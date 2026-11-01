import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'
import HeroMedia from '@/components/media/HeroMedia'
import Broll from '@/components/media/Broll'
import NeglectMeter from '@/components/charts/NeglectMeter'
import { Button } from '@/components/ui/button'
import { problems } from '@/data/problems'
import { discoveryCountByProblem } from '@/data/discoveries'
import { computeRadarRows } from '@/lib/radar'
import { displayDeaths } from '@/lib/burden'
import { formatHumans } from '@/lib/format'
import { decadeBarPercent } from '@/lib/charts'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export const revalidate = 300

const DOORS = [
  { label: 'Problems', cta: 'Pick a problem', href: '#problems', body: 'The biggest unsolved ones, ranked.' },
  { label: 'Capital', cta: 'Fund a gap', href: '/command#capital', body: 'Where money is, and where it is missing.' },
  { label: 'Talent', cta: 'Work on one', href: '/command#talent', body: 'Specific work that moves a problem.' },
]

const EARTHSET = [
  { media: '(max-width: 767px)', avif: '/media/earthset-828.avif', webp: '/media/earthset-828.webp' },
  { media: '(max-width: 1279px)', avif: '/media/earthset-1280.avif', webp: '/media/earthset-1280.webp' },
  { avif: '/media/earthset-1920.avif', webp: '/media/earthset-1920.webp' },
]

export default function Home() {
  const rows = computeRadarRows().sort((a, b) => b.opportunity - a.opportunity)
  const bySlug = new Map(problems.map((p) => [p.slug, p]))
  const discoveryCounts = discoveryCountByProblem()
  const updated = [...problems.map((p) => p.lastUpdated ?? p.asOf)].sort().at(-1)

  return (
    <>
      <Navbar />
      <main>
        <section className="relative md:h-[720px]">
          <div className="h-[300px] mt-14 md:mt-0 md:absolute md:inset-0 md:h-full">
            <HeroMedia
              alt="A Breathtaking Earthset from Orion, Artemis II, NASA"
              sources={EARTHSET}
              width={1920}
              height={1080}
              priority
            />
            <div className="hero-scrim absolute inset-0 hidden md:block" />
          </div>
          <Container className="relative z-10 py-8 md:h-full md:flex md:flex-col md:justify-center">
            <h1 className="text-display-1 text-neutral-900 md:text-white max-w-[15ch]">
              Humanity&rsquo;s hardest problems.
              <span className="block text-primary md:text-teal-200">Bring money or work.</span>
            </h1>
            <p className="text-body-lg text-neutral-700 md:text-neutral-200 mt-4 md:mt-6 max-w-[46ch]">
              {problems.length} problems. Every number sourced. Nothing for sale.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
              <Button asChild className="h-11 md:bg-white md:text-teal-800 md:hover:bg-neutral-50">
                <Link href="#problems">Pick a problem</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 bg-white md:bg-transparent md:text-white md:border-white/50 md:hover:bg-white/10">
                <Link href="/data">Download the data</Link>
              </Button>
            </div>
            <p className="text-small mt-4 flex flex-wrap gap-x-3 gap-y-1">
              <Link href="/where" className="inline-flex items-center h-11 text-primary md:text-teal-200">
                Where do I fit
              </Link>
              <Link href="/poster" className="inline-flex items-center h-11 text-primary md:text-teal-200">
                Poster
              </Link>
            </p>
          </Container>
        </section>

        <div className="relative z-20 md:-mt-[88px]">
          <Container>
            <div className="doors-panel grid md:grid-cols-3 overflow-hidden">
              {DOORS.map((d) => (
                <Link
                  key={d.label}
                  href={d.href}
                  className="block p-5 md:p-8 min-h-11 border-b md:border-b-0 md:border-r border-neutral-200 last:border-0"
                >
                  <p className="text-small font-medium text-neutral-700">{d.label}</p>
                  <p className="text-h3 text-neutral-900 mt-1">
                    {d.cta} <span className="text-primary">→</span>
                  </p>
                  <p className="text-small text-neutral-700 mt-1">{d.body}</p>
                </Link>
              ))}
            </div>
          </Container>
        </div>

        <Section id="problems" className="scroll-mt-20">
          <Container>
            <p className="text-label text-primary">The problems</p>
            <h2 className="text-h1 text-ink-100 mt-2 max-w-[28ch]">
              Humanity&rsquo;s hardest problems, by how many people they reach.
            </h2>
            <p className="text-body text-neutral-600 mt-3 max-w-[68ch]">
              Longer bar, more people, on a log scale. The order is the site ranking. Ranked by need against how well-served each problem is. Related deaths count every cause a problem feeds, so they overlap.
            </p>

            <div className="mt-8 border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-[48px_minmax(0,1.3fr)_minmax(0,1.5fr)_120px_150px_72px] gap-4 items-center h-12 px-6 bg-neutral-50 border-b border-neutral-200 text-small font-medium text-neutral-600">
                <span>#</span>
                <span>Problem</span>
                <span className="flex justify-between pr-14">
                  <span>1M</span>
                  <span>10M</span>
                  <span>100M</span>
                  <span>1B</span>
                  <span>10B</span>
                </span>
                <span className="text-right">Related deaths / yr</span>
                <span>Neglected</span>
                <span />
              </div>
              <ol>
                {rows.map((r, i) => {
                  const p = bySlug.get(r.slug)
                  const people = p?.humansAffected?.value
                  const unit = p?.humansAffected?.unit
                  const deaths = displayDeaths(r.slug)
                  const discoveries = discoveryCounts.get(r.slug) ?? 0
                  const width = people ? decadeBarPercent(people) : 0
                  const score = p?.neglectedness?.score ?? null
                  return (
                    <li
                      key={r.slug}
                      className="grid grid-cols-[28px_minmax(0,1fr)_auto] md:grid-cols-[48px_minmax(0,1.3fr)_minmax(0,1.5fr)_120px_150px_72px] gap-x-3 gap-y-2 items-center px-4 md:px-6 py-4 border-b border-neutral-100 last:border-b-0"
                    >
                      <span className="text-small text-neutral-600 font-medium self-start md:self-center">{i + 1}</span>
                      <div className="min-w-0">
                        <Link href={`/p/${r.slug}`} className="text-body font-semibold text-ink-100 hover:text-primary">
                          {r.name}
                        </Link>
                        <p className="text-small text-neutral-600">
                          {unit}
                          {discoveries > 0 && (
                            <>
                              {' · '}
                              <Link href={`/discoveries?problem=${r.slug}`} className="text-primary hover:underline">
                                {discoveries === 1 ? '1 discovery' : `${discoveries} discoveries`}
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                      <Link
                        href={`/p/${r.slug}#coordinate`}
                        className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-lg border border-neutral-200 text-primary font-semibold"
                        aria-label={`Act on ${r.name}`}
                      >
                        →
                      </Link>
                      <div className="col-start-2 md:col-start-auto md:col-span-1 flex items-center gap-3 min-w-0">
                        <div className="decade-track relative h-3 flex-1 rounded-full overflow-hidden" aria-hidden>
                          <div className="absolute inset-y-0 left-0 bg-blue-600 rounded-full" style={{ width: `${width}%` }} />
                        </div>
                        <span className="text-small font-semibold text-blue-700 tabular-nums w-14 text-right">
                          {people ? formatHumans(people) : '—'}
                        </span>
                      </div>
                      <span className="hidden md:block text-small text-right tabular-nums text-neutral-900">
                        {deaths ? formatHumans(deaths) : '—'}
                      </span>
                      <span className="hidden md:flex">
                        <NeglectMeter score={score} />
                      </span>
                      <p className="col-start-2 md:hidden text-small text-neutral-600">
                        {deaths ? `${formatHumans(deaths)} related deaths / yr` : null}
                        {deaths ? ' · ' : null}
                        {score == null ? 'neglectedness unscored' : `${score}/10 neglected`}
                      </p>
                      <Link
                        href={`/p/${r.slug}#coordinate`}
                        className="hidden md:inline-flex items-center justify-center h-11 px-3 rounded-lg border border-neutral-200 text-small font-semibold text-primary hover:bg-teal-50"
                      >
                        Act
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3 text-small text-neutral-600">
              <p className="max-w-[68ch]">
                Each count is the humans-affected figure on that problem, with its own source and unit. Neglectedness is the stored 0 to 10 score.
                {updated ? ` Figures reviewed through ${updated}.` : ''}{' '}
                <Link href="/methodology" className="text-primary underline underline-offset-2">
                  How
                </Link>
                {' · '}
                <Link href="/data" className="text-primary underline underline-offset-2">
                  Download the data
                </Link>
              </p>
              <p>CC BY 4.0</p>
            </div>
          </Container>
        </Section>

        <Broll />
      </main>
      <Footer />
    </>
  )
}
