'use client'

/**
 * Email capture — subscribers get notified when the data updates or new
 * problems/voices are added. Submissions POST to a Formspree form (separate
 * from feedback). Set NEXT_PUBLIC_FORMSPREE_EMAIL_ID in env.
 *
 * Admin panel: https://formspree.io/forms (same Formspree account, different form).
 */

import { useState } from 'react'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_EMAIL_ID

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')

    const payload = {
      email,
      source: 'optimism.fun landing',
      timestamp: new Date().toISOString(),
    }

    try {
      if (FORMSPREE_ID) {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`${res.status}`)
      } else {
        console.info('[email] (no formspree id set) payload:', payload)
        await new Promise((r) => setTimeout(r, 400))
      }
      setStatus('sent')
      setEmail('')
    } catch (err) {
      console.error('[email] submit failed:', err)
      setStatus('error')
    }
  }

  return (
    <section className="border-t border-hair">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
          stay in the loop
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-ink-100 mb-4 leading-tight">
          Get notified when the ledger updates.
        </h2>
        <p className="text-ink-300 mb-6 max-w-2xl leading-relaxed">
          New problems added, confidence tags improved, sources refreshed. Low volume. No
          marketing. One send per meaningful data update, tops.
        </p>
        {status === 'sent' ? (
          <div className="inline-flex items-center gap-3 border border-amber-300/40 bg-amber-300/[0.05] px-4 py-3">
            <span className="text-amber-300 font-mono">◆</span>
            <span className="text-ink-100 text-sm">Logged. Welcome to the ledger.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-[rgb(var(--bg))] border border-hair-strong text-ink-100 font-sans text-sm px-4 py-3 focus:outline-none focus:border-amber-300/60 placeholder:text-ink-600"
            />
            <button
              type="submit"
              disabled={status === 'sending' || !email.trim()}
              className="font-mono text-[12px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-5 py-3 hover:bg-amber-300/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
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
      </div>
    </section>
  )
}
