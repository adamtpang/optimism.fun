import { isCoverageUrl, isExcludedUrl } from '@/lib/research/domains'
import {
  arxivIdFromUrl,
  citationLink,
  doiFromText,
  formatAuthors,
  formatCitationCount,
  normalizeUrl,
  paperStatus,
  parseAuthorField,
  pmidFromUrl,
  rankByPriority,
  retrievedExcerpt,
  statusLabel,
  workKey,
  yearFromDate,
  type PaperStatus,
} from '@/lib/research/papers'

export type CitationBlock = 'ok' | 'excluded' | 'coverage' | 'no-content' | 'retracted'

export function allowCitation(input: {
  url: string
  text?: string | null
  summary?: string | null
  highlights?: string[] | null
  retracted?: boolean | null
}): CitationBlock {
  if (isExcludedUrl(input.url)) return 'excluded'
  if (isCoverageUrl(input.url)) return 'coverage'
  if (input.retracted === true) return 'retracted'
  if (!retrievedExcerpt(input)) return 'no-content'
  return 'ok'
}

export type SourceFields = {
  url: string
  title?: string | null
  author?: string | null
  publishedDate?: string | null
  text?: string | null
  highlights?: string[] | null
  summary?: string | null
  doi?: string | null
  pmid?: string | null
}

export type PaperMeta = {
  doi?: string | null
  pmid?: string | null
  authors?: string[] | null
  year?: string | null
  venue?: string | null
  retracted?: boolean | null
  corrected?: boolean | null
  /** Set only when OpenAlex returned a count. */
  citationCount?: number | null
}

export type ResearchPaper = {
  n: number | null
  title: string
  authors: string
  year: string | null
  venue: string | null
  href: string | null
  hrefLabel: string | null
  doi: string | null
  status: PaperStatus
  statusLabel: string
  citationCount: string | null
  excerpt: string | null
  excerptKind: 'summary' | 'highlights' | 'text' | null
  sourceUrl: string
}

export type CitedSentence = { text: string; cites: number[] }
export type UncitedSentence = {
  text: string
  reason: 'no-source' | 'dropped-citation' | 'retracted-only'
}
export type CoverageLink = { title: string; url: string; label: 'Coverage' }

export type ShapedResearch = {
  sentences: CitedSentence[]
  uncited: UncitedSentence[]
  citations: ResearchPaper[]
  retrieved: ResearchPaper[]
  coverage: CoverageLink[]
  retracted: ResearchPaper[]
}

type Work = {
  key: string
  fields: SourceFields
  meta: PaperMeta
  excerpt: { text: string; kind: 'summary' | 'highlights' | 'text' }
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function asStringList(value: unknown): string[] {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : []
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
}

export function readSource(value: unknown): SourceFields | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const url = asString(row.url)
  if (!url) return null
  return {
    url,
    title: asString(row.title),
    author: asString(row.author),
    publishedDate: asString(row.publishedDate),
    text: asString(row.text),
    highlights: asStringList(row.highlights),
    summary: asString(row.summary),
    doi: asString(row.doi),
    pmid: asString(row.pmid),
  }
}

function metaFor(fields: SourceFields, metaByKey: Record<string, PaperMeta>): PaperMeta {
  const key = workKey(fields)
  return metaByKey[key] ?? metaByKey[fields.url] ?? {}
}

function withMeta(fields: SourceFields, meta: PaperMeta): SourceFields {
  return {
    ...fields,
    doi: meta.doi ?? fields.doi ?? null,
    pmid: meta.pmid ?? fields.pmid ?? null,
  }
}

function toPaper(work: Work, n: number | null, asOf: Date): ResearchPaper {
  const fields = withMeta(work.fields, work.meta)
  const authors = formatAuthors(
    work.meta.authors && work.meta.authors.length > 0
      ? work.meta.authors
      : parseAuthorField(fields.author),
  )
  const link = citationLink({ url: fields.url, doi: fields.doi, pmid: fields.pmid })
  const status = paperStatus({
    url: fields.url,
    retracted: work.meta.retracted,
    corrected: work.meta.corrected,
  })
  const year = work.meta.year ?? yearFromDate(fields.publishedDate)
  const count = work.meta.citationCount
  return {
    n,
    title: fields.title?.trim() || 'Title unavailable',
    authors,
    year,
    venue: work.meta.venue?.trim() || null,
    href: link.href,
    hrefLabel: link.label,
    doi: fields.doi?.trim().toLowerCase() || null,
    status,
    statusLabel: statusLabel(status),
    citationCount:
      typeof count === 'number' && Number.isFinite(count) ? formatCitationCount(count, asOf) : null,
    excerpt: work.excerpt.text,
    excerptKind: work.excerpt.kind,
    sourceUrl: fields.url,
  }
}

function addWork(
  works: Map<string, Work>,
  fields: SourceFields,
  metaByKey: Record<string, PaperMeta>,
): Work | null {
  const meta = metaFor(fields, metaByKey)
  const merged = withMeta(fields, meta)
  const decision = allowCitation({
    url: merged.url,
    text: merged.text,
    summary: merged.summary,
    highlights: merged.highlights,
    retracted: meta.retracted,
  })
  if (decision !== 'ok') return null
  const excerpt = retrievedExcerpt(merged)
  if (!excerpt) return null
  const key = workKey(merged)
  const existing = works.get(key)
  if (existing) {
    if (!existing.fields.title && merged.title) existing.fields.title = merged.title
    if (!existing.fields.author && merged.author) existing.fields.author = merged.author
    if (!existing.fields.publishedDate && merged.publishedDate) existing.fields.publishedDate = merged.publishedDate
    if (!existing.fields.text && merged.text) existing.fields.text = merged.text
    if (!existing.fields.summary && merged.summary) existing.fields.summary = merged.summary
    existing.meta = { ...existing.meta, ...meta }
    existing.excerpt = retrievedExcerpt(existing.fields) ?? existing.excerpt
    return existing
  }
  const work: Work = { key, fields: merged, meta, excerpt }
  works.set(key, work)
  return work
}

type RawSentence = { text: string; urls: string[]; markers: number[] }

function markerNumbers(text: string): number[] {
  const out: number[] = []
  for (const match of text.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g)) {
    for (const part of match[1].split(',')) {
      const n = Number(part.trim())
      if (Number.isInteger(n) && n > 0) out.push(n)
    }
  }
  return out
}

function splitProse(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((para) => para.split(/(?<=[.!?])\s+(?=[A-Z[])/))
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function structuredSentences(value: unknown): RawSentence[] | null {
  if (!value || typeof value !== 'object') return null
  const sentences = (value as { sentences?: unknown }).sentences
  if (!Array.isArray(sentences)) return null
  return sentences
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const text = asString((row as { text?: unknown }).text)
      if (!text) return null
      const urls = asStringList((row as { urls?: unknown }).urls)
      return { text, urls, markers: markerNumbers(text) }
    })
    .filter((row): row is RawSentence => Boolean(row))
}

function findWork(groups: Work[][], url: string): Work | null {
  const directKey = workKey({ url })
  const doi = doiFromText(url)
  const arxiv = arxivIdFromUrl(url)
  const pmid = pmidFromUrl(url)
  const normalized = normalizeUrl(url)
  for (const group of groups) {
    for (const work of group) {
      if (work.key === directKey) return work
      if (doi && work.key === `doi:${doi}`) return work
      if (arxiv && work.key === `arxiv:${arxiv}`) return work
      if (pmid && work.key === `pmid:${pmid}`) return work
      if (normalizeUrl(work.fields.url) === normalized) return work
      const workDoi = work.fields.doi?.toLowerCase() || doiFromText(work.fields.url)
      if (doi && workDoi === doi) return work
      if (arxiv && arxivIdFromUrl(work.fields.url) === arxiv) return work
      const workPmid = work.fields.pmid || pmidFromUrl(work.fields.url)
      if (pmid && workPmid === pmid) return work
    }
  }
  return null
}

function readAnswerSentences(
  answer: unknown,
  answerCitations: SourceFields[],
): RawSentence[] {
  if (typeof answer === 'string') {
    const trimmed = answer.trim()
    if (trimmed.startsWith('{')) {
      try {
        const parsed = structuredSentences(JSON.parse(trimmed))
        if (parsed) return parsed
      } catch {
        // Prose, parsed below.
      }
    }
    return splitProse(answer).map((text) => ({ text, urls: [], markers: markerNumbers(text) }))
  }
  const structured = structuredSentences(answer)
  if (structured) return structured
  if (answer && typeof answer === 'object' && typeof (answer as { answer?: unknown }).answer === 'string') {
    return readAnswerSentences((answer as { answer: string }).answer, answerCitations)
  }
  return []
}

function stripMarkers(text: string): string {
  return text
    .replace(/\[(\d+(?:\s*,\s*\d+)*)\]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .trim()
}

function classifySide(
  fields: SourceFields,
  meta: PaperMeta,
  coverage: CoverageLink[],
  retracted: Work[],
): void {
  const merged = withMeta(fields, meta)
  const decision = allowCitation({
    url: merged.url,
    text: merged.text,
    summary: merged.summary,
    highlights: merged.highlights,
    retracted: meta.retracted,
  })
  if (decision === 'coverage') {
    const href = merged.url
    if (!coverage.some((item) => item.url === href)) {
      coverage.push({
        title: merged.title?.trim() || href,
        url: href,
        label: 'Coverage',
      })
    }
    return
  }
  if (decision === 'retracted') {
    const excerpt = retrievedExcerpt(merged) ?? { text: '', kind: 'text' as const }
    const key = workKey(merged)
    if (!retracted.some((item) => item.key === key)) {
      retracted.push({ key, fields: merged, meta, excerpt })
    }
  }
}

export function shapeResearchAnswer(input: {
  retrieved: SourceFields[]
  answer?: unknown
  answerCitations?: SourceFields[]
  metaByKey?: Record<string, PaperMeta>
  now?: Date
}): ShapedResearch {
  const asOf = input.now ?? new Date()
  const metaByKey = input.metaByKey ?? {}
  const coverage: CoverageLink[] = []
  const retractedWorks: Work[] = []
  const works = new Map<string, Work>()

  const retrieved = rankByPriority(input.retrieved)
  for (const fields of retrieved) {
    const meta = metaFor(fields, metaByKey)
    classifySide(fields, meta, coverage, retractedWorks)
    addWork(works, fields, metaByKey)
  }

  const answerCitations = input.answerCitations ?? []
  for (const fields of answerCitations) {
    const meta = metaFor(fields, metaByKey)
    classifySide(fields, meta, coverage, retractedWorks)
    addWork(works, fields, metaByKey)
  }

  const citationList = answerCitations
  const sentencesIn = readAnswerSentences(input.answer, citationList)

  type Kept = { text: string; keys: string[]; reason: UncitedSentence['reason'] | null }
  const keptSentences: Kept[] = []

  for (const sentence of sentencesIn) {
    const citedWorks: Work[] = []
    const blocks: CitationBlock[] = []
    const urls = [...sentence.urls]
    for (const n of sentence.markers) {
      const cited = citationList[n - 1]
      if (cited) urls.push(cited.url)
      else blocks.push('no-content')
    }
    const pools = [[...works.values()], retractedWorks]
    for (const url of urls) {
      const work = findWork(pools, url)
      if (work && works.has(work.key) && allowCitation({ ...work.fields, retracted: work.meta.retracted }) === 'ok') {
        citedWorks.push(work)
        blocks.push('ok')
        continue
      }
      const meta = work?.meta ?? metaFor({ url }, metaByKey)
      const decision = allowCitation({
        url: work?.fields.url ?? url,
        text: work?.fields.text,
        summary: work?.fields.summary,
        highlights: work?.fields.highlights,
        retracted: meta.retracted === true,
      })
      blocks.push(decision === 'ok' ? 'no-content' : decision)
    }

    const unique = [...new Map(citedWorks.map((work) => [work.key, work])).values()]
    const plain = stripMarkers(sentence.text)
    if (!plain) continue
    if (unique.length > 0) {
      keptSentences.push({ text: plain, keys: unique.map((work) => work.key), reason: null })
      continue
    }
    const sawRetracted = blocks.includes('retracted')
    const onlyRetracted = sawRetracted && blocks.every((block) => block === 'retracted')
    const hadAttempt = sentence.urls.length > 0 || sentence.markers.length > 0
    keptSentences.push({
      text: plain,
      keys: [],
      reason: onlyRetracted ? 'retracted-only' : hadAttempt ? 'dropped-citation' : 'no-source',
    })
  }

  const order: string[] = []
  for (const sentence of keptSentences) {
    for (const key of sentence.keys) {
      if (!order.includes(key)) order.push(key)
    }
  }
  const numberOf = new Map(order.map((key, index) => [key, index + 1]))

  const citations = order
    .map((key) => works.get(key))
    .filter((work): work is Work => Boolean(work))
    .map((work) => toPaper(work, numberOf.get(work.key) ?? null, asOf))

  const sentences: CitedSentence[] = []
  const uncited: UncitedSentence[] = []
  for (const sentence of keptSentences) {
    if (sentence.reason || sentence.keys.length === 0) {
      uncited.push({ text: sentence.text, reason: sentence.reason ?? 'no-source' })
      continue
    }
    const cites = sentence.keys.map((key) => numberOf.get(key)).filter((n): n is number => Boolean(n))
    sentences.push({
      text: `${sentence.text} ${cites.map((n) => `[${n}]`).join('')}`,
      cites,
    })
  }

  const used = new Set(order)
  const retrievedPapers = [...works.values()]
    .filter((work) => !used.has(work.key))
    .map((work) => toPaper(work, null, asOf))

  return {
    sentences,
    uncited,
    citations,
    retrieved: retrievedPapers,
    coverage,
    retracted: retractedWorks.map((work) => toPaper(work, null, asOf)),
  }
}
