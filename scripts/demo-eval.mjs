#!/usr/bin/env node
// Run the demo questions against a preview and print pass or fail.
// Usage: node scripts/demo-eval.mjs https://preview.example [runs]
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
      return [
        ['sutton cited', dois.includes('10.1016/j.cmet.2018.04.010')],
        ['andriessen cited', dois.includes('10.1007/s00125-022-05752-z')],
        ['at least 3 papers', new Set(dois).size >= 3],
        ['no postprandial', !/postprandial/i.test(text)],
        ['no clothing', !/clothing/i.test(text)],
      ]
    },
  },
  {
    name: 'm72',
    question: 'Does the M72/AS01E vaccine prevent tuberculosis?',
    check(data) {
      const dois = (data.citations || []).map((paper) => (paper.doi || '').toLowerCase())
      const text = (data.sentences || []).map((sentence) => sentence.text).join(' ')
      const phase2b = (data.citations || []).find((paper) => (paper.doi || '').toLowerCase() === '10.1056/nejmoa1803484')
      return [
        ['54.0%', text.includes('54.0%')],
        ['49.7%', text.includes('49.7%')],
        ['phase 2b cited', dois.includes('10.1056/nejmoa1803484')],
        ['final analysis cited', dois.includes('10.1056/nejmoa1909953')],
        ['peer-reviewed label', !phase2b || phase2b.statusLabel === 'Peer-reviewed'],
        ['lowercase doi', !phase2b || phase2b.doi === phase2b.doi.toLowerCase()],
      ]
    },
  },
  {
    name: 'tb4month',
    question: 'Is a 4-month rifapentine-based regimen as effective as the standard 6-month regimen for drug-susceptible pulmonary tuberculosis?',
    check(data) {
      const dois = (data.citations || []).map((paper) => (paper.doi || '').toLowerCase())
      const text = (data.sentences || []).map((sentence) => sentence.text).join(' ')
      return [
        ['dorman cited', dois.includes('10.1056/nejmoa2033400')],
        ['2516', /2,?516/.test(text)],
        ['noninferior', /noninferior/i.test(text)],
      ]
    },
  },
  {
    name: 'r21',
    question: 'How well does the R21 malaria vaccine work?',
    check(data) {
      const dois = (data.citations || []).map((paper) => (paper.doi || '').toLowerCase())
      const text = (data.sentences || []).map((sentence) => sentence.text).join(' ')
      return [
        ['phase 3 cited', dois.includes('10.1016/s0140-6736(23)02511-4')],
        ['4878 or 75%', /4,?878/.test(text) && /75%/.test(text)],
        ['68%', /68%/.test(text)],
        ['no 78-79 range', !/78\s*[-\u2013]\s*79%/.test(text)],
        ['no cross-protection', !/cross-protection/i.test(text)],
      ]
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

async function ask(question) {
  const response = await fetch(`${base}/api/research/ask`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
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
      console.log(`${item.name} run ${run}: FAIL http ${result.http}${bad.length ? ` ${bad.join(', ')}` : ''}`)
    } else {
      console.log(`${item.name} run ${run}: PASS`)
    }
  }
}
process.exit(failed ? 1 : 0)
