import {
  isPeerReviewedUrl,
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

export function doiFromText(raw: string | null | undefined): string | null {
  if (!raw) return null
  const match = raw.match(/10\.\d{4,9}\/[^\s?#]+/i)
  if (!match) return null
  return match[0].replace(/[).,;]+$/g, '').toLowerCase()
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
    raw.match(/europepmc\.org\/article\/MED\/(\d+)/i)
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

/** DOI, then the arXiv abstract, then PubMed. Never a PDF. */
export function citationLink(input: {
  url: string
  doi?: string | null
  pmid?: string | null
}): CitationLink {
  const doi = input.doi?.trim().toLowerCase() || doiFromText(input.url)
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
  return { href: input.url, kind: null, label: input.url }
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
  const doi = input.doi?.trim().toLowerCase() || doiFromText(input.url)
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

export type PaperStatus = 'peer-reviewed' | 'preprint' | 'corrected' | 'retracted' | 'unknown'

export function statusLabel(status: PaperStatus): string {
  if (status === 'peer-reviewed') return 'Peer-reviewed'
  if (status === 'preprint') return 'Preprint'
  if (status === 'corrected') return 'Corrected'
  if (status === 'retracted') return 'Retracted'
  return 'Status unknown'
}

export function paperStatus(input: {
  url: string
  retracted?: boolean | null
  corrected?: boolean | null
}): PaperStatus {
  if (input.retracted === true) return 'retracted'
  if (input.corrected === true) return 'corrected'
  if (pathIsNewsOnly(input.url)) return 'unknown'
  if (isPreprintUrl(input.url)) return 'preprint'
  if (isPeerReviewedUrl(input.url)) return 'peer-reviewed'
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
