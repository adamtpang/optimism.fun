'use client'

/**
 * The essay's closing question, made answerable: "are you on a good quest
 * right now?" Two answers place the visitor's own current work on the same
 * grid as every quest here, then hand off to the player card on /quests,
 * which already does the matching.
 *
 * The two answers live in this browser's local storage and are never sent
 * anywhere. The page works without storage; it just forgets.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import QuestGrid from '@/components/QuestGrid'
import { quadrant, type PlottedQuest } from '@/lib/quest-grid'

const STORE_KEY = 'optimism.currentQuest.v1'

const GOOD_OPTIONS = [
  { value: 85, label: 'The world is clearly better if it works' },
  { value: 55, label: 'Somewhat better' },
  { value: 15, label: 'Honestly, about the same or worse' },
]
const HARD_OPTIONS = [
  { value: 85, label: 'No playbook. Most attempts fail' },
  { value: 55, label: 'Hard, but people have done similar things' },
  { value: 15, label: 'There is a known playbook' },
]

function Choice({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string
  options: { value: number; label: string }[]
  value: number | null
  onChange: (v: number) => void
}) {
  return (
    <fieldset className="mb-5">
      <legend className="text-small text-ink-200 mb-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              className={`min-h-11 rounded border px-3 py-2 text-small text-left transition-colors ${
                on ? 'border-primary bg-primary/10 text-ink-100' : 'border-hair text-ink-300 hover:border-primary/60'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function QuestFlow({ quests }: { quests: PlottedQuest[] }) {
  const [good, setGood] = useState<number | null>(null)
  const [hard, setHard] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as { good?: unknown; hard?: unknown }
        if (typeof saved.good === 'number') setGood(saved.good)
        if (typeof saved.hard === 'number') setHard(saved.hard)
      }
    } catch {
      // No storage, or a damaged entry: start blank.
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      if (good == null && hard == null) window.localStorage.removeItem(STORE_KEY)
      else window.localStorage.setItem(STORE_KEY, JSON.stringify({ good, hard }))
    } catch {
      // Storage unavailable: the page still works for this visit.
    }
  }, [good, hard, loaded])

  const you = good != null && hard != null ? { good, hard } : null
  const box = you ? quadrant(you.good, you.hard) : null

  return (
    <div id="your-quest" className="scroll-mt-24">
      <h3 className="text-h2 md:text-h1 text-ink-100 leading-tight mb-2">
        Where is the thing you work on now?
      </h3>
      <p className="text-ink-400 text-small leading-relaxed max-w-2xl mb-5">
        Two honest answers put you on the same grid as every quest here. Your answers stay in this browser.
      </p>
      <Choice legend="If it fully works, what changes?" options={GOOD_OPTIONS} value={good} onChange={setGood} />
      <Choice legend="How hard is it?" options={HARD_OPTIONS} value={hard} onChange={setHard} />

      <div aria-live="polite">
        {box && (
          <div className="border-l-2 border-primary pl-4 mb-6 max-w-2xl">
            <p className="text-ink-200 text-small leading-relaxed">
              You are in <span className="text-ink-100 font-medium">{box.name}</span>. {box.verdict}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <Link
                href="/quests"
                className="first-letter:uppercase inline-flex items-center min-h-11 text-small text-paper bg-primary hover:bg-primary/90 rounded px-4 py-2 transition-colors"
              >
                Next: fill in your player card &rarr;
              </Link>
              <button
                type="button"
                onClick={() => {
                  setGood(null)
                  setHard(null)
                }}
                className="min-h-11 text-small text-ink-400 underline hover:text-ink-200"
              >
                Clear my answers
              </button>
            </div>
          </div>
        )}
      </div>

      <QuestGrid quests={quests} you={you} />
    </div>
  )
}
