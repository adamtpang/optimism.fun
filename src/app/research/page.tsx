import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ResearchDesk from '@/components/ResearchDesk'
import { isExaConfigured } from '@/lib/sources/exa'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Research | optimism.fun',
  description:
    'Ask a research question and read a cited answer built from papers Exa retrieved. A sentence without a retrieved source is not a finding.',
}

export default function ResearchPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="site-shell">
            <p className="font-mono text-small uppercase text-primary mb-3">Research</p>
            <h1 className="font-serif text-4xl md:text-6xl text-ink-100 leading-[1.05]">
              Ask a question. Read the papers.
            </h1>
            <p className="text-ink-400 mt-4 text-lg max-w-2xl">
              A cited answer from research papers. Each numbered claim links to a paper whose text Exa retrieved.
              Preprints are labeled. A retracted paper is not used as support.
            </p>
            <p className="mt-3 text-small text-ink-500 max-w-2xl">
              OpenAlex, Crossref, and Semantic Scholar supply DOI, venue, citation count, and retraction status.
              They are not the source of a claim.
            </p>
            <p className="font-mono text-sm mt-3">
              <Link href="/discoveries" className="text-primary hover:underline">
                Discoveries
              </Link>
            </p>
          </div>
        </section>
        <section className="site-shell py-10">
          <ResearchDesk configured={isExaConfigured()} />
        </section>
      </main>
      <Footer />
    </>
  )
}
