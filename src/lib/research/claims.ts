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

export function chooseBalancedClaims(claims: PaperClaim[]): PaperClaim[] {
  const perPaper = new Map<string, PaperClaim[]>()
  const limited: PaperClaim[] = []
  for (const claim of claims) {
    const used = perPaper.get(claim.doi) ?? []
    if (used.length >= 2) continue
    used.push(claim)
    perPaper.set(claim.doi, used)
    limited.push(claim)
  }
  const benefit = limited.filter((claim) => claim.direction === 'benefit')
  const nulls = limited.filter((claim) => claim.direction === 'null')
  const mixed = limited.filter((claim) => claim.direction === 'mixed')
  const picked: PaperClaim[] = []
  if (benefit[0]) picked.push(benefit[0])
  if (nulls[0]) picked.push(nulls[0])
  for (const claim of [...benefit.slice(1), ...nulls.slice(1), ...mixed]) {
    if (picked.length >= 5) break
    if (!picked.includes(claim)) picked.push(claim)
  }
  return picked
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
  papers: { doi: string; abstract: string }[],
  claims: PaperClaim[],
  restatements: { doi: string; text: string }[] = [],
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
    if (!claimBelongsToAbstract(text, abstract)) continue
    if (unsupportedNumbers(text, abstract).length) text = stripTokens(text, unsupportedNumbers(text, abstract))
    if (text.split(/\s+/).length < 6) continue
    accepted.push({ ...claim, text, abstract })
  }
  return chooseBalancedClaims(accepted).map((claim) => {
    const full = accepted.find((item) => item.doi === claim.doi && item.text === claim.text && item.direction === claim.direction)
    return full ?? { ...claim, abstract: abstracts.get(claim.doi) || '' }
  })
}
