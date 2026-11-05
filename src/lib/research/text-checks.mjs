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
