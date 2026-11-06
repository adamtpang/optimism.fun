import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'
import HeroMedia from '@/components/media/HeroMedia'
import Broll from '@/components/media/Broll'
import Credit from '@/components/media/Credit'
import { mediaCredit } from '@/components/media/credits'
import RankedProblems from '@/components/RankedProblems'
import { Button } from '@/components/ui/button'
import { problems } from '@/data/problems'
import { discoveryCountByProblem } from '@/data/discoveries'
import { computeRadarRows } from '@/lib/radar'
import { displayDeaths } from '@/lib/burden'
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
      <Navbar onHero />
      <main>
        <section className="relative md:h-[720px]">
          <div className="relative h-[300px] mt-14 md:mt-0 md:absolute md:inset-0 md:h-full overflow-hidden">
            <HeroMedia
              alt={mediaCredit('earthset').text}
              sources={EARTHSET}
              width={1920}
              height={1080}
              priority
              className="md:scale-[1.458] md:origin-[87px_402px]"
            />
            <div className="hero-scrim absolute inset-0 hidden md:block" />
            <Credit
              credit={mediaCredit('earthset')}
              onDark
              className="absolute right-4 bottom-3 md:bottom-32 z-10 max-w-[36ch] text-right [text-shadow:0_1px_2px_rgb(0_0_0/.8)]"
            />
          </div>
          <Container className="relative z-10 py-8 md:h-full md:flex md:flex-col md:justify-center">
            <h1 className="text-display-1 text-neutral-900 md:text-white max-w-[15ch]">
              Humanity&rsquo;s hardest problems.
              <span className="block text-primary md:text-white">Bring money or work.</span>
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
              Humanity&rsquo;s hardest problems.
            </h2>

            <RankedProblems
              rows={rows.map((r) => {
                const p = bySlug.get(r.slug)
                const people = p?.humansAffected?.value ?? null
                return {
                  slug: r.slug,
                  name: r.name,
                  people,
                  unit: p?.humansAffected?.unit ?? null,
                  deaths: displayDeaths(r.slug),
                  discoveries: discoveryCounts.get(r.slug) ?? 0,
                  width: people ? decadeBarPercent(people) : 0,
                  score: p?.neglectedness?.score ?? null,
                }
              })}
            />

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
