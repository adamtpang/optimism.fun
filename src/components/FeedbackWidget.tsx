'use client'

/**
 * Feedback widget: floating button opens a modal with a feedback form.
 * Submissions POST to Formspree (https://formspree.io) which is your admin panel.
 *
 * To wire up: set NEXT_PUBLIC_FORMSPREE_FEEDBACK_ID in .env.local or Vercel env.
 * Without it, submissions will fail silently. Create a form at formspree.io/forms,
 * grab the ID (e.g. "xvojabcd"), and paste.
 *
 * Your admin panel: https://formspree.io/forms (shows all submissions with email,
 * message, timestamp, and optional Slack / email forwarding).
 */

import { useEffect, useState } from 'react'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_FEEDBACK_ID

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('data')

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setStatus('sending')

    const payload = {
      topic,
      message,
      email,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
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
        // Dev / unset fallback: console-log the submission so we can verify UX.
        console.info('[feedback] (no formspree id set) payload:', payload)
        await new Promise((r) => setTimeout(r, 400))
      }
      setStatus('sent')
      setMessage('')
      setTimeout(() => {
        setOpen(false)
        setStatus('idle')
      }, 1800)
    } catch (err) {
      console.error('[feedback] submit failed:', err)
      setStatus('error')
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="fixed bottom-5 right-5 z-40 font-mono text-[11px] uppercase tracking-wider text-amber-300 bg-ink-900 border border-amber-300/40 px-4 py-2.5 hover:bg-amber-300/[0.08] transition-colors shadow-[0_4px_24px_rgba(8,8,10,0.4)]"
      >
        <span className="mr-1.5">✎</span> feedback
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[rgb(var(--bg)/0.75)] backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="w-full max-w-lg bg-ink-900 border border-hair-strong p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline justify-between mb-5 border-b border-hair pb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1">
                  feedback · criticism welcome
                </p>
                <h2 id="feedback-title" className="font-serif text-xl text-ink-100">
                  What&rsquo;s wrong with this?
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close feedback"
                className="font-mono text-ink-500 hover:text-ink-100 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {status === 'sent' ? (
              <div className="py-8 text-center">
                <p className="font-serif text-lg text-amber-300 mb-2">Logged.</p>
                <p className="font-mono text-[11px] text-ink-500">
                  {FORMSPREE_ID
                    ? 'Sent to the admin panel. Thanks.'
                    : '(no form id set — saved to console)'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5">
                    topic
                  </label>
                  <div className="flex flex-wrap gap-px border border-hair">
                    {[
                      { k: 'data', l: 'data is wrong' },
                      { k: 'design', l: 'design' },
                      { k: 'thesis', l: 'thesis' },
                      { k: 'other', l: 'other' },
                    ].map((t) => (
                      <button
                        key={t.k}
                        type="button"
                        onClick={() => setTopic(t.k)}
                        className={`px-3 py-1.5 font-mono text-[11px] transition-colors ${
                          topic === t.k
                            ? 'bg-amber-300/10 text-amber-300'
                            : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800'
                        }`}
                      >
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="feedback-message"
                    className="block font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5"
                  >
                    message
                  </label>
                  <textarea
                    id="feedback-message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="what is wrong with the data, design, or thesis?"
                    className="w-full bg-[rgb(var(--bg))] border border-hair-strong text-ink-100 font-sans text-sm p-3 focus:outline-none focus:border-amber-300/60 placeholder:text-ink-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="feedback-email"
                    className="block font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5"
                  >
                    email (optional, if you want a reply)
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[rgb(var(--bg))] border border-hair-strong text-ink-100 font-sans text-sm p-3 focus:outline-none focus:border-amber-300/60 placeholder:text-ink-600"
                  />
                </div>

                {status === 'error' && (
                  <p className="font-mono text-[11px] text-terminal-rose">
                    failed to send. try again in a moment.
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="font-mono text-[10px] text-ink-500">
                    submissions go to the admin panel at formspree.io
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'sending' || !message.trim()}
                    className="font-mono text-[11px] uppercase tracking-wider text-amber-300 border border-amber-300/40 px-4 py-2 hover:bg-amber-300/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {status === 'sending' ? 'sending…' : 'send →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
