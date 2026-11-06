/**
 * Capture the demand and trend feeds public pages render.
 * Windows are frozen to 2026-11-06 so a later run is a new snapshot, not a silent rewrite.
 * A failed call is status unavailable. It is not stored as zero.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { demandSignalRegistry } from '../src/data/demand-signals.ts'
import { watchedTerms } from '../src/data/watched-terms.ts'
import { fetchOpenAlexCount } from '../src/lib/sources/openalex.ts'
import { fetchWikipediaPageviews } from '../src/lib/sources/wikipedia.ts'
import { fetchFormDCount } from '../src/lib/sources/edgar.ts'
import { fetchFederalRegisterCount } from '../src/lib/sources/federal-register.ts'
import { fetchUsaSpendingAwards } from '../src/lib/sources/usaspending.ts'
import { fetchNihProjectCount } from '../src/lib/sources/nih.ts'
import { fetchFdaShortages } from '../src/lib/sources/openfda.ts'
import { fetchHackerNewsTrend } from '../src/lib/sources/hackernews.ts'
import { fetchGithubTrend } from '../src/lib/sources/github.ts'

const AS_OF = '2026-11-06'
const FILE = 'src/data/snapshots/rendered-2026-11-06.json'

function stamp() {
  const now = new Date()
  const utc = now.toISOString()
  const ct = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(now).replace(', ', 'T')
  return { retrievedAtUtc: utc, retrievedAtCt: `${ct}-06:00` }
}

type Row = {
  problem?: string
  term?: string
  provider: string
  status: 'ok' | 'unavailable'
  retrievedAtUtc: string
  retrievedAtCt: string
  unit: string
  value: number | null
  detail: unknown
  reason?: string
}

function row(partial: Omit<Row, 'retrievedAtUtc' | 'retrievedAtCt'> & { ok: boolean }): Row {
  const time = stamp()
  return {
    problem: partial.problem,
    term: partial.term,
    provider: partial.provider,
    status: partial.ok ? 'ok' : 'unavailable',
    ...time,
    unit: partial.unit,
    value: partial.ok ? partial.value : null,
    detail: partial.ok ? partial.detail : null,
    reason: partial.ok ? undefined : partial.reason,
  }
}

const demandFeeds: Row[] = []

for (const [problem, feeds] of Object.entries(demandSignalRegistry)) {
  if (feeds.openAlexSearch) {
    const got = await fetchOpenAlexCount(feeds.openAlexSearch, { fromDate: '2024-01-01' })
    demandFeeds.push(row({
      problem, provider: 'openalex', ok: !!got, unit: 'papers',
      value: got?.workCount ?? null, detail: got, reason: got ? undefined : 'OpenAlex returned no count',
    }))
    console.log('openalex', problem, got?.workCount ?? 'unavailable')
  }
  if (feeds.wikipediaArticle) {
    const got = await fetchWikipediaPageviews(feeds.wikipediaArticle, { fromDate: '2025-01-01', toDate: AS_OF })
    demandFeeds.push(row({
      problem, provider: 'wikipedia', ok: !!got, unit: 'monthly readers',
      value: got?.monthlyAverage ?? null, detail: got, reason: got ? undefined : 'Wikipedia pageviews unavailable',
    }))
    console.log('wiki', problem, got?.monthlyAverage ?? 'unavailable')
  }
  if (feeds.edgar) {
    const got = await fetchFormDCount(feeds.edgar.q, { kind: feeds.edgar.kind, fromDate: '2025-01-01', toDate: AS_OF })
    demandFeeds.push(row({
      problem, provider: 'edgar', ok: !!got, unit: 'Form D filings',
      value: got?.filingCount ?? null, detail: got, reason: got ? undefined : 'EDGAR returned no count',
    }))
    console.log('edgar', problem, got?.filingCount ?? 'unavailable')
  }
  if (feeds.federalRegisterTerm) {
    const got = await fetchFederalRegisterCount(feeds.federalRegisterTerm, { fromDate: '2025-01-01' })
    demandFeeds.push(row({
      problem, provider: 'federal-register', ok: !!got, unit: 'federal documents',
      value: got?.documentCount ?? null, detail: got, reason: got ? undefined : 'Federal Register returned no count',
    }))
    console.log('fr', problem, got?.documentCount ?? 'unavailable')
  }
  if (feeds.usaSpendingTerm) {
    const got = await fetchUsaSpendingAwards(feeds.usaSpendingTerm, { fromDate: '2025-01-01', toDate: AS_OF })
    demandFeeds.push(row({
      problem, provider: 'usaspending', ok: !!got, unit: 'federal awards',
      value: got?.awardCount ?? null, detail: got, reason: got ? undefined : 'USAspending returned no count',
    }))
    console.log('usa', problem, got?.awardCount ?? 'unavailable')
  }
  if (feeds.nihSearch) {
    const got = await fetchNihProjectCount(feeds.nihSearch, { fiscalYear: 2026 })
    demandFeeds.push(row({
      problem, provider: 'nih', ok: !!got, unit: 'funded projects',
      value: got?.projectCount ?? null, detail: got, reason: got ? undefined : 'NIH RePORTER returned no count',
    }))
    console.log('nih', problem, got?.projectCount ?? 'unavailable')
  }
  if (feeds.fdaCategory) {
    const got = await fetchFdaShortages({ category: feeds.fdaCategory })
    demandFeeds.push(row({
      problem, provider: 'openfda', ok: !!got, unit: 'drugs in shortage',
      value: got?.currentCount ?? null, detail: got, reason: got ? undefined : 'openFDA returned no count',
    }))
    console.log('fda', problem, got?.currentCount ?? 'unavailable')
  }
}

const trends: Row[] = []
for (const term of watchedTerms) {
  const observations = []
  const missing: string[] = []
  const hn = await fetchHackerNewsTrend(term.term)
  if (hn) observations.push(hn)
  else missing.push('hackernews')
  const gh = await fetchGithubTrend(term.term)
  if (gh) observations.push(gh)
  else missing.push('github')
  const wiki = await fetchWikipediaPageviews(term.term.replace(/\s+/g, '_'), { fromDate: '2025-01-01', toDate: AS_OF })
  if (wiki && wiki.months >= 2) {
    const baseline = wiki.monthlyAverage
    const latest = Math.max(0, wiki.totalViews - baseline * (wiki.months - 1))
    observations.push({
      source: 'wikipedia',
      term: term.term,
      current: Math.round(latest),
      prior: Math.round(baseline),
      windowDays: 30,
      evidence: [{ title: `Wikipedia: ${term.term}`, url: wiki.url, engagement: wiki.monthlyAverage }],
      url: wiki.url,
      fromDate: wiki.fromDate,
      toDate: AS_OF,
      months: wiki.months,
      totalViews: wiki.totalViews,
    })
  } else missing.push('wikipedia')
  const time = stamp()
  trends.push({
    term: term.term,
    provider: 'trend-board',
    status: observations.length > 0 ? 'ok' : 'unavailable',
    ...time,
    unit: 'source observations',
    value: observations.length,
    detail: { category: term.category, problemSlug: term.problemSlug ?? null, observations, unavailableSources: missing },
    reason: observations.length > 0 ? undefined : 'No source returned an observation',
  })
  console.log('trend', term.term, observations.map((o) => o.source).join('+') || 'unavailable', missing.join(',') || '-')
}

const existing = JSON.parse(readFileSync(FILE, 'utf8'))
existing.timekeeping = {
  retrievedAtMeans: 'UTC instant, suffix Z',
  displayTimezone: 'America/Chicago (CST, UTC-6, on 2026-11-06)',
  note: 'OWID, WHO, and the first World Bank rows were captured 2026-11-06 16:59 CT. Extra World Bank rows were captured 2026-11-06 17:11 CT. Demand and trend rows carry retrievedAtCt. None of these instants are after the capture.',
}
existing.demandFeeds = demandFeeds
existing.trends = trends
writeFileSync(FILE, JSON.stringify(existing))
console.log('demand', demandFeeds.length, 'trends', trends.length, 'unavailable', [...demandFeeds, ...trends].filter((r) => r.status !== 'ok').length)
