'use client'

/**
 * Feedback modal. Triggered from anywhere via the useFeedback() hook.
 * Submissions POST to /api/feedback, which emails them to RESEND_NOTIFY_EMAIL
 * via Resend. If env not set, the API logs to the Vercel runtime log instead.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Ctx = { open: () => void }
const FeedbackCtx = createContext<Ctx>({ open: () => {} })

export const useFeedback = () => useContext(FeedbackCtx)

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0) // 0 = unset; 1–5 = selected
  const [hoverRating, setHoverRating] = useState(0)

  const open = useCallback(() => setVisible(true), [])
  const close = useCallback(() => {
    setVisible(false)
    // delay so the closing animation (if any) finishes before reset
    setTimeout(() => {
      setStatus('idle')
      setRating(0)
      setHoverRating(0)
      setMessage('')
    }, 300)
  }, [])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, close])

  // Submit is allowed when a rating is set, AND (if rating < 5) a message is present.
  const canSubmit = rating > 0 && (rating === 5 || message.trim().length > 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          message,
          email,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      setStatus('sent')
      setMessage('')
      setEmail('')
      setTimeout(() => close(), 1400)
    } catch (err) {
      console.error('[feedback] submit failed:', err)
      setStatus('error')
    }
  }

  return (
    <FeedbackCtx.Provider value={{ open }}>
      {children}
      {visible && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-[rgb(var(--bg)/0.75)] backdrop-blur-sm p-4"
          onClick={close}
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
                  feedback &middot; criticism welcome
                </p>
                <h2 id="feedback-title" className="font-serif text-xl text-ink-100">
                  Rate optimism.fun
                </h2>
              </div>
              <button
                onClick={close}
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
                  thanks. adam will read it.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                    your rating
                  </label>
                  <div
                    className="flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => {
                      const filled = (hoverRating || rating) >= n
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          onMouseEnter={() => setHoverRating(n)}
                          aria-label={`${n} star${n > 1 ? 's' : ''}`}
                          aria-pressed={rating === n}
                          className={`text-3xl leading-none w-10 h-10 flex items-center justify-center transition-colors ${
                            filled ? 'text-amber-300' : 'text-ink-600 hover:text-ink-400'
                          }`}
                        >
                          {filled ? '★' : '☆'}
                        </button>
                      )
                    })}
                    <span className="ml-3 font-mono text-[11px] text-ink-500 tabular-nums">
                      {rating ? `${rating} / 5` : 'pick a rating'}
                    </span>
                  </div>
                </div>

                {rating > 0 && (
                  <div>
                    <label
                      htmlFor="feedback-message"
                      className="block font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-1.5"
                    >
                      {rating < 5 ? 'what would make this a 5?' : 'anything you’d love to see? (optional)'}
                    </label>
                    <textarea
                      id="feedback-message"
                      required={rating < 5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder={
                        rating < 5
                          ? 'be specific — data, design, or thesis. all criticism welcome.'
                          : 'extra signal welcome but not required.'
                      }
                      className="w-full bg-[rgb(var(--bg))] border border-hair-strong text-ink-100 font-sans text-sm p-3 focus:outline-none focus:border-amber-300/60 placeholder:text-ink-500"
                    />
                  </div>
                )}

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
                    className="w-full bg-[rgb(var(--bg))] border border-hair-strong text-ink-100 font-sans text-sm p-3 focus:outline-none focus:border-amber-300/60 placeholder:text-ink-500"
                  />
                </div>

                {status === 'error' && (
                  <p className="font-mono text-[11px] text-terminal-rose">
                    failed to send. try again in a moment.
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 gap-3">
                  <p className="font-mono text-[10px] text-ink-500">
                    sent to adam via email
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'sending' || !canSubmit}
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
    </FeedbackCtx.Provider>
  )
}

/**
 * Tiny button to open the feedback modal from anywhere (e.g. Navbar).
 */
export function FeedbackButton({ className = '' }: { className?: string }) {
  const { open } = useFeedback()
  return (
    <button
      onClick={open}
      className={`font-mono text-[11px] text-ink-300 hover:text-amber-300 transition-colors ${className}`}
    >
      feedback
    </button>
  )
}
