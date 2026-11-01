import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { problems, getProblemBySlug } from '@/data/problems'
import { getCompaniesForProblem } from '@/data/companies'
import { getCapitalFlow } from '@/data/capital-flows'
import { getInLimitCap } from '@/data/in-limit'
import { displayDeathCitation, displayDeaths } from '@/lib/burden'
import CiteThis from '@/components/CiteThis'
import { formatHumans } from '@/lib/format'
import { fmtUsdCompact } from '@/lib/allocation'
import ActionBar from '@/components/ActionBar'
import CommitmentForm from '@/components/CommitmentForm'
import CoordinationBoard from '@/components/CoordinationBoard'
import ConstraintTree from '@/components/ConstraintTree'
import { cachedCountsByProblem, cachedListByProblem } from '@/lib/commitments-cache'
import { isDbConfigured } from '@/lib/db'
import { requestsForStartups } from '@/data/rfs'
import { getSourcedCrowding } from '@/data/quest-crowding'
import { listDiscoveries } from '@/data/discoveries'
import DiscoveryList from '@/components/DiscoveryList'
import Link from 'next/link'
import ProblemNumbers from '@/components/ProblemNumbers'
import CtaBoard from '@/components/CtaBoard'
import BurdenBlock from '@/components/BurdenBlock'
import { problemMetrics } from '@/lib/open-data'
import PageBand, { problemBandKind } from '@/components/media/PageBand'

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }))
}

/** Prerendered, refreshed every 5 minutes; approving a commitment refreshes it at once. */
export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const problem = getProblemBySlug(slug)
  if (!problem) return {}
  return { title: `${problem.name} | optimism.fun`, description: problem.tagline }
}

function Stat({
  label,
  value,
  source,
  href,
}: {
  label: string
  value: string
  source?: string
  href?: string
}) {
  const external = href?.startsWith('http')
  return (
    <div className="border border-hair p-4 min-w-0">
      <p className="font-mono text-3xl md:text-4xl tabular-nums text-ink-100">{value}</p>
      <p className="text-sm text-ink-500 mt-1">{label}</p>
      {source && href && (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="block text-xs text-amber-300 underline decoration-dotted underline-offset-2 mt-2 leading-snug hover:text-amber-200 line-clamp-3"
        >
          {source}
        </a>
      )}
      {source && !href && <p className="text-xs text-ink-500 mt-2 leading-snug">{source}</p>}
    </div>
  )
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const problem = getProblemBySlug(slug)
  if (!problem) notFound()

  const companies = getCompaniesForProblem(slug)
  const flow = getCapitalFlow(slug)
  const prize = getInLimitCap(slug)
  const deaths = displayDeaths(slug)
  const deathSource = displayDeathCitation(slug)
  const people = problem.humansAffected
  const cite = '#cite-this'

  const boardAvailable = isDbConfigured()
  const [commitments, allCounts] = await Promise.all([cachedListByProblem(slug), cachedCountsByProblem()])
  const boardQuests = requestsForStartups
    .filter((q) => q.problemSlug === slug)
    .map((q) => {
      const cw = getSourcedCrowding(q.slug)
      return { slug: q.slug, title: q.title, crowded: Boolean(cw && cw.competitorCount >= 5) }
    })
  const boardCompanies = companies.map((c) => ({ slug: c.slug, name: c.name, url: c.url, stage: c.stage }))
  const science = listDiscoveries({ problemSlug: slug })
  const deathsMetric = problemMetrics(slug).find((metric) => metric.id === 'related_deaths')
  const updated = problem.lastUpdated ?? problem.asOf

  return (
    <>
      <Navbar />
      <main className="pt-4">
        {problemBandKind(slug) ? <PageBand kind={problemBandKind(slug)!} /> : <div className="pt-20" />}
        <div className="site-shell pb-8">
          <h1 className="font-serif text-4xl md:text-6xl text-ink-100 leading-tight">{problem.name}</h1>
          <p className="text-lg text-ink-400 mt-3 max-w-7xl">{problem.tagline}</p>
          <p className="font-mono text-small text-ink-500 mt-3">
            Updated {updated}
            {' · '}
            <a className="text-primary hover:underline" href={`/api/problems/${slug}/csv`}>
              Download this data
            </a>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {people && (
              <Stat
                label="people affected"
                value={formatHumans(people.value)}
                source={people.source}
                href={people.sourceUrl ?? cite}
              />
            )}
            {deaths && (
              <Stat
                label="related deaths / yr"
                value={formatHumans(deaths)}
                source={deathsMetric?.source ?? deathSource?.source}
                href={deathsMetric?.sourceUrl ?? deathSource?.sourceUrl ?? cite}
              />
            )}
            {flow && (
              <Stat
                label="spent on it / yr"
                value={fmtUsdCompact(flow.usdPerYear.value)}
                source={flow.usdPerYear.source}
                href={flow.usdPerYear.sourceUrl ?? cite}
              />
            )}
            {prize && (
              <Stat
                label="prize if solved"
                value={fmtUsdCompact(prize.marketCap.value)}
                source={prize.marketCap.source}
                href={prize.marketCap.sourceUrl ?? cite}
              />
            )}
          </div>
        </div>

        <CiteThis problem={problem} />

        <ActionBar />

        <ProblemNumbers problem={problem} />
        <CtaBoard problemSlug={slug} />
        <BurdenBlock problemSlug={slug} />

        <ConstraintTree problemSlug={slug} />

        {companies.length > 0 && (
          <section className="site-shell py-10 border-b border-hair">
            <h2 className="font-serif text-2xl text-ink-100 mb-4">Who is on it</h2>
            <ul className="flex flex-wrap gap-2">
              {companies.map((c) => (
                <li key={c.slug}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-block border border-hair hover:border-primary px-3 min-h-11 inline-flex items-center text-sm text-ink-200">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {science.length > 0 && (
          <section className="site-shell py-10 border-b border-hair">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2 className="font-serif text-2xl text-ink-100">New science</h2>
              <Link
                href={`/discoveries?problem=${slug}`}
                className="font-mono text-small uppercase tracking-wider text-primary hover:underline"
              >
                All {science.length}
              </Link>
            </div>
            <DiscoveryList items={science.slice(0, 3)} compact />
          </section>
        )}

        <CoordinationBoard
          problemName={problem.name}
          counts={allCounts.get(slug)}
          commitments={commitments}
          quests={boardQuests}
          companies={boardCompanies}
          boardAvailable={boardAvailable}
        />

        <section className="px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
          <CommitmentForm
            problemSlug={problem.slug}
            problemName={problem.name}
            companies={boardCompanies.map((c) => ({ slug: c.slug, name: c.name }))}
          />
        </section>
      </main>
      <Footer />
    </>
  )
}
