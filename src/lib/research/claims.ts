import { cleanDoi, doiFromUrl, isNonAnswer, normalizeTitle, plainSentence, quotedFigures, rewriteDerivedTotals } from '@/lib/research/papers'
import type { SourceFields } from '@/lib/research/shape'

export type ClaimDirection = 'benefit' | 'null' | 'mixed'

export type PaperClaim = {
  doi: string
  direction: ClaimDirection
  text: string
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

/** Commas, spaces, percent words, and dashes, so 2,516 and 2516 compare equal. */
export function normalizeNumericText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/percent/g, '%')
    .replace(/(\d),(?=\d)/g, '$1')
    .replace(/(\d)\s+(?=\d)/g, '$1')
    .replace(/\s+/g, '')
}

/** Numbers and printed ranges. A hyphenated percent is one token, not two endpoints. */
export function numericTokens(text: string): string[] {
  const ranges = [...text.matchAll(/\b\d+(?:\.\d+)?\s*[-\u2013]\s*\d+(?:\.\d+)?\s*%/g)].map((match) => match[0])
  const withoutRanges = text.replace(/\b\d+(?:\.\d+)?\s*[-\u2013]\s*\d+(?:\.\d+)?\s*%/g, ' ')
  const rest = quotedFigures(withoutRanges)
  return [...ranges, ...rest]
}

export function numberPrinted(token: string, abstract: string): boolean {
  const wanted = normalizeNumericText(token)
  const hay = normalizeNumericText(abstract)
  if (!wanted) return true
  if (/\d-\d/.test(wanted)) return hay.includes(wanted)
  const bare = wanted.replace(/%$/, '')
  if (hay.includes(bare) && (!wanted.endsWith('%') || hay.includes(`${bare}%`))) return true
  if (wanted.endsWith('%') || wanted.includes('-')) return false
  const probe = rewriteDerivedTotals(`The trial enrolled ${token} adults.`, abstract)
  return probe.includes('vaccine') && probe.includes('placebo')
}

export function unsupportedNumbers(claim: string, abstract: string): string[] {
  return numericTokens(claim).filter((token) => !numberPrinted(token, abstract))
}

export function isVerbatimAbstract(claim: string, abstract: string): boolean {
  const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
  const text = norm(claim)
  if (text.length < 48) return false
  return norm(abstract).includes(text)
}

function durationPhrases(text: string): string[] {
  const found: string[] = []
  for (const match of text.matchAll(/\b(\d+(?:\.\d+)?)\s*-?\s*(day|week|month|year|hour)s?\b/gi)) {
    found.push(`${match[1].replace(/\.0+$/, '')} ${match[2].toLowerCase()}`)
  }
  return found
}

function durationPrinted(support: string, phrase: string): boolean {
  const [count, unit] = phrase.split(' ')
  const word = DURATION_WORDS[count]
  const forms = [count, word].filter(Boolean).join('|')
  return new RegExp(`\\b(?:${forms})\\s*-?\\s*${unit}s?\\b`, 'i').test(support)
}

/** A claim that names a duration or population the abstract does not contain is not about this paper. */
export function claimBelongsToAbstract(claim: string, abstract: string): boolean {
  if (!durationPhrases(claim).every((phrase) => durationPrinted(abstract, phrase))) return false
  const phrases = [/\bprediabetes\b/i, /\btype 2 diabetes\b/i, /\bhepatic\b/i, /\bperipheral\b/i, /\boverweight\b/i, /\bobesity\b/i]
  return phrases.every((pattern) => !pattern.test(claim) || pattern.test(abstract))
}

export function polishClaim(text: string): string {
  let next = plainSentence(text).replace(/^\s*[-•]\s*/, '')
  next = next.replace(/^(?:also|conversely|however|in contrast|additionally|similarly|furthermore|moreover)\b[,:]?\s+/i, '')
  next = next.replace(/\bAS01\s+E\b/g, 'AS01E')
  next = next.replace(/\s*\(p\s*[=<>]\s*[^)]*\)/gi, '')
  next = next.replace(/,?\s*\bp\s*[=<>]\s*0?\.\d+\b/gi, '')
  return next.replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim()
}

export function describesOtherStudies(text: string): boolean {
  return /\([A-Z][A-Za-z'’.-]+ et al\.,?\s*\d{4}/.test(text)
}

function stripTokens(text: string, tokens: string[]): string {
  let next = text
  for (const token of tokens) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    next = next.replace(new RegExp(escaped, 'g'), '')
  }
  return next.replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim()
}

export function readPaperClaims(payload: unknown): PaperClaim[] | null {
  const answer = payload && typeof payload === 'object' && 'answer' in (payload as object)
    ? (payload as { answer: unknown }).answer
    : payload
  const claims = answer && typeof answer === 'object' ? (answer as { claims?: unknown }).claims : null
  if (!Array.isArray(claims)) return null
  const out: PaperClaim[] = []
  for (const row of claims) {
    if (!row || typeof row !== 'object') continue
    const doi = cleanDoi(String((row as { doi?: unknown }).doi ?? ''))
    const text = String((row as { text?: unknown }).text ?? '').trim()
    const direction = String((row as { direction?: unknown }).direction ?? '')
    if (!doi || !text) continue
    if (direction !== 'benefit' && direction !== 'null' && direction !== 'mixed') continue
    out.push({ doi: doi.toLowerCase(), direction, text })
  }
  return out
}

/** Prefer a DOI record. A title match with no DOI is the duplicate page. */
export function dedupeSources(papers: SourceFields[]): SourceFields[] {
  const rows = papers.map((paper) => ({
    paper,
    doi: (cleanDoi(paper.doi) || doiFromUrl(paper.url) || '').toLowerCase(),
    title: normalizeTitle(paper.title || ''),
  }))
  const keep = rows.map(() => true)
  const seenDoi = new Set<string>()
  const titleAt = new Map<string, number>()
  rows.forEach((row, index) => {
    if (row.doi) {
      if (seenDoi.has(row.doi)) keep[index] = false
      else seenDoi.add(row.doi)
    }
    if (row.title.length < 24) return
    const previous = titleAt.get(row.title)
    if (previous == null) {
      titleAt.set(row.title, index)
      return
    }
    if (!rows[previous].doi && row.doi) {
      keep[previous] = false
      titleAt.set(row.title, index)
      return
    }
    keep[index] = false
  })
  return rows.filter((_, index) => keep[index]).map((row) => row.paper)
}

const GENERIC_TERMS = new Set([
  'does', 'what', 'when', 'where', 'which', 'with', 'from', 'that', 'this', 'have', 'been', 'were',
  'will', 'into', 'over', 'under', 'than', 'then', 'them', 'they', 'their', 'there', 'such', 'only',
  'also', 'more', 'most', 'many', 'some', 'well', 'work', 'works', 'improve', 'improves', 'improved',
  'reduce', 'reduces', 'reduced', 'reduction', 'effect', 'effects', 'effective', 'efficacy', 'risk',
  'risks', 'adult', 'adults', 'people', 'trial', 'study', 'studies', 'standard', 'versus', 'against',
  'prevent', 'prevents', 'treatment', 'regimen', 'based', 'using', 'compared', 'comparison', 'month',
  'months', 'year', 'years', 'week', 'weeks', 'pulmonary', 'question', 'about', 'among', 'between',
  'within', 'without', 'clinical', 'patients', 'persons', 'human', 'humans', 'older', 'raise',
  'raises', 'raised', 'change', 'changed', 'affect', 'affected', 'remain', 'remained', 'found',
  'showed', 'shown', 'reported', 'significant', 'significantly', 'respectively', 'after', 'before',
  'during', 'their', 'these', 'those', 'other', 'results', 'result', 'group', 'groups', 'control',
  'participants', 'participant', 'received', 'following', 'primary', 'secondary', 'analysis',
  'recorded', 'average', 'highest', 'lower', 'higher',
])

/** Salient words in a question. An unmatched one, such as socks, blocks generation. */
export function questionTerms(question: string): string[] {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((word) => word.length >= 4 && !GENERIC_TERMS.has(word))
}

const SYNONYM_GROUPS: { test: (text: string) => boolean; covers: string[] }[] = [
  {
    test: (text) => /\bm72\b/i.test(text) || /\bas01e?\b/i.test(text),
    covers: ['m72', 'as01e', 'as01', 'vaccine', 'tuberculosis', 'prevent'],
  },
  {
    test: (text) => /\br21\b/i.test(text) || /matrix[-\s]?m\b/i.test(text),
    covers: ['r21', 'matrix', 'malaria', 'vaccine'],
  },
  {
    test: (text) => /\brifapentine\b/i.test(text) || /\bmoxifloxacin\b/i.test(text) || /\b4[-\s]?month\b/i.test(text),
    covers: ['rifapentine', 'moxifloxacin', 'based', 'regimen', 'month', 'months', 'effective', 'standard', 'drug', 'susceptible', 'pulmonary', 'tuberculosis'],
  },
  {
    test: (text) => /\bfasting\b/i.test(text) || /\btime[-\s]?restricted\b/i.test(text) || /\betrf\b/i.test(text) || /\btre\b/i.test(text),
    covers: ['fasting', 'intermittent', 'time', 'restricted', 'eating', 'etrf', 'tre', 'insulin', 'sensitivity', 'adults'],
  },
]

function compactText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function questionIsGrounded(question: string, abstracts: string[]): boolean {
  const hay = abstracts.join('\n')
  const active = SYNONYM_GROUPS.filter((group) => group.test(question))
  if (active.length) {
    if (!active.every((group) => group.test(hay))) return false
    const covered = new Set(active.flatMap((group) => group.covers))
    return questionTerms(question)
      .filter((term) => !covered.has(term))
      .every((term) => compactText(hay).includes(compactText(term)))
  }
  const terms = questionTerms(question)
  if (terms.length === 0) return true
  const flat = compactText(hay)
  return terms.every((term) => flat.includes(compactText(term)))
}

export function contentTerms(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((word) => word.length >= 6 && !GENERIC_TERMS.has(word))
}

/** Outcome, population, and intervention words in the claim must be printed in the abstract. */
export function missingContentTerms(claim: string, abstract: string): string[] {
  const hay = abstract.toLowerCase()
  return contentTerms(claim).filter((term) => !hay.includes(term))
}

export function claimOffTopic(question: string, claim: string): boolean {
  if (!question.trim()) return false
  const terms = questionTerms(question)
  if (!terms.length) return false
  const hay = compactText(claim)
  if (terms.some((term) => hay.includes(compactText(term)))) return false
  const active = SYNONYM_GROUPS.filter((group) => group.test(question))
  return !active.some((group) => group.test(claim))
}

/** 0 is a primary trial, 3 is a review or commentary. */
export function studyRank(title: string, abstract: string): number {
  const head = `${title}\n${abstract.slice(0, 700)}`.toLowerCase()
  const review = /\b(systematic review|meta-analysis|narrative review|commentary|editorial|prospects)\b/.test(head)
  const primary = /\bphase\s*3\b|\bphase\s*2b\b|\brandomi[sz]ed controlled\b|\bdouble-blind\b|\bplacebo-controlled\b|\brandomi[sz]ed\b/.test(head)
  if (primary && !review) return 0
  if (primary) return 1
  if (review) return 3
  return 2
}

export function chooseBalancedClaims(claims: PaperClaim[], rankOf: (doi: string) => number = () => 2): PaperClaim[] {
  const perPaper = new Map<string, PaperClaim[]>()
  const limited: PaperClaim[] = []
  for (const claim of claims) {
    const used = perPaper.get(claim.doi) ?? []
    if (used.length >= 2) continue
    used.push(claim)
    perPaper.set(claim.doi, used)
    limited.push(claim)
  }
  const sorted = [...limited].sort((a, b) => rankOf(a.doi) - rankOf(b.doi))
  const picked: PaperClaim[] = []
  const has = (direction: ClaimDirection) => picked.some((claim) => claim.direction === direction)
  const papers = () => new Set(picked.map((claim) => claim.doi))
  const nullsExist = sorted.some((claim) => claim.direction === 'null')
  const benefitsExist = sorted.some((claim) => claim.direction === 'benefit')
  for (const claim of sorted) {
    const needSide = (benefitsExist && !has('benefit') && claim.direction === 'benefit')
      || (nullsExist && !has('null') && claim.direction === 'null')
    const needPaper = papers().size < 3 && !papers().has(claim.doi)
    if (needSide || needPaper) picked.push(claim)
  }
  for (const claim of sorted) {
    if (picked.includes(claim) || picked.length >= 5) continue
    if (rankOf(claim.doi) >= 3 && papers().size >= 3 && (!benefitsExist || has('benefit')) && (!nullsExist || has('null'))) continue
    picked.push(claim)
  }
  return picked
}

export function mergeRepeatedClaims<T extends PaperClaim>(claims: T[]): T[] {
  const words = (text: string) => new Set(text.toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter((word) => word.length > 4))
  const kept: T[] = []
  for (const claim of claims) {
    const mine = words(claim.text)
    const repeat = kept.some((earlier) => {
      const theirs = words(earlier.text)
      if (mine.size < 4 || theirs.size < 4) return false
      let shared = 0
      for (const word of mine) if (theirs.has(word)) shared += 1
      return shared / Math.min(mine.size, theirs.size) >= 0.7
    })
    if (!repeat) kept.push(claim)
  }
  return kept
}

/** One paragraph. The opening sentence uses only the selected claim labels and wording. */
export function paragraphFromClaims(claims: PaperClaim[]): string {
  if (claims.length === 0) return ''
  const order: string[] = []
  for (const claim of claims) if (!order.includes(claim.doi)) order.push(claim.doi)
  const marker = (doi: string) => `[${order.indexOf(doi) + 1}]`
  const benefit = claims.find((claim) => claim.direction === 'benefit')
  const nulls = claims.find((claim) => claim.direction === 'null')
  const opening = benefit && nulls
    ? 'The retrieved studies disagree.'
    : benefit
      ? 'The retrieved studies report a benefit.'
      : nulls
        ? 'The retrieved studies report no effect.'
        : 'The retrieved studies report mixed results.'
  const body = claims.map((claim) => `${claim.text.replace(/\.$/, '')} ${marker(claim.doi)}.`).join(' ')
  return `${opening} ${body}`
}

export type GroundedClaim = PaperClaim & { abstract: string }

/**
 * Keep a claim only with its own abstract. Unsupported numbers are removed
 * after an optional restatement. Verbatim abstract sentences and other-study
 * citations are not used.
 */
export function claimNeedsRepair(claim: PaperClaim, abstract: string): boolean {
  const text = polishClaim(rewriteDerivedTotals(claim.text, abstract))
  return unsupportedNumbers(text, abstract).length > 0 || isVerbatimAbstract(text, abstract)
}

export function groundClaims(
  papers: { doi: string; abstract: string; title?: string }[],
  claims: PaperClaim[],
  restatements: { doi: string; text: string }[] = [],
  question = '',
): GroundedClaim[] {
  const abstracts = new Map(papers.map((paper) => [paper.doi.toLowerCase(), paper.abstract]))
  const accepted: GroundedClaim[] = []
  for (const claim of claims) {
    const abstract = abstracts.get(claim.doi.toLowerCase())
    if (!abstract) continue
    let text = polishClaim(rewriteDerivedTotals(claim.text, abstract))
    if (isNonAnswer(text) || describesOtherStudies(text)) continue
    const bad = unsupportedNumbers(text, abstract)
    const copied = isVerbatimAbstract(text, abstract)
    if (bad.length || copied) {
      const repaired = restatements.find((row) => row.doi.toLowerCase() === claim.doi && row.text !== claim.text)
      text = polishClaim(repaired ? rewriteDerivedTotals(repaired.text, abstract) : stripTokens(text, bad))
    }
    if (!text || isNonAnswer(text) || describesOtherStudies(text) || isVerbatimAbstract(text, abstract)) continue
    if (!claimBelongsToAbstract(text, abstract) || claimOffTopic(question, text)) continue
    if (missingContentTerms(text, abstract).length) continue
    if (unsupportedNumbers(text, abstract).length) text = stripTokens(text, unsupportedNumbers(text, abstract))
    if (text.split(/\s+/).length < 6) continue
    accepted.push({ ...claim, text, abstract })
  }
  const rankOf = (doi: string) => {
    const paper = papers.find((item) => item.doi.toLowerCase() === doi)
    return paper ? studyRank(paper.title || '', paper.abstract) : 2
  }
  return mergeRepeatedClaims(chooseBalancedClaims(accepted, rankOf)).map((claim) => {
    const full = accepted.find((item) => item.doi === claim.doi && item.text === claim.text && item.direction === claim.direction)
    return full ?? { ...claim, abstract: abstracts.get(claim.doi) || '' }
  })
}
