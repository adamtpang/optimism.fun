import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { problems, getProblemBySlug } from '@/data/problems'
import { getCompaniesForProblem } from '@/data/companies'
import { getCapitalFlow } from '@/data/capital-flows'
import { getInLimitCap } from '@/data/in-limit'
import { displayDeaths } from '@/lib/burden'
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

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <>
      <p className="font-mono text-3xl md:text-4xl tabular-nums text-ink-100">{value}</p>
      <p className="text-sm text-ink-500 mt-1">{label}</p>
    </>
  )
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="border border-hair p-4 hover:border-amber-300">
      {body}
    </a>
  ) : (
    <div className="border border-hair p-4">{body}</div>
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
  const people = problem.humansAffected

  const boardAvailable = isDbConfigured()
  const [commitments, allCounts] = await Promise.all([cachedListByProblem(slug), cachedCountsByProblem()])
  const boardQuests = requestsForStartups
    .filter((q) => q.problemSlug === slug)
    .map((q) => {
      const cw = getSourcedCrowding(q.slug)
      return { slug: q.slug, title: q.title, crowded: Boolean(cw && cw.competitorCount >= 5) }
    })
  const boardCompanies = companies.map((c) => ({ slug: c.slug, name: c.name, url: c.url, stage: c.stage }))

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <h1 className="font-serif text-4xl md:text-6xl text-ink-100 leading-tight">{problem.name}</h1>
          <p className="text-lg text-ink-400 mt-3 max-w-3xl">{problem.tagline}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {people && <Stat label="people affected" value={formatHumans(people.value)} href={people.sourceUrl} />}
            {deaths && <Stat label="related deaths / yr" value={formatHumans(deaths)} />}
            {flow && <Stat label="spent on it / yr" value={fmtUsdCompact(flow.usdPerYear.value)} href={flow.usdPerYear.sourceUrl} />}
            {prize && <Stat label="prize if solved" value={fmtUsdCompact(prize.marketCap.value)} href={prize.marketCap.sourceUrl} />}
          </div>
        </div>

        <ActionBar />

        <ConstraintTree problemSlug={slug} />

        {companies.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 border-b border-hair">
            <h2 className="font-serif text-2xl text-ink-100 mb-4">Who is on it</h2>
            <ul className="flex flex-wrap gap-2">
              {companies.map((c) => (
                <li key={c.slug}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-block border border-hair hover:border-amber-300 px-3 py-1.5 text-sm text-ink-200">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
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

        <section className="px-4 sm:px-6 pb-16 max-w-5xl mx-auto">
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
