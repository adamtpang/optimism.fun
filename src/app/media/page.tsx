import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getMediaItems } from '@/data/media'
import { getMediaSource, mediaSources } from '@/data/media-sources'
import { problems } from '@/data/problems'
import type { MediaSourceKind } from '@/data/types'

export const metadata = {
  title: 'Media · optimism.fun',
  description:
    'Live feed of essays, podcasts, threads, and videos writing about humanity’s problems right now.',
}

const SOURCE_KIND_LABEL: Record<MediaSourceKind, string> = {
  substack: 'essay',
  blog: 'essay',
  youtube: 'video',
  x: 'thread',
  podcast: 'podcast',
}

const SOURCE_KIND_COLOR: Record<MediaSourceKind, string> = {
  substack: 'text-amber-300 border-amber-300/40',
  blog: 'text-amber-300 border-amber-300/40',
  youtube: 'text-terminal-rose border-rose-500/40',
  x: 'text-terminal-cyan border-cyan-400/40',
  podcast: 'text-terminal-violet border-violet-400/40',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const now = Date.now()
  const diffDays = Math.floor((now - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays < 1) return 'today'
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

export default async function MediaIndex({
  searchParams,
}: {
  searchParams: Promise<{ problem?: string; source?: string }>
}) {
  const { problem: problemFilter, source: sourceFilter } = await searchParams
  const items = await getMediaItems({
    problemSlug: problemFilter,
    sourceId: sourceFilter,
    limit: 200,
  })

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="max-w-5xl mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-ultra-wide text-ink-500 hover:text-amber-300 transition-colors mb-8"
            >
              <span>&larr;</span> back
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              media &middot; firehose
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] text-ink-100 mb-5">
              Writing about this <span className="text-amber-300">right now</span>.
            </h1>
            <p className="text-lg text-ink-300 leading-relaxed max-w-3xl">
              Essays, podcasts, videos, and threads from the {mediaSources.length}{' '}
              sources we follow most closely &mdash; tagged to the problems on the
              leaderboard.
            </p>
          </div>
        </section>

        <section className="px-6 py-10 max-w-5xl mx-auto">
          <div className="mb-6 space-y-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                filter by problem
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Link
                  href="/media"
                  className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                    !problemFilter
                      ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                      : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
                  }`}
                >
                  all
                </Link>
                {problems.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/media?problem=${p.slug}${sourceFilter ? `&source=${sourceFilter}` : ''}`}
                    className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                      problemFilter === p.slug
                        ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                        : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
                    }`}
                  >
                    {p.name.toLowerCase().split(/[ &]/)[0]}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                filter by source
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Link
                  href={problemFilter ? `/media?problem=${problemFilter}` : '/media'}
                  className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                    !sourceFilter
                      ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                      : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
                  }`}
                >
                  all
                </Link>
                {mediaSources.map((s) => (
                  <Link
                    key={s.id}
                    href={`/media?${problemFilter ? `problem=${problemFilter}&` : ''}source=${s.id}`}
                    className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                      sourceFilter === s.id
                        ? 'bg-amber-300/10 border-amber-300/60 text-amber-300'
                        : 'border-hair text-ink-400 hover:text-ink-100 hover:border-ink-400'
                    }`}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="font-mono text-[11px] text-ink-500">
              no items match this filter.
            </p>
          ) : (
            <ul className="border border-hair">
              {items.map((item) => {
                const source = getMediaSource(item.sourceId)
                const kindLabel = source ? SOURCE_KIND_LABEL[source.kind] : 'item'
                const kindColor = source
                  ? SOURCE_KIND_COLOR[source.kind]
                  : 'text-ink-400 border-hair'
                return (
                  <li key={item.id} className="border-b border-hair last:border-b-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-ink-900 hover:bg-ink-800/50 transition-colors p-4 group"
                    >
                      <div className="flex items-baseline gap-2 mb-1.5">
                        <span
                          className={`font-mono text-[9px] uppercase tracking-ultra-wide border px-1.5 py-px ${kindColor}`}
                        >
                          {kindLabel}
                        </span>
                        {source && (
                          <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                            {source.name}
                            {source.author ? ` · ${source.author}` : ''}
                          </span>
                        )}
                        <span className="ml-auto font-mono text-[10px] text-ink-600 tabular-nums">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>
                      <p className="font-sans text-sm text-ink-100 group-hover:text-amber-300 transition-colors leading-snug">
                        {item.title}
                      </p>
                      {item.excerpt && (
                        <p className="mt-1 text-[12px] text-ink-400 leading-relaxed line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.problemSlugs.map((slug) => {
                          const p = problems.find((x) => x.slug === slug)
                          if (!p) return null
                          return (
                            <Link
                              key={slug}
                              href={`/p/${slug}`}
                              className="font-mono text-[9px] uppercase tracking-ultra-wide text-ink-400 hover:text-amber-300 border border-hair hover:border-amber-300/60 px-1.5 py-px"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {p.name.toLowerCase().split(/[ &]/)[0]}
                            </Link>
                          )
                        })}
                      </div>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
