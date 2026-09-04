'use client'

/**
 * The one write surface on the site.
 *
 * Three actors, six intents, one POST. The form deliberately asks for something
 * costly in every path (an assumption you will test, a role you would take, a
 * thesis and a band) because a board of frictionless clicks carries no signal.
 * Client-side checks mirror lib/commitments.ts, but the server revalidates:
 * this is a convenience layer, not the gate.
 */
import { useEffect, useRef, useState } from 'react'
import {
  ACTOR_TYPES,
  INTENTS_BY_ACTOR,
  CHECK_SIZE_BANDS,
  STAGES,
  ROLE_TYPES,
  BAND_LABEL,
  MIN_PROOF,
  MAX_PROOF,
  type ActorType,
  type Intent,
} from '@/lib/commitments'

export type FormCompany = { slug: string; name: string }

/** Fired by ActionBar so the sticky buttons can drive this form. */
export const COORDINATE_EVENT = 'optimism:coordinate'

const ACTOR_LABEL: Record<ActorType, string> = {
  talent: 'I build',
  capital: 'I fund',
  operator: 'I hire',
}

const INTENT_LABEL: Record<Intent, string> = {
  start: 'Start something new',
  join: 'Join a company already on this',
  contribute: 'Correct the data, add a source, or offer an intro',
  fund: 'Signal that I would fund this gap',
  hire: 'Post an open role',
  raise: 'Post that we are raising',
}

/** The proof prompt is the whole anti-spam design, so it changes per intent. */
const PROOF_PROMPT: Record<Intent, { label: string; placeholder: string }> = {
  start: {
    label: 'Riskiest assumption, and the first artifact you will ship in 14 days',
    placeholder:
      'Riskiest assumption: clinics will not switch without a billing-code path. In 14 days I will ship a teardown of the three codes that apply and get one clinic to say yes or no.',
  },
  join: {
    label: 'One sentence of proof of work',
    placeholder:
      'I built and shipped the ingest pipeline behind X, which handled 40M rows a day. Link below.',
  },
  contribute: {
    label: 'The correction, the source, or the intro',
    placeholder:
      'The market-size figure on this page cites a 2019 report. The 2025 update puts it 40 percent lower. Link below.',
  },
  fund: {
    label: 'Your thesis on this gap, in a sentence or two',
    placeholder:
      'We back pre-seed hard tech with a regulatory wedge. On this problem the bottleneck is permitting, not physics, so we would fund a team with a policy lead on the founding side.',
  },
  hire: {
    label: 'The role, and what the first 90 days look like',
    placeholder:
      'Founding engineer. First 90 days: take the internal simulation from a notebook to a service our three pilot customers can call.',
  },
  raise: {
    label: 'What the raise is for, and what it buys',
    placeholder:
      'Raising a seed to run the first in-human pilot. It buys 18 months and the safety data we need before a Series A.',
  },
}

type Props = {
  problemSlug: string
  problemName: string
  /** Companies already in the dataset for this problem. Nobody can add one here. */
  companies: FormCompany[]
  /** Set when the form is rendered from a specific quest or company row. */
  initialActor?: ActorType
  initialIntent?: Intent
  initialCompanySlug?: string
  /** Renders without the heading, for embedding under a /paths row. */
  compact?: boolean
}

export default function CommitmentForm({
  problemSlug,
  problemName,
  companies,
  initialActor = 'talent',
  initialIntent,
  initialCompanySlug,
  compact = false,
}: Props) {
  const [actor, setActor] = useState<ActorType>(initialActor)
  const [intent, setIntent] = useState<Intent>(initialIntent ?? INTENTS_BY_ACTOR[initialActor][0])
  const [companySlug, setCompanySlug] = useState(initialCompanySlug ?? '')
  const [roleType, setRoleType] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [url, setUrl] = useState('')
  const [proof, setProof] = useState('')
  const [band, setBand] = useState('')
  const [stage, setStage] = useState('')
  const [anon, setAnon] = useState(false)
  const [wantsIntro, setWantsIntro] = useState(false)

  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errors, setErrors] = useState<string[]>([])
  const rootRef = useRef<HTMLDivElement>(null)

  // The sticky action bar drives this form rather than duplicating it.
  useEffect(() => {
    const onCoordinate = (e: Event) => {
      const detail = (e as CustomEvent<{ actor?: ActorType }>).detail
      const next = detail?.actor
      if (next && ACTOR_TYPES.includes(next)) {
        setActor(next)
        setIntent(INTENTS_BY_ACTOR[next][0])
        setState('idle')
      }
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    window.addEventListener(COORDINATE_EVENT, onCoordinate)
    return () => window.removeEventListener(COORDINATE_EVENT, onCoordinate)
  }, [])

  const needsCompany = intent === 'join' || intent === 'hire' || intent === 'raise'
  const needsBand = intent === 'fund'
  const needsRole = intent === 'join'
  const prompt = PROOF_PROMPT[intent]

  function pickActor(next: ActorType) {
    setActor(next)
    setIntent(INTENTS_BY_ACTOR[next][0])
    setErrors([])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    setErrors([])
    try {
      const res = await fetch('/api/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemSlug,
          actorType: actor,
          intent,
          companySlug: needsCompany ? companySlug : null,
          roleType: needsRole ? roleType : null,
          name,
          email,
          url: url || null,
          proof,
          checkSizeBand: needsBand ? band : null,
          stage: stage || null,
          visibility: anon ? 'anon' : 'public',
          wantsIntro,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        setErrors(json.errors ?? ['Something went wrong. Try again.'])
        setState('error')
        return
      }
      setState('done')
    } catch {
      setErrors(['Network error. Try again.'])
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div
        ref={rootRef}
        id="coordinate"
        className="border border-terminal-green/40 bg-terminal-green/[0.04] p-6 scroll-mt-24"
      >
        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green mb-2">
          Submitted · not yet public
        </p>
        <p className="text-ink-200 text-sm leading-relaxed">
          Check your email and confirm the address. After that a human reads it before it appears on
          the {problemName} board. Nothing is published automatically, and your email is never shown.
        </p>
      </div>
    )
  }

  const label = 'block font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5'
  const field =
    'w-full bg-ink-900/60 border border-hair px-3 py-2 text-sm text-ink-100 placeholder:text-ink-600 focus:border-amber-300 focus:outline-none'

  return (
    <div ref={rootRef} id="coordinate" className="border border-hair scroll-mt-24">
      {!compact && (
        <div className="border-b border-hair px-5 py-4 bg-ink-900/40">
          <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
            Take an action on this problem
          </p>
          <p className="text-ink-400 text-[13px] leading-relaxed">
            One structured record, attached to {problemName}. Confirmed by email, then read by a
            human before it goes on the board. You cannot buy a place on it.
          </p>
        </div>
      )}

      <form onSubmit={submit} className="p-5 space-y-5">
        {/* Actor */}
        <div className="grid grid-cols-3 gap-px bg-hair border border-hair">
          {ACTOR_TYPES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => pickActor(a)}
              aria-pressed={actor === a}
              className={`px-3 py-2.5 font-mono text-[11px] transition-colors ${
                actor === a
                  ? 'bg-amber-300 text-ink-900 font-medium'
                  : 'bg-ink-900/60 text-ink-400 hover:text-ink-100'
              }`}
            >
              {ACTOR_LABEL[a]}
            </button>
          ))}
        </div>

        {/* Intent */}
        <fieldset>
          <legend className={label}>What exactly</legend>
          <div className="space-y-1.5">
            {INTENTS_BY_ACTOR[actor].map((i) => (
              <label key={i} className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="intent"
                  checked={intent === i}
                  onChange={() => setIntent(i)}
                  className="mt-1 accent-amber-300"
                />
                <span className="text-[13px] text-ink-300 group-hover:text-ink-100 leading-snug">
                  {INTENT_LABEL[i]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {needsCompany && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="cf-company">
                Company
              </label>
              <select
                id="cf-company"
                required
                value={companySlug}
                onChange={(e) => setCompanySlug(e.target.value)}
                className={field}
              >
                <option value="">Pick one already on this problem</option>
                {companies.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              {companies.length === 0 && (
                <p className="font-mono text-[10px] text-terminal-rose mt-1.5">
                  No company is tracked on this problem yet. Use the contribute path to add one.
                </p>
              )}
            </div>
            {needsRole && (
              <div>
                <label className={label} htmlFor="cf-role">
                  Role type
                </label>
                <select
                  id="cf-role"
                  required
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className={field}
                >
                  <option value="">What you would do</option>
                  {ROLE_TYPES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {needsBand && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="cf-band">
                Check size
              </label>
              <select
                id="cf-band"
                required
                value={band}
                onChange={(e) => setBand(e.target.value)}
                className={field}
              >
                <option value="">Pick a band</option>
                {CHECK_SIZE_BANDS.map((b) => (
                  <option key={b} value={b}>
                    {BAND_LABEL[b]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="cf-stage">
                Stage
              </label>
              <select
                id="cf-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className={field}
              >
                <option value="">Any</option>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Proof: the field that carries the signal */}
        <div>
          <label className={label} htmlFor="cf-proof">
            {prompt.label}
          </label>
          <textarea
            id="cf-proof"
            required
            rows={4}
            minLength={MIN_PROOF}
            maxLength={MAX_PROOF}
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder={prompt.placeholder}
            className={`${field} resize-y leading-relaxed`}
          />
          <p className="font-mono text-[10px] text-ink-600 mt-1 tabular-nums">
            {proof.length} / {MAX_PROOF}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="cf-name">
              Name
            </label>
            <input
              id="cf-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
              placeholder="Who you are"
            />
          </div>
          <div>
            <label className={label} htmlFor="cf-email">
              Email
            </label>
            <input
              id="cf-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              placeholder="Never shown publicly"
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="cf-url">
            Link {intent === 'contribute' ? '(the source)' : '(proof of work)'}
          </label>
          <input
            id="cf-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={field}
            placeholder="https://"
          />
        </div>

        <div className="space-y-2 border-t border-hair pt-4">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={anon}
              onChange={(e) => setAnon(e.target.checked)}
              className="mt-0.5 accent-amber-300"
            />
            <span className="text-[13px] text-ink-400 leading-snug">
              Show this without my name.{' '}
              {actor === 'capital'
                ? 'The band and the thesis still appear, so the signal survives.'
                : 'Your commitment still counts on the board.'}
            </span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={wantsIntro}
              onChange={(e) => setWantsIntro(e.target.checked)}
              className="mt-0.5 accent-amber-300"
            />
            <span className="text-[13px] text-ink-400 leading-snug">
              Ask for an intro. Brokered by hand, not automatically.
            </span>
          </label>
        </div>

        {errors.length > 0 && (
          <ul className="border border-terminal-rose/40 bg-terminal-rose/[0.05] px-4 py-3 space-y-1">
            {errors.map((e) => (
              <li key={e} className="text-[13px] text-terminal-rose leading-snug">
                {e}
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={state === 'sending'}
          className="w-full bg-amber-300 text-ink-900 font-medium text-sm py-3 hover:bg-amber-400 disabled:opacity-50 transition-colors"
        >
          {state === 'sending' ? 'Sending...' : 'Commit'}
        </button>
        <p className="font-mono text-[10px] text-ink-600 text-center">
          Email confirm, then human review. Nothing publishes itself.
        </p>
      </form>
    </div>
  )
}
