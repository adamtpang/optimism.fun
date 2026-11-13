import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Container from '@/components/layout/Container'
import FigureCard from '@/components/FigureCard'
import ClassActionBar from '@/components/ClassActionBar'
import { figures, getFigure } from '@/data/figures'
import { getProblemBySlug } from '@/data/problems'
import { commitHref } from '@/lib/visitor-classes'

export function generateStaticParams() {
  return figures.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const figure = getFigure(slug)
  if (!figure) return {}
  return {
    title: `${figure.finding} | optimism.fun`,
    description: `${figure.hero.value} ${figure.hero.label}. ${figure.reading[0]}`,
    alternates: { canonical: `/figures/${figure.slug}` },
  }
}

export default async function FigurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const figure = getFigure(slug)
  if (!figure) notFound()

  const problem = getProblemBySlug(figure.problemSlug)
  const others = figures.filter((f) => f.slug !== figure.slug)

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-28 pb-16">
        <Container>
          <FigureCard figure={figure} titleAs="h1">
            <ClassActionBar
              hrefs={{
                patron: commitHref(figure.problemSlug, 'patron'),
                founder: commitHref(figure.problemSlug, 'founder'),
                researcher: commitHref(figure.problemSlug, 'researcher'),
              }}
            />
          </FigureCard>

          <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] mt-10">
            <section aria-labelledby="reading">
              <h2 id="reading" className="text-h2 text-ink-100">
                What this means
              </h2>
              <div className="mt-3 space-y-3 max-w-[65ch]">
                {figure.reading.map((line) => (
                  <p key={line} className="text-body text-ink-300">
                    {line}
                  </p>
                ))}
              </div>
              {problem && (
                <p className="text-body mt-5">
                  <Link href={`/p/${problem.slug}`} className="text-primary underline underline-offset-2">
                    Why {problem.name.toLowerCase()} is not solved yet, and who is working on it
                  </Link>
                </p>
              )}
            </section>

            <section aria-labelledby="reuse">
              <h2 id="reuse" className="text-h2 text-ink-100">
                Share or reuse
              </h2>
              <p className="text-body text-ink-300 mt-3">
                Free to reuse under CC BY 4.0. Credit optimism.fun and the original source named on the figure.
              </p>
              <p className="mt-4">
                <a
                  href={`/figures/${figure.slug}/opengraph-image`}
                  download={`optimism-fun-fig-${figure.number}-${figure.slug}.png`}
                  className="inline-flex items-center min-h-11 rounded border border-neutral-300 px-4 text-label text-primary hover:bg-teal-50"
                >
                  Download as an image
                </a>
              </p>
              <p className="font-figure text-small text-ink-500 mt-4 break-all">optimism.fun/figures/{figure.slug}</p>
            </section>
          </div>

          {others.length > 0 && (
            <section aria-labelledby="more" className="mt-12 border-t border-neutral-200 pt-8">
              <h2 id="more" className="text-h2 text-ink-100">
                More figures
              </h2>
              <ul className="mt-3 divide-y divide-neutral-200 border-y border-neutral-200">
                {others.map((f) => (
                  <li key={f.slug}>
                    <Link href={`/figures/${f.slug}`} className="flex items-baseline gap-4 py-3 min-h-11 hover:text-primary">
                      <span className="font-figure text-small text-ink-500">Fig. {f.number}</span>
                      <span className="text-body text-ink-100">{f.finding}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}
