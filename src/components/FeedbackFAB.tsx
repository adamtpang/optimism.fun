'use client'

/**
 * Floating bottom-right pill that opens the existing 5-star feedback modal.
 * Always-visible — part of the "play optimism.fun" game loop: play → rate → iterate.
 * The modal itself lives in FeedbackWidget.tsx; this is just the trigger.
 */

import { useFeedback } from './FeedbackWidget'

export default function FeedbackFAB() {
  const { open } = useFeedback()
  return (
    <button
      type="button"
      onClick={open}
      aria-label="rate optimism.fun"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#08080a] bg-amber-300 hover:bg-amber-200 px-4 py-2.5 shadow-[0_8px_24px_-4px_rgba(14,165,233,0.35)] hover:shadow-[0_10px_28px_-4px_rgba(14,165,233,0.5)] transition-all"
    >
      <span aria-hidden>★</span>
      <span>rate this</span>
    </button>
  )
}
