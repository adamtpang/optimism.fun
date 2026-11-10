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
import { fetchFederalRegisterCount } from '../src/lib/sources/federal-register'
import { fetchUsaSpendingAwards } from '../src/lib/sources/usaspending'
import { fetchFormDCount } from '../src/lib/sources/edgar'
import { fetchFdaShortages } from '../src/lib/sources/openfda'
import { fetchWikipediaPageviews } from '../src/lib/sources/wikipedia'

type Named = { name: string; url: string; count: number }

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
  names?: Named[]
  capped?: boolean
}

const UA = 'optimism.fun research adamtpang@gmail.com'
const ACTIVE_STATUS = 'RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION,NOT_YET_RECRUITING'
const NOT_CLINICAL = 'Not a clinical condition. No trial query was registered.'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function monthsAgo(iso: string, months: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCMonth(date.getUTCMonth() - months)
  return date.toISOString().slice(0, 10)
}

/** Latest complete US fiscal year. FY N ends on 30 September of year N. */
function latestCompleteFiscalYear(now = new Date()): number {
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1
  return month > 9 ? year : year - 1
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

async function nihFunding(search: string, fiscalYear: number, retrievedOn: string): Promise<Reading> {
  const label = 'NIH RePORTER funding'
  const query = `${search} (FY${fiscalYear})`
  let offset = 0
  let reported = 0
  let summed = 0
  let missing = 0
  let searchId: string | null = null
  const limit = 500
  try {
    for (;;) {
      let res: Response | null = null
      for (let attempt = 0; attempt < 4; attempt += 1) {
        res = await fetch('https://api.reporter.nih.gov/v2/projects/search', {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': UA },
          body: JSON.stringify({
            criteria: {
              advanced_text_search: {
                operator: 'and',
                search_field: 'projecttitle,abstracttext,terms',
                search_text: search,
              },
              fiscal_years: [fiscalYear],
            },
            include_fields: ['AwardAmount'],
            offset,
            limit,
          }),
          signal: AbortSignal.timeout(30_000),
        })
        if (res.ok || (res.status < 500 && res.status !== 400 && res.status !== 429)) break
        await sleep(1500 * (attempt + 1))
      }
      if (!res || !res.ok) return unavailable('nih', label, retrievedOn, `NIH RePORTER returned HTTP ${res?.status ?? 'no response'}.`, query, 'https://reporter.nih.gov/')
      const json = (await res.json()) as {
        meta?: { total?: number; search_id?: string }
        results?: { award_amount?: number | null }[]
      }
      reported = json.meta?.total ?? reported
      searchId = json.meta?.search_id ?? searchId
      const rows = json.results ?? []
      if (reported > 15_000) {
        return unavailable('nih', label, retrievedOn, 'NIH RePORTER rejects offsets at 15000, and this query has more projects than that. The award total was not summed from a partial set.', query, 'https://reporter.nih.gov/')
      }
      for (const row of rows) {
        if (typeof row.award_amount === 'number') summed += row.award_amount
        else missing += 1
      }
      offset += rows.length
      if (rows.length === 0 || offset >= reported) break
      await sleep(1100)
    }
  } catch (error) {
    return unavailable('nih', label, retrievedOn, error instanceof Error ? error.message : FAILED, query, 'https://reporter.nih.gov/')
  }
  const rawUrl = searchId ? `https://reporter.nih.gov/search/${searchId}/projects` : 'https://reporter.nih.gov/'
  const sourceUrl = rawUrl.startsWith('https:/') && !rawUrl.startsWith('https://') ? `https://${rawUrl.slice('https:/'.length)}` : rawUrl
  const reason = missing > 0 ? `${missing} projects had no reported award amount. Those amounts were not filled in. The value is the sum of reported awards.` : null
  return { feed: 'nih', status: 'ok', label, value: summed, unit: 'USD', query, sourceUrl, retrievedOn, reason }
}

function trialParams(feeds: DemandSignalFeeds): URLSearchParams | null {
  if (!feeds.clinicalTrials?.cond && !feeds.clinicalTrials?.term) return null
  const params = new URLSearchParams()
  if (feeds.clinicalTrials.cond) params.set('query.cond', feeds.clinicalTrials.cond)
  if (feeds.clinicalTrials.term) params.set('query.term', feeds.clinicalTrials.term)
  params.set('filter.overallStatus', ACTIVE_STATUS)
  return params
}

async function trialCount(feeds: DemandSignalFeeds | undefined, retrievedOn: string): Promise<Reading> {
  const label = 'ClinicalTrials.gov active trials'
  if (!feeds?.clinicalTrials) return unavailable('clinicaltrials', label, retrievedOn, NOT_CLINICAL)
  const params = trialParams(feeds)
  if (!params) return unavailable('clinicaltrials', label, retrievedOn, NOT_CLINICAL)
  params.set('countTotal', 'true')
  params.set('pageSize', '1')
  const sourceUrl = `https://clinicaltrials.gov/api/v2/studies?${params.toString()}`
  const query = feeds.clinicalTrials.cond ?? feeds.clinicalTrials.term ?? ''
  try {
    const res = await fetch(sourceUrl, { headers: { accept: 'application/json', 'user-agent': UA }, signal: AbortSignal.timeout(30_000) })
    if (!res.ok) return unavailable('clinicaltrials', label, retrievedOn, `ClinicalTrials.gov returned HTTP ${res.status}.`, query, sourceUrl)
    const json = (await res.json()) as { totalCount?: number }
    if (typeof json.totalCount !== 'number') return unavailable('clinicaltrials', label, retrievedOn, FAILED, query, sourceUrl)
    return ok('clinicaltrials', label, json.totalCount, 'active trials', query, sourceUrl, retrievedOn)
  } catch (error) {
    return unavailable('clinicaltrials', label, retrievedOn, error instanceof Error ? error.message : FAILED, query, sourceUrl)
  }
}

async function trialSponsors(feeds: DemandSignalFeeds | undefined, retrievedOn: string): Promise<Reading> {
  const label = 'ClinicalTrials.gov industry sponsors'
  if (!feeds?.clinicalTrials) return unavailable('clinicaltrials-sponsors', label, retrievedOn, NOT_CLINICAL)
  const query = feeds.clinicalTrials.cond ?? feeds.clinicalTrials.term ?? ''
  const counts = new Map<string, number>()
  let token: string | undefined
  let pages = 0
  try {
    for (;;) {
      const params = trialParams(feeds)
      if (!params) return unavailable('clinicaltrials-sponsors', label, retrievedOn, NOT_CLINICAL)
      params.set('filter.advanced', 'AREA[LeadSponsorClass]INDUSTRY')
      params.set('pageSize', '1000')
      params.set('countTotal', 'true')
      params.set('fields', 'NCTId,LeadSponsorName,LeadSponsorClass,CollaboratorName,CollaboratorClass')
      if (token) params.set('pageToken', token)
      const sourceUrl = `https://clinicaltrials.gov/api/v2/studies?${params.toString()}`
      const res = await fetch(sourceUrl, { headers: { accept: 'application/json', 'user-agent': UA }, signal: AbortSignal.timeout(40_000) })
      if (!res.ok) return unavailable('clinicaltrials-sponsors', label, retrievedOn, `ClinicalTrials.gov returned HTTP ${res.status}.`, query)
      const json = (await res.json()) as {
        studies?: { protocolSection?: { sponsorCollaboratorsModule?: { leadSponsor?: { name?: string; class?: string }; collaborators?: { name?: string; class?: string }[] } } }[]
        nextPageToken?: string
      }
      for (const study of json.studies ?? []) {
        const mod = study.protocolSection?.sponsorCollaboratorsModule
        const lead = mod?.leadSponsor
        if (lead?.class === 'INDUSTRY' && lead.name) counts.set(lead.name, (counts.get(lead.name) ?? 0) + 1)
        for (const collaborator of mod?.collaborators ?? []) {
          if (collaborator.class === 'INDUSTRY' && collaborator.name) {
            counts.set(collaborator.name, (counts.get(collaborator.name) ?? 0) + 1)
          }
        }
      }
      pages += 1
      if (!json.nextPageToken) break
      if (pages >= 40) {
        return unavailable('clinicaltrials-sponsors', label, retrievedOn, 'Sponsor list exceeded 40 pages. The distinct count was not taken from a partial set.', query)
      }
      token = json.nextPageToken
      await sleep(200)
    }
  } catch (error) {
    return unavailable('clinicaltrials-sponsors', label, retrievedOn, error instanceof Error ? error.message : FAILED, query)
  }
  const names = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([name, count]) => {
      const params = trialParams(feeds)
      params?.set('query.spons', name)
      params?.set('countTotal', 'true')
      params?.set('pageSize', '1')
      return { name, count, url: `https://clinicaltrials.gov/api/v2/studies?${params?.toString() ?? ''}` }
    })
  const listUrl = trialParams(feeds)
  listUrl?.set('filter.advanced', 'AREA[LeadSponsorClass]INDUSTRY')
  listUrl?.set('countTotal', 'true')
  listUrl?.set('pageSize', '1')
  return {
    feed: 'clinicaltrials-sponsors',
    status: 'ok',
    label,
    value: counts.size,
    unit: 'industry sponsors',
    query,
    sourceUrl: `https://clinicaltrials.gov/api/v2/studies?${listUrl?.toString() ?? ''}`,
    retrievedOn,
    reason: null,
    names,
  }
}

async function openAlexCompanies(search: string, fromDate: string, retrievedOn: string): Promise<Reading> {
  const label = 'OpenAlex company affiliations'
  const filter = `title_and_abstract.search:${search},from_publication_date:${fromDate},authorships.institutions.type:company`
  const sourceUrl = `https://api.openalex.org/works?filter=${encodeURIComponent(filter)}&group_by=authorships.institutions.id&per_page=200&mailto=${encodeURIComponent('adamtpang@gmail.com')}`
  try {
    const res = await fetch(sourceUrl, { headers: { accept: 'application/json', 'user-agent': UA }, signal: AbortSignal.timeout(30_000) })
    if (!res.ok) return unavailable('openalex-companies', label, retrievedOn, `OpenAlex returned HTTP ${res.status}.`, search, sourceUrl)
    const json = (await res.json()) as { group_by?: { key?: string; key_display_name?: string; count?: number }[] }
    const groups = json.group_by ?? []
    const names = groups
      .filter((group) => group.key && group.key_display_name && typeof group.count === 'number')
      .slice(0, 12)
      .map((group) => ({ name: group.key_display_name as string, url: group.key as string, count: group.count as number }))
    const capped = groups.length >= 200
    if (capped) {
      return {
        feed: 'openalex-companies',
        status: 'unavailable',
        label,
        value: null,
        unit: 'companies',
        query: search,
        sourceUrl,
        retrievedOn,
        reason: 'OpenAlex group_by returns at most 200 institutions. The distinct company count is higher and was not invented. The named list is the top of that capped response.',
        names,
        capped: true,
      }
    }
    return { feed: 'openalex-companies', status: 'ok', label, value: groups.length, unit: 'companies', query: search, sourceUrl, retrievedOn, reason: null, names }
  } catch (error) {
    return unavailable('openalex-companies', label, retrievedOn, error instanceof Error ? error.message : FAILED, search, sourceUrl)
  }
}

async function readingsFor(feeds: DemandSignalFeeds | undefined, retrievedOn: string): Promise<Reading[]> {
  const fromDate = monthsAgo(retrievedOn, 12)
  const fiscalYear = latestCompleteFiscalYear(new Date(`${retrievedOn}T00:00:00Z`))
  const burden = await burdenReading(feeds, retrievedOn)
  const openalex = await countReading('openalex', 'OpenAlex works, last 12 months', feeds?.openAlexSearch, retrievedOn, async (query) => {
    const result = await fetchOpenAlexCount(query, { fromDate, revalidateSeconds: 0 })
    if (!result) return null
    return { value: result.workCount, unit: 'works', sourceUrl: result.url }
  })
  const nih = feeds?.nihSearch
    ? await nihFunding(feeds.nihSearch, fiscalYear, retrievedOn)
    : unavailable('nih', 'NIH RePORTER funding', retrievedOn, NO_QUERY)
  const companies = feeds?.openAlexSearch
    ? await openAlexCompanies(feeds.openAlexSearch, fromDate, retrievedOn)
    : unavailable('openalex-companies', 'OpenAlex company affiliations', retrievedOn, NO_QUERY)
  const trials = await trialCount(feeds, retrievedOn)
  const sponsors = await trialSponsors(feeds, retrievedOn)
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
  return [burden, openalex, nih, companies, trials, sponsors, federal, usa, edgar, fda, wiki]
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
