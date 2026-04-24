'use client'

/**
 * Prominent email CTA. Posts to /api/subscribe which adds the contact to the
 * Resend audience (RESEND_AUDIENCE_ID). Adam sees the list at
 * https://resend.com/audiences and can send broadcasts from the same dashboard.
 *
 * The lede hints at the longer-term vision: soon, routing subscribers to the
 * specific problems, founders, and allocators that match their interests.
 */

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Variant = 'prominent' | 'compact'

export default function EmailCapture({ variant = 'prominent' }: { variant?: Variant }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing' }),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      setStatus('sent')
      setEmail('')
    } catch (err) {
      console.error('[subscribe] submit failed:', err)
      setStatus('error')
    }
  }

  if (variant === 'compact') {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 max-w-md"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 bg-[rgb(var(--bg))] border border-hair-strong text-ink-100 font-sans text-sm px-3 py-2 focus:outline-none focus:border-amber-300/60 placeholder:text-ink-500"
        />
        <button
          type="submit"
          disabled={status === 'sending' || !email.trim()}
          className="font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-4 py-2 hover:bg-amber-300/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {status === 'sent' ? 'thanks →' : status === 'sending' ? 'joining…' : 'join'}
        </button>
      </form>
    )
  }

  return (
    <section id="join" className="border-y border-hair-strong surface-paper">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-paper-copper mb-4">
              Join the ledger
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-ink-100 leading-[1.05] mb-5">
              Get routed to the problems
              <span className="block text-amber-300">that matter most.</span>
            </h2>
            <p className="text-ink-200 leading-relaxed text-base md:text-lg max-w-xl mb-6">
              Subscribers get notified when the dataset updates, new problems are added, and
              confidence tags improve. Soon, you&rsquo;ll opt in to direct routing: tell us
              what you can build or fund, and we&rsquo;ll match you to the founders, companies,
              and quests that need you. No spam. No marketing. Ledger updates only.
            </p>

            {status === 'sent' ? (
              <div className="inline-flex items-center gap-3 border border-amber-300/40 bg-amber-300/[0.06] px-4 py-3">
                <span className="text-amber-300 font-mono">◆</span>
                <span className="text-ink-100 text-sm">
                  Logged. Welcome to the ledger.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 max-w-xl"
              >
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-[rgb(var(--bg))] border border-hair-strong text-ink-100 font-sans text-base px-4 py-3 focus:outline-none focus:border-amber-300/60 placeholder:text-ink-500"
                />
                <button
                  type="submit"
                  disabled={status === 'sending' || !email.trim()}
                  className="font-mono text-[13px] uppercase tracking-wider text-[#08080a] bg-amber-300 hover:bg-amber-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-6 py-3 whitespace-nowrap border border-amber-300 font-semibold"
                >
                  {status === 'sending' ? 'subscribing…' : 'subscribe →'}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-3 font-mono text-[11px] text-terminal-rose">
                failed. try again in a moment.
              </p>
            )}

            <p className="mt-5 font-mono text-[11px] text-ink-500 max-w-xl leading-relaxed">
              by subscribing you agree to receive low-volume updates from optimism.fun.
              unsubscribe with one click, any time.
            </p>
          </div>

          <div className="hidden lg:flex flex-col gap-3 font-mono text-[11px]">
            <p className="text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
              the three routings
            </p>
            <div className="border border-hair p-4 bg-[rgb(var(--bg)/0.3)]">
              <p className="text-amber-300 mb-1">1 &middot; ledger updates</p>
              <p className="text-ink-300 leading-relaxed">
                when new problems, companies, or voices are added. ships now.
              </p>
            </div>
            <div className="border border-hair p-4 bg-[rgb(var(--bg)/0.3)]">
              <p className="text-terminal-violet mb-1">2 &middot; founder → problem match</p>
              <p className="text-ink-300 leading-relaxed">
                if you&rsquo;re building, we&rsquo;ll route you toward the problem and capital
                stack you fit.
              </p>
            </div>
            <div className="border border-hair p-4 bg-[rgb(var(--bg)/0.3)]">
              <p className="text-terminal-green mb-1">3 &middot; allocator → deal flow</p>
              <p className="text-ink-300 leading-relaxed">
                if you&rsquo;re deploying capital, curated quest-mapped deal flow in the
                domains you care about.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
