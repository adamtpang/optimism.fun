import { getEpisodesForCategory } from '@/lib/founders'

export default function LearnSection({ categorySlug }: { categorySlug: string | null }) {
  if (!categorySlug) return null
  const episodes = getEpisodesForCategory(categorySlug)
  if (episodes.length === 0) return null

  return (
    <section className="mb-10">
      <h2 className="text-sm font-medium text-cream uppercase tracking-wider mb-1">
        Learn From the Best
      </h2>
      <p className="text-xs text-muted mb-4">
        From David Senra&apos;s Founders podcast  - church for entrepreneurs.
      </p>
      <div className="space-y-3">
        {episodes.map((ep) => (
          <a
            key={ep.episodeNumber}
            href={ep.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl card-space p-4 hover:border-gold/30 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-gold font-medium mb-1">
                  Founders #{ep.episodeNumber} · {ep.subject}
                </div>
                <div className="font-display font-semibold text-cream text-sm group-hover:text-gold transition-colors mb-1">
                  {ep.title}
                </div>
                <p className="text-xs text-muted mb-2">{ep.description}</p>
                <p className="text-xs text-warm italic">
                  &ldquo;{ep.keyInsight}&rdquo;
                </p>
              </div>
              <svg className="w-4 h-4 text-muted group-hover:text-gold transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
