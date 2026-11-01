'use client'

/**
 * The sticky action bar on every problem page.
 *
 * It does not contain a form. It dispatches an event that CommitmentForm picks
 * up, so there is exactly one write surface on the page and no chance of two
 * copies of the form drifting apart. Stays reachable on mobile, which is the
 * whole reason it is sticky rather than sitting in the hero.
 */
import { COORDINATE_EVENT } from './CommitmentForm'
import type { ActorType } from '@/lib/commitments'

const BUTTONS: { actor: ActorType; label: string; hint: string }[] = [
  { actor: 'talent', label: 'Work on this', hint: 'start, join or contribute' },
  { actor: 'capital', label: 'Fund this gap', hint: 'signal a check size' },
  { actor: 'operator', label: 'Post a need', hint: 'a role or a raise' },
]

export default function ActionBar() {
  function open(actor: ActorType) {
    window.dispatchEvent(new CustomEvent(COORDINATE_EVENT, { detail: { actor } }))
  }

  return (
    <div className="sticky top-14 md:top-16 z-40 glass">
      <div className="site-shell">
        <div className="grid grid-cols-3 gap-2 py-2.5">
          {BUTTONS.map((b, i) => (
            <button
              key={b.actor}
              type="button"
              onClick={() => open(b.actor)}
              className={`group px-2 sm:px-4 py-2 text-center transition-colors border ${
                i === 0
                  ? 'bg-primary text-ink-900 border-primary hover:bg-primary/90'
                  : 'border-hair text-ink-300 hover:border-primary hover:text-primary'
              }`}
            >
              <span className="block text-small sm:text-sm font-medium leading-tight">
                {b.label}
              </span>
              <span
                className={`hidden sm:block font-mono text-small mt-0.5 ${
                  i === 0 ? 'text-ink-900/70' : 'text-ink-600 group-hover:text-primary/70'
                }`}
              >
                {b.hint}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
