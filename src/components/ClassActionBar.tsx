import Link from 'next/link'
import { VISITOR_CLASSES, type VisitorClassId } from '@/lib/visitor-classes'

/**
 * The three class buttons, together. This is the only place bold color
 * appears on a page. Each button names its class, so color is never the
 * only signal.
 */
export default function ClassActionBar({
  hrefs,
  asks,
  prompt = 'What will you do about it?',
}: {
  hrefs: Record<VisitorClassId, string>
  /** Page-specific asks. Falls back to each class's default. */
  asks?: Partial<Record<VisitorClassId, string>>
  prompt?: string
}) {
  return (
    <nav aria-label="Ways to act">
      <p className="text-small text-ink-500 mb-2">{prompt}</p>
      <ul className="grid gap-2 sm:grid-cols-3">
        {VISITOR_CLASSES.map((c) => (
          <li key={c.id} className="flex">
            <Link
              href={hrefs[c.id]}
              className={`flex min-h-11 flex-1 flex-col justify-center rounded px-4 py-2.5 text-label focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-100 ${c.solid}`}
            >
              <span className="text-small font-normal">{c.label}</span>
              <span>
                {asks?.[c.id] ?? c.ask} <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
