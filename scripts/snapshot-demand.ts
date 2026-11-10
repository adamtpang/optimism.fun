/**
 * Fetch every registered demand feed and write src/data/demand-snapshot.json.
 *
 * Free, keyless public APIs only. Exa is not called: it needs EXA_API_KEY.
 * A problem with no registered query is marked unavailable. A failed request
 * is marked unavailable with the reason. No number is invented.
 *
 *   npx tsx scripts/snapshot-demand.ts
 */
import { writeFileSync } from 'node:fs'
import { problems } from '../src/data/problems'
import { demandSignalRegistry, type DemandSignalFeeds } from '../src/data/demand-signals'
import { fetchDemandBurden } from '../src/lib/burden-feed'
import { fetchOpenAlexCount } from '../src/lib/sources/openalex'
import { fetchNihProjectCount } from '../src/lib/sources/nih'
import { fetchFederalRegisterCount } from '../src/lib/sources/federal-register'
import { fetchUsaSpendingAwards } from '../src/lib/sources/usaspending'
import { fetchFormDCount } from '../src/lib/sources/edgar'
import { fetchFdaShortages } from '../src/lib/sources/openfda'
import { fetchWikipediaPageviews } from '../src/lib/sources/wikipedia'

type Reading = {
  feed: string
  status: 'ok' | 'unavailable'
  label: string
  value: number | null
  unit: string
  query: string | null
  sourceUrl: string | null
  retrievedOn: string
  reason: string | null
}

const NO_QUERY = 'No query is registered for this problem. A query was not invented.'
const FAILED = 'The public API did not return a usable count. No key was sent.'

function unavailable(feed: string, label: string, retrievedOn: string, reason: string, query: string | null = null, sourceUrl: string | null = null): Reading {
  return { feed, status: 'unavailable', label, value: null, unit: '', query, sourceUrl, retrievedOn, reason }
}

function ok(feed: string, label: string, value: number, unit: string, query: string | null, sourceUrl: string | null, retrievedOn: string): Reading {
  return { feed, status: 'ok', label, value, unit, query, sourceUrl, retrievedOn, reason: null }
}

async function burdenReading(feeds: DemandSignalFeeds | undefined, retrievedOn: string): Promise<Reading> {
  const label = 'Burden feed'
  if (!feeds?.burden) return unavailable('burden', label, retrievedOn, NO_QUERY)
  const query =
    feeds.burden.kind === 'who'
      ? feeds.burden.code
      : feeds.burden.kind === 'owid'
        ? feeds.burden.slug
        : feeds.burden.indicator
  try {
    const result = await fetchDemandBurden(feeds.burden, { revalidateSeconds: 0 })
    if (!result) return unavailable('burden', feeds.burden.label, retrievedOn, FAILED, query)
    if (result.status === 'unavailable') {
      return unavailable('burden', result.label, retrievedOn, result.reason, query, result.url)
    }
    return ok('burden', result.label, result.value, result.unit, query, result.url, retrievedOn)
  } catch (error) {
    return unavailable('burden', feeds.burden.label, retrievedOn, error instanceof Error ? error.message : FAILED, query)
  }
}

async function countReading(
  feed: string,
  label: string,
  query: string | undefined,
  retrievedOn: string,
  load: (query: string) => Promise<{ value: number; unit: string; sourceUrl: string | null } | null>,
): Promise<Reading> {
  if (!query) return unavailable(feed, label, retrievedOn, NO_QUERY)
  try {
    const result = await load(query)
    if (!result) return unavailable(feed, label, retrievedOn, FAILED, query)
    return ok(feed, label, result.value, result.unit, query, result.sourceUrl, retrievedOn)
  } catch (error) {
    return unavailable(feed, label, retrievedOn, error instanceof Error ? error.message : FAILED, query)
  }
}

async function readingsFor(feeds: DemandSignalFeeds | undefined, retrievedOn: string): Promise<Reading[]> {
  const burden = await burdenReading(feeds, retrievedOn)
  const openalex = await countReading('openalex', 'OpenAlex works', feeds?.openAlexSearch, retrievedOn, async (query) => {
    const result = await fetchOpenAlexCount(query, { revalidateSeconds: 0 })
    if (!result) return null
    return { value: result.workCount, unit: 'works', sourceUrl: result.url }
  })
  const nih = await countReading('nih', 'NIH RePORTER projects', feeds?.nihSearch, retrievedOn, async (query) => {
    const result = await fetchNihProjectCount(query)
    if (!result) return null
    const url = result.url ?? 'https://reporter.nih.gov/'
    const sourceUrl = url.startsWith('https:/') && !url.startsWith('https://') ? `https://${url.slice('https:/'.length)}` : url
    return { value: result.projectCount, unit: 'projects', sourceUrl }
  })
  const federal = await countReading('federal-register', 'Federal Register documents', feeds?.federalRegisterTerm, retrievedOn, async (query) => {
    const result = await fetchFederalRegisterCount(query, { revalidateSeconds: 0 })
    if (!result) return null
    return { value: result.documentCount, unit: 'documents', sourceUrl: result.url }
  })
  const usa = await countReading('usaspending', 'USAspending awards', feeds?.usaSpendingTerm, retrievedOn, async (query) => {
    const result = await fetchUsaSpendingAwards(query, { revalidateSeconds: 0 })
    if (!result) return null
    return { value: result.awardCount, unit: 'awards', sourceUrl: result.url }
  })
  const edgar = await countReading('edgar', 'SEC EDGAR Form D filings', feeds?.edgar?.q, retrievedOn, async (query) => {
    const result = await fetchFormDCount(query, { kind: feeds?.edgar?.kind, revalidateSeconds: 0 })
    if (!result) return null
    return { value: result.filingCount, unit: 'filings', sourceUrl: result.url }
  })
  const fda = await countReading('openfda', 'openFDA current drug shortages', feeds?.fdaCategory, retrievedOn, async (query) => {
    const result = await fetchFdaShortages({ category: query, revalidateSeconds: 0 })
    if (!result) return null
    const search = `status:%22Current%22+AND+therapeutic_category:%22${encodeURIComponent(query)}%22`
    return {
      value: result.currentCount,
      unit: 'distinct drugs',
      sourceUrl: `https://api.fda.gov/drug/shortages.json?search=${search}&count=generic_name.exact`,
    }
  })
  const wiki = await countReading('wikipedia', 'Wikipedia pageviews (attention, not demand)', feeds?.wikipediaArticle, retrievedOn, async (query) => {
    const result = await fetchWikipediaPageviews(query, { revalidateSeconds: 0 })
    if (!result) return null
    return { value: result.totalViews, unit: 'pageviews', sourceUrl: result.url }
  })
  return [burden, openalex, nih, federal, usa, edgar, fda, wiki]
}

async function main() {
  const retrievedOn = new Date().toISOString().slice(0, 10)
  const problemsOut: Record<string, Reading[]> = {}
  for (const problem of problems) {
    process.stdout.write(`${problem.slug}\n`)
    problemsOut[problem.slug] = await readingsFor(demandSignalRegistry[problem.slug], retrievedOn)
  }
  const file = {
    retrievedOn,
    note: 'Stored readings from keyless public APIs. A missing query or a failed request is unavailable. Values are not imputed.',
    notCalled: [
      {
        id: 'exa',
        reason: 'Exa queue extraction needs EXA_API_KEY. It was not called. No new key was created.',
      },
    ],
    problems: problemsOut,
  }
  writeFileSync(new URL('../src/data/demand-snapshot.json', import.meta.url), `${JSON.stringify(file, null, 2)}\n`)
  const readings = Object.values(problemsOut).flat()
  const okCount = readings.filter((reading) => reading.status === 'ok').length
  process.stdout.write(`wrote ${readings.length} readings, ${okCount} ok, retrieved ${retrievedOn}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
