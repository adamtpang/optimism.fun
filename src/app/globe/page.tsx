import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import GlobeView from '@/components/GlobeView'
import { publicCompanies } from '@/data/public-companies'

export const metadata: Metadata = {
  title: 'The Globe | optimism.fun',
  description:
    'Capitalism, on a globe. The world’s largest public companies plotted at their headquarters, scaled by market cap. A modern, open re-imagining of Harvard’s Globe of Economic Complexity.',
}

export default function GlobePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-6 border-b border-hair">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The globe
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              Capitalism, on a globe.
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              The world’s {publicCompanies.length} largest public companies, plotted at their
              headquarters and scaled by market cap. A calm, open re-imagining of Harvard’s
              Globe of Economic Complexity. Drag to spin, scroll to zoom, hover a dot.
            </p>
          </div>
        </section>

        <section className="px-2 sm:px-6 py-4 max-w-7xl mx-auto">
          <GlobeView />
          <p className="mt-3 px-4 font-mono text-[10px] text-ink-500 leading-relaxed">
            <span className="text-amber-300">●</span> each dot is a public company at its HQ
            country, height scaled to market cap (companiesmarketcap-style). Market data from the
            companies dataset. More layers coming: crypto, founders, countries by GDP, and the
            problems each company serves.
          </p>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
