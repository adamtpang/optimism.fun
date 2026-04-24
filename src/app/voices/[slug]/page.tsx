import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { voices, getVoiceBySlug } from '@/data/voices'
import { problems } from '@/data/problems'

export function generateStaticParams() {
  return voices.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const voice = getVoiceBySlug(slug)
  if (!voice) return {}
  return {
    title: `${voice.name} | optimism.fun`,
    description: voice.bio,
  }
}

export default async function VoicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const voice = getVoiceBySlug(slug)
  if (!voice) notFound()

  const problemBySlug = new Map(problems.map((p) => [p.slug, p]))

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/voices"
              className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-300 transition-colors mb-8"
            >
              <span>←</span> all voices
            </Link>
            <p className="text-terminal-violet font-medium tracking-[0.2em] uppercase text-xs mb-3">
              Voice
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-normal leading-[1.1] mb-3">
              {voice.name}
            </h1>
            <p className="text-ink-400 mb-8">
              {voice.role}
              {voice.org ? ` · ${voice.org}` : ''}
              {voice.url && (
                <>
                  {' · '}
                  <a
                    href={voice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terminal-violet hover:text-terminal-violet underline underline-offset-2"
                  >
                    site
                  </a>
                </>
              )}
            </p>

            <p className="text-lg text-ink-300 leading-relaxed mb-12">{voice.bio}</p>

            {voice.writings.length > 0 && (
              <section className="mb-12">
                <h2 className="font-serif text-lg font-semibold text-ink-100 mb-4">
                  Key writings
                </h2>
                <ul className="space-y-2">
                  {voice.writings.map((w) => (
                    <li key={w.url}>
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-amber-300 hover:text-amber-200 underline underline-offset-2"
                      >
                        {w.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="font-serif text-2xl font-normal text-ink-100 mb-6">
                Positions on problems
              </h2>
              <div className="space-y-4">
                {voice.positions.map((pos) => {
                  const problem = problemBySlug.get(pos.problemSlug)
                  if (!problem) return null
                  return (
                    <div
                      key={pos.problemSlug}
                      className="rounded border border-hair bg-ink-900 p-6"
                    >
                      <Link
                        href={`/p/${pos.problemSlug}`}
                        className="font-serif font-semibold text-ink-100 hover:text-amber-200 transition-colors"
                      >
                        {problem.name}
                      </Link>
                      {pos.quote && (
                        <blockquote className="border-l-2 border-terminal-violet/40 pl-4 my-4 text-ink-300 italic leading-relaxed">
                          &ldquo;{pos.quote}&rdquo;
                        </blockquote>
                      )}
                      <p className="text-sm text-ink-400 leading-relaxed mt-2">
                        {pos.stance}
                      </p>
                      <p className="mt-3 text-xs text-ink-500">
                        {pos.sourceUrl ? (
                          <a
                            href={pos.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink-500 hover:text-ink-300 underline underline-offset-2"
                          >
                            {pos.source}
                          </a>
                        ) : (
                          pos.source
                        )}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
