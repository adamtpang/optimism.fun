'use client'

import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'optimism_last_company_v1'

type Draft = {
  problem: string
  edge: string
  people: string
  constraints: string
  decade: string
  thesis: string
  proofs: boolean[]
}

const EMPTY_DRAFT: Draft = {
  problem: '',
  edge: '',
  people: '',
  constraints: '',
  decade: '',
  thesis: '',
  proofs: [false, false, false, false],
}

const QUESTIONS: { key: keyof Pick<Draft, 'problem' | 'edge' | 'people' | 'constraints' | 'decade'>; label: string; prompt: string }[] = [
  {
    key: 'problem',
    label: 'The problem',
    prompt: 'What problem have you returned to for years, even when nobody rewarded you for caring?',
  },
  {
    key: 'edge',
    label: 'Earned access',
    prompt: 'What have you built, learned, survived, or noticed that gives you a non-generic right to work on it?',
  },
  {
    key: 'people',
    label: 'The people',
    prompt: 'Whose life gets materially better if this company works, and what painful job are they already trying to do?',
  },
  {
    key: 'constraints',
    label: 'Your life',
    prompt: 'What must the company protect: location, health, relationships, creative energy, control, or financial floor?',
  },
  {
    key: 'decade',
    label: 'The decade test',
    prompt: 'If this takes ten years and receives little applause for the first three, why would the work still be worth doing?',
  },
]

const PROOF_TESTS = [
  'Talk to 10 people living the problem and record what changed your mind.',
  'Build one artifact that tests the riskiest assumption, not the fullest product.',
  'Get one stranger to use it, pay, commit time, or make a consequential decision.',
  'Write the kill criteria before enthusiasm can move the goalposts.',
]

function buildCouncilPrompt(draft: Draft): string {
  return `I am choosing the last company I would be proud to build for a decade or longer.

My current brief:
- Problem I keep returning to: ${draft.problem || '[not answered]'}
- Earned edge: ${draft.edge || '[not answered]'}
- People and painful job: ${draft.people || '[not answered]'}
- Life constraints the company must respect: ${draft.constraints || '[not answered]'}
- Why it could survive the decade test: ${draft.decade || '[not answered]'}
- Current one-sentence company thesis: ${draft.thesis || '[not answered]'}

Use the Founders corpus as a skeptical council, not as hero worship. Find at least three relevant historical precedents. Compare founder-problem fit, mission durability, control, customer evidence, and the danger of obsession. Tell me where the analogies break. End with the three cheapest falsifiable tests I should run before committing, and cite every episode you use.`
}

export default function LastCompanyLab() {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [hydrated, setHydrated] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Draft>
        setDraft({ ...EMPTY_DRAFT, ...parsed, proofs: parsed.proofs || EMPTY_DRAFT.proofs })
      }
    } catch {
      // A private or restricted browser may block local storage. The worksheet still works.
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // Best-effort local persistence only.
    }
  }, [draft, hydrated])

  const prompt = useMemo(() => buildCouncilPrompt(draft), [draft])
  const answered = QUESTIONS.filter(({ key }) => draft[key].trim()).length
  const proofCount = draft.proofs.filter(Boolean).length

  async function copyCouncilPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-10">
      <section className="border border-hair bg-[rgb(var(--bg))] p-5 md:p-8">
        <div className="flex flex-col gap-2 border-b border-hair pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
              01 · write the commitment brief
            </p>
            <h2 className="mt-2 font-serif text-2xl text-ink-100 md:text-3xl">
              Make the idea survive contact with your actual life.
            </h2>
          </div>
          <p className="font-mono text-[10px] text-ink-500" aria-live="polite">
            {answered} / {QUESTIONS.length} answered · saved on this device
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {QUESTIONS.map(({ key, label, prompt: question }) => (
            <label key={key} className="block">
              <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500">
                {label}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-200">{question}</span>
              <textarea
                value={draft[key]}
                onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
                rows={3}
                className="mt-2 w-full resize-y border border-hair-strong bg-[rgb(var(--paper))] px-3 py-3 text-sm leading-relaxed text-ink-100 outline-none placeholder:text-ink-600 focus:border-amber-300/70"
                placeholder="Use concrete evidence, not the person you hope to become."
              />
            </label>
          ))}
        </div>

        <label className="mt-7 block border-t border-hair pt-6">
          <span className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
            Your one-sentence candidate
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-300">
            We help [specific people] make [measurable progress] by [your unusual mechanism].
          </span>
          <textarea
            value={draft.thesis}
            onChange={(event) => setDraft((current) => ({ ...current, thesis: event.target.value }))}
            rows={2}
            className="mt-2 w-full resize-y border border-amber-300/40 bg-amber-300/[0.03] px-3 py-3 font-serif text-lg leading-relaxed text-ink-100 outline-none placeholder:text-ink-600 focus:border-amber-300"
            placeholder="Name one company thesis. A portfolio is not an answer."
          />
        </label>
      </section>

      <section className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-hair bg-ink-900/20 p-5 md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
            02 · ask history
          </p>
          <h2 className="mt-2 font-serif text-2xl text-ink-100">Convene the Founders council.</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">
            Your answers stay in this browser. Copy the reviewed brief yourself, then ask Summon
            to retrieve precedents and counterexamples from the David Senra corpus.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyCouncilPrompt}
              className="inline-flex min-h-11 items-center bg-amber-300 px-4 font-mono text-[10px] uppercase tracking-wider text-paper transition-colors hover:bg-amber-200"
            >
              {copied ? 'Copied council brief' : 'Copy council brief'}
            </button>
            <a
              href="https://summon.guide/chat/source/founders-podcast"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border border-hair px-4 font-mono text-[10px] uppercase tracking-wider text-ink-300 transition-colors hover:border-amber-300 hover:text-ink-100"
            >
              Open Summon ↗
            </a>
          </div>
        </div>

        <div className="border border-hair bg-[rgb(var(--bg))] p-5 md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
            03 · earn the decision
          </p>
          <h2 className="mt-2 font-serif text-2xl text-ink-100">Run the 30-day reality test.</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">
            Optimism chooses the problem. History supplies priors. Only contact with reality earns
            a commitment.
          </p>
          <ul className="mt-5 space-y-3">
            {PROOF_TESTS.map((test, index) => (
              <li key={test}>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-300">
                  <input
                    type="checkbox"
                    checked={draft.proofs[index] || false}
                    onChange={(event) =>
                      setDraft((current) => {
                        const proofs = [...current.proofs]
                        proofs[index] = event.target.checked
                        return { ...current, proofs }
                      })
                    }
                    className="mt-0.5 h-4 w-4 accent-amber-300"
                  />
                  <span>{test}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-hair pt-4 font-mono text-[10px] uppercase tracking-wider text-ink-500">
            Evidence gate · {proofCount} / {PROOF_TESTS.length} complete
          </p>
        </div>
      </section>

      <aside className="border-l-2 border-amber-300/50 bg-amber-300/[0.03] px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
          The commitment rule
        </p>
        <p className="mt-2 max-w-3xl font-serif text-xl leading-relaxed text-ink-100">
          Do not choose the company because the story feels important. Choose it when sustained
          energy, earned insight, a real person&rsquo;s demand, and a survivable life all point in the
          same direction.
        </p>
      </aside>
    </div>
  )
}
