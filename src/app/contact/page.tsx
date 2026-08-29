import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FeedbackButton } from '@/components/FeedbackWidget'

export const metadata: Metadata = {
  title: 'Contact | optimism.fun',
  description: 'How to contact the operator of optimism.fun about feedback, data corrections, and privacy.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-hair pt-28 pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
              Contact
            </div>
            <h1 className="font-serif text-4xl text-ink-100 md:text-6xl">Corrections are welcome.</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-ink-300">
              optimism.fun identifies Adam Pangelinan as its builder and Anchor Marianas LLC in
              its sitewide operator credits. Choose the channel below based on whether your note
              concerns a public data correction, product feedback, or the handling of personal
              information.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-4xl gap-px bg-ink-700/50 px-6 py-12 md:grid-cols-3">
          <div className="bg-ink-900 p-6">
            <h2 className="font-serif text-xl text-ink-100">Data corrections</h2>
            <p className="mt-3 text-sm leading-7 text-ink-300">
              Open a public issue in the project repository when a ranking, source, company,
              founder, or displayed value needs correction. Include the page, the disputed field,
              and a primary source, but do not place private information in a public issue.
            </p>
            <a className="mt-5 inline-block font-mono text-[11px] uppercase tracking-wider text-amber-300 hover:underline" href="https://github.com/adamtpang/optimism.fun/issues">
              GitHub issues &rarr;
            </a>
          </div>

          <div className="bg-ink-900 p-6">
            <h2 className="font-serif text-xl text-ink-100">Product feedback</h2>
            <p className="mt-3 text-sm leading-7 text-ink-300">
              Use the site&rsquo;s feedback dialog for a rating and an optional reply address. The
              privacy policy explains which fields the application sends, how Resend is involved,
              and what happens when that service is not configured.
            </p>
            <FeedbackButton className="mt-5 border border-amber-300/40 px-3 py-2 uppercase tracking-wider text-amber-300" />
          </div>

          <div className="bg-ink-900 p-6">
            <h2 className="font-serif text-xl text-ink-100">Operator and privacy</h2>
            <p className="mt-3 text-sm leading-7 text-ink-300">
              For private operator or privacy matters, use the contact channel published on Adam
              Pangelinan&rsquo;s website and identify optimism.fun in the request. The project does
              not publish a separate contact address in this repository, so none is invented here.
            </p>
            <a className="mt-5 inline-block font-mono text-[11px] uppercase tracking-wider text-amber-300 hover:underline" href="https://adampang.com">
              Operator website &rarr;
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
