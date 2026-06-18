import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import FitFinder from '@/components/FitFinder'

export const metadata: Metadata = {
  title: 'Founder-Problem Fit | optimism.fun',
  description:
    'Find your life’s work. Two questions — what you can’t stop thinking about, and how you build — turn into the handful of humanity’s problems that could be your founder-problem fit, each as an actionable quest.',
}

export default function FitPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-3xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              Founder-problem fit
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              Find your life&rsquo;s work.
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              The best founders have a deep, almost unreasonable fit with one problem — Hassabis
              with intelligence, Jobs with the product. Founder-problem fit matters more than
              market or skills. Answer two questions and we will point your obsession and your
              archetype at the problems that could be yours, each turned into an actionable quest.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-10">
          <FitFinder />
          <p className="mt-4 font-mono text-[10px] text-ink-500 leading-relaxed">
            This is a mirror, not an oracle. It reflects what you tell it back through the ranked
            problems and the founder canon. The point is to start the conversation with yourself —
            then go earn the fit in the real world.
          </p>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
