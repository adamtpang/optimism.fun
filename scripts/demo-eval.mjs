#!/usr/bin/env node
// Run the demo questions against a preview and print pass or fail.
// Usage: node scripts/demo-eval.mjs https://preview.example [runs]
// Optional auth, never committed: RESEARCH_DEMO_COOKIE, or
// RESEARCH_BYPASS_TOKEN / VERCEL_AUTOMATION_BYPASS_SECRET.
// The Answer API has no seed field, so this repeats the live call instead.

const base = (process.argv[2] || '').replace(/\/$/, '')
const runs = Number(process.argv[3] || 3)
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
      ], data)
    },
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
      ], data)
    },
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
      ], data)
    },
  },
  {
    name: 'r21',
    question: 'How well does the R21 malaria vaccine work?',
    check(data) {
      const dois = (data.citations || []).map((paper) => (paper.doi || '').toLowerCase())
      const text = (data.sentences || []).map((sentence) => sentence.text).join(' ')
      return withNumbers([
        ['phase 3 cited', dois.includes('10.1016/s0140-6736(23)02511-4')],
        ['4878 or 75%', /4,?878/.test(text) && /75%/.test(text)],
        ['68%', /68%/.test(text)],
        ['no 78-79 range', !/78\s*[-\u2013]\s*79%/.test(text)],
        ['no cross-protection', !/cross-protection/i.test(text)],
      ], data)
    },
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
  const bare = figure.replace(/,/g, '').replace(/%$/, '')
  const year = Number(bare)
  if (/^\d{4}$/.test(bare) && year >= 1990 && year <= 2030) return true
  const hay = excerpt.replace(/,/g, '').toLowerCase()
  if (figure.endsWith('%')) return hay.includes(`${bare}%`) || hay.includes(`${bare} percent`)
  if (hay.includes(bare)) return true
  const target = Number(bare)
  if (!Number.isFinite(target)) return false
  const nums = [...hay.matchAll(/\d{2,}/g)].map((match) => Number(match[0]))
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      if (nums[i] + nums[j] === target) return true
    }
  }
  return false
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
for (const item of questions) {
  for (let run = 1; run <= runs; run += 1) {
    let result
    try {
      result = await ask(item.question)
    } catch (err) {
      console.log(`${item.name} run ${run}: FAIL request ${err instanceof Error ? err.message : err}`)
      failed += 1
      continue
    }
    const checks = item.check(result.data)
    const bad = checks.filter(([, ok]) => !ok).map(([name]) => name)
    if (result.http !== 200 || bad.length) {
      failed += 1
      const rejected = (result.data.debug || []).filter((row) => row.status === 'rejected').map((row) => `${row.doi || row.title}: ${row.reason}`).slice(0, 6)
      console.log(`${item.name} run ${run}: FAIL http ${result.http}${bad.length ? ` ${bad.join(', ')}` : ''}${rejected.length ? ` | ${rejected.join(' | ')}` : ''}`)
    } else {
      console.log(`${item.name} run ${run}: PASS`)
    }
  }
}
process.exit(failed ? 1 : 0)
