import { numericTokens, numberPrinted, polishClaim } from '@/lib/research/claims'
import { cleanDoi, printedArmTotal, rewriteDerivedTotals } from '@/lib/research/papers'

export const SUPPORT_LIMIT = 4500

export type SpanField = { text: string; evidence_span: string }
export type ExtractDirection = 'benefit' | 'null' | 'mixed'

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

export function normalizeSpan(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

export function spanInAbstract(span: string, abstract: string): boolean {
  const needle = normalizeSpan(span)
  if (!needle) return false
  if (needle.length < 4 && !/\d/.test(needle)) return false
  return normalizeSpan(abstract).includes(needle)
}

function asField(value: unknown): SpanField | null {
  if (!value || typeof value !== 'object') return null
  const text = String((value as { text?: unknown }).text ?? '').trim()
  const evidence_span = String((value as { evidence_span?: unknown }).evidence_span ?? '').trim()
  if (!text && !evidence_span) return null
  return { text, evidence_span }
}

function asDirection(value: unknown): ExtractDirection {
  return value === 'benefit' || value === 'null' || value === 'mixed' ? value : 'mixed'
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

function numbersOutsideSpan(field: SpanField): string[] {
  return numericTokens(field.text).filter((token) => !numberPrinted(token, field.evidence_span))
}

/** Keep a field only when its span is in the abstract and its numbers are in that span. */
function keepField(field: SpanField | null, abstract: string): { value: string | null; reason: string | null } {
  if (!field) return { value: null, reason: null }
  if (!field.evidence_span.trim()) return { value: null, reason: 'missing evidence span' }
  if (!spanInAbstract(field.evidence_span, abstract)) return { value: null, reason: 'span is not in the abstract' }
  const bad = numbersOutsideSpan(field)
  if (bad.length) return { value: null, reason: `number not in span (${bad.join(', ')})` }
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
  const reject = !intervention.value
    ? 'Rejected: intervention span is not in the abstract.'
    : !outcome.value
      ? 'Rejected: outcome span is not in the abstract.'
      : null
  return {
    doi: extract.doi,
    direction: extract.effect_direction,
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

export function citeName(author: string | string[] | null | undefined, year: string | null | undefined): string {
  const raw = Array.isArray(author) ? author.find((name) => name.trim()) || '' : author || ''
  const surname = raw.trim().split(/\s+/).filter(Boolean).slice(-1)[0]?.replace(/[^A-Za-z'’.-]/g, '') || ''
  const match = year?.match(/\d{4}/)
  const printed = match ? match[0] : ''
  if (surname && printed) return `${surname} ${printed}`
  if (surname) return surname
  if (printed) return `A ${printed} study`
  return 'A retrieved study'
}

export function renderExtractSentence(row: VerifiedExtract, who: string, abstract: string): string {
  if (row.rejectReason || !row.intervention || !row.outcome) return ''
  const lead = row.direction === 'null' ? 'reported no effect' : row.direction === 'mixed' ? 'reported mixed results' : 'reported a benefit'
  let text = `${who} ${lead}`
  if (row.population) text += ` in ${row.population}`
  text += `: ${row.intervention}`
  if (row.comparator) text += ` compared with ${row.comparator}`
  text += ` ${row.outcome}`
  const figures = [...new Set([...(row.n ? [row.n] : []), ...row.keyNumbers])]
  if (figures.length) text += ` (${figures.join('; ')})`
  const arms = printedArmTotal(abstract)
  if (arms) {
    const have = figures.join(' ').replace(/,/g, '')
    if (have.includes(arms.vaccine) && have.includes(arms.placebo)) text += ` The trial enrolled ${arms.text}.`
  }
  text = polishClaim(rewriteDerivedTotals(text, abstract))
  return text
}
