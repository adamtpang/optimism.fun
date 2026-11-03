import { openAlexContact } from '@/lib/sources/openalex'
import {
  abstractFromInvertedIndex,
  arxivIdFromUrl,
  cleanDoi,
  doiFromExcerpt,
  doiFromText,
  doiFromUrl,
  normalizeTitle,
  plainAbstract,
  pmcidFromUrl,
  pmidFromUrl,
  sciencedirectPii,
} from '@/lib/research/papers'
import type { PaperMeta, SourceFields } from '@/lib/research/shape'

export const METADATA_TIMEOUT_MS = 2_500

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

function contact(): string {
  return openAlexContact()
}

function userAgent(): string {
  return `optimism.fun research (mailto:${contact()})`
}

async function getJson(fetchImpl: FetchLike, url: string, timeoutMs: number): Promise<unknown | null> {
  try {
    const res = await fetchImpl(url, {
      headers: {
        accept: 'application/json',
        'user-agent': userAgent(),
      },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function digits(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(Math.trunc(value))
  if (typeof value !== 'string') return null
  const match = value.match(/(\d{4,})/)
  return match ? match[1] : null
}

export function readOpenAlex(payload: unknown): PaperMeta {
  const row = asRecord(payload)
  if (!row || row.error) return {}
  const authorships = Array.isArray(row.authorships) ? row.authorships : []
  const authors = authorships
    .map((item) => {
      const author = asRecord(asRecord(item)?.author)
      return typeof author?.display_name === 'string' ? author.display_name : null
    })
    .filter((name): name is string => Boolean(name))
  const source = asRecord(asRecord(row.primary_location)?.source)
  const ids = asRecord(row.ids)
  const year = typeof row.publication_year === 'number' ? String(row.publication_year) : null
  const count = typeof row.cited_by_count === 'number' && Number.isFinite(row.cited_by_count) ? row.cited_by_count : null
  const openAlexType = typeof row.type === 'string' ? row.type : null
  return {
    doi: doiFromText(typeof row.doi === 'string' ? row.doi : null),
    pmid: digits(ids?.pmid),
    authors: authors.length ? authors : null,
    year,
    venue: typeof source?.display_name === 'string' ? source.display_name : null,
    title: typeof row.display_name === 'string' ? row.display_name : null,
    retracted: typeof row.is_retracted === 'boolean' ? row.is_retracted : null,
    citationCount: count,
    abstract: abstractFromInvertedIndex(row.abstract_inverted_index),
    openAlexType,
    journal: openAlexType === 'article' || openAlexType === 'review',
    recordOk: true,
  }
}

function scanUpdateRows(rows: unknown[], flags: { retracted: boolean; corrected: boolean; concern: boolean }) {
  for (const row of rows) {
    const type = String(asRecord(row)?.type ?? '').toLowerCase()
    if (type.includes('retract')) flags.retracted = true
    if (type.includes('concern')) flags.concern = true
    if (type.includes('correct') || type.includes('erratum')) flags.corrected = true
  }
}

function crossrefFlags(message: Record<string, unknown>): {
  retracted: boolean | null
  corrected: boolean | null
  concern: boolean | null
} {
  const flags = { retracted: false, corrected: false, concern: false }
  for (const key of ['update-to', 'updated-by']) {
    const rows = message[key]
    if (Array.isArray(rows)) scanUpdateRows(rows, flags)
  }
  const relation = asRecord(message.relation)
  if (relation) {
    for (const key of Object.keys(relation)) {
      const name = key.toLowerCase()
      if (name.includes('retract')) flags.retracted = true
      if (name.includes('concern')) flags.concern = true
      if (name.includes('correct') || name.includes('erratum')) flags.corrected = true
    }
  }
  return {
    retracted: flags.retracted ? true : null,
    corrected: flags.corrected ? true : null,
    concern: flags.concern ? true : null,
  }
}

function articleTypeOf(message: Record<string, unknown>): string | null {
  const assertions = Array.isArray(message.assertion) ? message.assertion : []
  for (const row of assertions) {
    const assertion = asRecord(row)
    const name = String(assertion?.name ?? '').toLowerCase()
    if (name.includes('article') && typeof assertion?.value === 'string') return assertion.value
  }
  return null
}

export function readCrossref(payload: unknown): PaperMeta {
  const message = asRecord(asRecord(payload)?.message)
  if (!message) return {}
  const authors = (Array.isArray(message.author) ? message.author : [])
    .map((row) => {
      const author = asRecord(row)
      if (!author) return null
      const given = typeof author.given === 'string' ? author.given : ''
      const family = typeof author.family === 'string' ? author.family : ''
      const name = `${given} ${family}`.trim()
      return name || null
    })
    .filter((name): name is string => Boolean(name))
  const issued = asRecord(message.issued)
  const parts = Array.isArray(issued?.['date-parts']) ? issued['date-parts'] : []
  const yearPart = Array.isArray(parts[0]) ? parts[0][0] : null
  const containers = Array.isArray(message['container-title']) ? message['container-title'] : []
  const titles = Array.isArray(message.title) ? message.title : []
  const flags = crossrefFlags(message)
  const crossrefType = typeof message.type === 'string' ? message.type : null
  return {
    doi: doiFromText(typeof message.DOI === 'string' ? message.DOI : null),
    authors: authors.length ? authors : null,
    year: typeof yearPart === 'number' ? String(yearPart) : null,
    venue: typeof containers[0] === 'string' ? containers[0] : null,
    title: typeof titles[0] === 'string' ? titles[0] : null,
    retracted: flags.retracted,
    corrected: flags.corrected,
    concern: flags.concern,
    crossrefType,
    articleType: articleTypeOf(message),
    journal: crossrefType === 'journal-article',
    abstract: plainAbstract(message.abstract),
    recordOk: true,
  }
}

export function readSemanticScholar(payload: unknown): PaperMeta {
  const row = asRecord(payload)
  if (!row || row.error) return {}
  const authors = (Array.isArray(row.authors) ? row.authors : [])
    .map((item) => {
      const name = asRecord(item)?.name
      return typeof name === 'string' ? name : null
    })
    .filter((name): name is string => Boolean(name))
  const ids = asRecord(row.externalIds)
  const venueObj = asRecord(row.publicationVenue)
  const venue =
    (typeof venueObj?.name === 'string' && venueObj.name) ||
    (typeof row.venue === 'string' && row.venue) ||
    null
  return {
    doi: doiFromText(typeof ids?.DOI === 'string' ? ids.DOI : null),
    pmid: digits(ids?.PubMed),
    authors: authors.length ? authors : null,
    year: typeof row.year === 'number' ? String(row.year) : null,
    venue,
  }
}

function first<T>(...values: (T | null | undefined)[]): T | null {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== '') return value
  }
  return null
}

export function mergePaperMeta(openAlex: PaperMeta, crossref: PaperMeta, scholar: PaperMeta): PaperMeta {
  const retracted =
    openAlex.retracted === true || crossref.retracted === true
      ? true
      : openAlex.retracted === false || crossref.recordOk === true
        ? false
        : null
  const checks = [openAlex.recordOk, crossref.recordOk].filter((value) => value !== undefined)
  const retractionChecked = checks.length === 0 ? null : checks.some((value) => value === true)
  return {
    doi: first(openAlex.doi, crossref.doi, scholar.doi),
    pmid: first(openAlex.pmid, scholar.pmid),
    authors: openAlex.authors ?? scholar.authors ?? crossref.authors ?? null,
    year: first(crossref.year, openAlex.year, scholar.year),
    venue: first(crossref.venue, openAlex.venue, scholar.venue),
    title: first(crossref.title, openAlex.title),
    retracted,
    corrected: crossref.corrected === true ? true : null,
    concern: crossref.concern === true ? true : null,
    citationCount: typeof openAlex.citationCount === 'number' ? openAlex.citationCount : null,
    abstract: first(crossref.abstract, openAlex.abstract),
    crossrefType: crossref.crossrefType ?? null,
    openAlexType: openAlex.openAlexType ?? null,
    articleType: crossref.articleType ?? null,
    journal: openAlex.journal === true || crossref.journal === true ? true : null,
    retractionChecked,
    recordOk: retractionChecked === true,
  }
}

function localIds(fields: SourceFields): {
  doi: string | null
  pmid: string | null
  pmcid: string | null
  arxiv: string | null
  pii: string | null
} {
  const excerpt = [fields.text, fields.summary, ...(fields.highlights ?? [])].filter(Boolean).join('\n')
  return {
    doi: cleanDoi(fields.doi) || doiFromUrl(fields.url) || doiFromExcerpt(excerpt),
    pmid: fields.pmid?.trim() || pmidFromUrl(fields.url),
    pmcid: pmcidFromUrl(fields.url),
    arxiv: arxivIdFromUrl(fields.url),
    pii: sciencedirectPii(fields.url),
  }
}

export function readNcbiIdconv(payload: unknown): { doi: string | null; pmid: string | null } {
  const records = asRecord(payload)?.records
  if (!Array.isArray(records)) return { doi: null, pmid: null }
  for (const row of records) {
    const record = asRecord(row)
    const doi = cleanDoi(typeof record?.doi === 'string' ? record.doi : null)
    const pmid = typeof record?.pmid === 'number' || typeof record?.pmid === 'string' ? String(record.pmid) : null
    if (doi || pmid) return { doi, pmid: pmid && /^\d+$/.test(pmid) ? pmid : null }
  }
  return { doi: null, pmid: null }
}

function titleFromWorkList(payload: unknown, wanted: string): string | null {
  const record = asRecord(payload)
  const rows = Array.isArray(record?.results)
    ? record.results
    : Array.isArray(asRecord(record?.message)?.items)
      ? (asRecord(record?.message)?.items as unknown[])
      : []
  for (const row of rows) {
    const item = asRecord(row)
    if (!item) continue
    const title = Array.isArray(item.title)
      ? item.title.find((part) => typeof part === 'string')
      : item.display_name
    if (typeof title === 'string' && normalizeTitle(title) === normalizeTitle(wanted)) {
      return cleanDoi(typeof item.doi === 'string' ? item.doi : typeof item.DOI === 'string' ? item.DOI : null)
    }
  }
  return null
}

async function lookupDoi(
  fields: SourceFields,
  ids: ReturnType<typeof localIds>,
  fetchImpl: FetchLike,
  timeoutMs: number,
  mailto: string,
): Promise<{ doi: string | null; pmid: string | null }> {
  let doi = ids.doi
  let pmid = ids.pmid
  if (!doi && ids.pii) {
    const payload = await getJson(
      fetchImpl,
      `https://api.crossref.org/works?filter=alternative-id:${encodeURIComponent(ids.pii)}&rows=1&mailto=${mailto}`,
      timeoutMs,
    )
    const item = asRecord((asRecord(asRecord(payload)?.message)?.items as unknown[] | undefined)?.[0])
    doi = cleanDoi(typeof item?.DOI === 'string' ? item.DOI : null) || doi
  }
  if (!doi && (ids.pmcid || pmid)) {
    const id = ids.pmcid || pmid
    const payload = await getJson(
      fetchImpl,
      `https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=${encodeURIComponent(id || '')}&format=json&tool=optimismfun&email=${mailto}`,
      timeoutMs,
    )
    const converted = readNcbiIdconv(payload)
    doi = converted.doi || doi
    pmid = pmid || converted.pmid
  }
  if (!doi && !pmid && !ids.arxiv && fields.title && fields.title.trim().length >= 24) {
    const query = encodeURIComponent(fields.title)
    const [openAlex, crossref] = await Promise.all([
      getJson(fetchImpl, `https://api.openalex.org/works?search=${query}&per-page=3&mailto=${mailto}`, timeoutMs),
      getJson(
        fetchImpl,
        `https://api.crossref.org/works?query.bibliographic=${query}&rows=3&mailto=${mailto}`,
        timeoutMs,
      ),
    ])
    doi = titleFromWorkList(openAlex, fields.title) || titleFromWorkList(crossref, fields.title)
  }
  return { doi, pmid }
}

export async function resolvePaperMetadata(
  fields: SourceFields,
  opts: { fetchImpl?: FetchLike; timeoutMs?: number } = {},
): Promise<PaperMeta> {
  const ids = localIds(fields)
  const fetchImpl = opts.fetchImpl ?? fetch
  const timeoutMs = opts.timeoutMs ?? METADATA_TIMEOUT_MS
  const mailto = encodeURIComponent(contact())
  const found = await lookupDoi(fields, ids, fetchImpl, timeoutMs, mailto)
  const doi = found.doi
  const pmid = found.pmid
  const arxiv = ids.arxiv
  if (!doi && !pmid && !arxiv) return {}

  const openAlexUrl = doi
    ? `https://api.openalex.org/works/doi:${encodeURIComponent(doi)}?mailto=${mailto}`
    : pmid
      ? `https://api.openalex.org/works/pmid:${pmid}?mailto=${mailto}`
      : `https://api.openalex.org/works/https://arxiv.org/abs/${arxiv}?mailto=${mailto}`
  const crossrefUrl = doi ? `https://api.crossref.org/works/${encodeURIComponent(doi)}?mailto=${mailto}` : null
  const scholarId = doi ? `DOI:${doi}` : pmid ? `PMID:${pmid}` : `ARXIV:${arxiv}`
  const scholarUrl =
    `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(scholarId)}` +
    '?fields=title,year,authors,externalIds,venue,publicationVenue'

  const [openAlexPayload, crossrefPayload, scholarPayload] = await Promise.all([
    getJson(fetchImpl, openAlexUrl, timeoutMs),
    crossrefUrl ? getJson(fetchImpl, crossrefUrl, timeoutMs) : Promise.resolve(null),
    getJson(fetchImpl, scholarUrl, timeoutMs),
  ])
  const openAlex = openAlexPayload ? readOpenAlex(openAlexPayload) : { recordOk: false }
  const crossref = crossrefUrl ? (crossrefPayload ? readCrossref(crossrefPayload) : { recordOk: false }) : {}
  const scholar = scholarPayload ? readSemanticScholar(scholarPayload) : {}
  const merged = mergePaperMeta(openAlex, crossref, scholar)
  return {
    ...merged,
    doi: merged.doi || doi,
    pmid: merged.pmid || pmid,
  }
}
