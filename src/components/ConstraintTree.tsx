/**
 * Why this problem is not solved yet: the constraint tree on a problem page.
 * Each node shows the claim, the reason, the evidence that would refute it and
 * what we found, who is on it, and what one more person changes. Renders
 * nothing for problems without a tree yet.
 */
import Link from 'next/link'
import { getConstraintTree, type Constraint } from '@/data/constraints'

const WHO_LABEL = { talent: 'Talent', capital: 'Capital', operator: 'Operator' } as const

function Node({ c, binding, depth }: { c: Constraint; binding: string; depth: number }) {
  const isBinding = c.id === binding
  return (
    <div className={`border-l-2 pl-4 ${isBinding ? 'border-amber-300' : 'border-hair'} ${depth ? 'mt-4' : ''}`}>
      <p className="font-mono text-xs uppercase tracking-wider text-ink-500 mb-1">
        {isBinding ? 'Most binding · ' : ''}
        {c.kind} · supply {c.supplyState} · one more team: {c.additionality.level}
      </p>
      <p className="text-ink-100 text-base font-medium leading-snug">{c.claim}</p>
      <p className="text-ink-400 text-sm leading-relaxed mt-2">{c.whyUnsolved}</p>
      <p className="text-ink-400 text-sm leading-relaxed mt-2">
        <span className="text-ink-200">Would be wrong if:</span> {c.falsifier}
      </p>
      {c.tested && (
        <p className="text-ink-400 text-sm leading-relaxed mt-2">
          <span className="text-ink-200">What we found:</span> {c.tested}
        </p>
      )}
      <p className="text-ink-400 text-sm leading-relaxed mt-2">
        <span className="text-ink-200">One more team:</span> {c.additionality.why}
      </p>
      {c.suppliers.length > 0 && (
        <p className="text-ink-500 text-sm mt-2">On it: {c.suppliers.join(', ')}</p>
      )}
      {c.entryPoints.length > 0 && (
        <ul className="mt-3 space-y-1">
          {c.entryPoints.map((e) => (
            <li key={e.action} className="text-sm text-ink-300">
              <span className="font-mono text-xs uppercase text-amber-300 mr-2">{WHO_LABEL[e.who]}</span>
              {e.action}
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-ink-500 mt-2">
        {c.sources.map((s, i) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 underline decoration-dotted">
            {s.label}
            {i < c.sources.length - 1 ? ' · ' : ''}
          </a>
        ))}
      </p>
      {c.children?.map((k) => <Node key={k.id} c={k} binding={binding} depth={depth + 1} />)}
    </div>
  )
}

export default function ConstraintTree({ problemSlug }: { problemSlug: string }) {
  const t = getConstraintTree(problemSlug)
  if (!t) return null
  return (
    <section id="why-unsolved" className="border-b border-hair">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="font-mono text-xs uppercase tracking-ultra-wide text-amber-300 mb-2">Why it is not solved yet</p>
        <p className="text-ink-100 text-lg leading-relaxed max-w-3xl">{t.whyUnsolved}</p>
        <p className="text-ink-500 text-sm mt-2 max-w-3xl">
          Goal: {t.outcome}
        </p>
        <div className="mt-8 space-y-8">
          {t.root.map((c) => (
            <Node key={c.id} c={c} binding={t.bindingId} depth={0} />
          ))}
        </div>
        <p className="text-sm text-ink-500 mt-8 max-w-3xl">
          Every claim here is a conjecture with its own test. Know something that breaks one?{' '}
          <Link href="#coordinate" className="text-amber-300 hover:underline">Say so on the board</Link>, or commit to a constraint.
          Updated {t.updated}.
        </p>
      </div>
    </section>
  )
}
