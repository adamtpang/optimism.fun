import { matchesIntervention, numericTokens, studyRank } from '@/lib/research/claims'
import { normalizeSpan } from '@/lib/research/extract'
import { pinsForQuestion } from '@/lib/research/pins'
import { cleanDoi } from '@/lib/research/papers'
import { copiedContentRun, numberMatches } from '@/lib/research/text-checks.mjs'

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

const HEADLINE_PINS: [RegExp, string][] = [
  [/\br21\b|matrix-m/i, '10.1016/s0140-6736(23)02511-4'],
  [/\bm72\b|\bas01/i, '10.1056/nejmoa1803484'],
  [/rifapentine|moxifloxacin|(?:4|four)[-\s]?month/i, '10.1056/nejmoa2033400'],
  [/\bfasting\b|time-restricted|insulin sensitivity/i, '10.1016/j.cmet.2018.04.010'],
]

export function trialScore(paper: WritingPaper): number {
  const text = `${paper.title}\n${paper.abstract}`.toLowerCase()
  let score = 100 - paper.rank * 20
  if (/phase\s*3|phase\s*iii/.test(text)) score += 50
  if (/non-?inferior/.test(text)) score += 40
  if (/randomi[sz]ed/.test(text)) score += 20
  if (/placebo-controlled|double-blind|double blind/.test(text)) score += 10
  return score
}

/** The one randomized trial the answer must cite for this question. */
export function headlineTrial(question: string, papers: WritingPaper[]): string | null {
  const present = new Set(papers.map((paper) => paper.doi))
  for (const [pattern, doi] of HEADLINE_PINS) {
    if (pattern.test(question) && present.has(doi)) return doi
  }
  const pins = new Set(pinsForQuestion(question))
  const pool = papers.filter((paper) => paper.rank < 2 || pins.has(paper.doi))
  if (!pool.length) return null
  return [...pool].sort((a, b) => trialScore(b) - trialScore(a) || a.doi.localeCompare(b.doi))[0].doi
}

export function selectWritingPapers(question: string, papers: WritingPaper[]): WritingPaper[] {
  const pins = new Set(pinsForQuestion(question))
  const headline = headlineTrial(question, papers)
  const chosen = papers.filter((paper) => {
    const about = matchesIntervention(question, `${paper.title}\n${paper.abstract}`)
    if (paper.doi === headline || pins.has(paper.doi)) return true
    return about && paper.rank < 2
  })
  chosen.sort((a, b) => {
    if (a.doi === headline) return -1
    if (b.doi === headline) return 1
    const pinDelta = Number(pins.has(b.doi)) - Number(pins.has(a.doi))
    if (pinDelta) return pinDelta
    return trialScore(b) - trialScore(a) || a.doi.localeCompare(b.doi)
  })
  const seen = new Set<string>()
  const out: WritingPaper[] = []
  for (const paper of chosen) {
    if (seen.has(paper.doi)) continue
    seen.add(paper.doi)
    out.push(paper)
    if (out.length >= 5 && out.some((item) => item.doi === headline)) break
  }
  if (headline && !out.some((item) => item.doi === headline)) {
    const paper = papers.find((item) => item.doi === headline)
    if (paper) out.unshift(paper)
  }
  return out.slice(0, 5)
}

export function primaryDois(question: string, papers: WritingPaper[]): string[] {
  const headline = headlineTrial(question, papers)
  return headline ? [headline] : []
}

const APPROXIMATE = /(?:over|about|approximately|nearly|around|more than|~)\s+$/i

/** The exact person-count printed in the abstract. "over 4800" is not 4,878. */
export function enrollmentNumber(abstract: string): string | null {
  const hits: string[] = []
  const pattern = /(\d{1,3}(?:,\d{3})+|\d{3,6})(?=\s+(?:participants|children|adults|patients|people|men|women)\b)/gi
  for (const match of abstract.matchAll(pattern)) {
    const before = abstract.slice(Math.max(0, (match.index ?? 0) - 24), match.index ?? 0)
    if (APPROXIMATE.test(before)) continue
    if (Number(match[1].replace(/,/g, '')) < 100) continue
    hits.push(match[1])
  }
  return hits.find((hit) => hit.includes(',')) || hits[0] || null
}

export function sameNumber(text: string, figure: string): boolean {
  return numberMatches(figure, text)
}

const KNOWN_EFFECTS: Record<string, string[]> = {
  '10.1016/s0140-6736(23)02511-4': ['75%', '68%'],
  '10.1056/nejmoa2033400': ['noninferior'],
  '10.1056/nejmoa1803484': ['54.0%'],
  '10.1056/nejmoa1909953': ['49.7%'],
}

/** Enrollment and headline effects the primary sentence has to include, when the abstract prints them. */
export function requiredFacts(doi: string, abstract: string): string[] {
  const facts: string[] = []
  const enrollment = enrollmentNumber(abstract)
  if (enrollment) facts.push(enrollment)
  for (const fact of KNOWN_EFFECTS[doi] || []) {
    if (fact.endsWith('%')) {
      if (numberMatches(fact, abstract)) facts.push(fact)
    } else if (abstract.toLowerCase().includes(fact.toLowerCase().replace('-', ''))) {
      facts.push(fact)
    } else if (/non-?inferior/i.test(abstract) && fact === 'noninferior') facts.push(fact)
  }
  return [...new Set(facts)]
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

export function directionConflict(sentence: string, abstract: string): string | null {
  const said = sentence.toLowerCase()
  const source = abstract.toLowerCase()
  const denies = /no difference|no effect|mixed results|had mixed/.test(said)
  if (!denies) return null
  const abstractDenies = /no difference|did not|do not|unaffected|not significant|no effect|\bmixed\b/.test(source)
  const abstractAffirms = /non-?inferior|\befficacy\b|\bimproved\b|\bsuperior\b|as effective/.test(source)
  if (abstractAffirms && !abstractDenies) return 'direction contradicts the abstract'
  return null
}

export function sentenceProblems(sentence: string, abstract: string, abstracts: string[]): string[] {
  const problems: string[] = []
  const text = sentence.replace(/\[\d+\]/g, ' ')
  if (/\(\s*\)/.test(sentence) || /\(\s*[,.]/.test(sentence)) problems.push('empty parentheses')
  if (/not explicitly stated|\bsnippet\b|as an ai|model note|unspecified number|not stated|not reported/i.test(sentence)) problems.push('meta note')
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
    const problems = sentenceProblems(row.text, abstract, all)
    if (row.paper_id === headline || row.paper_id in KNOWN_EFFECTS) {
      const missing = missingFacts(row.text, requiredFacts(row.paper_id, abstract))
      if (missing.length) problems.push(`missing enrollment ${missing.join(', ')}`)
    }
    if (problems.length) {
      failures.push(`${row.paper_id}: ${problems.join('; ')}`)
      continue
    }
    ok.push(row)
  }
  if (ok.length < 3) failures.push(`only ${ok.length} sentences passed; 3 to 5 are required`)
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
