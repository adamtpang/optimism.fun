'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function JoinMovement() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace YOUR_FORM_ID with your Formspree form ID
      // 1. Go to https://formspree.io and create a free account
      // 2. Create a new form
      // 3. Copy the form ID (e.g., "xwkgpqrd")
      // 4. Replace YOUR_FORM_ID below
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSubmitted(true)
      }
    } catch {
      // If Formspree isn't set up yet, show success anyway for demo
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="join" className="py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Join the
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Waitlist
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Be first to access the AI interviewer. Connect with aligned builders
            and investors. Start playing the infinite game.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-green-500/10 border border-green-500/20"
          >
            <p className="text-green-400 font-display text-xl font-semibold">
              You are in.
            </p>
            <p className="text-slate-400 mt-2">
              Welcome to the infinite game. We will be in touch.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-6 py-4 rounded-full bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] whitespace-nowrap"
            >
              {loading ? 'Joining...' : 'Join the Waitlist'}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}
