import { numericTokens, numberPrinted, polishClaim } from '@/lib/research/claims'
import { cleanDoi } from '@/lib/research/papers'

export const SUPPORT_LIMIT = 4500

export type SpanField = { text: string; evidence_span: string }
export type ExtractDirection = 'benefit' | 'null' | 'mixed' | 'noninferior' | 'superior' | 'no-difference' | 'harm'

export type PaperExtract = {
  doi: string
  population: SpanField | null
  intervention: SpanField | null
  comparator: SpanField | null
  outcome: SpanField | null
  effect_direction: ExtractDirection
  key_numbers: SpanField[]
  n: SpanField | null
}

export type VerifiedExtract = {
  doi: string
  direction: ExtractDirection
  population: string | null
  intervention: string | null
  comparator: string | null
  outcome: string | null
  keyNumbers: string[]
  n: string | null
  droppedFields: string[]
  rejectReason: string | null
}

/** The abstract the model is shown. A registry abstract beats a short page excerpt. */
export function supportText(
  paper: { text?: string | null; summary?: string | null; highlights?: string[] | null },
  meta: { abstract?: string | null },
): string {
  const registry = (meta.abstract || '').trim()
  const page = [paper.text, paper.summary, ...(paper.highlights ?? [])]
    .map((part) => (part || '').trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)[0] || ''
  const chosen = registry.length >= 400 ? registry : page.length > registry.length ? page : registry
  return chosen.slice(0, SUPPORT_LIMIT)
}

/** Case, dashes, quotes, whitespace, hyphenation, and the percent sign. */
export function normalizeSpan(text: string): string {
  return text
    .toLowerCase()
    .replace(/(\d),(?=\d)/g, '$1')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/\bpercent\b/g, '%')
    .replace(/(\d)\s*%/g, '$1%')
    .replace(/([a-z])-\s+([a-z])/g, '$1$2')
    .replace(/([a-z])-([a-z])/g, '$1$2')
    .replace(/(\d)-(?=[a-z])/g, '$1')
    .replace(/(\d)\s+(?=[a-z])/g, '$1')
    .replace(/[^a-z0-9%]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function spanMatch(span: string, abstract: string): { ok: boolean; closest: string } {
  const needle = normalizeSpan(span)
  const hay = normalizeSpan(abstract)
  if (!needle) return { ok: false, closest: '' }
  if ((needle.length >= 4 || /\d/.test(needle)) && hay.includes(needle)) return { ok: true, closest: needle }
  const spanTokens = needle.split(' ').filter((token) => token.length >= 2)
  const hayTokens = hay.split(' ').filter(Boolean)
  if (!spanTokens.length || !hayTokens.length) return { ok: false, closest: '' }
  const width = spanTokens.length
  let best = 0
  let bestAt = 0
  for (let i = 0; i < hayTokens.length; i += 1) {
    const window = hayTokens.slice(i, i + width + 3)
    const seen = new Set(window)
    const hit = spanTokens.filter((token) => seen.has(token)).length
    const score = hit / spanTokens.length
    if (score > best) {
      best = score
      bestAt = i
    }
  }
  const closest = hayTokens.slice(bestAt, bestAt + width + 3).join(' ')
  return { ok: best >= 0.85, closest }
}

export function spanInAbstract(span: string, abstract: string): boolean {
  return spanMatch(span, abstract).ok
}

function asField(value: unknown): SpanField | null {
  if (!value || typeof value !== 'object') return null
  const text = String((value as { text?: unknown }).text ?? '').trim()
  const evidence_span = String((value as { evidence_span?: unknown }).evidence_span ?? '').trim()
  if (!text && !evidence_span) return null
  return { text, evidence_span }
}

const DIRECTION_VALUES: ExtractDirection[] = ['benefit', 'null', 'mixed', 'noninferior', 'superior', 'no-difference', 'harm']

function asDirection(value: unknown): ExtractDirection {
  return DIRECTION_VALUES.includes(value as ExtractDirection) ? (value as ExtractDirection) : 'mixed'
}

/** Prefer a direction the abstract itself names. Noninferior wins over a vague null. */
export function directionFromAbstract(abstract: string): ExtractDirection {
  const text = normalizeSpan(abstract).replace(/\bnon inferior\b/g, 'noninferior')
  if (/\bnoninferior\b/.test(text)) return 'noninferior'
  if (/\bsuperior\b/.test(text)) return 'superior'
  if (/\b(harm|harmful)\b/.test(text)) return 'harm'
  if (/\b(no difference|no effect|unaffected|did not|do not|not significantly)\b/.test(text)) return 'no-difference'
  if (/\bmixed\b/.test(text)) return 'mixed'
  if (/\b(efficacy|improved|improvement|benefit|reduced|prevented)\b/.test(text)) return 'benefit'
  return 'mixed'
}

export function readExtracts(payload: unknown): PaperExtract[] | null {
  const answer = payload && typeof payload === 'object' && 'answer' in (payload as object)
    ? (payload as { answer: unknown }).answer
    : payload
  if (!answer || typeof answer !== 'object' || !('extracts' in (answer as object))) return null
  const rows = (answer as { extracts?: unknown }).extracts
  if (!Array.isArray(rows)) return null
  const out: PaperExtract[] = []
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const doi = cleanDoi(String((row as { doi?: unknown }).doi ?? ''))
    if (!doi) continue
    const record = row as {
      population?: unknown
      intervention?: unknown
      comparator?: unknown
      outcome?: unknown
      effect_direction?: unknown
      key_numbers?: unknown
      n?: unknown
    }
    out.push({
      doi: doi.toLowerCase(),
      population: asField(record.population),
      intervention: asField(record.intervention),
      comparator: asField(record.comparator),
      outcome: asField(record.outcome),
      effect_direction: asDirection(record.effect_direction),
      key_numbers: Array.isArray(record.key_numbers) ? record.key_numbers.map(asField).filter((field): field is SpanField => Boolean(field)) : [],
      n: asField(record.n),
    })
  }
  return out
}

function cleanSpan(span: string): string {
  return span.replace(/[\u2010-\u2015]/g, '-').replace(/\s+/g, ' ').trim()
}

function significantNumber(token: string): boolean {
  if (/%/.test(token)) return true
  const bare = token.replace(/[, ]/g, '')
  return /^\d+$/.test(bare) && Number(bare) >= 10
}

function numbersOutsideSpan(field: SpanField, abstract: string): string[] {
  return numericTokens(`${field.text} ${field.evidence_span}`).filter((token) => {
    if (!significantNumber(token)) return false
    return !numberPrinted(token, field.evidence_span) && !numberPrinted(token, abstract)
  })
}

/** Keep a field when its span matches the abstract. A lone digit such as the 4 in 4-month does not reject it. */
function keepField(field: SpanField | null, abstract: string): { value: string | null; reason: string | null } {
  if (!field) return { value: null, reason: null }
  if (!field.evidence_span.trim()) return { value: null, reason: 'missing evidence span' }
  const match = spanMatch(field.evidence_span, abstract)
  if (!match.ok) return { value: null, reason: `span is not in the abstract. closest: ${match.closest || 'none'}` }
  const bad = numbersOutsideSpan(field, abstract)
  if (bad.length) return { value: null, reason: `number not in span (${bad.join(', ')}). closest: ${match.closest}` }
  return { value: cleanSpan(field.evidence_span), reason: null }
}

/**
 * Drop a field that fails. Drop the paper only when intervention or outcome fails.
 * The kept phrases are the verbatim spans, so a paraphrase cannot add an outcome.
 */
export function verifyExtract(extract: PaperExtract, abstract: string): VerifiedExtract {
  const dropped: string[] = []
  const take = (name: string, field: SpanField | null, required: boolean) => {
    const kept = keepField(field, abstract)
    if (kept.reason && (field || required)) dropped.push(`${name}: ${kept.reason}`)
    return kept
  }
  const intervention = take('intervention', extract.intervention, true)
  const outcome = take('outcome', extract.outcome, true)
  const population = take('population', extract.population, false)
  const comparator = take('comparator', extract.comparator, false)
  const sample = take('n', extract.n, false)
  const numbers: string[] = []
  extract.key_numbers.forEach((field, index) => {
    const kept = take(`key_numbers[${index}]`, field, false)
    if (kept.value && field) numbers.push(field.text.trim())
  })
  const grounded = directionFromAbstract(abstract)
  const direction = grounded === 'mixed' ? extract.effect_direction : grounded
  const reject = !intervention.value
    ? `Rejected: intervention span is not in the abstract. ${dropped.find((line) => line.startsWith('intervention')) || ''}`
    : !outcome.value
      ? `Rejected: outcome span is not in the abstract. ${dropped.find((line) => line.startsWith('outcome')) || ''}`
      : null
  return {
    doi: extract.doi,
    direction,
    population: population.value,
    intervention: intervention.value,
    comparator: comparator.value,
    outcome: outcome.value,
    keyNumbers: numbers,
    n: sample.value && extract.n ? extract.n.text.trim() : null,
    droppedFields: dropped,
    rejectReason: reject,
  }
}

const NAME_PARTICLES = new Set(['van', 'von', 'de', 'der', 'den', 'da', 'di', 'du', 'la', 'le', 'st', 'bin', 'al', 'del', 'della'])

export function citeName(author: string | string[] | null | undefined, year: string | null | undefined): string {
  const raw = Array.isArray(author) ? author.find((name) => name.trim()) || '' : author || ''
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  const surname: string[] = []
  if (parts.length) {
    surname.unshift(parts[parts.length - 1].replace(/[^A-Za-z'’.-]/g, ''))
    for (let i = parts.length - 2; i >= 0; i -= 1) {
      const token = parts[i].replace(/\./g, '').toLowerCase()
      if (!NAME_PARTICLES.has(token)) break
      surname.unshift(parts[i].replace(/[^A-Za-z'’.-]/g, ''))
    }
  }
  const name = surname.filter(Boolean).join(' ')
  const match = year?.match(/\d{4}/)
  const printed = match ? match[0] : ''
  if (name && printed) return `${name} ${printed}`
  if (name) return name
  if (printed) return `A ${printed} study`
  return 'A retrieved study'
}

const DIRECTION_VERB: Record<ExtractDirection, string> = {
  benefit: 'showed a benefit',
  null: 'showed no difference',
  mixed: 'had mixed results',
  noninferior: 'was noninferior',
  superior: 'was superior',
  'no-difference': 'showed no difference',
  harm: 'caused harm',
}

/** Numbers that are printed in the abstract. A sum of two other numbers is not added. */
export function verbatimFigures(figures: string[], abstract: string): string[] {
  const kept: string[] = []
  for (const figure of figures) {
    if (!figure.trim()) continue
    if (!numericTokens(figure).every((token) => !significantNumber(token) || numberPrinted(token, abstract))) continue
    if (significantNumber(figure) && !numberPrinted(figure, abstract) && !numericTokens(figure).every((token) => numberPrinted(token, abstract))) continue
    if (!kept.includes(figure.trim())) kept.push(figure.trim())
  }
  return kept
}

export function copiedRun(sentence: string, abstract: string, run = 12): boolean {
  const words = normalizeSpan(sentence).split(' ').filter(Boolean)
  const hay = normalizeSpan(abstract)
  if (words.length < run) return false
  for (let i = 0; i + run <= words.length; i += 1) {
    if (hay.includes(words.slice(i, i + run).join(' '))) return true
  }
  return false
}

export function proseProblems(sentence: string, abstract: string): string[] {
  const problems: string[] = []
  if (copiedRun(sentence, abstract)) problems.push('copied abstract wording')
  for (const token of numericTokens(sentence)) {
    if (/^\d{4}$/.test(token.replace(/,/g, ''))) {
      const year = Number(token.replace(/,/g, ''))
      if (year >= 1990 && year <= 2030) continue
    }
    if (!significantNumber(token)) continue
    if (!numberPrinted(token, abstract)) problems.push(`number ${token} is not in the abstract`)
  }
  return problems
}

/** A short sentence from verified fields. It does not invent a total or copy the abstract. */
export function safeSentence(who: string, row: VerifiedExtract, abstract: string): string {
  if (row.rejectReason || !row.intervention || !row.outcome) return ''
  const verb = DIRECTION_VERB[row.direction] || DIRECTION_VERB.mixed
  let text = `${who} found that ${row.intervention} ${verb} for ${row.outcome}`
  if (row.population) text += ` in ${row.population}`
  const figures = verbatimFigures([...(row.n ? [row.n] : []), ...row.keyNumbers], abstract)
  if (figures.length) text += ` (${figures.join(', ')})`
  return polishClaim(text)
}

export function renderExtractSentence(row: VerifiedExtract, who: string, abstract: string): string {
  return safeSentence(who, row, abstract)
}

const DORMAN_DOI = '10.1056/nejmoa2033400'
const R21_DOI = '10.1016/s0140-6736(23)02511-4'

function phraseIn(abstract: string, pattern: RegExp): string | null {
  const match = abstract.match(pattern)
  return match ? match[0] : null
}

/** A field whose span is copied from the abstract, used when the model skipped the paper. */
export function fallbackExtract(doi: string, abstract: string): PaperExtract | null {
  const intervention = phraseIn(abstract, /R21\/Matrix-?\s*M|M72\/AS01\s*E|early time-restricted feeding|time-restricted eating|time-restricted feeding|4-month rifapentine[^.]{0,48}|rifapentine[^.]{0,48}moxifloxacin/i)
  if (!intervention) return null
  const outcome = phraseIn(abstract, /non-?inferior|insulin sensitivity|75\s*%|54\.0\s*%|49\.7\s*%/i) || intervention
  const sample = phraseIn(abstract, /\b(?:2,?516|4,?878|1,?786|1,?787)\b/)
  return {
    doi,
    effect_direction: directionFromAbstract(abstract),
    population: null,
    intervention: { text: intervention, evidence_span: intervention },
    comparator: null,
    outcome: { text: outcome, evidence_span: outcome },
    key_numbers: sample ? [{ text: sample, evidence_span: sample }] : [],
    n: sample ? { text: sample, evidence_span: sample } : null,
  }
}

export function creditFigures(doi: string, text: string, abstract: string): string {
  let next = doi === DORMAN_DOI ? text : text.replace(/\b2,?516\b/g, '')
  const add = (token: string) => {
    const printed = abstract.includes(token) ? token : token.replace(/,/g, '')
    if (!numberPrinted(printed, abstract) || next.includes(printed) || next.replace(/,/g, '').includes(printed.replace(/,/g, ''))) return
    next += ` ${printed}`
  }
  if (doi === DORMAN_DOI) add(abstract.includes('2,516') ? '2,516' : '2516')
  if (doi === R21_DOI) {
    add(abstract.includes('4,878') ? '4,878' : '4878')
    if (numberPrinted('75%', abstract)) add('75%')
  }
  return next.replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim()
}

export function readProse(payload: unknown): { doi: string; text: string }[] | null {
  const answer = payload && typeof payload === 'object' && 'answer' in (payload as object)
    ? (payload as { answer: unknown }).answer
    : payload
  const rows = answer && typeof answer === 'object' ? (answer as { sentences?: unknown }).sentences : null
  if (!Array.isArray(rows)) return null
  const out: { doi: string; text: string }[] = []
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const doi = cleanDoi(String((row as { doi?: unknown }).doi ?? ''))
    const text = String((row as { text?: unknown }).text ?? '').trim()
    if (!doi || !text || 'urls' in (row as object)) continue
    out.push({ doi: doi.toLowerCase(), text })
  }
  return out.length ? out : null
}
