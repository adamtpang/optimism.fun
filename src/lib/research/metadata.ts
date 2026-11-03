import { openAlexContact } from '@/lib/sources/openalex'
import { arxivIdFromUrl, doiFromText, pmidFromUrl } from '@/lib/research/papers'
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
  return {
    doi: doiFromText(typeof row.doi === 'string' ? row.doi : null),
    pmid: digits(ids?.pmid),
    authors: authors.length ? authors : null,
    year,
    venue: typeof source?.display_name === 'string' ? source.display_name : null,
    retracted: typeof row.is_retracted === 'boolean' ? row.is_retracted : null,
    citationCount: count,
  }
}

function crossrefFlags(message: Record<string, unknown>): { retracted: boolean | null; corrected: boolean | null } {
  let retracted = false
  let corrected = false
  const updates = Array.isArray(message['update-to']) ? message['update-to'] : []
  for (const row of updates) {
    const type = String(asRecord(row)?.type ?? '').toLowerCase()
    if (type.includes('retract')) retracted = true
    if (type.includes('correct') || type.includes('erratum')) corrected = true
  }
  const relation = asRecord(message.relation)
  if (relation) {
    for (const key of Object.keys(relation)) {
      const name = key.toLowerCase()
      if (name.includes('retract')) retracted = true
      if (name.includes('correct') || name.includes('erratum')) corrected = true
    }
  }
  return {
    retracted: retracted ? true : null,
    corrected: corrected ? true : null,
  }
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
  const flags = crossrefFlags(message)
  return {
    doi: doiFromText(typeof message.DOI === 'string' ? message.DOI : null),
    authors: authors.length ? authors : null,
    year: typeof yearPart === 'number' ? String(yearPart) : null,
    venue: typeof containers[0] === 'string' ? containers[0] : null,
    retracted: flags.retracted,
    corrected: flags.corrected,
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
      : openAlex.retracted === false
        ? false
        : null
  return {
    doi: first(openAlex.doi, crossref.doi, scholar.doi),
    pmid: first(openAlex.pmid, scholar.pmid),
    authors: openAlex.authors ?? scholar.authors ?? crossref.authors ?? null,
    year: first(crossref.year, openAlex.year, scholar.year),
    venue: first(openAlex.venue, crossref.venue, scholar.venue),
    retracted,
    corrected: crossref.corrected === true ? true : null,
    citationCount: typeof openAlex.citationCount === 'number' ? openAlex.citationCount : null,
  }
}

function identifiers(fields: SourceFields): { doi: string | null; arxiv: string | null; pmid: string | null } {
  return {
    doi: fields.doi?.trim().toLowerCase() || doiFromText(fields.url),
    arxiv: arxivIdFromUrl(fields.url),
    pmid: fields.pmid?.trim() || pmidFromUrl(fields.url),
  }
}

export async function resolvePaperMetadata(
  fields: SourceFields,
  opts: { fetchImpl?: FetchLike; timeoutMs?: number } = {},
): Promise<PaperMeta> {
  const ids = identifiers(fields)
  if (!ids.doi && !ids.arxiv && !ids.pmid) return {}
  const fetchImpl = opts.fetchImpl ?? fetch
  const timeoutMs = opts.timeoutMs ?? METADATA_TIMEOUT_MS
  const mailto = encodeURIComponent(contact())
  const openAlexUrl = ids.doi
    ? `https://api.openalex.org/works/doi:${ids.doi}?mailto=${mailto}`
    : ids.pmid
      ? `https://api.openalex.org/works/pmid:${ids.pmid}?mailto=${mailto}`
      : `https://api.openalex.org/works/https://arxiv.org/abs/${ids.arxiv}?mailto=${mailto}`
  const crossrefUrl = ids.doi
    ? `https://api.crossref.org/works/${encodeURIComponent(ids.doi)}?mailto=${mailto}`
    : null
  const scholarId = ids.doi ? `DOI:${ids.doi}` : ids.pmid ? `PMID:${ids.pmid}` : `ARXIV:${ids.arxiv}`
  const scholarUrl =
    `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(scholarId)}` +
    '?fields=title,year,authors,externalIds,venue,publicationVenue'

  const [openAlex, crossref, scholar] = await Promise.all([
    getJson(fetchImpl, openAlexUrl, timeoutMs).then(readOpenAlex),
    crossrefUrl ? getJson(fetchImpl, crossrefUrl, timeoutMs).then(readCrossref) : Promise.resolve({}),
    getJson(fetchImpl, scholarUrl, timeoutMs).then(readSemanticScholar),
  ])
  return mergePaperMeta(openAlex, crossref, scholar)
}
