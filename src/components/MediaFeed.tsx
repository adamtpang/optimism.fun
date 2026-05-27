import { getMediaItems } from '@/data/media'
import { getMediaSource } from '@/data/media-sources'
import type { MediaSourceKind } from '@/data/types'

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

export default async function MediaFeed({
  problemSlug,
  sectorSlug,
  limit = 8,
  emptyLabel = 'No coverage logged yet for this problem.',
}: {
  problemSlug?: string
  sectorSlug?: string
  limit?: number
  emptyLabel?: string
}) {
  const items = await getMediaItems({ problemSlug, sectorSlug, limit })

  if (items.length === 0) {
    return (
      <p className="font-mono text-[11px] text-ink-500">{emptyLabel}</p>
    )
  }

  return (
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
            </a>
          </li>
        )
      })}
    </ul>
  )
}
