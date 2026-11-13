'use client'

/**
 * The sticky action bar on every problem page: the three class buttons.
 *
 * It does not contain a form. It dispatches an event that CommitmentForm picks
 * up, so there is exactly one write surface on the page and no chance of two
 * copies drifting apart. Stays reachable on mobile, which is the whole reason
 * it is sticky rather than sitting in the header.
 *
 * Hiring and raising are still in the commitment area itself, under "I hire".
 */
import { COORDINATE_EVENT } from './CommitmentForm'
import { VISITOR_CLASSES, type VisitorClass } from '@/lib/visitor-classes'

const SHORT_ASK: Record<VisitorClass['id'], string> = {
  patron: 'Fund this gap',
  founder: 'Start or join',
  researcher: 'Fix a number',
}

export default function ActionBar() {
  function open(c: VisitorClass) {
    window.dispatchEvent(new CustomEvent(COORDINATE_EVENT, { detail: c.commitment }))
  }

  return (
    <div className="sticky top-14 md:top-16 z-40 glass">
      <div className="site-shell">
        <div className="grid grid-cols-3 gap-2 py-2.5">
          {VISITOR_CLASSES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => open(c)}
              className={`min-h-11 rounded px-2 sm:px-4 py-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-100 ${c.solid}`}
            >
              <span className="block text-small leading-tight">{c.label}</span>
              <span className="block text-small sm:text-label font-medium leading-tight">{SHORT_ASK[c.id]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
