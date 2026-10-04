/**
 * Why a problem is not solved yet, as short claims. Each claim shows one line
 * of why, what you can do, and its sources. The reasoning (what would prove
 * it wrong, what we found) sits behind a toggle.
 */
import { getConstraintTree, type Constraint } from '@/data/constraints'

const WHO = { talent: 'Work', capital: 'Fund', operator: 'Run' } as const

function Node({ c, binding, nested }: { c: Constraint; binding: string; nested?: boolean }) {
  const isBinding = c.id === binding
  return (
    <div className={`border-l-2 pl-4 ${isBinding ? 'border-amber-300' : 'border-hair'} ${nested ? 'mt-4' : ''}`}>
      {isBinding && <p className="font-mono text-xs uppercase tracking-wider text-amber-300 mb-1">Biggest blocker</p>}
      <p className="text-ink-100 text-lg leading-snug">{c.claim}</p>
      {c.entryPoints.length > 0 && (
        <ul className="mt-2 space-y-1">
          {c.entryPoints.map((e) => (
            <li key={e.action} className="text-sm text-ink-300">
              <span className="font-mono text-xs uppercase text-amber-300 mr-2">{WHO[e.who]}</span>
              {e.action}
            </li>
          ))}
        </ul>
      )}
      <details className="mt-2 text-sm text-ink-400">
        <summary className="cursor-pointer text-ink-500 hover:text-ink-200">Why, and how we know</summary>
        <p className="mt-2">{c.whyUnsolved}</p>
        <p className="mt-2"><span className="text-ink-200">Wrong if:</span> {c.falsifier}</p>
        {c.tested && <p className="mt-2"><span className="text-ink-200">Found:</span> {c.tested}</p>}
        {c.suppliers.length > 0 && <p className="mt-2"><span className="text-ink-200">On it:</span> {c.suppliers.join(', ')}</p>}
        <p className="mt-2 text-xs">
          {c.sources.map((s, i) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-amber-300">
              {s.label}{i < c.sources.length - 1 ? ' · ' : ''}
            </a>
          ))}
        </p>
      </details>
      {c.children?.map((k) => <Node key={k.id} c={k} binding={binding} nested />)}
    </div>
  )
}

export default function ConstraintTree({ problemSlug }: { problemSlug: string }) {
  const t = getConstraintTree(problemSlug)
  if (!t) return null
  return (
    <section id="why-unsolved" className="border-b border-hair">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="font-serif text-2xl text-ink-100 mb-6">Why it is not solved yet</h2>
        <div className="space-y-8">
          {t.root.map((c) => (
            <Node key={c.id} c={c} binding={t.bindingId} />
          ))}
        </div>
      </div>
    </section>
  )
}
