import Link from 'next/link'
import { getProblemBySlug } from '@/data/problems'
import { existentialRisks } from '@/data/existential-risks'
import type { Discovery, DiscoveryChange, ReviewStatus } from '@/data/discoveries'

const REVIEW_LABEL: Record<ReviewStatus, string> = {
  'peer-reviewed': 'Peer reviewed',
  preprint: 'Preprint, not peer reviewed',
  'trial-result': 'Trial result',
}

const REVIEW_CLASS: Record<ReviewStatus, string> = {
  'peer-reviewed': 'text-terminal-green border-terminal-green/40',
  preprint: 'text-amber-300 border-amber-300/70',
  'trial-result': 'text-terminal-cyan border-terminal-cyan/50',
}

const CHANGE_LABEL: Record<DiscoveryChange, string> = {
  scale: 'scale',
  neglectedness: 'neglectedness',
  tractability: 'tractability',
}

function riskName(slug: string): string {
  return existentialRisks.find((r) => r.slug === slug)?.shortName ?? slug
}

export default function DiscoveryList({
  items,
  compact = false,
}: {
  items: Discovery[]
  compact?: boolean
}) {
  if (items.length === 0) return null

  return (
    <ul className="border border-hair">
      {items.map((item) => {
        const flagged = item.status === 'challenged' || item.status === 'retracted'
        return (
          <li
            key={item.id}
            className={`border-b border-hair last:border-b-0 bg-ink-900 ${
              flagged ? 'border-l-2 border-l-terminal-rose' : ''
            }`}
          >
            <article className={compact ? 'p-4' : 'p-5'}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider border px-1.5 py-px ${REVIEW_CLASS[item.review]}`}
                >
                  {REVIEW_LABEL[item.review]}
                </span>
                {item.status && (
                  <span className="font-mono text-[10px] uppercase tracking-wider border border-terminal-rose/70 bg-terminal-rose/10 text-terminal-rose px-1.5 py-px">
                    {item.status === 'retracted' ? 'Retracted' : 'Challenged'}
                  </span>
                )}
                <time
                  dateTime={item.published || undefined}
                  className="ml-auto font-mono text-[11px] text-ink-500 tabular-nums"
                >
                  {item.published || 'date unknown'}
                </time>
              </div>

              {compact ? (
                <h3 className="font-serif text-lg text-ink-100 leading-snug">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition-colors"
                  >
                    {item.title}
                  </a>
                </h3>
              ) : (
                <h2 className="font-serif text-xl text-ink-100 leading-snug">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition-colors"
                  >
                    {item.title}
                  </a>
                </h2>
              )}

              <p className="mt-2 text-sm text-ink-300 leading-relaxed">{item.summary}</p>

              {item.notice && (
                <p className="mt-3 text-sm text-terminal-rose leading-relaxed">
                  <span className="font-medium">
                    {item.status === 'retracted' ? 'Retracted. ' : 'Challenged. '}
                  </span>
                  {item.notice.note}{' '}
                  <a
                    href={item.notice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-2 hover:text-ink-100"
                  >
                    Read the {item.status === 'retracted' ? 'retraction' : 'challenge'}
                  </a>
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
                  Moves {CHANGE_LABEL[item.changes]}
                </span>
                {item.problemSlugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/p/${slug}`}
                    className="text-ink-300 hover:text-amber-300 transition-colors"
                  >
                    {getProblemBySlug(slug)?.name ?? slug}
                  </Link>
                ))}
                {(item.riskSlugs ?? []).map((slug) => (
                  <Link
                    key={slug}
                    href={`/s-tier#${slug}`}
                    className="text-terminal-rose/90 hover:text-terminal-rose transition-colors"
                  >
                    S-tier: {riskName(slug)}
                  </Link>
                ))}
              </div>

              <p className="mt-2 font-mono text-[11px] text-ink-500">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 underline decoration-dotted underline-offset-2"
                >
                  {item.source}
                </a>
                {item.doi ? <span className="text-ink-600"> · {item.doi}</span> : null}
              </p>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
