import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import GlobeView from '@/components/GlobeView'

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
          <div className="site-shell">
            <p className="font-mono text-small uppercase text-primary mb-3">
              The globe
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              Capitalism, on a globe.
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              The world’s largest public companies, wealthiest founders, and biggest
              economies — plotted at their location, each scaled (log) within its layer. A calm,
              open re-imagining of Harvard’s Globe of Economic Complexity. Drag to spin, scroll to
              zoom, hover a dot, toggle the layers.
            </p>
          </div>
        </section>

        <section className="px-2 sm:px-6 py-4 max-w-7xl mx-auto">
          <GlobeView
            className="relative w-full h-[72vh] min-h-[480px]"
            initialLayers={['companies', 'founders', 'countries']}
          />
          <p className="mt-3 px-4 font-mono text-small text-ink-500 leading-relaxed">
            <span style={{ color: 'rgb(56, 189, 248)' }}>●</span> companies by market cap ·{' '}
            <span style={{ color: 'rgb(251, 191, 36)' }}>●</span> founders by net worth ·{' '}
            <span style={{ color: 'rgb(52, 211, 153)' }}>●</span> countries by GDP. Height is log-scaled
            within each layer. Next: color companies by the problem they serve.
          </p>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
