/** Shared by the app and scripts/demo-eval.mjs. */

const UNITS = new Set([
  'percent', 'ci', 'mg', 'kg', 'ml', 'mm', 'hr', 'hrs', 'hour', 'hours',
  'day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years', 'vs',
])

const KEEPING_CAPS = new Set(['the', 'a', 'an', 'in', 'of', 'and', 'for', 'with', 'from', 'by', 'to', 'on', 'at', 'as', 'or'])

export function normalizeNumberText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\u00a0\u2000-\u200b\u202f\u205f\ufeff]/g, '')
    .replace(/\uFF05/g, '%')
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/(\d)[,\s]+(?=\d)/g, '$1')
    .replace(/(\d)\s*(?:%|percent)(?!\w)/g, '$1%')
}

export function numberMatches(token, abstract) {
  const raw = normalizeNumberText(token).replace(/\s+/g, '')
  const hay = normalizeNumberText(abstract)
  const percent = raw.endsWith('%')
  const bare = raw.replace(/%$/, '').replace(/percent$/, '')
  if (!bare || !/\d/.test(bare)) return true
  if (/^\d{4}$/.test(bare)) {
    const year = Number(bare)
    if (year >= 1990 && year <= 2030) return true
  }
  const value = Number(bare)
  if (!Number.isFinite(value)) return false
  for (const match of hay.matchAll(/\d+(?:\.\d+)?%?/g)) {
    const piece = match[0]
    const piecePercent = piece.endsWith('%')
    if (percent !== piecePercent) continue
    if (Number(piece.replace('%', '')) === value) return true
  }
  return false
}

export function contentWords(text) {
  return String(text || '')
    .replace(/[\u2010-\u2015\u2212]/g, ' ')
    .split(/[^A-Za-z0-9.%]+/)
    .filter(Boolean)
    .filter((token, index) => {
      if (/\d/.test(token)) return false
      const lower = token.toLowerCase()
      if (UNITS.has(lower)) return false
      if (index > 0 && /^[A-Z]/.test(token) && token.length > 1 && !KEEPING_CAPS.has(lower)) return false
      return lower.length > 1
    })
    .map((token) => token.toLowerCase())
}

const NAME_PARTICLES = new Set(['van', 'der', 'de', 'da', 'di', 'la', 'le', 'von', 'den', 'ten', 'ter', 'du'])

/** Surname of the first author, keeping particles such as Van Der. */
export function firstSurname(authors) {
  const first = String(authors || '')
    .split(/\s+et al\b/i)[0]
    .split(/\s+and\s+/i)[0]
    .split(',')[0]
    .trim()
  const parts = first.split(/\s+/).filter(Boolean)
  if (!parts.length) return ''
  const surname = [parts[parts.length - 1].replace(/[^A-Za-z'’.-]/g, '')]
  for (let i = parts.length - 2; i >= 0; i -= 1) {
    const token = parts[i].replace(/\./g, '').toLowerCase()
    if (!NAME_PARTICLES.has(token)) break
    surname.unshift(parts[i].replace(/[^A-Za-z'’.-]/g, ''))
  }
  return surname.filter(Boolean).join(' ')
}

/** The sentence has to name that surname and that publication year. */
export function attributionMismatch(sentence, authors, year) {
  const problems = []
  const body = String(sentence || '')
  const surname = firstSurname(authors)
  if (surname) {
    const escaped = surname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (!new RegExp(escaped, 'i').test(body)) problems.push('missing author')
  }
  const printed = String(year || '').match(/\b(1[89]\d{2}|20\d{2})\b/)
  if (printed && !new RegExp(`\\b${printed[1]}\\b`).test(body)) problems.push('year mismatch')
  return problems
}

/** A denial in the sentence against an abstract that reports an effect. */
export function directionConflict(sentence, abstract) {
  const said = String(sentence || '').toLowerCase()
  const source = String(abstract || '').toLowerCase()
  const denies = /no difference|no effect|mixed results|had mixed/.test(said)
  if (!denies) return null
  const abstractDenies = /no difference|did not|do not|unaffected|not significant|no effect|\bmixed\b/.test(source)
  const abstractAffirms = /non-?inferior|\befficacy\b|\bimproved\b|\bsuperior\b|as effective/.test(source)
  if (abstractAffirms && !abstractDenies) return 'direction contradicts the abstract'
  return null
}

/** 8 content words in a row. Numbers, units, and proper nouns are not counted. */
export function copiedContentRun(sentence, abstract, run = 8) {
  const left = contentWords(sentence)
  const hay = contentWords(abstract).join(' ')
  if (left.length < run) return { copied: false, span: '' }
  for (let i = 0; i + run <= left.length; i += 1) {
    const span = left.slice(i, i + run).join(' ')
    if (hay.includes(span)) return { copied: true, span }
  }
  return { copied: false, span: '' }
}
