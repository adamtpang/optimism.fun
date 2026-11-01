import type { Problem } from '@/data/types'
import { citationsForProblem, deathRatePair } from '@/lib/citations'

/**
 * The citable record for one problem: an APA citation of this page, then
 * each underlying source. Same type and color as the rest of the problem page.
 */
export default function CiteThis({ problem }: { problem: Problem }) {
  const cites = citationsForProblem(problem)
  const scored = deathRatePair(problem)
  return (
    <section id="cite-this" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 border-b border-hair">
      <h2 className="font-serif text-2xl text-ink-100 mb-4">Cite this</h2>
      {problem.severityNote && (
        <p className="text-sm text-ink-400 leading-relaxed mb-4">{problem.severityNote}</p>
      )}
      {scored?.yearMismatch && (
        <p className="text-sm text-ink-400 leading-relaxed mb-4">
          Year mismatch: {scored.yearMismatch}
        </p>
      )}
      <ol className="space-y-3 text-sm text-ink-300 leading-relaxed list-decimal pl-5">
        {cites.map((c) => (
          <li key={c.href ?? c.text}>
            {c.href ? (
              <a
                href={c.href}
                {...(c.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="underline decoration-dotted hover:text-amber-300"
              >
                {c.text}
              </a>
            ) : (
              c.text
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
