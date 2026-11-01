import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhereMatcher from '@/components/WhereMatcher'
import { whereCatalog } from '@/lib/where'

export const metadata: Metadata = {
  title: 'Where do I fit? | optimism.fun',
  description: 'Pick a skill, an interest, and what you can offer. Get three matches and the actions next to them. Nothing is saved.',
}

export default function WherePage() {
  const catalog = whereCatalog()
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">Where</p>
        <h1 className="font-serif text-4xl md:text-6xl text-ink-100 leading-[1.05]">Where do I fit?</h1>
        <p className="text-ink-400 mt-4 text-lg">
          Three matches from the current ranking. An S-tier risk shows up when your skills point there. No account.
        </p>
        <div className="mt-8">
          <WhereMatcher catalog={catalog} />
        </div>
      </main>
      <Footer />
    </>
  )
}
