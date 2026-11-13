import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { formatIndexNumber, indexPack, indexProblem, indexScore, prerenderIndexSlugs, problemSnapshot } from '@/lib/problem-index'
import type { IndexMetric, IndexSensorReading } from '@/lib/problem-index'

export const revalidate = 86400
export const dynamicParams = true

export function generateStaticParams() {
  return prerenderIndexSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const problem = indexProblem(slug)
  if (!problem) return { title: 'Problem | optimism.fun' }
  return {
    title: `${problem.name} | optimism.fun`,
    description: `Sourced figures for ${problem.name}. The company sketch on this page is an AI suggestion, not a real company.`,
    alternates: { canonical: `/problem-index/${slug}` },
  }
}

function MetricLine({ metric }: { metric: IndexMetric }) {
  return (
    <li className="border-t border-neutral-100 py-3 min-w-0">
      <p className="text-sm text-neutral-900 break-words">{metric.label}</p>
      <p className="mt-1 text-sm tabular-nums text-ink-100">
        {formatIndexNumber(metric.value)} {metric.unit} ({metric.year})
      </p>
      {metric.intervalLow != null && metric.intervalHigh != null ? (
        <p className="text-sm text-neutral-600">
          Published interval {formatIndexNumber(metric.intervalLow)} to {formatIndexNumber(metric.intervalHigh)} {metric.unit}.
        </p>
      ) : null}
      {metric.derived && metric.formula ? <p className="text-sm text-neutral-600 break-words">Calculated. {metric.formula}</p> : null}
      <p className="text-sm text-neutral-600">
        {metric.source}. Retrieved {metric.retrievedOn}.{' '}
        <a href={metric.sourceUrl} className="text-primary underline underline-offset-2 break-words" target="_blank" rel="noopener noreferrer">
          Source
        </a>
        {metric.pageUrl && metric.pageUrl !== metric.sourceUrl ? (
          <>
            {' · '}
            <a href={metric.pageUrl} className="text-primary underline underline-offset-2 break-words" target="_blank" rel="noopener noreferrer">
              Indicator page
            </a>
          </>
        ) : null}
      </p>
    </li>
  )
}

function SensorBlock({ sensor }: { sensor: IndexSensorReading | null }) {
  if (!sensor) return null
  return (
    <li className="border-t border-neutral-100 py-3">
      <p className="text-sm text-neutral-900">{sensor.label}</p>
      <p className="mt-1 text-sm tabular-nums text-ink-100">
        {sensor.capped
          ? 'count capped'
          : sensor.status === 'ok' && sensor.value != null
            ? `${sensor.value.toLocaleString('en-US')} ${sensor.unit}`
            : 'not yet sourced'}
      </p>
      {sensor.reason ? <p className="text-sm text-neutral-600 break-words">{sensor.reason}</p> : null}
      {sensor.query ? <p className="text-sm text-neutral-600 break-words">Query: {sensor.query}</p> : null}
      {sensor.sourceUrl ? (
        <a href={sensor.sourceUrl} className="text-sm text-primary underline underline-offset-2 break-words" target="_blank" rel="noopener noreferrer">
          Source
        </a>
      ) : null}
    </li>
  )
}

export default async function IndexProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const problem = indexProblem(slug)
  const score = indexScore(slug)
  const pack = indexPack(slug)
  if (!problem || !score || !pack) notFound()
  const companies = problem.sensors.companies?.names || []
  const sponsors = problem.sensors.sponsors?.names || []

  return (
    <>
      <Navbar />
      <main className="site-shell pt-28 pb-16">
        <p className="text-sm">
          <Link href="/problem-index" className="text-primary underline underline-offset-2">
            Open index
          </Link>
        </p>
        <p className="font-mono text-small uppercase text-primary mt-4">{problem.category}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink-100 leading-tight mt-2 max-w-[20ch]">{problem.name}</h1>
        <p className="text-sm text-neutral-700 mt-3">
          {score.rank == null ? 'Not ranked. The gap is insufficient data.' : `Gap rank ${score.rank}.`}{' '}
          {score.openQuest
            ? 'Open quest. The company search finished and found none.'
            : problem.sensors.companies?.capped
              ? 'OpenAlex hit its company-list cap, so that count is not in the supply score. Named institutions are listed below.'
              : score.companyCount == null
                ? 'The company count is not yet sourced. This is not marked an open quest.'
                : `${score.companyCount.toLocaleString('en-US')} known companies in the sourced lists.`}
        </p>
        <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-neutral-200 bg-white p-3">
            <dt className="text-sm text-neutral-600">Demand</dt>
            <dd className="text-h3 tabular-nums">{score.demandLabel}</dd>
          </div>
          <div className="border border-neutral-200 bg-white p-3">
            <dt className="text-sm text-neutral-600">Supply</dt>
            <dd className="text-h3 tabular-nums">{score.supplyLabel}</dd>
          </div>
          <div className="border border-neutral-200 bg-white p-3">
            <dt className="text-sm text-neutral-600">Gap</dt>
            <dd className="text-h3 tabular-nums">{score.gapLabel}</dd>
          </div>
          <div className="border border-neutral-200 bg-white p-3">
            <dt className="text-sm text-neutral-600">Companies</dt>
            <dd className="text-h3 tabular-nums">{score.openQuest ? '0' : score.companyCount == null ? 'n/a' : score.companyCount}</dd>
          </div>
        </dl>
        {score.companyNote ? <p className="text-sm text-neutral-600 mt-3 max-w-[68ch]">{score.companyNote}</p> : null}
        <p className="text-sm text-neutral-600 mt-3 max-w-[68ch]">
          Headline: {formatIndexNumber(problem.headline.value)} {problem.headline.unit} in {problem.headline.year}. Retrieved {problemSnapshot.retrievedOn}. This is not a valuation.
        </p>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-h3 text-ink-100">Sourced numbers</h2>
          <ul>
            {problem.metrics.map((metric) => (
              <MetricLine key={`${metric.sourceUrl}-${metric.label}-${metric.year}`} metric={metric} />
            ))}
            <SensorBlock sensor={problem.sensors.openalex} />
            <SensorBlock sensor={problem.sensors.nih} />
            <SensorBlock sensor={problem.sensors.trials} />
            <SensorBlock sensor={problem.sensors.companies} />
            <SensorBlock sensor={problem.sensors.sponsors} />
          </ul>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-h3 text-ink-100">Known companies</h2>
          <p className="text-sm text-neutral-600 mt-2">
            Names come from the OpenAlex company search and, when the list fits on one page, ClinicalTrials.gov industry lead sponsors. The same company can appear in both. Placeholders are not listed here and are not counted.
          </p>
          {companies.length === 0 && sponsors.length === 0 ? (
            <p className="text-sm text-neutral-700 mt-3">No named company link was returned for this search.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {companies.map((company) => (
                <li key={`oa-${company.name}`} className="text-sm break-words">
                  {company.url ? (
                    <a href={company.url} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                      {company.name}
                    </a>
                  ) : (
                    company.name
                  )}
                  <span className="text-neutral-600"> · OpenAlex{company.count ? ` · ${company.count} works` : ''}</span>
                </li>
              ))}
              {sponsors.map((company) => (
                <li key={`ct-${company.name}`} className="text-sm break-words">
                  {company.url ? (
                    <a href={company.url} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                      {company.name}
                    </a>
                  ) : (
                    company.name
                  )}
                  <span className="text-neutral-600"> · ClinicalTrials.gov lead sponsor{company.count ? ` · ${company.count} trials` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <article className="mt-10 border border-dashed border-primary bg-neutral-50 p-4 max-w-3xl min-w-0">
          <p className="font-mono text-small uppercase text-primary">AI-generated suggestion. Not a real company. Not a forecast.</p>
          <h2 className="font-serif text-2xl text-ink-100 mt-2 break-words">{pack.name}</h2>
          <p className="text-sm text-neutral-700 mt-2">
            This placeholder is not counted as supply. It has no revenue, funding, or valuation.
          </p>
          <h3 className="text-sm font-semibold text-ink-100 mt-4">Founder starter pack</h3>
          <p className="text-sm text-neutral-900 mt-2 break-words">{pack.concept}</p>
          <p className="text-sm text-neutral-900 mt-2 break-words">Customer: {pack.customer}</p>
          <p className="text-sm text-neutral-900 mt-2 break-words">{pack.wedge}</p>
          <h3 className="text-sm font-semibold text-ink-100 mt-4">Metrics to move</h3>
          <ul className="mt-2 space-y-1">
            {pack.metricsToMove.map((metric) => (
              <li key={metric.sourceUrl + metric.label} className="text-sm break-words">
                {metric.label}: {formatIndexNumber(metric.value)} {metric.unit} ({metric.year}){' '}
                <a href={metric.sourceUrl} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                  Source
                </a>
              </li>
            ))}
          </ul>
          <h3 className="text-sm font-semibold text-ink-100 mt-4">Key papers</h3>
          <p className="text-sm text-neutral-600 mt-1">Most-cited OpenAlex articles returned for a short title search on this problem. A neighboring topic can still appear. This is not a curated reading list.</p>
          {pack.papers.length ? (
            <ol className="mt-2 space-y-2 list-decimal pl-5">
              {pack.papers.map((paper) => (
                <li key={paper.url} className="text-sm break-words">
                  <a href={paper.url} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                    {paper.title}
                  </a>
                  <span className="text-neutral-600">
                    {paper.year ? ` · ${paper.year}` : ''}
                    {paper.citedBy != null ? ` · ${paper.citedBy.toLocaleString('en-US')} citations in OpenAlex` : ''}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-neutral-700 mt-2">No OpenAlex paper link resolved for this search.</p>
          )}
          <h3 className="text-sm font-semibold text-ink-100 mt-4">Datasets</h3>
          <ul className="mt-2 space-y-1">
            {pack.datasets.map((dataset) => (
              <li key={dataset.url} className="text-sm break-words">
                <a href={dataset.url} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                  {dataset.name}
                </a>
              </li>
            ))}
          </ul>
          <h3 className="text-sm font-semibold text-ink-100 mt-4">Funders and grant programs</h3>
          {pack.funders.length ? (
            <ul className="mt-2 space-y-2">
              {pack.funders.map((funder) => (
                <li key={funder.url + funder.name} className="text-sm break-words">
                  <a href={funder.url} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                    {funder.name}
                  </a>
                  <span className="text-neutral-700"> {funder.note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-700 mt-2">No funder link was verified for this row.</p>
          )}
          <h3 className="text-sm font-semibold text-ink-100 mt-4">Comparable companies</h3>
          {pack.comparables.length ? (
            <ul className="mt-2 space-y-1">
              {pack.comparables.map((company) => (
                <li key={`${company.source}-${company.name}`} className="text-sm break-words">
                  {company.url ? (
                    <a href={company.url} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                      {company.name}
                    </a>
                  ) : (
                    company.name
                  )}
                  {company.source ? <span className="text-neutral-600"> · {company.source}</span> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-700 mt-2">No comparable company was sourced.</p>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
