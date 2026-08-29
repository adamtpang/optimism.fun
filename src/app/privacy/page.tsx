import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy | optimism.fun',
  description:
    'How optimism.fun handles analytics, browser storage, subscriptions, feedback, AI interview text, hosting data, and third-party services.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-hair pt-28 pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300">
              Privacy and data handling
            </div>
            <h1 className="font-serif text-4xl text-ink-100 md:text-6xl">What the site actually processes.</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-ink-300">
              This policy describes the collection and sharing paths present in the optimism.fun
              application code and deployed homepage. The site identifies Adam Pangelinan as its
              builder and includes Anchor Marianas LLC in its operator credits; contact routes are
              listed on the contact page without inventing a separate address.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-4xl space-y-10 px-6 py-12 text-ink-300">
          <section>
            <h2 className="font-serif text-2xl text-ink-100">Hosting and ordinary requests</h2>
            <p className="mt-4 leading-8">
              Vercel hosts the site and therefore processes ordinary request information needed
              to deliver and secure it, including the requested URL, IP address, browser and device
              headers, timestamps, and server logs. The application also includes Vercel Web
              Analytics and Speed Insights, which receive page-view and performance measurements.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink-100">PostHog analytics and session replay</h2>
            <p className="mt-4 leading-8">
              In production, the site initializes PostHog through the first-party /ingest proxy
              when a PostHog key is configured. It records page views and page leaves, anonymous
              device and session identifiers, interaction analytics and heatmaps, web-vital and
              network-timing measurements, and session replay when enabled by the PostHog project.
              The deployed project configuration also enables replay-related console recording.
            </p>
            <p className="mt-4 leading-8">
              The code configures PostHog person profiles as identified-only and does not call an
              identify method. Proxying analytics through optimism.fun does not make PostHog the
              operator: analytics events and replay data are still processed by PostHog in its US
              service. Avoid entering secrets or sensitive personal information anywhere on the site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink-100">Cookies and browser storage</h2>
            <p className="mt-4 leading-8">
              The initial HTML response does not set an application cookie. The problem table
              saves a visitor&rsquo;s visible-column preference in localStorage, and PostHog stores
              anonymous device, session, and configuration state in browser storage. Clearing site
              data removes those local values, although provider-side records may remain under the
              retention settings of the relevant service account.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink-100">Newsletter subscriptions and feedback</h2>
            <p className="mt-4 leading-8">
              A newsletter subscription sends the submitted email address to Resend and adds it to
              the configured optimism.fun audience. If Resend is unavailable or unconfigured, the
              fallback writes the email address, signup source, and timestamp to Vercel runtime logs
              instead. Every newsletter is intended to include Resend&rsquo;s unsubscribe mechanism.
            </p>
            <p className="mt-4 leading-8">
              The feedback dialog submits a rating, message, optional reply email, current page,
              and browser user-agent information to the application. When Resend is configured,
              the handler emails the rating, message, page, and optional address to the operator;
              otherwise it writes the handled feedback fields to Vercel runtime logs.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink-100">Optional founder-fit interview</h2>
            <p className="mt-4 leading-8">
              The founder-fit interview sends the full conversation with each request to the
              configured model path. Hosted deployments use Vercel AI Gateway and its configured
              model provider, currently MiniMax in this code; a directly configured environment can
              use Anthropic instead. The application treats the interview as stateless and does not
              write those answers to its Neon research database.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink-100">Research data, external assets, and links</h2>
            <p className="mt-4 leading-8">
              Server-side research jobs query public data services and can store indicator records,
              sourced candidates, trends, and administrative publishing records in Neon Postgres.
              Those jobs are for the published research rather than visitor form submissions. The
              homepage also requests its globe texture from unpkg.com, which receives normal network
              request metadata, and outbound links are governed by the destination&rsquo;s own policies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink-100">Sharing, retention, and choices</h2>
            <p className="mt-4 leading-8">
              Personal or device data is shared only along the service paths described above:
              Vercel for hosting and measurements, PostHog for analytics and replay, Resend for
              subscriptions and feedback delivery, and the AI gateway and model provider for an
              interview a visitor chooses to use. The repository does not define one fixed retention
              period for those providers, so their configured account settings control retention.
            </p>
            <p className="mt-4 leading-8">
              Visitors can browse without submitting the newsletter, feedback, or interview forms;
              clear local site data to remove browser-stored preferences and identifiers; use the
              unsubscribe link in an email; or use the contact page for an access or deletion request.
              A request may require enough detail to locate the relevant provider-side record.
            </p>
          </section>

          <div className="border-t border-hair pt-6 font-mono text-[11px] uppercase tracking-wider">
            <Link className="text-amber-300 hover:underline" href="/contact">Contact and correction routes &rarr;</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
