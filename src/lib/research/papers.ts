import {
  isNewsRecord,
  isPerspectiveRecord,
  isPreprintUrl,
  priorityBand,
  type PriorityBand,
} from '@/lib/research/domains'

export const QUESTION_MIN = 8
export const QUESTION_MAX = 1000
export const URL_MAX = 2048

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatAsOf(date: Date): string {
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
}

export function formatCitationCount(count: number, asOf: Date): string {
  const n = Math.round(count).toLocaleString('en-US')
  return `cited ${n} times (OpenAlex, ${formatAsOf(asOf)})`
}

export function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw)
    url.hash = ''
    url.search = ''
    url.protocol = 'https:'
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1)
    }
    return url.toString()
  } catch {
    return raw.trim().toLowerCase()
  }
}

const PREPRINT_DOI_PREFIXES = ['10.1101/', '10.48550/', '10.2139/', '10.21203/']

/** Pull a DOI and strip version and file suffixes that 404 on bioRxiv and medRxiv. */
export function cleanDoi(raw: string | null | undefined): string | null {
  if (!raw) return null
  const match = raw.match(/10\.\d{4,9}\/[^\s?#]+/i)
  if (!match) return null
  let doi = match[0].replace(/[).,;\]>]+$/g, '')
  doi = doi.replace(/\/(full|pdf|abstract|html|epdf|meta|abs)$/i, '')
  doi = doi.replace(/\.full\.pdf$/i, '')
  doi = doi.replace(/\.full$/i, '')
  doi = doi.replace(/\.pdf$/i, '')
  doi = doi.replace(/v\d+$/i, '')
  doi = doi.replace(/[).,;]+$/g, '')
  return doi || null
}

export function doiFromText(raw: string | null | undefined): string | null {
  return cleanDoi(raw)
}

export function isPreprintDoi(doi: string | null | undefined): boolean {
  if (!doi) return false
  const lower = doi.toLowerCase()
  return PREPRINT_DOI_PREFIXES.some((prefix) => lower.startsWith(prefix))
}

/** Header DOI only. A DOI deep in the reference list is not this paper. */
export function doiFromExcerpt(text: string | null | undefined): string | null {
  if (!text) return null
  const head = text.slice(0, 3000)
  const link = head.match(/https?:\/\/(?:dx\.)?doi\.org\/(10\.\d{4,9}\/[^\s?#]+)/i)
  if (link) return cleanDoi(link[1])
  const early = text.slice(0, 800)
  const label = early.match(/\bdoi:\s*(10\.\d{4,9}\/[^\s?#]+)/i)
  if (label) return cleanDoi(label[1])
  return null
}

export function pmcidFromUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  const match = raw.match(/\/articles\/(PMC\d+)/i)
  return match ? match[1].toUpperCase() : null
}

export function medscapePmid(raw: string | null | undefined): string | null {
  if (!raw) return null
  const match =
    raw.match(/medscape\.com\/(?:medline\/abstract|pubmed)\/(\d+)/i) ||
    raw.match(/[?&]pmid=(\d+)/i)
  return match ? match[1] : null
}

export function sciencedirectPii(raw: string | null | undefined): string | null {
  if (!raw) return null
  const match = raw.match(/sciencedirect\.com\/science\/article\/pii\/([A-Za-z0-9]+)/i)
  return match ? match[1] : null
}

/** DOI from the URL, including Lancet PII and Nature article ids. */
export function doiFromUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  const direct = cleanDoi(raw)
  if (direct) return direct
  try {
    const url = new URL(raw)
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    const path = decodeURIComponent(url.pathname)
    if (host === 'nature.com' || host.endsWith('.nature.com')) {
      const article = path.match(/\/articles\/([a-z0-9][a-z0-9.-]+)/i)
      if (article) return `10.1038/${article[1].replace(/\.+$/g, '')}`
    }
    if (host === 'thelancet.com' || host.endsWith('.thelancet.com')) {
      const pii = path.match(/\/article\/PII([^/]+)/i)
      if (pii) return `10.1016/${pii[1]}`
    }
  } catch {
    return null
  }
  return null
}

export function stripTrackingUrl(raw: string): string {
  try {
    const url = new URL(raw)
    for (const key of [...url.searchParams.keys()]) {
      const name = key.toLowerCase()
      if (name === 'code' || name === 'error' || name === 'fbclid' || name === 'gclid' || name.startsWith('utm_')) {
        url.searchParams.delete(key)
      }
    }
    return url.toString()
  } catch {
    return raw
  }
}

export function cleanTitle(title: string): string {
  let text = title.replace(/\s+/g, ' ').trim()
  text = text.replace(/^Frontiers\s*\|\s*/i, '')
  text = text.replace(/\s*\|\s*springermedizin\.de\s*$/i, '')
  text = text.replace(/\s+-\s+PubMed\s*$/i, '')
  text = text.replace(/\s+-\s+PMC\s*$/i, '')
  return text.trim()
}

export function normalizeTitle(title: string): string {
  const cleaned = cleanTitle(title)
  const parts = cleaned.split(/\s+\|\s+/)
  const core = parts[0] && parts[0].length >= 40 ? parts[0] : cleaned
  return core
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function plainExcerpt(text: string): string {
  return text.replace(/\u2014/g, '-')
}

/** Rebuild an OpenAlex abstract from its inverted index. */
export function abstractFromInvertedIndex(index: unknown): string | null {
  if (!index || typeof index !== 'object') return null
  const placed: { at: number; word: string }[] = []
  for (const [word, positions] of Object.entries(index as Record<string, unknown>)) {
    if (!Array.isArray(positions)) continue
    for (const position of positions) {
      if (typeof position === 'number') placed.push({ at: position, word })
    }
  }
  if (placed.length === 0) return null
  placed.sort((a, b) => a.at - b.at)
  return placed.map((item) => item.word).join(' ')
}

export function plainAbstract(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text || null
}

function figureBody(raw: string): { body: string; percent: boolean; sample: boolean } {
  const percent = /%|percent/i.test(raw)
  const sample = /^\s*n\s*=/i.test(raw)
  let body = raw.toLowerCase().replace(/,/g, '').replace(/\s+/g, '')
  body = body.replace(/^n=/, '').replace(/%$/, '').replace(/percent$/, '')
  if (body.endsWith('.0')) body = body.slice(0, -2)
  return { body, percent, sample }
}

/** Numbers, percents, and n= values stated in a sentence. */
export function quotedFigures(sentence: string): string[] {
  const patterns = [
    /\bn\s*=\s*\d{1,3}(?:,\d{3})+(?:\.\d+)?/gi,
    /\bn\s*=\s*\d+(?:\.\d+)?/gi,
    /\b\d{1,3}(?:,\d{3})+(?:\.\d+)?%/g,
    /\b\d+(?:\.\d+)?%/g,
    /\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g,
    /\b\d+(?:\.\d+)?\b/g,
  ]
  const spans: { start: number; end: number; text: string }[] = []
  for (const pattern of patterns) {
    for (const match of sentence.matchAll(pattern)) {
      if (match.index == null) continue
      spans.push({ start: match.index, end: match.index + match[0].length, text: match[0] })
    }
  }
  const kept = spans.filter(
    (span) =>
      !spans.some(
        (other) =>
          other !== span &&
          other.start <= span.start &&
          other.end >= span.end &&
          other.end - other.start > span.end - span.start,
      ),
  )
  return [...new Set(kept.map((span) => span.text))]
}

export function figureAppears(figure: string, text: string): boolean {
  const wanted = figureBody(figure)
  if (!wanted.body) return true
  const hay = text.replace(/,/g, '')
  const token = wanted.body.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const number = new RegExp(`(?:^|[^\\d.])${token}(?:\\.0+)?(?=$|[^\\d])`, 'i')
  if (!number.test(hay)) return false
  if (!wanted.percent) return true
  return new RegExp(`${token}(?:\\.0+)?\\s*(?:%|percent)`, 'i').test(hay)
}

export function citesRctWithoutSupport(sentence: string, support: string): boolean {
  const callsRct = /\brcts?\b|\brandomi[sz]ed controlled trials?\b/i.test(sentence)
  if (!callsRct) return false
  return !/\brcts?\b|\brandomi[sz]ed\b/i.test(support)
}

export function arxivIdFromUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  const modern = raw.match(/arxiv\.org\/(?:abs|pdf|html)\/(\d{4}\.\d{4,5})(?:v\d+)?/i)
  if (modern) return modern[1]
  const legacy = raw.match(/arxiv\.org\/(?:abs|pdf)\/([a-z-]+\/\d{7})(?:v\d+)?/i)
  return legacy ? legacy[1].toLowerCase() : null
}

export function pmidFromUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  const match =
    raw.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i) ||
    raw.match(/ncbi\.nlm\.nih\.gov\/pubmed\/(\d+)/i) ||
    raw.match(/europepmc\.org\/article\/MED\/(\d+)/i) ||
    raw.match(/medscape\.com\/(?:medline\/abstract|pubmed)\/(\d+)/i) ||
    raw.match(/[?&]pmid=(\d+)/i)
  return match ? match[1] : null
}

export function isPdfUrl(raw: string): boolean {
  try {
    const url = new URL(raw)
    const path = url.pathname.toLowerCase()
    return path.endsWith('.pdf') || path.includes('/pdf/')
  } catch {
    return /\.pdf($|\?)/i.test(raw)
  }
}

export type CitationLink = {
  href: string | null
  kind: 'doi' | 'arxiv' | 'pubmed' | null
  label: string | null
}

/** DOI, then the arXiv abstract, then PubMed. Never a PDF or a raw mirror URL. */
export function citationLink(input: {
  url: string
  doi?: string | null
  pmid?: string | null
}): CitationLink {
  const doi = cleanDoi(input.doi) || doiFromUrl(input.url)
  if (doi) {
    const href = `https://doi.org/${doi}`
    return { href, kind: 'doi', label: href }
  }
  const arxiv = arxivIdFromUrl(input.url)
  if (arxiv) {
    const href = `https://arxiv.org/abs/${arxiv}`
    return { href, kind: 'arxiv', label: href }
  }
  const pmid = input.pmid?.trim() || pmidFromUrl(input.url)
  if (pmid) {
    const href = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
    return { href, kind: 'pubmed', label: href }
  }
  if (isPdfUrl(input.url)) return { href: null, kind: null, label: null }
  const href = stripTrackingUrl(input.url)
  return { href, kind: null, label: href }
}

export function formatAuthors(names: string[]): string {
  const clean = names.map((name) => name.replace(/\s+/g, ' ').trim()).filter(Boolean)
  if (clean.length === 0) return 'Authors unavailable'
  if (clean.length > 3) return `${clean[0]} et al.`
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`
  return `${clean[0]}, ${clean[1]}, and ${clean[2]}`
}

export function parseAuthorField(author: string | null | undefined): string[] {
  if (!author) return []
  const trimmed = author.replace(/\s+/g, ' ').trim()
  if (!trimmed) return []
  if (trimmed.includes(';')) {
    return trimmed.split(';').map((part) => part.trim()).filter(Boolean)
  }
  const parts = trimmed.split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 2 && !parts[1].includes(' ')) return [trimmed]
  return parts
}

export function yearFromDate(value: string | null | undefined): string | null {
  if (!value) return null
  const match = value.match(/\b(1[89]\d{2}|20\d{2})\b/)
  return match ? match[1] : null
}

export function retrievedExcerpt(input: {
  text?: string | null
  summary?: string | null
  highlights?: string[] | null
}): { text: string; kind: 'text' | 'summary' | 'highlights' } | null {
  const summary = input.summary?.trim()
  if (summary) return { text: summary, kind: 'summary' }
  const highlights = (input.highlights ?? []).map((item) => item.trim()).filter(Boolean)
  if (highlights.length) return { text: highlights.join('\n\n'), kind: 'highlights' }
  const text = input.text?.trim()
  if (text) return { text, kind: 'text' }
  return null
}

export function workKey(input: { url: string; doi?: string | null; pmid?: string | null }): string {
  const doi = (cleanDoi(input.doi) || doiFromUrl(input.url))?.toLowerCase() || null
  if (doi) return `doi:${doi}`
  const arxiv = arxivIdFromUrl(input.url)
  if (arxiv) return `arxiv:${arxiv}`
  const pmid = input.pmid?.trim() || pmidFromUrl(input.url)
  if (pmid) return `pmid:${pmid}`
  return `url:${normalizeUrl(input.url)}`
}

export function rankByPriority<T extends { url: string }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index, band: priorityBand(item.url) as PriorityBand }))
    .sort((a, b) => a.band - b.band || a.index - b.index)
    .map((row) => row.item)
}

export type PaperStatus =
  | 'peer-reviewed'
  | 'preprint'
  | 'corrected'
  | 'retracted'
  | 'concern'
  | 'unverified'
  | 'unknown'

export function statusLabel(status: PaperStatus): string {
  if (status === 'peer-reviewed') return 'Peer-reviewed'
  if (status === 'preprint') return 'Preprint'
  if (status === 'corrected') return 'Corrected'
  if (status === 'retracted') return 'Retracted'
  if (status === 'concern') return 'Concern'
  if (status === 'unverified') return 'Unverified'
  return 'Status unknown'
}

/**
 * Status comes from Crossref and OpenAlex types, not from the website host.
 * A retraction check that timed out is Unverified and must not be cited as peer-reviewed.
 */
export function paperStatus(input: {
  url: string
  doi?: string | null
  title?: string | null
  retracted?: boolean | null
  corrected?: boolean | null
  concern?: boolean | null
  journal?: boolean | null
  crossrefType?: string | null
  openAlexType?: string | null
  retractionChecked?: boolean | null
  articleType?: string | null
}): PaperStatus {
  if (input.retractionChecked === false) return 'unverified'
  if (input.retracted === true) return 'retracted'
  if (input.concern === true) return 'concern'
  if (input.corrected === true) return 'corrected'
  const doi = cleanDoi(input.doi) || doiFromUrl(input.url)
  if (isNewsRecord(input.url, doi) || pathIsNewsOnly(input.url)) return 'unknown'
  if (isPerspectiveRecord(input.url, input.title, input.articleType)) return 'unknown'
  if (isPreprintDoi(doi) || isPreprintUrl(input.url) || input.openAlexType === 'preprint' || input.crossrefType === 'posted-content') {
    return 'preprint'
  }
  const journal =
    input.journal === true ||
    input.crossrefType === 'journal-article' ||
    input.openAlexType === 'article' ||
    input.openAlexType === 'review'
  if (journal) return 'peer-reviewed'
  return 'unknown'
}

function pathIsNewsOnly(raw: string): boolean {
  try {
    return /\/(news|press|press-release|pressreleases|media-release)(\/|$)/.test(new URL(raw).pathname.toLowerCase())
  } catch {
    return false
  }
}

export function validateQuestion(raw: unknown): { ok: true; question: string } | { ok: false; error: string } {
  if (typeof raw !== 'string') return { ok: false, error: 'Question must be text.' }
  const question = raw.trim()
  if (question.length < QUESTION_MIN || question.length > QUESTION_MAX) {
    return { ok: false, error: `Question must be ${QUESTION_MIN} to ${QUESTION_MAX} characters.` }
  }
  return { ok: true, question }
}
