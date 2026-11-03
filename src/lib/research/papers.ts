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

/** A DOI printed on the page. Reference lists after a References heading are ignored. */
export function doiFromExcerpt(text: string | null | undefined): string | null {
  if (!text) return null
  const head = text.slice(0, 4000)
  const link = head.match(/https?:\/\/(?:dx\.)?doi\.org\/(10\.\d{4,9}\/[^\s?#]+)/i)
  if (link) return cleanDoi(link[1])
  const label = head.match(/\bdoi:\s*(10\.\d{4,9}\/[^\s?#]+)/i)
  if (label) return cleanDoi(label[1])
  const refs = head.search(/\breferences\b|\bbibliography\b/i)
  const zone = refs > 200 ? head.slice(0, refs) : head.slice(0, 1500)
  const bare = zone.match(/\b(10\.\d{4,9}\/[^\s?#]+)/i)
  return bare ? cleanDoi(bare[1]) : null
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
  let text = title
  text = text.replace(/[ \t\r\n]+(?=<\s*\/?\s*(?:sub|sup)\b)/gi, '')
  text = text.replace(/\s+/g, ' ').trim()
  text = text.replace(/<\s*\/?\s*(?:sub|sup|i|em|b|strong|span)\b[^>]*>/gi, '')
  text = text.replace(/\bAS01\s+E\b/g, 'AS01E')
  text = text.replace(/\s*\u2014\s*/g, ', ')
  text = text.replace(/,\s*,/g, ',')
  text = text.replace(/\s*(?:\.{3}|…)+\s*$/g, '')
  text = text.replace(/^Frontiers\s*\|\s*/i, '')
  text = text.replace(/\s*\|\s*springermedizin\.de\s*$/i, '')
  text = text.replace(/\s+-\s+(?:PubMed|PMC)\s*$/i, '')
  const journalTail = text.match(/^(.*?)\s+-\s+([^-]+)$/)
  if (
    journalTail &&
    journalTail[1].trim().length > 20 &&
    journalTail[2].trim().length <= 70 &&
    /\b(journal|lancet|medicine|cardiology|metabolism|obesity|diabetes|nature|science|nejm)\b/i.test(journalTail[2])
  ) {
    text = journalTail[1].trim()
  }
  const parts = text.split(/\s+\|\s+/)
  while (parts.length > 1 && siteSuffix(parts[parts.length - 1] ?? '')) parts.pop()
  const cleaned = parts.join(' | ').trim()
  return cleaned || title.trim()
}

function siteSuffix(segment: string): boolean {
  const text = segment.trim()
  if (!text) return true
  if (text.length <= 24) return true
  return /\b(plos|springer|wiley|nature|pubmed|pmc|elsevier|lancet|oxford|frontiers|sciencedirect|nejm|bmj|endocrine|medicine|journal|researcher|discovery)\b/i.test(text) && text.length <= 80
}

/** Display the catalog title. The page title is only a fallback. */
export function chooseTitle(scraped: string | null | undefined, catalog: string | null | undefined): string {
  const fromCatalog = cleanTitle(catalog || '')
  if (fromCatalog) return fromCatalog
  return cleanTitle(scraped || '') || 'Title unavailable'
}

export type StudyDirection = 'benefit' | 'no-effect' | 'unclear'

/** A reported p-value under 0.05, or a "p < 0.05" statement. P = 0.80 does not count. */
function hasSignificantP(sample: string): boolean {
  for (const match of sample.matchAll(/\bp\s*([=<])\s*(0?\.\d+)/g)) {
    const value = Number(match[2])
    if (!Number.isFinite(value)) continue
    if (match[1] === '<' && value <= 0.05) return true
    if (match[1] === '=' && value < 0.05) return true
  }
  return false
}

/**
 * 'no-effect' is only a null on the primary outcome.
 * A statistically significant result is a benefit even when the effect is modest.
 * "Adverse events were similar" is a safety comparison, not a null primary.
 */
export function studyDirection(text: string): StudyDirection {
  const sample = text.toLowerCase()
  const significantEfficacy =
    hasSignificantP(sample) && /\befficac\w*\b[^.]{0,200}\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*%[^.]{0,80}\befficac\w*\b/.test(sample)
  const benefitWord = /\b(improv(?:e|es|ed|ement)?|benefit|beneficial|reduc(?:e|ed|tion)|decreas(?:e|ed)|protect(?:ion|ed)?)\b/.test(sample)
  const nullPrimary =
    /\b(did not|didn't|does not|do not|no significant|not significant|unchanged|no effect|no difference|not different|failed to|unaffected|not accompanied by)\b[^.]{0,160}\b(primary outcome|insulin sensitivity|glucose|homa-?ir|hba1c|fasting insulin|vaccine efficacy)\b/.test(sample) ||
    /\b(primary outcome|insulin sensitivity|glucose|homa-?ir|hba1c|fasting insulin|vaccine efficacy)\b[^.]{0,160}\b(did not|didn't|does not|do not|no significant|not significant|unchanged|no effect|no difference|not different|failed to|unaffected)\b/.test(sample)
  const negatedBenefit = /\b(?:did not|didn't|does not|do not|no|not)\s+(?:\w+\s+){0,3}(?:improv|benefit|reduc|decreas|protect)/.test(sample)
  if (significantEfficacy) return 'benefit'
  if (nullPrimary && negatedBenefit) return 'no-effect'
  if (benefitWord && nullPrimary) return 'unclear'
  if (benefitWord) return 'benefit'
  if (nullPrimary) return 'no-effect'
  return 'unclear'
}

/** True when two titles are the same work after normalization, including a shortened page title. */
export function titlesMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizeTitle(a || '')
  const right = normalizeTitle(b || '')
  if (!left || !right) return false
  if (left === right) return true
  const shorter = left.length <= right.length ? left : right
  const longer = left.length <= right.length ? right : left
  if (shorter.length >= 24 && longer.includes(shorter)) return true
  const words = (value: string) => new Set(value.split(' ').filter((word) => word.length > 3))
  const lt = words(left)
  const rt = words(right)
  if (lt.size < 3 || rt.size < 3) return false
  let shared = 0
  for (const word of lt) if (rt.has(word)) shared += 1
  const union = lt.size + rt.size - shared
  return shared >= 4 && shared / union >= 0.6
}

/** Drop a leading connective that points at a sentence the reader does not have. */
export function repairOpening(text: string): string {
  let next = text.trim()
  next = next.replace(
    /^(?:in contrast|by contrast|conversely|however|on the other hand|similarly|likewise|furthermore|moreover|additionally|in addition|meanwhile)\s*,?\s+/i,
    '',
  )
  next = next.replace(/^the same (trial|study|paper)\b/i, 'The $1')
  if (!next) return text.trim()
  return next.charAt(0).toUpperCase() + next.slice(1)
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

/** Answer sentences use a comma where a title would. Excerpts keep a hyphen. */
export function plainSentence(text: string): string {
  return text.replace(/\s*\u2014\s*/g, ', ').replace(/,\s*,/g, ',').replace(/\s+/g, ' ').trim()
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
  // 5 must not match inside 5.7. A sentence-ending period still counts.
  const boundary = '(?:$|[^\\d.]|\\.(?!\\d))'
  const number = new RegExp(`(?:^|[^\\d.])${token}(?:\\.0+)?${boundary}`, 'i')
  if (!number.test(hay)) return false
  if (!wanted.percent) return true
  return new RegExp(`(?:^|[^\\d.])${token}(?:\\.0+)?\\s*(?:%|percent)`, 'i').test(hay)
}

function thousands(value: number): string {
  return value.toLocaleString('en-US')
}

function armRole(support: string, raw: string): 'vaccine' | 'placebo' | null {
  const re = new RegExp(`\\b${raw}\\b`, 'g')
  let role: 'vaccine' | 'placebo' | null = null
  for (const match of support.matchAll(re)) {
    const forward = support.slice((match.index ?? 0) + raw.length, (match.index ?? 0) + raw.length + 70)
    const vaccineAt = forward.search(/\b(?:vaccine|M72|AS01E|AS01)\b/i)
    const placeboAt = forward.search(/\bplacebo\b/i)
    if (vaccineAt < 0 && placeboAt < 0) continue
    if (placeboAt >= 0 && (vaccineAt < 0 || placeboAt < vaccineAt)) role = 'placebo'
    else role = 'vaccine'
  }
  return role
}

/** A model refusal, not a finding. */
export function isNonAnswer(text: string): boolean {
  return /\b(no information|not enough information|none of the (?:provided )?sources|sources do not|do not (?:contain|mention|address|provide)|cannot (?:answer|determine)|no (?:evidence|data) (?:in|from) the (?:provided )?sources)\b/i.test(text)
}

/**
 * When a headcount is the sum of two printed arm counts, spell the total with those arms.
 * Otherwise remove the count and keep the noun.
 */
export function rewriteDerivedTotals(sentence: string, support: string): string {
  let next = sentence
  const printed = [...support.matchAll(/\b\d{2,}\b/g)].map((match) => ({
    raw: match[0],
    value: Number(match[0]),
    index: match.index ?? 0,
  }))
  for (const figure of quotedFigures(sentence)) {
    if (figureAppears(figure, support)) continue
    const wanted = figureBody(figure)
    if (wanted.percent || wanted.sample || !/^\d+$/.test(wanted.body)) continue
    const target = Number(wanted.body)
    if (target < 20) continue
    let pair: { raw: string; value: number; index: number }[] | null = null
    for (let i = 0; i < printed.length; i += 1) {
      for (let j = i + 1; j < printed.length; j += 1) {
        if (printed[j].index - printed[i].index > 90) break
        if (printed[i].value + printed[j].value === target) pair = [printed[i], printed[j]]
      }
    }
    const escaped = figure.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const clause = new RegExp(`\\b${escaped}\\s+((?:HIV-negative\\s+)?(?:adults|participants|people|children))\\b`, 'i')
    if (!pair) continue
    const first = armRole(support, pair[0].raw)
    const second = armRole(support, pair[1].raw)
    const vaccine = first === 'vaccine' ? pair[0] : second === 'vaccine' ? pair[1] : null
    const placebo = first === 'placebo' ? pair[0] : second === 'placebo' ? pair[1] : null
    if (vaccine && placebo && vaccine.raw !== placebo.raw) {
      const rendered = `${thousands(target)} adults (${thousands(vaccine.value)} vaccine, ${thousands(placebo.value)} placebo)`
      next = clause.test(next) ? next.replace(clause, rendered) : next.replace(figure, rendered)
      continue
    }
    next = clause.test(next) ? next.replace(clause, '$1') : next.replace(new RegExp(`\\b${escaped}\\b`), '')
  }
  return next.replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim()
}

const CLAIM_ANCHORS = [
  /\bprediabetes\b/i,
  /\bearly time-restricted\b|\betRF\b/i,
  /\btype 2 diabetes\b/i,
  /\boverweight\b/i,
  /\bobesity\b/i,
  /\bhepatic\b/i,
  /\bperipheral\b/i,
  /\bwhole-body\b|\bwhole body\b/i,
]

function anchorsMatch(sentence: string, support: string): boolean {
  return CLAIM_ANCHORS.every((pattern) => !pattern.test(sentence) || pattern.test(support))
}

function durationPhrases(text: string): string[] {
  const found: string[] = []
  for (const match of text.matchAll(/\b(\d+(?:\.\d+)?)\s*-?\s*(day|week|month|year|hour)s?\b/gi)) {
    found.push(`${match[1].replace(/\.0+$/, '')} ${match[2].toLowerCase()}`)
  }
  return found
}

const DURATION_WORDS: Record<string, string> = {
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '8': 'eight',
  '12': 'twelve',
}

function supportHasDuration(support: string, phrase: string): boolean {
  const [count, unit] = phrase.split(' ')
  const word = DURATION_WORDS[count]
  const forms = [count, word].filter(Boolean).join('|')
  return new RegExp(`\\b(?:${forms})\\s*-?\\s*${unit}s?\\b`, 'i').test(support)
}

function durationsMatch(sentence: string, support: string): boolean {
  return durationPhrases(sentence).every((phrase) => supportHasDuration(support, phrase))
}

/**
 * Drop a sample-size digit the abstract does not print when the population word is there.
 * Returns null when some other figure is still missing.
 */
function explainedSum(figure: string, support: string): boolean {
  const wanted = figureBody(figure)
  if (wanted.percent || wanted.sample || !/^\d+$/.test(wanted.body)) return false
  const target = Number(wanted.body)
  if (target < 20) return false
  const printed = [...support.matchAll(/\b\d{2,}\b/g)].map((match) => ({
    value: Number(match[0]),
    index: match.index ?? 0,
  }))
  for (let i = 0; i < printed.length; i += 1) {
    for (let j = i + 1; j < printed.length; j += 1) {
      if (printed[j].index - printed[i].index > 90) break
      if (printed[i].value + printed[j].value === target) return true
    }
  }
  return false
}

function figureAccounted(figure: string, support: string): boolean {
  return figureAppears(figure, support) || explainedSum(figure, support)
}

export function stripUnprintedCounts(sentence: string, support: string): string | null {
  let next = sentence
  for (const figure of quotedFigures(next)) {
    if (figureAccounted(figure, support)) continue
    const wanted = figureBody(figure)
    if (wanted.percent || wanted.sample || !/^\d+$/.test(wanted.body)) return null
    const count = new RegExp(`\\b${wanted.body}\\s+(men|women|adults|participants|patients|children|people)\\b`, 'i')
    const match = next.match(count)
    if (!match) return null
    if (!new RegExp(`\\b${match[1]}\\b`, 'i').test(support)) return null
    next = next.replace(count, match[1])
  }
  return next
}

/** A sentence copied from an abstract that reports a null on its own. */
export function nullFindingSentence(text: string): string | null {
  const parts = text
    .replace(/\s+/g, ' ')
    .split(/(?<=\.)\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 40 && part.length <= 420)
  const hits = parts.filter((part) => studyDirection(part) === 'no-effect')
  const standalone = hits.find((part) => !/^(however|these|this|that|it|they)\b/i.test(part))
  return standalone || hits[0] || null
}

/** True when the sentence and the abstract share a printed figure or a population phrase. */
export function claimOverlap(sentence: string, support: string): boolean {
  if (quotedFigures(sentence).some((figure) => figureAppears(figure, support))) return true
  return CLAIM_ANCHORS.some((pattern) => pattern.test(sentence) && pattern.test(support))
}

export function sentenceFitsSupport(sentence: string, support: string): string | null {
  if (!support.trim() || isNonAnswer(sentence) || !anchorsMatch(sentence, support) || !durationsMatch(sentence, support)) return null
  if (citesRctWithoutSupport(sentence, support)) return null
  const rewritten = stripUnprintedCounts(rewriteDerivedTotals(sentence, support), support)
  if (!rewritten) return null
  if (!quotedFigures(rewritten).every((figure) => figureAccounted(figure, support))) return null
  return rewritten
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
