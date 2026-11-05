import { matchesIntervention, numericTokens, studyRank } from '@/lib/research/claims'
import { normalizeSpan } from '@/lib/research/extract'
import { cleanDoi } from '@/lib/research/papers'
import { attributionMismatch, copiedContentRun, directionConflict, numberMatches } from '@/lib/research/text-checks.mjs'

export const JUDGE_PROMPT = 'Given this abstract, is this sentence fully supported, including the direction of the effect? Answer yes or no.'

export type WrittenSentence = { text: string; paper_id: string; numbers: string[] }

export type WritingPaper = {
  doi: string
  title: string
  abstract: string
  rank: number
}

const COMMON_WORDS = new Set(`
a an the of to and or in on for with from by at as is was were are be been being
this that these those it its their they he she his her who whom which
found showed reported compared noted observed concluded suggested indicated
among between after before during within without following across
trial study studies result results group groups control placebo vaccine vaccines
efficacy effective benefit benefits difference mixed superior harm harmful
noninferior noninferiority regimen regimens month months year years week weeks
children adults participants patients persons people men women
early time restricted feeding eating fasting insulin sensitivity
phase randomized randomised controlled double blind primary secondary
seasonal standard shorter treatment treated received enrolled enrollment
lower higher reduced improved improvement significant significantly
not no yes than then also only more most less well
large larger largest small smaller high highly protective indicated indication
human infection infections controlled control optimization discuss discusses
against about into over under very much many some such these those
author published journal clinical malaria tuberculosis pulmonary drug susceptible
`.split(/\s+/).filter(Boolean))

export function readWritten(payload: unknown): WrittenSentence[] | null {
  const answer = payload && typeof payload === 'object' && 'answer' in (payload as object)
    ? (payload as { answer: unknown }).answer
    : payload
  if (!answer || typeof answer !== 'object' || !('sentences' in (answer as object))) return null
  const rows = (answer as { sentences?: unknown }).sentences
  if (!Array.isArray(rows)) return null
  if (rows.some((row) => row && typeof row === 'object' && 'urls' in (row as object))) return null
  const looksWritten = rows.length === 0 || rows.some((row) => row && typeof row === 'object' && ('paper_id' in (row as object) || 'doi' in (row as object)))
  if (!looksWritten) return null
  const out: WrittenSentence[] = []
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const record = row as { paper_id?: unknown; doi?: unknown; text?: unknown; numbers?: unknown }
    const paper_id = cleanDoi(String(record.paper_id ?? record.doi ?? ''))
    const text = String(record.text ?? '').trim()
    if (!paper_id || !text) continue
    const numbers = Array.isArray(record.numbers) ? record.numbers.map((item) => String(item)) : []
    out.push({ text, paper_id: paper_id.toLowerCase(), numbers })
  }
  return out
}

export function readJudge(payload: unknown): { supported: boolean; reason: string } | null {
  const answer = payload && typeof payload === 'object' && 'answer' in (payload as object)
    ? (payload as { answer: unknown }).answer
    : payload
  if (!answer || typeof answer !== 'object') return null
  const record = answer as { supported?: unknown; reason?: unknown; answer?: unknown }
  if (typeof record.supported === 'boolean') {
    return { supported: record.supported, reason: String(record.reason ?? '') }
  }
  const text = String(record.answer ?? record.reason ?? '').toLowerCase()
  if (text.startsWith('yes')) return { supported: true, reason: text }
  if (text.startsWith('no')) return { supported: false, reason: text }
  return null
}

/** RCTs, phase 3 trials, noninferiority trials, and meta-analyses outrank other papers. */
export function isPriorityStudy(paper: WritingPaper): boolean {
  const text = `${paper.title}\n${paper.abstract}`.toLowerCase()
  return /phase\s*3|phase\s*iii|non-?inferior|\brandomi[sz]ed\b|\brct\b|meta-analysis|systematic review/.test(text)
}

export function trialScore(paper: WritingPaper): number {
  const text = `${paper.title}\n${paper.abstract}`.toLowerCase()
  let score = 100 - paper.rank * 20
  if (/phase\s*3|phase\s*iii/.test(text)) score += 50
  if (/non-?inferior/.test(text)) score += 40
  if (/\brandomi[sz]ed controlled\b|\brct\b|\bdouble-blind\b|\bdouble blind\b/.test(text)) score += 25
  else if (/\brandomi[sz]ed\b/.test(text)) score += 20
  if (/meta-analysis|systematic review/.test(text)) score += 45
  if (/placebo-controlled|placebo controlled/.test(text)) score += 10
  if (/\bcommentary\b|\beditorial\b|\bnarrative review\b/.test(text) && !/meta-analysis|systematic review/.test(text)) score -= 30
  return score
}

function aboutQuestion(question: string, paper: WritingPaper): boolean {
  return matchesIntervention(question, `${paper.title}\n${paper.abstract}`)
}

/** The highest-ranked relevant trial. No paper is pinned to a question. */
export function headlineTrial(question: string, papers: WritingPaper[]): string | null {
  const matching = papers.filter((paper) => aboutQuestion(question, paper))
  const priority = matching.filter((paper) => isPriorityStudy(paper) || paper.rank < 2)
  const pool = priority.length ? priority : matching
  if (!pool.length) return null
  return [...pool].sort((a, b) => trialScore(b) - trialScore(a) || a.doi.localeCompare(b.doi))[0].doi
}

export function selectWritingPapers(question: string, papers: WritingPaper[]): WritingPaper[] {
  const headline = headlineTrial(question, papers)
  const matching = papers.filter((paper) => aboutQuestion(question, paper))
  const pool = matching.filter((paper) => paper.doi === headline || isPriorityStudy(paper) || paper.rank < 2)
  const chosen = (pool.length ? pool : matching).slice()
  chosen.sort((a, b) => {
    if (a.doi === headline) return -1
    if (b.doi === headline) return 1
    return trialScore(b) - trialScore(a) || a.doi.localeCompare(b.doi)
  })
  const seen = new Set<string>()
  const out: WritingPaper[] = []
  for (const paper of chosen) {
    if (seen.has(paper.doi)) continue
    seen.add(paper.doi)
    out.push(paper)
    if (out.length >= 5) break
  }
  return out
}

export function primaryDois(question: string, papers: WritingPaper[]): string[] {
  const headline = headlineTrial(question, papers)
  return headline ? [headline] : []
}

const APPROXIMATE = /(?:over|about|approximately|nearly|around|more than|~)\s+$/i
const COUNT_NOUN = 'participants|children|adults|patients|people|men|women|persons|individuals'
const ENROLL_WORD = /randomi[sz](?:ed|ation)|enrolled|enrollment|underwent randomization|undergone randomization/i
const SCREEN_WORD = /screen(?:ed|ing)?/i

/** The exact person-count printed in the abstract. Prefer randomized or enrolled over screened. */
export function enrollmentNumber(abstract: string): string | null {
  const hits: { token: string; score: number }[] = []
  const pattern = new RegExp(`(\\d{1,3}(?:,\\d{3})+|\\d{1,6})(?=\\s+(?:${COUNT_NOUN})\\b)`, 'gi')
  for (const match of abstract.matchAll(pattern)) {
    const start = match.index ?? 0
    const before = abstract.slice(Math.max(0, start - 40), start)
    if (APPROXIMATE.test(before)) continue
    const value = Number(match[1].replace(/,/g, ''))
    if (!Number.isFinite(value) || value < 8) continue
    const window = abstract.slice(Math.max(0, start - 64), start + match[0].length + 40)
    let score = 0
    if (ENROLL_WORD.test(window)) score += 5
    if (SCREEN_WORD.test(before) && !ENROLL_WORD.test(before)) score -= 5
    if (match[1].includes(',')) score += 1
    hits.push({ token: match[1], score })
  }
  if (!hits.length) return null
  hits.sort((a, b) => b.score - a.score || b.token.length - a.token.length)
  if (hits[0].score < 0) return null
  return hits[0].token
}

function isScreenedCount(token: string, abstract: string): boolean {
  const digits = token.replace(/[^\d]/g, '')
  if (!digits) return false
  const pattern = new RegExp(`(?:${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${digits})`, 'i')
  const match = pattern.exec(abstract)
  if (!match || match.index == null) return false
  const before = abstract.slice(Math.max(0, match.index - 48), match.index)
  return SCREEN_WORD.test(before) && !ENROLL_WORD.test(before)
}

export function sameNumber(text: string, figure: string): boolean {
  return numberMatches(figure, text)
}

/** Keep model-proposed facts only when the abstract prints them. Enrollment prefers the randomized count. */
export function requiredFacts(abstract: string, proposed: string[] = []): string[] {
  const facts: string[] = []
  const enrollment = enrollmentNumber(abstract)
  if (enrollment) facts.push(enrollment)
  for (const fact of proposed) {
    const cleaned = fact.trim()
    if (!cleaned) continue
    if (facts.some((have) => have.toLowerCase() === cleaned.toLowerCase() || (/\d/.test(have) && /\d/.test(cleaned) && numberMatches(have, cleaned) && numberMatches(cleaned, have)))) continue
    if (/\d/.test(cleaned)) {
      if (!numberMatches(cleaned, abstract)) continue
      if (isScreenedCount(cleaned, abstract)) continue
      facts.push(cleaned)
    } else if (abstract.toLowerCase().includes(cleaned.toLowerCase())) {
      facts.push(cleaned)
    }
  }
  return [...new Set(facts)]
}

export type ModelFact = { paper_id: string; enrollment: string; effects: string[] }

export function readModelFacts(payload: unknown): ModelFact[] {
  const answer = payload && typeof payload === 'object' && 'answer' in (payload as object)
    ? (payload as { answer: unknown }).answer
    : payload
  const rows = answer && typeof answer === 'object' ? (answer as { facts?: unknown }).facts : null
  if (!Array.isArray(rows)) return []
  const out: ModelFact[] = []
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const record = row as { paper_id?: unknown; enrollment?: unknown; effects?: unknown }
    const paper_id = (cleanDoi(String(record.paper_id ?? '')) || '').toLowerCase()
    if (!paper_id) continue
    const effects = Array.isArray(record.effects) ? record.effects.map((item) => String(item)) : []
    out.push({ paper_id, enrollment: String(record.enrollment ?? '').trim(), effects })
  }
  return out
}

/** A judge rejection that is only about who the sentence names, not the finding. */
export function attributionOnlyReason(reason: string): boolean {
  const text = reason.toLowerCase()
  if (!/attribut|author|surname|\byear\b|named|citation wording|\(\d{4}\)/.test(text)) return false
  if (/efficacy|direction|contradict|number|population|outcome|not (?:state|support|mention)|absent|invent|sample/.test(text)) return false
  return true
}

export function missingFacts(sentence: string, facts: string[]): string[] {
  return facts.filter((fact) => {
    if (/\d/.test(fact)) return !numberMatches(fact, sentence)
    return !sentence.toLowerCase().includes(fact.toLowerCase())
  })
}

export function isFiller(sentence: string, abstract: string): boolean {
  if (numericTokens(sentence).some((token) => significantNumber(token))) return false
  const finding = /non-?inferior|\befficacy\b|no difference|no effect|did not|do not|improved|reduced|reduction|benefit|as effective|superior|unaffected|not significant|prevented|protection|sensitivity|unchanged|better|worse/i
  return !(finding.test(sentence) && finding.test(abstract))
}

function significantNumber(token: string): boolean {
  if (/%/.test(token)) return true
  const bare = token.replace(/[, ]/g, '')
  if (/^\d{4}$/.test(bare)) {
    const year = Number(bare)
    if (year >= 1990 && year <= 2030) return false
  }
  return /^\d+$/.test(bare) && Number(bare) >= 10
}

/** A number is allowed only when those digits are printed. Sums of other numbers are not. */
function printedVerbatim(token: string, abstract: string): boolean {
  return numberMatches(token, abstract)
}

export function normalizedSentence(text: string): string {
  return normalizeSpan(text).replace(/\b\d+\b/g, '#').replace(/\s+/g, ' ').trim()
}

export function truncatedTokens(sentence: string, abstract: string): string[] {
  const abstractWords = normalizeSpan(abstract).split(' ').filter((word) => word.length >= 4)
  const abstractSet = new Set(abstractWords)
  const bad: string[] = []
  for (const word of normalizeSpan(sentence).split(' ')) {
    if (word.length < 4 || word.length > 8) continue
    if (COMMON_WORDS.has(word) || abstractSet.has(word)) continue
    if (/^\d/.test(word)) continue
    const stem = abstractWords.find((full) => full.startsWith(word) && full.length >= word.length + 3)
    if (stem) bad.push(word)
  }
  return [...new Set(bad)]
}

export type SentenceAttribution = { author?: string; year?: string }

export function sentenceProblems(sentence: string, abstract: string, abstracts: string[], attribution?: SentenceAttribution): string[] {
  const problems: string[] = []
  const text = sentence.replace(/\[\d+\]/g, ' ')
  if (/[\u2014]/.test(sentence)) problems.push('em dash')
  if (/\(\s*\)/.test(sentence) || /\(\s*[,.]/.test(sentence)) problems.push('empty parentheses')
  if (/not explicitly stated|\bsnippet\b|as an ai|model note|unspecified number|not stated|not reported/i.test(sentence)) problems.push('meta note')
  if (/\bthousands of\b|\bunspecified (?:number|sample)\b/i.test(text) && enrollmentNumber(abstract)) problems.push('vague sample size')
  problems.push(...attributionMismatch(text, attribution?.author || '', attribution?.year || ''))
  let copiedSpan = ''
  for (const item of abstracts) {
    const copy = copiedContentRun(text, item, 8)
    if (copy.copied) {
      copiedSpan = copy.span
      break
    }
  }
  if (copiedSpan) problems.push(`copied abstract wording: "${copiedSpan}"`)
  for (const token of [...numericTokens(text), ...numericTokens(sentence)]) {
    if (!significantNumber(token)) continue
    if (!printedVerbatim(token, abstract)) problems.push(`number ${token} is not in this abstract`)
  }
  const truncated = truncatedTokens(text, abstract)
  if (truncated.length) problems.push(`truncated words: ${truncated.join(', ')}`)
  const conflict = directionConflict(text, abstract)
  if (conflict) problems.push(conflict)
  if (isFiller(text, abstract)) problems.push('no finding')
  return [...new Set(problems)]
}

export function auditSentences(
  rows: { text: string; paper_id: string }[],
  abstracts: Map<string, string>,
  headline = '',
  facts: Map<string, string[]> = new Map(),
  people: Map<string, SentenceAttribution> = new Map(),
): { ok: { text: string; paper_id: string }[]; failures: string[] } {
  const failures: string[] = []
  const ok: { text: string; paper_id: string }[] = []
  const seen = new Set<string>()
  const all = [...abstracts.values()]
  for (const row of rows) {
    const abstract = abstracts.get(row.paper_id) || ''
    if (!abstract) {
      failures.push(`${row.paper_id}: not a selected paper`)
      continue
    }
    const key = normalizedSentence(row.text)
    if (seen.has(key)) {
      failures.push(`${row.paper_id}: duplicate sentence`)
      continue
    }
    seen.add(key)
    const problems = sentenceProblems(row.text, abstract, all, people.get(row.paper_id))
    if (row.paper_id === headline) {
      const expected = facts.get(row.paper_id) ?? requiredFacts(abstract)
      const missing = missingFacts(row.text, expected)
      if (missing.length) problems.push(`missing enrollment ${missing.join(', ')}`)
    }
    if (problems.length) {
      failures.push(`${row.paper_id}: ${problems.join('; ')}`)
      continue
    }
    ok.push(row)
  }
  if (ok.length < 2) failures.push(`only ${ok.length} sentences passed; 2 to 5 are required`)
  if (ok.length > 5) failures.push('more than 5 sentences')
  return { ok, failures }
}

export function coversPrimary(question: string, papers: WritingPaper[], kept: { paper_id: string }[]): boolean {
  const required = primaryDois(question, papers)
  if (!required.length) return kept.length >= 2
  return kept.some((row) => required.includes(row.paper_id))
}

export function withMarker(text: string, n: number): string {
  const body = text.replace(/\[\d+\]/g, ' ').replace(/\s+/g, ' ').trim().replace(/[.]+$/, '')
  return `${body} [${n}].`
}

export { studyRank }
