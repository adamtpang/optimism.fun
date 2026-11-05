#!/usr/bin/env node
import { attributionMismatch, copiedContentRun, directionConflict, numberMatches } from '../src/lib/research/text-checks.mjs'
// Run the demo questions against a preview and print pass or fail.
// Usage: node scripts/demo-eval.mjs https://preview.example [runs]
// Optional auth, never committed: RESEARCH_DEMO_COOKIE, or
// RESEARCH_BYPASS_TOKEN / VERCEL_AUTOMATION_BYPASS_SECRET.
// The Answer API has no seed field, so this repeats the live call instead.

const judgeMode = process.argv.includes('--judge')
const args = process.argv.slice(2).filter((arg) => arg !== '--judge')
const base = (args[0] || '').replace(/\/$/, '')
const runs = Number(args[1] || 3)
if (!base.startsWith('http')) {
  console.error('Usage: node scripts/demo-eval.mjs <base-url> [runs]')
  process.exit(1)
}

const questions = [
  {
    name: 'fasting',
    question: 'Does intermittent fasting improve insulin sensitivity in adults?',
    variants: [
      'Does time-restricted eating improve insulin sensitivity in adults?',
      'Does early time-restricted feeding improve insulin sensitivity?',
    ],
  },
  {
    name: 'm72',
    question: 'Does the M72/AS01E vaccine prevent tuberculosis?',
    variants: [
      'Does M72/AS01 prevent tuberculosis?',
      'How well does the M72/AS01E tuberculosis vaccine work?',
    ],
  },
  {
    name: 'tb4month',
    question: 'Is a 4-month rifapentine-based regimen as effective as the standard 6-month regimen for drug-susceptible pulmonary tuberculosis?',
    variants: [
      'Is the 4-month rifapentine-moxifloxacin regimen noninferior for tuberculosis?',
      'Does a 4-month rifapentine regimen match standard tuberculosis treatment?',
    ],
  },
  {
    name: 'r21',
    question: 'How well does the R21 malaria vaccine work?',
    variants: [
      'Does the R21/Matrix-M malaria vaccine work?',
      'How effective is R21/Matrix-M against malaria?',
      'What is the efficacy of the R21 malaria vaccine?',
    ],
  },
  {
    name: 'noanswer',
    question: 'Does wearing blue socks on Tuesdays reduce the risk of kidney stones in left-handed adults?',
  },
]

const GENERIC = new Set('does what when where which with from that this have been were will into over under than then them they their there such only also more most many some well work works improve improves improved reduce reduces reduced effect effects effective efficacy risk risks adult adults people trial study studies standard versus against prevent prevents treatment regimen based using compared month months year years week weeks about among between within without clinical patients human humans older raise raises change changed found showed shown reported significant significantly after before during these those other results result group groups control participants received primary secondary analysis'.split(' '))

function figures(text) {
  return text.match(/\d[\d,]*(?:\.\d+)?%?/g) || []
}

function wordsOf(text) {
  return text.toLowerCase().replace(/[^a-z0-9%]+/g, ' ').split(/\s+/).filter(Boolean)
}

function copiedRun(sentence, excerpt) {
  return copiedContentRun(sentence, excerpt, 8).copied
}

function paperList(data) {
  const rows = data.citations || []
  if (!rows.length) return 'papers: none'
  return `papers: ${rows.map((paper) => `${paper.authors || 'Authors unavailable'} ${paper.year || 'year unavailable'} ${paper.doi || paper.title || 'untitled'}`).join('; ')}`
}

function relevantTrials(question, data) {
  const terms = question.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 4 && !GENERIC.has(word))
  return (data.citations || []).filter((paper) => {
    const text = `${paper.title || ''} ${paper.excerpt || ''}`
    if (!/randomi[sz]ed|phase\s*3|phase\s*iii|phase\s*2|non-?inferior|meta-analysis|systematic review|\brct\b/i.test(text)) return false
    const hay = text.toLowerCase()
    return terms.some((term) => hay.includes(term))
  })
}

function coreChecks(data, question) {
  const sentences = data.sentences || []
  const text = sentences.map((sentence) => sentence.text).join(' ')
  const copied = sentences.some((sentence) => (sentence.cites || []).some((n) => {
    const paper = (data.citations || []).find((item) => item.n === n)
    return paper && copiedRun(sentence.text, paper.excerpt || '')
  }))
  const normalized = sentences.map((sentence) => wordsOf(sentence.text).join(' '))
  const duplicate = normalized.some((key, index) => normalized.indexOf(key) !== index)
  const uncited = sentences.some((sentence) => {
    const cites = sentence.cites || []
    if (!cites.length) return true
    return cites.some((n) => !(data.citations || []).some((paper) => paper.n === n))
  })
  const attribution = []
  for (const sentence of sentences) {
    for (const n of sentence.cites || []) {
      const paper = (data.citations || []).find((item) => item.n === n)
      if (!paper) continue
      attribution.push(...attributionMismatch(sentence.text, paper.authors, paper.year).map((problem) => `${paper.doi || paper.title}: ${problem}`))
    }
  }
  const direction = sentences.some((sentence) => (sentence.cites || []).some((n) => {
    const paper = (data.citations || []).find((item) => item.n === n)
    return paper && directionConflict(sentence.text, paper.excerpt || '')
  }))
  const filler = sentences.some((sentence) => {
    const body = sentence.text || ''
    const hasNumber = /\d/.test(body.replace(/\[\d+\]/g, ''))
    const finding = /non-?inferior|efficacy|no difference|no effect|did not|improved|reduced|benefit|as effective|superior|unaffected|sensitivity|unchanged|better|worse/i.test(body)
    return !hasNumber && !finding
  })
  const notes = /not explicitly stated|\bsnippet\b|as an ai|model note|unspecified number|not stated|not reported/i.test(text)
  const missing = numberFailures(data)
  const trials = relevantTrials(question, data)
  return [
    ['answer exists', sentences.length > 0 && data.status !== 'no-answer'],
    ['2 to 5 sentences', sentences.length >= 2 && sentences.length <= 5],
    ['uncited sentence', !uncited],
    [`author and year${attribution.length ? `: ${attribution.join('; ')}` : ''}`, attribution.length === 0 && sentences.length > 0],
    [`numbers in cited abstracts${missing.length ? `: ${missing.join('; ')}` : ''}`, missing.length === 0],
    ['no copied abstract run', !copied],
    ['duplicate sentence', !duplicate],
    ['empty parentheses', !/\(\s*\)|\(\s*[,.]/.test(text)],
    ['meta note', !notes],
    ['em dash', !/[\u2014]/.test(text)],
    ['filler sentence', !filler],
    ['direction contradicts the abstract', !direction],
    [`cites a relevant trial${trials.length ? `: ${trials.map((paper) => paper.doi || paper.title).join(', ')}` : ''}`, trials.length > 0],
    [paperList(data), true],
  ]
}

function numberFailures(data) {
  const failures = []
  for (const sentence of data.sentences || []) {
    const body = String(sentence.text || '').replace(/\[\d+\]/g, ' ')
    for (const n of sentence.cites || []) {
      const paper = (data.citations || []).find((item) => item.n === n)
      if (!paper) {
        failures.push(`citation ${n} missing`)
        continue
      }
      const excerpt = paper.excerpt || ''
      for (const figure of figures(body)) {
        if (figure === String(paper.year || '')) continue
        if (!numberMatches(figure, excerpt)) failures.push(`${paper.doi || paper.title} missing ${figure}`)
      }
    }
  }
  return failures
}

async function judgeSentences(data) {
  const key = process.env.EXA_API_KEY
  if (!key) return ['judge skipped, EXA_API_KEY is unset']
  const failures = []
  for (const sentence of data.sentences || []) {
    for (const n of sentence.cites || []) {
      const paper = (data.citations || []).find((item) => item.n === n)
      if (!paper) continue
      const response = await fetch('https://api.exa.ai/answer', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key },
        body: JSON.stringify({
          query: `Given this abstract, is this sentence fully supported, including the direction of the effect? Answer yes or no.\n\nAbstract:\n${paper.excerpt || ''}\n\nSentence:\n${sentence.text}`,
          stream: false,
          text: false,
          model: 'exa',
          temperature: 0,
        }),
      })
      const payload = await response.json()
      const answer = String(payload.answer || payload.text || '').toLowerCase()
      if (answer.startsWith('no')) failures.push(`${paper.doi || paper.title} judge said no`)
    }
  }
  return failures
}

async function ask(question) {
  const headers = { 'content-type': 'application/json' }
  if (process.env.RESEARCH_DEMO_COOKIE) headers.cookie = process.env.RESEARCH_DEMO_COOKIE
  const bypass = process.env.RESEARCH_BYPASS_TOKEN || process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  if (bypass) headers['x-vercel-protection-bypass'] = bypass
  const started = Date.now()
  const response = await fetch(`${base}/api/research/ask?debug=1`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ question }),
  })
  const data = await response.json()
  return { http: response.status, data, ms: Date.now() - started }
}

let failed = 0
const jobs = []
for (const item of questions) {
  for (let run = 1; run <= runs; run += 1) jobs.push({ ...item, label: `${item.name} run ${run}` })
  for (const [index, variant] of (item.variants || []).entries()) {
    jobs.push({ ...item, question: variant, label: `${item.name} variant ${index + 1}` })
  }
}
for (const item of jobs) {
  let result
  try {
    result = await ask(item.question)
  } catch (err) {
    console.log(`${item.label}: FAIL request ${err instanceof Error ? err.message : err}`)
    failed += 1
    continue
  }
  const checks = item.name === 'noanswer'
    ? [
        ['status no-answer', result.data.status === 'no-answer'],
        ['zero citations', (result.data.citations || []).length === 0],
        ['latency under 25s', result.ms < 25_000],
      ]
    : [...coreChecks(result.data, item.question), ['latency under 25s', result.ms < 25_000]]
  if (judgeMode && item.name !== 'noanswer') {
    const judged = await judgeSentences(result.data)
    if (judged.some((line) => line.startsWith('judge skipped'))) {
      if (!globalThis.__judgeNoted) {
        console.log(judged[0])
        globalThis.__judgeNoted = true
      }
    } else if (judged.length) {
      checks.push([judged.join('; '), false])
    }
  }
  const bad = checks.filter(([, ok]) => !ok).map(([name]) => name)
  const papers = item.name === 'noanswer' ? '' : ` | ${paperList(result.data)} | ${result.ms}ms`
  if (result.http !== 200 || bad.length) {
    failed += 1
    const rejected = (result.data.debug || []).filter((row) => row.status === 'rejected').map((row) => `${row.doi || row.title}: ${row.reason}`).slice(0, 4)
    console.log(`${item.label}: FAIL http ${result.http}${bad.length ? ` ${bad.join(', ')}` : ''}${papers}${rejected.length ? ` | ${rejected.join(' | ')}` : ''}`)
  } else {
    console.log(`${item.label}: PASS${papers}`)
  }
}
process.exit(failed ? 1 : 0)
