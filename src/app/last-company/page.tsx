import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import LastCompanyLab from '@/components/LastCompanyLab'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Find your last company | optimism.fun',
  description:
    'A private-on-device commitment brief, Founders corpus council, and 30-day evidence test for choosing the company you could build for a decade.',
}

export default function LastCompanyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-hair pb-10 pt-28">
          <div className="mx-auto max-w-4xl px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
              The last company lab
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-normal leading-[1.04] text-ink-100 md:text-6xl">
              Find the company you would still want to build in ten years.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-400">
              Not a personality quiz and not a permanent vow. Write the strongest current thesis,
              pressure-test it against founder history, then earn the decision with one month of
              reality. Your draft stays on this device until you choose to copy it.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-10 md:py-14">
          <LastCompanyLab />
        </section>
      </main>
      <Footer />
    </>
  )
}
