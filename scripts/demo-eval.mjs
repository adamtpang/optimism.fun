#!/usr/bin/env node
import { copiedContentRun, numberMatches } from '../src/lib/research/text-checks.mjs'
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
    check(data) {
      const dois = (data.citations || []).map((paper) => (paper.doi || '').toLowerCase())
      const text = (data.sentences || []).map((sentence) => sentence.text).join(' ')
      return withNumbers([
        ['sutton cited', dois.includes('10.1016/j.cmet.2018.04.010')],
        ['andriessen cited', dois.includes('10.1007/s00125-022-05752-z')],
        ['at least 3 papers', new Set(dois).size >= 3],
        ['no postprandial', !/postprandial/i.test(text)],
        ['no clothing', !/clothing/i.test(text)],
      ].concat(sharedChecks(data)), data)
    },
    variants: [
      'Does time-restricted eating improve insulin sensitivity in adults?',
      'Does early time-restricted feeding improve insulin sensitivity?',
    ],
  },
  {
    name: 'm72',
    question: 'Does the M72/AS01E vaccine prevent tuberculosis?',
    check(data) {
      const dois = (data.citations || []).map((paper) => (paper.doi || '').toLowerCase())
      const text = (data.sentences || []).map((sentence) => sentence.text).join(' ')
      const phase2b = (data.citations || []).find((paper) => (paper.doi || '').toLowerCase() === '10.1056/nejmoa1803484')
      return withNumbers([
        ['54.0%', text.includes('54.0%')],
        ['49.7%', text.includes('49.7%')],
        ['phase 2b cited', dois.includes('10.1056/nejmoa1803484')],
        ['final analysis cited', dois.includes('10.1056/nejmoa1909953')],
        ['peer-reviewed label', !phase2b || phase2b.statusLabel === 'Peer-reviewed'],
        ['lowercase doi', !phase2b || phase2b.doi === phase2b.doi.toLowerCase()],
      ].concat(sharedChecks(data)), data)
    },
    variants: [
      'Does M72/AS01 prevent tuberculosis?',
      'How well does the M72/AS01E tuberculosis vaccine work?',
    ],
  },
  {
    name: 'tb4month',
    question: 'Is a 4-month rifapentine-based regimen as effective as the standard 6-month regimen for drug-susceptible pulmonary tuberculosis?',
    check(data) {
      const dois = (data.citations || []).map((paper) => (paper.doi || '').toLowerCase())
      const text = (data.sentences || []).map((sentence) => sentence.text).join(' ')
      return withNumbers([
        ['dorman cited', dois.includes('10.1056/nejmoa2033400')],
        ['2516', /2,?516/.test(text)],
        ['noninferior', /noninferior/i.test(text)],
        ['not guidance alone', dois.some((doi) => doi !== '10.15585/mmwr.mm7108a1')],
        ['2516 only on Dorman', dormanOwns(data, '10.1056/nejmoa2033400', /2,?516/)],
      ].concat(sharedChecks(data, 'noninferior')), data)
    },
    variants: [
      'Is the 4-month rifapentine-moxifloxacin regimen noninferior for tuberculosis?',
      'Does a 4-month rifapentine regimen match standard tuberculosis treatment?',
    ],
  },
  {
    name: 'r21',
    question: 'How well does the R21 malaria vaccine work?',
    check(data) {
      const dois = (data.citations || []).map((paper) => (paper.doi || '').toLowerCase())
      const text = (data.sentences || []).map((sentence) => sentence.text).join(' ')
      return withNumbers([
        ['phase 3 cited', dois.includes('10.1016/s0140-6736(23)02511-4')],
        ['4878 and 75%', /4,?878/.test(text) && /75%/.test(text)],
        ['68%', /68%/.test(text)],
        ['no 78-79 range', !/78\s*[-\u2013]\s*79%/.test(text)],
        ['no cross-protection', !/cross-protection/i.test(text)],
        ['efficacy', /efficacy/i.test(text)],
        ['not no difference', !/no difference/i.test(text)],
      ].concat(sharedChecks(data)), data)
    },
    variants: [
      'Does the R21/Matrix-M malaria vaccine work?',
      'How effective is R21/Matrix-M against malaria?',
      'What is the efficacy of the R21 malaria vaccine?',
    ],
  },
  {
    name: 'noanswer',
    question: 'Does wearing blue socks on Tuesdays reduce the risk of kidney stones in left-handed adults?',
    check(data) {
      return [
        ['status no-answer', data.status === 'no-answer'],
        ['zero citations', (data.citations || []).length === 0],
      ]
    },
  },
]

function figures(text) {
  return text.match(/\d[\d,]*(?:\.\d+)?%?/g) || []
}

function figureInExcerpt(figure, excerpt) {
  return numberMatches(figure, excerpt)
}

function wordsOf(text) {
  return text.toLowerCase().replace(/[^a-z0-9%]+/g, ' ').split(/\s+/).filter(Boolean)
}

function copiedRun(sentence, excerpt) {
  return copiedContentRun(sentence, excerpt, 8).copied
}

function truncatedWord(sentence, excerpt) {
  const abs = wordsOf(excerpt).filter((word) => word.length >= 4)
  return wordsOf(sentence).some((word) => word.length >= 4 && word.length <= 8 && !abs.includes(word) && abs.some((full) => full.startsWith(word) && full.length >= word.length + 3))
}

function sharedChecks(data, direction) {
  const sentences = data.sentences || []
  const text = sentences.map((sentence) => sentence.text).join(' ')
  const copied = sentences.some((sentence) => (sentence.cites || []).some((n) => {
    const paper = (data.citations || []).find((item) => item.n === n)
    return paper && copiedRun(sentence.text, paper.excerpt || '')
  }))
  const normalized = sentences.map((sentence) => wordsOf(sentence.text).join(' '))
  const duplicate = normalized.some((key, index) => normalized.indexOf(key) !== index)
  const emptyParens = /\(\s*\)|\(\s*[,.]/.test(text)
  const meta = /not explicitly stated|\bsnippet\b/i.test(text)
  const truncated = sentences.some((sentence) => (sentence.cites || []).some((n) => {
    const paper = (data.citations || []).find((item) => item.n === n)
    return paper && truncatedWord(sentence.text, paper.excerpt || '')
  }))
  const uncited = sentences.some((sentence) => {
    const cites = sentence.cites || []
    if (!cites.length) return true
    return cites.some((n) => !(data.citations || []).some((paper) => paper.n === n))
  })
  const filler = sentences.some((sentence) => {
    const body = sentence.text || ''
    const hasNumber = /\d/.test(body.replace(/\[\d+\]/g, ''))
    const finding = /non-?inferior|efficacy|no difference|no effect|did not|improved|reduced|benefit|as effective|superior|unaffected|sensitivity|unchanged/i.test(body)
    return !hasNumber && !finding
  })
  const rows = [
    ['3 to 5 sentences', sentences.length >= 3 && sentences.length <= 5],
    ['no copied abstract run', !copied],
    ['duplicate sentence', !duplicate],
    ['empty parentheses', !emptyParens],
    ['meta note', !meta],
    ['truncated word', !truncated],
    ['uncited sentence', !uncited],
    ['filler sentence', !filler],
    ['each sentence names a year', sentences.every((sentence) => /\b(19|20)\d{2}\b/.test(sentence.text))],
  ]
  if (direction) rows.push([direction, new RegExp(direction, 'i').test(text)])
  return rows
}

function dormanOwns(data, doi, pattern) {
  const paper = (data.citations || []).find((item) => (item.doi || '').toLowerCase() === doi)
  if (!paper) return false
  const own = (data.sentences || []).filter((sentence) => sentence.cites.includes(paper.n)).map((sentence) => sentence.text).join(' ')
  const rest = (data.sentences || []).filter((sentence) => !sentence.cites.includes(paper.n)).map((sentence) => sentence.text).join(' ')
  return pattern.test(own) && !pattern.test(rest)
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
        if (!figureInExcerpt(figure, excerpt)) failures.push(`${paper.doi || paper.title} missing ${figure}`)
      }
    }
  }
  return failures
}

function withNumbers(rows, data) {
  const missing = numberFailures(data)
  return [...rows, [`numbers in cited abstracts${missing.length ? `: ${missing.join('; ')}` : ''}`, missing.length === 0]]
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
  const response = await fetch(`${base}/api/research/ask?debug=1`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ question }),
  })
  const data = await response.json()
  return { http: response.status, data }
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
  const checks = item.check(result.data)
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
  if (result.http !== 200 || bad.length) {
    failed += 1
    const rejected = (result.data.debug || []).filter((row) => row.status === 'rejected').map((row) => `${row.doi || row.title}: ${row.reason}`).slice(0, 4)
    console.log(`${item.label}: FAIL http ${result.http}${bad.length ? ` ${bad.join(', ')}` : ''}${rejected.length ? ` | ${rejected.join(' | ')}` : ''}`)
  } else {
    console.log(`${item.label}: PASS`)
  }
}
process.exit(failed ? 1 : 0)
