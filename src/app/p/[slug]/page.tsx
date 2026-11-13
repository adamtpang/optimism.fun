import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { problems, getProblemBySlug } from '@/data/problems'
import { getCompaniesForProblem } from '@/data/companies'
import { technologiesForProblem } from '@/data/technologies'
import OpenQuestCard from '@/components/OpenQuestCard'
import { openQuestsFor } from '@/lib/open-quests'
import { balanceBySlug } from '@/lib/sourced-balance'
import { readingsFor } from '@/lib/demand-snapshot'
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
    <div className="border border-neutral-300 rounded p-4 min-w-0">
      <p className="font-figure text-h1 font-normal text-ink-100">{value}</p>
      <p className="text-small text-ink-400 mt-1">{label}</p>
      {source && href && (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="block text-small text-info underline underline-offset-2 mt-2 leading-snug line-clamp-3"
        >
          {source}
        </a>
      )}
      {source && !href && <p className="text-small text-ink-500 mt-2 leading-snug">{source}</p>}
    </div>
  )
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const problem = getProblemBySlug(slug)
  if (!problem) notFound()

  const companies = getCompaniesForProblem(slug)
  const technologies = technologiesForProblem(slug)
  const score = balanceBySlug().get(slug)
  const openQuests = openQuestsFor(slug)
  const readings = readingsFor(slug)
  const sponsorReading = readings.find((reading) => reading.feed === 'clinicaltrials-sponsors')
  const paperReading = readings.find((reading) => reading.feed === 'openalex-companies')
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
          <p className="font-figure text-small text-ink-500">Problem &middot; updated {updated}</p>
          <h1 className="text-h1 md:text-display-2 text-ink-100 mt-2">{problem.name}</h1>
          <p className="text-body-lg text-ink-300 mt-3 max-w-[70ch]">{problem.tagline}</p>
          <p className="text-small text-ink-500 mt-3">
            Every number below has a source
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

        <ActionBar />

        <ProblemNumbers problem={problem} />
        <CtaBoard problemSlug={slug} />
        <BurdenBlock problemSlug={slug} />

        <ConstraintTree problemSlug={slug} />

        <section className="site-shell py-10 border-b border-hair" id="companies">
          <h2 className="text-h2 text-ink-100">Companies working on this</h2>
          <p className="text-sm text-ink-400 mt-2">
            {companies.length} sourced {companies.length === 1 ? 'company' : 'companies'}. Links are the company page or the source already on file.
          </p>
          {companies.length === 0 ? (
            <p className="text-sm text-ink-400 mt-3">No sourced company is on file.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {companies.map((company) => {
                const source = company.sources[0]
                const href = company.url ?? source?.url
                return (
                  <li key={company.slug} className="min-w-0">
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-ink-100 hover:text-primary break-words">
                        {company.name}
                      </a>
                    ) : (
                      <span className="text-ink-100">{company.name}</span>
                    )}
                    {source?.url && (
                      <p className="text-sm text-ink-500 mt-1 break-words">
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                          {source.title}
                        </a>
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          {sponsorReading?.names && sponsorReading.names.length > 0 && (
            <div className="mt-6">
              <h3 className="text-label text-ink-300">Industry sponsors on active trials</h3>
              <p className="text-sm text-ink-400 mt-2">
                {sponsorReading.value ?? 'Count not stored'} distinct industry sponsors. Each link is the query for that sponsor. Top names by trial count.
              </p>
              <ul className="mt-3 space-y-2">
                {sponsorReading.names.slice(0, 8).map((name) => (
                  <li key={name.url} className="text-sm text-ink-300 break-words">
                    <a href={name.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {name.name}
                    </a>
                    {` · ${name.count} trials`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(paperReading?.names?.length ?? 0) > 0 && (
            <div className="mt-6">
              <h3 className="text-label text-ink-300">Company affiliations on recent papers</h3>
              <p className="text-sm text-ink-400 mt-2">
                {paperReading?.capped
                  ? 'OpenAlex stops at 200 institutions for this query, so the count is not in the score. These are the top names from that capped list.'
                  : `${paperReading?.value ?? 'Count not stored'} company affiliations on papers from the last 12 months.`}
              </p>
              <ul className="mt-3 space-y-2">
                {paperReading?.names?.slice(0, 8).map((name) => (
                  <li key={name.url} className="text-sm text-ink-300 break-words">
                    <a href={name.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {name.name}
                    </a>
                    {` · ${name.count} works`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {technologies.length > 0 && (
            <div className="mt-6">
              <h3 className="text-label text-ink-300">Technologies</h3>
              <p className="text-sm text-ink-400 mt-2">Enabling tools with a source. They are not extra problems.</p>
              <ul className="mt-3 space-y-2">
                {technologies.map((tag) => (
                  <li key={`${tag.companySlug}-${tag.id}`} className="text-sm text-ink-300 break-words">
                    {tag.name} via {tag.companyName}. Evidence: {tag.evidence}.{' '}
                    <a href={tag.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Source
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {score && (
            <div className="mt-6">
              <h3 className="text-label text-ink-300">Supply and demand</h3>
              <p className="text-sm text-ink-300 mt-2">
                This score does not change the priority rank. Demand {score.demandLabel}. Supply {score.supplyLabel}. Gap {score.gapLabel}.
              </p>
              <ul className="mt-3 space-y-1">
                {score.inputs.map((input) => (
                  <li key={input.label} className="text-sm text-ink-400 break-words">
                    {input.label}: {input.display}
                    {input.value != null && input.unit ? ` ${input.unit}` : ''}
                    {input.sourceUrl && (
                      <>
                        {' '}
                        <a href={input.sourceUrl} className="text-primary hover:underline">
                          Source
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {openQuests.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-label text-ink-300">Open quests</h3>
              {openQuests.map((quest) => (
                <OpenQuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          )}
        </section>

        {science.length > 0 && (
          <section className="site-shell py-10 border-b border-hair">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2 className="text-h2 text-ink-100">New science</h2>
              <Link
                href={`/discoveries?problem=${slug}`}
                className="text-small text-primary underline"
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

        <CiteThis problem={problem} />
      </main>
      <Footer />
    </>
  )
}
