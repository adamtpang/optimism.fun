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
    <div className="sticky top-0 z-40 border-y border-hair bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-2 py-2.5">
          {BUTTONS.map((b, i) => (
            <button
              key={b.actor}
              type="button"
              onClick={() => open(b.actor)}
              className={`group px-2 sm:px-4 py-2 text-center transition-colors border ${
                i === 0
                  ? 'bg-amber-300 text-ink-900 border-amber-300 hover:bg-amber-400'
                  : 'border-hair text-ink-300 hover:border-amber-300 hover:text-amber-300'
              }`}
            >
              <span className="block text-[12px] sm:text-sm font-medium leading-tight">
                {b.label}
              </span>
              <span
                className={`hidden sm:block font-mono text-[10px] mt-0.5 ${
                  i === 0 ? 'text-ink-900/70' : 'text-ink-600 group-hover:text-amber-300/70'
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
