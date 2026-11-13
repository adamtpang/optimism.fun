/**
 * Build the unsolved-problem index from public APIs. No key. No invented figures.
 *
 *   node scripts/build-problem-index.mjs --stage=facts
 *   node scripts/build-problem-index.mjs --stage=enrich
 *
 * facts writes a draft of sourced metrics. enrich adds OpenAlex, NIH, and
 * ClinicalTrials.gov readings, checks links, and writes the committed JSON.
 * Responses are cached under scripts/.cache so a rerun does not refetch.
 */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CACHE = join(ROOT, 'scripts/.cache/problem-index')
const DRAFT = join(CACHE, 'problems-draft.json')
const SNAPSHOT = join(ROOT, 'src/data/problem-index/snapshot.json')
const PACKS = join(ROOT, 'src/data/problem-index/starter-packs.json')

const UA = 'optimism.fun research adamtpang@gmail.com'
const WHO = 'https://xmart-api-public.who.int/GHO'
const MAILTO = 'adamtpang@gmail.com'
const STAGE = process.argv.find((arg) => arg.startsWith('--stage='))?.slice('--stage='.length) || 'facts'

const RETRIEVED = new Date().toISOString().slice(0, 10)
const MIN_YEAR = 2015
const FLOORS = { deaths: 1000, dalys: 10000, people: 100000, cases: 10000 }
const ACTIVE_STATUS = 'RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION,NOT_YET_RECRUITING'

mkdirSync(CACHE, { recursive: true })

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function cachePath(key) {
  return join(CACHE, createHash('sha1').update(key).digest('hex') + '.json')
}

async function request(url, options = {}, attempt = 0) {
  const key = `${options.method || 'GET'} ${url} ${options.body || ''}`
  const path = cachePath(key)
  if (existsSync(path) && !options.fresh) {
    return JSON.parse(readFileSync(path, 'utf8'))
  }
  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        accept: 'application/json',
        'user-agent': UA,
        ...(options.body ? { 'content-type': 'application/json' } : {}),
      },
      body: options.body,
      signal: AbortSignal.timeout(options.timeout ?? 45000),
    })
    const text = await res.text()
    const payload = { status: res.status, text }
    if (res.ok) writeFileSync(path, JSON.stringify(payload))
    else if (attempt < 3 && (res.status === 429 || res.status >= 500)) {
      await sleep(1200 * (attempt + 1))
      return request(url, options, attempt + 1)
    }
    return payload
  } catch (error) {
    if (attempt < 3) {
      await sleep(1200 * (attempt + 1))
      return request(url, options, attempt + 1)
    }
    return { status: 0, text: '', error: error instanceof Error ? error.message : 'request failed' }
  }
}

function jsonOf(payload) {
  if (!payload || payload.status < 200 || payload.status >= 300) return null
  try {
    return JSON.parse(payload.text)
  } catch {
    return null
  }
}

async function pool(items, size, worker) {
  const out = new Array(items.length)
  let cursor = 0
  async function run() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      out[index] = await worker(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, () => run()))
  return out
}

function cleanCopy(value) {
  return String(value)
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(value) {
  const slug = cleanCopy(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
  return slug || 'problem'
}

function titleCase(value) {
  const small = new Set(['of', 'and', 'the', 'in', 'on', 'for', 'to', 'with', 'a', 'an'])
  return cleanCopy(value)
    .split(' ')
    .filter(Boolean)
    .map((word, index) => {
      if (word === 'hiv') return 'HIV'
      if (word === 'tb') return 'TB'
      if (word === 'aids') return 'AIDS'
      if (word === 'copd') return 'COPD'
      if (word === 'pm2.5') return 'PM2.5'
      if (word === 'co2') return 'CO2'
      if (index > 0 && small.has(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function conditionKey(name) {
  let text = name.toLowerCase().replace(/['’]/g, '')
  text = text.replace(/\([^)]*\)/g, ' ')
  text = text.replace(
    /\b(number of|estimated number of|estimated|total|reported|confirmed|prevalence of|incidence of|deaths due to|deaths from|death rate|death rates|mortality due to|mortality rate|age-standardized|age standardized|dalys|daly|attributable|associated|related|proportion of|percentage of|share of)\b/g,
    ' ',
  )
  text = text.replace(/\b(per 100[, ]?000|per 100000|per 1[, ]?000|per 1000|per cent|percent)\b/g, ' ')
  text = text.replace(/[^a-z0-9.+ ]/g, ' ')
  text = text.replace(/\b(cases|deaths|incidence|prevalence|mortality)\b/g, ' ')
  text = text.replace(/\s+/g, ' ').trim()
  text = text.replace(/^(of|the|with|from|due|to|and|in|a|an|population|people)\b/g, '').trim()
  return text
}

const GENERIC_KEYS = new Set([
  'deaths',
  'cases',
  'people',
  'women',
  'children',
  'population',
  'disease',
  'diseases',
  'rate',
  'rates',
  'total',
  'world',
  'global',
  'number',
  'incidence',
  'prevalence',
  'all causes',
  'all',
])

function categoryFor(name) {
  const text = name.toLowerCase()
  if (/water|sanitation|hygiene|defecation|handwashing/.test(text)) return 'Water and sanitation'
  if (/electric|clean fuel|cooking fuel|energy access|renewable/.test(text)) return 'Energy'
  if (/co2|carbon dioxide|methane|greenhouse|nitrous|pm2|particulate|air pollution|ozone|climate/.test(text)) return 'Climate and air'
  if (/poverty|slum|unemploy|social protection|wage|labour|labor force/.test(text)) return 'Poverty and work'
  if (/school|education|litera|learning|pupil|teacher/.test(text)) return 'Education'
  if (/internet|broadband/.test(text)) return 'Digital access'
  if (/homicide|violence|traffick|assault|conflict|suicide|road|injur|drowning|poisoning|fall|burn|interpersonal/.test(text)) return 'Violence and injury'
  if (/hunger|food insecur|stunt|wasting|underweight|anaem|anem|nutri|iodine|vitamin a|overweight|obesity/.test(text)) return 'Nutrition'
  if (/malaria|tubercul|hiv|aids|hepatitis|measles|cholera|dengue|ebola|influenza|covid|pneumonia|diarrh|infect|tropical|polio|mening|yellow fever|rabies|leprosy|schisto|onchocer|trypano|filari|sepsis|tetanus|pertussis|syphilis|gonorrh/.test(text)) return 'Infectious disease'
  if (/maternal|neonat|newborn|infant|under-five|under five|pregnan|childbirth|stillbirth|preterm|low birth|contracept/.test(text)) return 'Maternal and newborn'
  if (/cancer|neoplasm|tumou?r|leukem|lymphoma|melanoma|carcinoma/.test(text)) return 'Cancer'
  if (/heart|cardio|stroke|hypertens|diabetes|kidney|copd|asthma|respirat|liver|cirrh|alzheimer|dementia|parkinson|depress|anxiety|mental|psych|substance|alcohol|tobacco|musculo|arthritis|blind|vision|hearing|oral|dental|refractive|migraine|epilep|autism|schizophren/.test(text)) return 'Noncommunicable disease'
  return 'Health'
}

function clinicalFor(category, name) {
  if (['Water and sanitation', 'Energy', 'Poverty and work', 'Education'].includes(category)) return false
  if (category === 'Climate and air') return /death|mortalit|disease/.test(name.toLowerCase())
  return true
}

function classifyWho(name) {
  const text = name.toLowerCase()
  if (/void|withdrawn|expenditure|budget|price of|per capita|hospital beds|density|workforce|questionnaire|survey response|reporting completeness|number of countries|countries with|proportion of countries|percentage of countries|projected|forecast|scenario|live births$|treated with|doses distributed|courses distributed|bed nets|vaccine doses|interventions delivered/.test(text)) {
    return null
  }
  const rate = /per\s*100|per\s*1[\s,]*000|age-standard|%|percent|proportion/.test(text)
  if (!rate && /death/.test(text)) return { scoreKey: 'deaths', kind: 'count' }
  if (!rate && /daly/.test(text)) return { scoreKey: 'dalys', kind: 'count' }
  if (!rate && /case/.test(text)) return { scoreKey: 'cases', kind: 'count' }
  if (!rate && /number of/.test(text)) return { scoreKey: 'people', kind: 'count' }
  if (rate && /death|mortalit|daly|prevalence|incidence|case/.test(text)) return { scoreKey: null, kind: 'rate' }
  return null
}

function scaleOf(name) {
  const text = name.toLowerCase()
  if (/\(thousands\)|in thousands/.test(text)) return 1000
  if (/\(millions\)|in millions/.test(text)) return 1000000
  return 1
}

function unitFor(scoreKey, name) {
  if (scoreKey === 'deaths') return 'deaths'
  if (scoreKey === 'dalys') return 'DALYs'
  if (scoreKey === 'cases') return 'cases'
  if (scoreKey === 'people') return 'people'
  if (/per\s*100[, ]?000/.test(name.toLowerCase())) return 'per 100,000'
  if (/per\s*1[\s,]*000/.test(name.toLowerCase())) return 'per 1,000'
  if (/%|percent|proportion/.test(name.toLowerCase())) return 'percent'
  return 'index'
}

const SDG_INCLUDE = /death|mortalit|undernourish|food insecur|stunt|wasting|anaem|anem|slum|poverty line|out of school|illitera|emission|greenhouse|homicide|traffick|sanitation|drinking water|electricity|clean fuel|cooking fuel|child labour|child labor|female genital|violence against|intimate partner|sexual violence|child marriage|hiv|tuberculosis|malaria|neglected tropical|hepatitis|road traffic|suicide|air pollution|unsafe water|hunger|measles|immuniz|open defecation|handwashing|overweight|obesity|particulate|wastewater|water stress|refugee|internally displaced|disaster/
const SDG_EXCLUDE = /development assistance|donor|number of countries|proportion of countries|legislative|legal framework|\bpolicy\b|statistical plan|tariff|patent|broadband subscription|export |import |tourism|passenger|freight|government revenue|tax revenue|\bdebt\b|military expenditure|arms|researchers \(full-time|passenger and freight|manufacturing|by sex and age/

function sdgScoreKey(description, unitCode) {
  const text = description.toLowerCase()
  const number = unitCode === 'NUMBER' || /number of/.test(text)
  const percent = unitCode === 'PERCENT' || /%|percent|proportion/.test(text)
  const per = /per 100/.test(text)
  if (number && /death/.test(text)) return { scoreKey: 'deaths', kind: 'count' }
  if (number && /case/.test(text)) return { scoreKey: 'cases', kind: 'count' }
  if (number) return { scoreKey: 'people', kind: 'count' }
  if (per) return { scoreKey: null, kind: 'rate' }
  if (percent) return { scoreKey: null, kind: 'rate' }
  if (/emission|tonne|ton |co2|greenhouse|gigagram/.test(text)) return { scoreKey: 'emissions', kind: 'count' }
  return null
}

function publishedUnit(description, classified, unitCode) {
  const text = description.toLowerCase()
  if (classified.kind === 'count' && classified.scoreKey === 'deaths') return 'deaths'
  if (classified.kind === 'count' && classified.scoreKey === 'cases') return 'cases'
  if (classified.kind === 'count' && classified.scoreKey === 'people') return 'people'
  if (classified.kind === 'count' && /million(s)?( of)? (metric )?ton(ne)?s/.test(text)) return 'million tonnes'
  if (classified.kind === 'count' && /kilotonne|\(kt\)/.test(text)) return 'kilotonnes'
  if (classified.kind === 'count') {
    const tail = description.match(/\(([^)]+)\)\s*$/)
    if (tail) return tail[1].slice(0, 80)
    return 'as published'
  }
  if (unitCode === 'PERCENT' || /%|percent|proportion/.test(text)) return 'percent'
  if (/per 100[, ]?000/.test(text)) return 'per 100,000'
  if (/per 1[, ]?000|per 1000/.test(text)) return 'per 1,000'
  return 'as published'
}

const WB_CODES = [
  ['SI.POV.DDAY', 'share'],
  ['SI.POV.LMIC', 'share'],
  ['SI.POV.UMIC', 'share'],
  ['SN.ITK.DEFC.ZS', 'share'],
  ['SH.STA.STNT.ZS', 'rate'],
  ['SH.STA.WAST.ZS', 'rate'],
  ['SH.ANM.ALLW.ZS', 'rate'],
  ['SH.ANM.CHLD.ZS', 'rate'],
  ['SH.STA.MMRT', 'rate'],
  ['SH.DYN.MORT', 'rate'],
  ['SP.DYN.IMRT.IN', 'rate'],
  ['SH.DYN.NMRT', 'rate'],
  ['SH.STA.TRAF.P5', 'per_pop'],
  ['VC.IHR.PSRC.P5', 'per_pop'],
  ['SH.STA.SUIC.P5', 'per_pop'],
  ['SH.STA.AIRP.P5', 'per_pop'],
  ['SH.HIV.INCD', 'rate'],
  ['SH.TBS.INCD', 'per_pop'],
  ['SH.MLR.INCD.P3', 'per_pop'],
  ['EG.ELC.ACCS.ZS', 'coverage'],
  ['EG.CFT.ACCS.ZS', 'coverage'],
  ['SH.H2O.SMDW.ZS', 'coverage'],
  ['SH.STA.BASS.ZS', 'coverage'],
  ['SH.STA.SMSS.ZS', 'coverage'],
  ['SH.STA.ODFC.ZS', 'share'],
  ['IT.NET.USER.ZS', 'coverage'],
  ['SE.ADT.LITR.ZS', 'rate'],
  ['SE.PRM.UNER', 'count'],
  ['SE.PRM.UNER.ZS', 'rate'],
  ['EN.ATM.CO2E.KT', 'emissions'],
  ['EN.ATM.METH.KT.CE', 'emissions'],
  ['EN.ATM.NOXE.KT.CE', 'emissions'],
  ['EN.ATM.PM25.MC.M3', 'rate'],
  ['EN.POP.SLUM.UR.ZS', 'rate'],
  ['SL.UEM.TOTL.ZS', 'rate'],
  ['SL.TLF.0714.ZS', 'rate'],
  ['SG.VAW.1549.ZS', 'rate'],
  ['SH.STA.BRTC.ZS', 'coverage'],
  ['SH.IMM.MEAS', 'coverage'],
  ['SH.DYN.AIDS', 'count'],
  ['SH.CON.AIDS.ZS', 'share'],
]

function whoAggregate(rows, sexSpecific) {
  const parsed = []
  for (const row of rows) {
    const year = Number(row.PERIOD_CODE)
    const value = row.VALUE_NUMERIC == null ? Number.NaN : Number(row.VALUE_NUMERIC)
    if (!Number.isFinite(year) || !Number.isFinite(value)) continue
    parsed.push({ year, value, low: num(row.VALUE_LOW), high: num(row.VALUE_HIGH), row })
  }
  if (!parsed.length) return null
  const years = [...new Set(parsed.map((row) => row.year))].sort((a, b) => b - a)
  for (const year of years) {
    if (year < MIN_YEAR || year > Number(RETRIEVED.slice(0, 4))) continue
    const group = parsed.filter((row) => row.year === year)
    const totals = group.filter((item) => isTotalRow(item.row))
    if (totals.length === 1) return totals[0]
    if (totals.length > 1) {
      const values = new Set(totals.map((item) => item.value))
      if (values.size === 1) return totals[0]
      continue
    }
    if (sexSpecific && group.length === 1) return group[0]
    const sexes = new Set(group.map((item) => item.row.DIMENSION_MEMBER_1 || ''))
    if (sexSpecific && sexes.size === 1 && group.length === 1) return group[0]
  }
  return null
}

function num(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function isTotalRow(row) {
  const dims = [1, 2, 3, 4, 5].map((index) => ({
    dimension: row[`DIMENSION_${index}`],
    member: row[`DIMENSION_MEMBER_${index}`],
  }))
  const present = dims.filter((item) => item.dimension || item.member)
  if (!present.length) return true
  return present.every((item) => {
    if (item.dimension === 'SEX') return ['BTSX', 'SEX_BTSX', 'TOTAL', 'BTSX_ALL'].includes(item.member)
    const member = String(item.member || '')
    return /^(TOTAL|ALL|GLOBAL|BTSX|AGE_ALL|GHE_ALL)$/i.test(member)
  })
}

function sexSpecificName(name) {
  return /pregnan|maternal|women|female|male|prostate|cervical|breast cancer|mothers/.test(name.toLowerCase())
}

function metric(partial) {
  return {
    label: cleanCopy(partial.label),
    value: partial.value,
    unit: partial.unit,
    year: String(partial.year),
    source: partial.source,
    sourceUrl: partial.sourceUrl,
    pageUrl: partial.pageUrl || null,
    retrievedOn: RETRIEVED,
    scoreKey: partial.scoreKey,
    kind: partial.kind,
    derived: Boolean(partial.derived),
    formula: partial.formula || null,
    curated: Boolean(partial.curated),
    publishedValue: partial.publishedValue ?? null,
    intervalLow: partial.intervalLow ?? null,
    intervalHigh: partial.intervalHigh ?? null,
  }
}

async function loadWhoCatalog() {
  const rows = []
  for (let skip = 0; skip < 5000; skip += 400) {
    const url = `${WHO}/REF_INDICATOR?$select=${encodeURIComponent('INDICATOR_CODE,INDICATOR_NAME,INDICATOR_URL')}&$orderby=${encodeURIComponent('INDICATOR_CODE')}&$top=400&$skip=${skip}`
    const data = jsonOf(await request(url))
    const value = data?.value || []
    rows.push(...value)
    process.stdout.write(`\rWHO catalog ${rows.length}`)
    if (value.length < 400) break
  }
  process.stdout.write('\n')
  return rows
}

async function whoFact(code) {
  const filter = `INDICATOR_CODE eq '${code}' and LOCATION_CODE eq 'GLOBAL'`
  const url = `${WHO}/FACT?$filter=${encodeURIComponent(filter)}&$select=${encodeURIComponent('PERIOD_CODE,VALUE_NUMERIC,VALUE_LOW,VALUE_HIGH,DIMENSION_1,DIMENSION_MEMBER_1,DIMENSION_2,DIMENSION_MEMBER_2,DIMENSION_3,DIMENSION_MEMBER_3,DIMENSION_4,DIMENSION_MEMBER_4,DIMENSION_5,DIMENSION_MEMBER_5')}&$orderby=${encodeURIComponent('PERIOD_CODE desc')}&$top=200`
  const data = jsonOf(await request(url, { timeout: 50000 }))
  return { url, rows: data?.value || [] }
}

async function loadSdgSeries() {
  const data = jsonOf(await request('https://unstats.un.org/SDGAPI/v1/sdg/Series/List'))
  return Array.isArray(data) ? data : []
}

async function sdgWorld(code) {
  const url = `https://unstats.un.org/SDGAPI/v1/sdg/Series/Data?seriesCode=${encodeURIComponent(code)}&areaCode=1&pageSize=1000`
  const data = jsonOf(await request(url, { timeout: 50000 }))
  return { url, data }
}

function pickSdg(data) {
  const rows = (data?.data || []).filter((row) => {
    const dims = row.dimensions || {}
    const age = dims.Age
    const sex = dims.Sex
    const location = dims.Location
    const reporting = dims['Reporting Type']
    if (age && !['ALLAGE', '_T'].includes(age)) return false
    if (sex && !['BOTHSEX', '_T'].includes(sex)) return false
    if (location && !['ALLAREA', '_T'].includes(location)) return false
    if (reporting && !['G', 'N'].includes(reporting)) return false
    return true
  })
  const global = rows.filter((row) => (row.dimensions || {})['Reporting Type'] === 'G')
  const poolRows = global.length ? global : rows
  const parsed = poolRows
    .map((row) => ({ row, year: Number(row.timePeriodStart), value: Number(row.value) }))
    .filter((row) => Number.isFinite(row.year) && Number.isFinite(row.value) && row.year >= MIN_YEAR && row.year <= Number(RETRIEVED.slice(0, 4)))
    .sort((a, b) => b.year - a.year)
  return parsed[0] || null
}

async function loadWb(code) {
  const url = `https://api.worldbank.org/v2/country/WLD/indicator/${encodeURIComponent(code)}?format=json&mrv=12&per_page=12`
  const data = jsonOf(await request(url))
  const rows = Array.isArray(data?.[1]) ? data[1] : []
  return { url, rows }
}

function wbObservations(rows) {
  return rows
    .map((row) => ({ year: Number(row.date), value: row.value == null ? Number.NaN : Number(row.value), name: row.indicator?.value || '' }))
    .filter((row) => Number.isFinite(row.year) && Number.isFinite(row.value) && row.year >= MIN_YEAR && row.year <= Number(RETRIEVED.slice(0, 4)))
    .sort((a, b) => b.year - a.year)
}

function populationNear(observations, year) {
  return observations.find((row) => Math.abs(row.year - year) <= 1) || null
}

function passesFloor(metrics) {
  return metrics.some((item) => {
    if (item.scoreKey && FLOORS[item.scoreKey] && item.value >= FLOORS[item.scoreKey]) return true
    if (item.curated && item.value > 0) return true
    if (item.scoreKey === 'emissions' && item.value > 0) return true
    const unit = `${item.unit} ${item.label}`.toLowerCase()
    if (item.kind === 'rate' && /per 100[, ]?000/.test(unit) && item.value >= 1) return true
    if (item.kind === 'rate' && /per 1[, ]?000|per 1000/.test(unit) && item.value >= 1) return true
    if (item.kind === 'rate' && /percent|%/.test(unit) && item.value >= 1 && item.value < 100) return true
    return false
  })
}

function wbPublishedUnit(name, hint) {
  if (hint === 'count') return /death/.test(name.toLowerCase()) ? 'deaths' : 'people'
  if (/per 100,000/.test(name)) return 'per 100,000'
  if (/per 1,000/.test(name)) return 'per 1,000'
  if (/%|percent/.test(name)) return 'percent'
  const match = name.match(/\(([^)]+)\)\s*$/)
  if (match) return match[1]
  if (hint === 'emissions') return 'kilotonnes'
  return 'as published'
}

function chooseSlot(metrics, scoreKey) {
  const rows = metrics.filter((item) => item.scoreKey === scoreKey && item.kind === 'count' && Number.isFinite(item.value))
  if (!rows.length) return null
  const direct = rows.filter((item) => !item.derived)
  const poolRows = direct.length ? direct : rows
  const latest = Math.max(...poolRows.map((item) => Number(item.year)))
  const sameYear = poolRows.filter((item) => Number(item.year) === latest)
  if (sameYear.length === 1) return sameYear[0].value
  const values = sameYear.map((item) => item.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  if (min === 0) return null
  if ((max - min) / min > 0.05) return null
  return sameYear[0].value
}

function clusterProblems(candidates) {
  const groups = new Map()
  for (const candidate of candidates) {
    const key = conditionKey(candidate.label)
    const id = key.length >= 6 && !GENERIC_KEYS.has(key) ? key : `row:${candidate.id}`
    if (!groups.has(id)) groups.set(id, [])
    groups.get(id).push(candidate)
  }
  const problems = []
  for (const [key, items] of groups) {
    const metrics = items.map((item) => item.metric)
    if (!passesFloor(metrics)) continue
    const headline = pickHeadline(metrics)
    const name = publicName(headline.label)
    if (!name || name.length < 3 || GENERIC_KEYS.has(name.toLowerCase())) continue
    const category = categoryFor(`${name} ${items.map((item) => item.label).join(' ')}`)
    problems.push({
      key,
      name: cleanCopy(name),
      category,
      clinical: clinicalFor(category, `${name} ${items.map((item) => item.label).join(' ')}`),
      metrics,
    })
  }
  const slugs = new Set()
  for (const problem of problems) {
    let slug = slugify(problem.name)
    let n = 2
    while (slugs.has(slug)) {
      slug = `${slugify(problem.name).slice(0, 64)}-${n}`
      n += 1
    }
    slugs.add(slug)
    problem.slug = slug
    problem.headline = pickHeadline(problem.metrics)
    problem.slots = {
      deaths: chooseSlot(problem.metrics, 'deaths'),
      dalys: chooseSlot(problem.metrics, 'dalys'),
      people: chooseSlot(problem.metrics, 'people'),
      cases: chooseSlot(problem.metrics, 'cases'),
    }
  }
  const unique = dedupeProblems(foldProblems(problems))
  const capped = unique.length > 500
  unique.sort((a, b) => sizeKey(b) - sizeKey(a) || a.name.localeCompare(b.name))
  const kept = unique.slice(0, 500)
  if (capped) console.log(`Kept 500 of ${problems.length} by headline size. Dropped the smaller rows.`)
  kept.sort((a, b) => a.name.localeCompare(b.name))
  return kept
}

function populationGapLabel(name, coverage) {
  const base = name.replace(/\s*\([^)]*\)\s*$/, '').trim()
  if (coverage) {
    if (/^people using/i.test(base)) return base.replace(/^people using/i, 'People without')
    if (/^individuals using/i.test(base)) return base.replace(/^individuals using/i, 'People not using')
    return `People without ${base.charAt(0).toLowerCase()}${base.slice(1)}`
  }
  if (/prevalence of undernourishment/i.test(base)) return 'People who are undernourished'
  if (/poverty headcount ratio at/i.test(base)) return base.replace(/poverty headcount ratio at/i, 'People below')
  if (/^people /i.test(base)) return base
  return `People living with ${base.charAt(0).toLowerCase()}${base.slice(1)}`
}

function publicName(label) {
  return cleanCopy(label)
    .replace(/\(thousands\)|\(millions\)/gi, '')
    .replace(/^Deaths implied by\s*/i, 'Deaths from ')
    .replace(/^Deaths from Mortality caused by\s*/i, 'Deaths from ')
    .replace(/^Deaths from Suicide mortality rate.*/i, 'Deaths from suicide')
    .replace(/^Deaths from Intentional homicides.*/i, 'Deaths from intentional homicide')
    .replace(/\s+/g, ' ')
    .trim()
}

const FOLD_RULES = [
  ['road', /road traffic/i],
  ['ntd', /neglected tropical|\bntds\b/i],
  ['wash', /wash deaths|unsafe wash|unsafe water, unsafe sanitation/i],
  ['overweight', /overweight prevalence among children under 5/i],
  ['wasting', /^(prevalence of wasting|wasting prevalence)/i],
  ['child-anemia', /anaemia in children|anemia among children/i],
  ['women-anemia', /anaemia in non-pregnant|anemia among women of reproductive/i],
]

function foldProblems(problems) {
  const used = new Set()
  const folded = []
  for (const [id, pattern] of FOLD_RULES) {
    const group = problems.filter((problem) => pattern.test(problem.name) || problem.metrics.some((metric) => pattern.test(metric.label)))
    if (group.length < 2) continue
    for (const problem of group) used.add(problem.slug)
    const metrics = []
    const seen = new Set()
    for (const problem of group) {
      for (const metric of problem.metrics) {
        const key = `${metric.sourceUrl}|${metric.label}|${metric.year}|${metric.value}`
        if (seen.has(key)) continue
        seen.add(key)
        metrics.push(metric)
      }
    }
    const headline = pickHeadline(metrics)
    const name = publicName(headline.label)
    folded.push({
      ...group[0],
      key: id,
      name,
      slug: slugify(name),
      category: categoryFor(`${name} ${metrics.map((metric) => metric.label).join(' ')}`),
      metrics,
      headline,
      slots: {
        deaths: chooseSlot(metrics, 'deaths'),
        dalys: chooseSlot(metrics, 'dalys'),
        people: chooseSlot(metrics, 'people'),
        cases: chooseSlot(metrics, 'cases'),
      },
    })
  }
  const rest = problems.filter((problem) => !used.has(problem.slug))
  const slugs = new Set()
  return [...folded, ...rest].map((problem) => {
    let slug = slugify(problem.name)
    let n = 2
    while (slugs.has(slug)) {
      slug = `${slugify(problem.name).slice(0, 64)}-${n}`
      n += 1
    }
    slugs.add(slug)
    return { ...problem, slug }
  })
}

function dedupeProblems(problems) {
  const kept = []
  for (const problem of problems) {
    const twin = kept.find((other) => {
      if (other.headline.unit !== problem.headline.unit || other.headline.year !== problem.headline.year) return false
      const delta = Math.abs(other.headline.value - problem.headline.value)
      const scale = Math.max(Math.abs(other.headline.value), 1)
      if (delta / scale > 0.01) return false
      const a = other.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      const b = problem.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      return a.includes(b) || b.includes(a)
    })
    if (!twin) kept.push(problem)
  }
  return kept
}

function sizeKey(problem) {
  return Math.max(
    problem.slots.deaths || 0,
    (problem.slots.people || 0) / 50,
    (problem.slots.cases || 0) / 5,
    problem.slots.dalys || 0,
    1,
  )
}

function pickHeadline(metrics) {
  const order = ['deaths', 'dalys', 'people', 'cases', 'emissions']
  for (const key of order) {
    const rows = metrics.filter((item) => item.scoreKey === key && item.kind === 'count')
    const direct = rows.filter((item) => !item.derived)
    const poolRows = direct.length ? direct : rows
    poolRows.sort((a, b) => Number(b.year) - Number(a.year))
    if (poolRows[0]) return poolRows[0]
  }
  return [...metrics].sort((a, b) => Number(b.year) - Number(a.year))[0]
}

async function buildFacts() {
  const [catalog, series, populationPayload] = await Promise.all([
    loadWhoCatalog(),
    loadSdgSeries(),
    loadWb('SP.POP.TOTL'),
  ])
  const population = wbObservations(populationPayload.rows)
  const whoCandidates = catalog
    .map((row) => {
      const name = row.INDICATOR_NAME || ''
      const classified = classifyWho(name)
      if (!classified || !row.INDICATOR_CODE) return null
      return { code: row.INDICATOR_CODE, name, url: row.INDICATOR_URL || null, ...classified }
    })
    .filter(Boolean)
  console.log(`WHO candidates ${whoCandidates.length} of ${catalog.length}`)

  let done = 0
  const whoMetrics = await pool(whoCandidates, 6, async (candidate) => {
    const fact = await whoFact(candidate.code)
    done += 1
    if (done % 25 === 0) process.stdout.write(`\rWHO facts ${done}/${whoCandidates.length}`)
    const picked = whoAggregate(fact.rows, sexSpecificName(candidate.name))
    if (!picked) return null
    const scale = candidate.kind === 'count' ? scaleOf(candidate.name) : 1
    return {
      id: `who:${candidate.code}`,
      label: candidate.name,
      metric: metric({
        label: candidate.name,
        value: picked.value * scale,
        unit: unitFor(candidate.scoreKey, candidate.name),
        year: picked.year,
        source: 'WHO Global Health Observatory',
        sourceUrl: fact.url,
        pageUrl: candidate.url,
        scoreKey: candidate.scoreKey,
        kind: candidate.kind,
        publishedValue: scale === 1 ? null : picked.value,
        formula: scale === 1 ? null : `WHO publishes this indicator in names that say thousands or millions. Shown value is VALUE_NUMERIC times ${scale}.`,
        intervalLow: picked.low == null ? null : picked.low * scale,
        intervalHigh: picked.high == null ? null : picked.high * scale,
      }),
    }
  })
  process.stdout.write('\n')

  const sdgCandidates = series.filter((row) => SDG_INCLUDE.test(row.description || '') && !SDG_EXCLUDE.test(row.description || ''))
  console.log(`SDG candidates ${sdgCandidates.length} of ${series.length}`)
  done = 0
  const sdgMetrics = await pool(sdgCandidates, 4, async (row) => {
    const result = await sdgWorld(row.code)
    done += 1
    if (done % 20 === 0) process.stdout.write(`\rSDG facts ${done}/${sdgCandidates.length}`)
    const picked = pickSdg(result.data)
    if (!picked) return null
    const unitCode = picked.row.attributes?.Units || ''
    const classified = sdgScoreKey(row.description, unitCode)
    if (!classified) return null
    let unit = publishedUnit(row.description, classified, unitCode)
    if (unit === 'as published' && /infected|people|women|children|cases/.test(row.description.toLowerCase())) unit = /case/.test(row.description.toLowerCase()) ? 'cases' : 'people'
    return {
      id: `sdg:${row.code}`,
      label: row.description,
      metric: metric({
        label: row.description,
        value: picked.value,
        unit,
        year: picked.year,
        source: picked.row.source || 'UN SDG Indicator Database',
        sourceUrl: result.url,
        scoreKey: classified.scoreKey,
        kind: classified.kind,
      }),
    }
  })
  process.stdout.write('\n')

  const popUrl = 'https://data.worldbank.org/indicator/SP.POP.TOTL'
  done = 0
  const wbMetrics = await pool(WB_CODES, 4, async ([code, hint]) => {
    const result = await loadWb(code)
    done += 1
    const observations = wbObservations(result.rows)
    const latest = observations[0]
    if (!latest) return null
    const name = latest.name || code
    const page = `https://data.worldbank.org/indicator/${code}`
    const rateLike = /per\s|%|percent|microgram/i.test(name)
    const countLike = hint === 'emissions' || hint === 'count' || (!rateLike && latest.value >= 1000)
    const scoreKey = hint === 'emissions' ? 'emissions' : countLike ? (/death|homicide|suicide/.test(name.toLowerCase()) ? 'deaths' : /case/.test(name.toLowerCase()) ? 'cases' : 'people') : null
    const base = metric({
      label: name,
      value: latest.value,
      unit: countLike && scoreKey === 'people' ? 'people' : countLike && scoreKey === 'deaths' ? 'deaths' : countLike && scoreKey === 'cases' ? 'cases' : wbPublishedUnit(name, hint),
      year: latest.year,
      source: 'World Bank World Development Indicators',
      sourceUrl: page,
      curated: true,
      scoreKey,
      kind: countLike ? 'count' : 'rate',
    })
    const out = [{ id: `wb:${code}`, label: name, metric: base }]
    const pop = populationNear(population, latest.year)
    const ofPopulation = /%\s*of population|percent of population/i.test(name)
    const coverage = ofPopulation && /access|using|users|reliance/i.test(name)
    if (!pop || !ofPopulation) {
      // Fall through to a death-rate derivation only when the name is a crude death rate.
    } else if (coverage || hint === 'share') {
      const share = coverage ? (100 - latest.value) / 100 : latest.value / 100
      if (share > 0 && share <= 1) {
        const formula = coverage
          ? `(100 - ${latest.value}) / 100 * ${pop.value} population in ${pop.year}. Population source: ${popUrl}. Indicator: ${page}.`
          : `${latest.value} / 100 * ${pop.value} population in ${pop.year}. Population source: ${popUrl}. Indicator: ${page}.`
        out.push({
          id: `wb:${code}:people`,
          label: name,
          metric: metric({
            label: populationGapLabel(name, coverage),
            value: share * pop.value,
            unit: 'people',
            year: latest.year,
            source: 'World Bank World Development Indicators',
            sourceUrl: page,
            scoreKey: 'people',
            kind: 'count',
            derived: true,
            formula,
            publishedValue: latest.value,
            curated: true,
          }),
        })
      }
    }
    if (pop && /death|mortalit|homicide|suicide/i.test(name) && /per 100,000/i.test(name) && !/age-standard|live birth|incidence/i.test(name)) {
      const deaths = (latest.value / 100000) * pop.value
      out.push({
        id: `wb:${code}:deaths`,
        label: name,
        metric: metric({
          label: `Deaths implied by ${name}`,
          value: deaths,
          unit: 'deaths',
          year: latest.year,
          source: 'World Bank World Development Indicators',
          sourceUrl: page,
          scoreKey: 'deaths',
          kind: 'count',
          derived: true,
          formula: `${latest.value} per 100,000 * ${pop.value} population in ${pop.year} / 100,000. Population source: ${popUrl}. Indicator: ${page}.`,
          publishedValue: latest.value,
        }),
      })
    }
    return out
  })
  console.log(`WB codes with data ${wbMetrics.filter(Boolean).length}`)

  const junk = /legal framework|death registration|countries with|suspects examined|by microscopy|by rapid diagnostic|presumed malaria|imported malaria|receiving antiretroviral|who received|started on|tested for rr|previously treated cases|target population who received|compliance of|indigenous p\.|protected from malaria|per unit of gdp|bacteriologically confirmed|deaths among children ages/i
  const flat = [...whoMetrics, ...sdgMetrics, ...wbMetrics.flat()].filter((item) => item && !junk.test(item.label))
  const problems = clusterProblems(flat)
  const draft = {
    retrievedOn: RETRIEVED,
    populationYear: population[0]?.year ?? null,
    population: population[0]?.value ?? null,
    populationUrl: popUrl,
    counts: {
      whoCatalog: catalog.length,
      whoCandidates: whoCandidates.length,
      whoWithNumber: whoMetrics.filter(Boolean).length,
      sdgSeries: series.length,
      sdgCandidates: sdgCandidates.length,
      sdgWithNumber: sdgMetrics.filter(Boolean).length,
      problems: problems.length,
    },
    problems,
  }
  writeFileSync(DRAFT, JSON.stringify(draft, null, 2))
  console.log(`Draft problems ${problems.length} -> ${DRAFT}`)
  const byCategory = {}
  for (const problem of problems) byCategory[problem.category] = (byCategory[problem.category] || 0) + 1
  console.log(byCategory)
}

function searchText(problem) {
  return problem.name
    .replace(/\([^)]*\)/g, ' ')
    .replace(/people without|people living in|deaths from/gi, ' ')
    .replace(/[,:;]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90)
}

function monthsAgo(iso) {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCMonth(date.getUTCMonth() - 12)
  return date.toISOString().slice(0, 10)
}

function fiscalYear(iso) {
  const date = new Date(`${iso}T00:00:00Z`)
  const month = date.getUTCMonth() + 1
  return month > 9 ? date.getUTCFullYear() : date.getUTCFullYear() - 1
}

async function openAlexCount(search, fromDate) {
  const filter = `title_and_abstract.search:${search},from_publication_date:${fromDate}`
  const url = `https://api.openalex.org/works?filter=${encodeURIComponent(filter)}&per_page=1&mailto=${encodeURIComponent(MAILTO)}`
  const data = jsonOf(await request(url))
  const value = data?.meta?.count
  if (typeof value !== 'number') return null
  return { value, url: `https://openalex.org/works?filter=${encodeURIComponent(filter)}`, query: search }
}

async function openAlexCompanies(search, fromDate) {
  const filter = `title_and_abstract.search:${search},from_publication_date:${fromDate},authorships.institutions.type:company`
  const url = `https://api.openalex.org/works?filter=${encodeURIComponent(filter)}&group_by=authorships.institutions.id&per_page=200&mailto=${encodeURIComponent(MAILTO)}`
  const data = jsonOf(await request(url))
  if (!data) return null
  const groups = data.group_by || []
  const names = groups
    .filter((group) => group.key && group.key_display_name && typeof group.count === 'number')
    .slice(0, 8)
    .map((group) => ({ name: cleanCopy(group.key_display_name), url: group.key, count: group.count }))
  return {
    value: groups.length >= 200 ? null : groups.length,
    capped: groups.length >= 200,
    names,
    url,
    query: search,
  }
}

function titleOnTopic(title, search) {
  const stop = new Set(['about', 'after', 'which', 'their', 'from', 'with', 'that', 'this', 'people', 'without', 'access', 'number', 'estimated', 'prevalence', 'mortality', 'population', 'years', 'children', 'global', 'rates', 'rate', 'among', 'total', 'using', 'under', 'world', 'study', 'deaths', 'cases', 'living'])
  const tokens = search.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 5 && !stop.has(token))
  if (!tokens.length) return true
  const text = title.toLowerCase()
  return tokens.some((token) => text.includes(token) || (token.endsWith('s') && text.includes(token.slice(0, -1))))
}

async function openAlexPapers(search) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(search)}&filter=${encodeURIComponent('is_retracted:false,type:article')}&per-page=25&select=${encodeURIComponent('id,display_name,publication_year,doi,cited_by_count')}&mailto=${encodeURIComponent(MAILTO)}`
  const data = jsonOf(await request(url))
  if (!data?.results) return null
  const mapped = data.results
    .filter((work) => work.id && work.display_name)
    .map((work) => {
      const id = String(work.id).split('/').pop()
      return {
        title: cleanCopy(work.display_name),
        year: work.publication_year || null,
        citedBy: typeof work.cited_by_count === 'number' ? work.cited_by_count : null,
        url: `https://openalex.org/${id}`,
        apiUrl: `https://api.openalex.org/works/${id}`,
        doi: work.doi || null,
      }
    })
  return {
    matched: mapped.filter((paper) => titleOnTopic(paper.title, search)),
    all: mapped,
  }
}

async function nihCount(search, year) {
  const body = JSON.stringify({
    criteria: {
      advanced_text_search: { operator: 'and', search_field: 'projecttitle,abstracttext,terms', search_text: search },
      fiscal_years: [year],
    },
    include_fields: ['ApplId'],
    offset: 0,
    limit: 1,
  })
  const payload = await request('https://api.reporter.nih.gov/v2/projects/search', { method: 'POST', body, timeout: 40000 })
  const data = jsonOf(payload)
  const value = data?.meta?.total
  if (typeof value !== 'number') return null
  let sourceUrl = 'https://reporter.nih.gov/'
  if (data.meta?.search_id) {
    const raw = `https://reporter.nih.gov/search/${data.meta.search_id}/projects`
    sourceUrl = raw
  }
  return { value, url: sourceUrl, query: `${search} (FY${year})` }
}

async function trialCount(search) {
  const params = new URLSearchParams()
  params.set('query.cond', search)
  params.set('filter.overallStatus', ACTIVE_STATUS)
  params.set('countTotal', 'true')
  params.set('pageSize', '1')
  const url = `https://clinicaltrials.gov/api/v2/studies?${params.toString()}`
  const data = jsonOf(await request(url))
  if (typeof data?.totalCount !== 'number') return null
  return { value: data.totalCount, url, query: search }
}

async function trialSponsors(search) {
  const params = new URLSearchParams()
  params.set('query.cond', search)
  params.set('filter.overallStatus', ACTIVE_STATUS)
  params.set('filter.advanced', 'AREA[LeadSponsorClass]INDUSTRY')
  params.set('countTotal', 'true')
  params.set('pageSize', '1')
  const countUrl = `https://clinicaltrials.gov/api/v2/studies?${params.toString()}`
  const counted = jsonOf(await request(countUrl))
  if (typeof counted?.totalCount !== 'number') return null
  if (counted.totalCount === 0) return { value: 0, names: [], url: countUrl, query: search, capped: false }
  if (counted.totalCount > 1000) {
    return { value: null, names: [], url: countUrl, query: search, capped: true, reason: 'More than 1000 industry-sponsored studies. Distinct sponsors were not counted from a partial page.' }
  }
  params.set('pageSize', '1000')
  params.set('fields', 'NCTId,LeadSponsorName,LeadSponsorClass')
  const url = `https://clinicaltrials.gov/api/v2/studies?${params.toString()}`
  const data = jsonOf(await request(url, { timeout: 50000 }))
  const counts = new Map()
  for (const study of data?.studies || []) {
    const lead = study.protocolSection?.sponsorCollaboratorsModule?.leadSponsor
    if (lead?.class === 'INDUSTRY' && lead.name) counts.set(cleanCopy(lead.name), (counts.get(cleanCopy(lead.name)) || 0) + 1)
  }
  const names = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      url: `https://clinicaltrials.gov/search?cond=${encodeURIComponent(search)}&spons=${encodeURIComponent(name)}`,
    }))
  return { value: counts.size, names, url: countUrl, query: search, capped: false }
}

const FUNDERS = [
  { name: 'Wellcome', url: 'https://wellcome.org/research-funding', categories: ['Infectious disease', 'Noncommunicable disease', 'Nutrition', 'Maternal and newborn', 'Cancer', 'Health', 'Violence and injury'], note: 'Wellcome lists open research funding. Check the current scheme before applying.' },
  { name: 'Gates Foundation committed grants', url: 'https://www.gatesfoundation.org/about/committed-grants', categories: ['Infectious disease', 'Maternal and newborn', 'Nutrition', 'Water and sanitation'], note: 'The grants database records funded work. It is not an application form.' },
  { name: 'The Global Fund', url: 'https://www.theglobalfund.org/en/', categories: ['Infectious disease'], note: 'Funds HIV, tuberculosis, and malaria programs through country grants.' },
  { name: 'CEPI calls for proposals', url: 'https://cepi.net/', categories: ['Infectious disease'], note: 'CEPI funds epidemic vaccines and platform work. Read the current call.' },
  { name: 'National Cancer Institute', url: 'https://www.cancer.gov/grants-training', categories: ['Cancer'], note: 'NCI publishes grant programs. Check the current funding opportunity.' },
  { name: 'Gavi', url: 'https://www.gavi.org/', categories: ['Infectious disease', 'Maternal and newborn'], note: 'Gavi funds vaccine introduction. Relevant when the problem is vaccine-preventable.', match: /measles|polio|hpv|rotavirus|pneumo|immuniz|malaria|yellow fever|vaccine|pertussis|tetanus|hepatitis b/i },
  { name: 'World Bank poverty topic', url: 'https://www.worldbank.org/en/topic/poverty', categories: ['Poverty and work', 'Education', 'Water and sanitation', 'Energy'], note: 'World Bank topic page for development programs. Not a startup application.' },
  { name: 'Breakthrough Energy', url: 'https://www.breakthroughenergy.org/', categories: ['Climate and air', 'Energy'], note: 'Breakthrough Energy funds climate technology. Confirm the current program on the site.' },
]

function customerFor(problem) {
  const text = `${problem.name} ${problem.headline?.label || ''}`.toLowerCase()
  if (/pregnan|maternal/.test(text)) return 'Pregnant women and the clinics that already see them.'
  if (/child|infant|newborn|neonat|under five|under-five|stunt|wasting/.test(text)) return 'Caregivers and the public child-health or school system that already reaches them.'
  if (/electric|clean fuel|cooking/.test(text)) return 'Households without the service, and the utility or ministry that already collects a tariff.'
  if (/water|sanitation|defecation/.test(text)) return 'Households without the service, and the municipal utility responsible for it.'
  if (/poverty|unemploy|slum/.test(text)) return 'People on the wrong side of the sourced line, and the agency that already runs transfers or jobs programs.'
  if (/school|litera|education/.test(text)) return 'Students who are missing the sourced outcome, and the school system that already has the budget line.'
  if (/co2|methane|nitrous|emission/.test(text)) return 'The emitters named by the dataset, and the buyers who already pay for abatement or compliance.'
  return 'The people counted in the headline metric, and the payer that already spends money when the condition gets worse.'
}

function wedgeFor(problem, sponsors) {
  if ((sponsors?.value || 0) > 0) {
    return 'First product: deliver or widen access to an intervention that already has an industry sponsor in ClinicalTrials.gov. Do not start by inventing a new molecule.'
  }
  if (problem.clinical) {
    return 'First product: one measured pilot in one health system. Pick the headline metric, pick one site, and see if that sourced number moves.'
  }
  return 'First product: a paid pilot with one buyer that already loses money or legitimacy because this gap is still open.'
}

function conceptFor(problem) {
  const headline = problem.headline
  const figure = headline ? `${formatNumber(headline.value)} ${headline.unit} in ${headline.year}` : 'the sourced headline figure'
  return `A company whose job is ${problem.name}, and whose progress report is the sourced figure of ${figure}.`
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return ''
  const abs = Math.abs(value)
  if (abs >= 100) return Math.round(value).toLocaleString('en-US')
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

async function urlOk(url) {
  if (!url || !/^https:\/\//.test(url)) return false
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'user-agent': UA, accept: '*/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    })
    return res.status >= 200 && res.status < 400
  } catch {
    return false
  }
}

async function buildEnrich() {
  if (!existsSync(DRAFT)) throw new Error('Run --stage=facts first')
  const draft = JSON.parse(readFileSync(DRAFT, 'utf8'))
  const fromDate = monthsAgo(RETRIEVED)
  const year = fiscalYear(RETRIEVED)
  const funderOk = []
  for (const funder of FUNDERS) {
    const ok = await urlOk(funder.url)
    console.log(`funder ${funder.name} ${ok ? 'ok' : 'FAIL'}`)
    if (ok) funderOk.push(funder)
  }

  let done = 0
  const enriched = await pool(draft.problems, 3, async (problem) => {
    const search = searchText(problem)
    const [works, companies, papers, nih, trials, sponsors] = await Promise.all([
      openAlexCount(search, fromDate),
      openAlexCompanies(search, fromDate),
      openAlexPapers(search),
      nihCount(search, year),
      problem.clinical ? trialCount(search) : Promise.resolve(null),
      problem.clinical ? trialSponsors(search) : Promise.resolve(null),
    ])
    done += 1
    if (done % 10 === 0) console.log(`enriched ${done}/${draft.problems.length}`)
    const verifiedPapers = []
    const paperList = papers ? (papers.matched.length >= 5 ? papers.matched : papers.all) : []
    for (const paper of paperList) {
      const apiOk = jsonOf(await request(paper.apiUrl))
      if (!apiOk?.id) continue
      const pageOk = await urlOk(paper.url)
      verifiedPapers.push({ ...paper, url: pageOk ? paper.url : paper.apiUrl })
      if (verifiedPapers.length >= 8) break
    }
    const datasets = []
    const seen = new Set()
    for (const item of problem.metrics) {
      if (!item.sourceUrl || seen.has(item.sourceUrl)) continue
      seen.add(item.sourceUrl)
      datasets.push({ name: item.source, url: item.sourceUrl })
    }
    if (works?.url) datasets.push({ name: 'OpenAlex works query', url: works.url })
    const funders = []
    if (nih?.url && nih.value > 0) {
      funders.push({ name: 'NIH RePORTER', url: nih.url, note: `${nih.value} projects matched this search in FY${year}. A match is not an open call.` })
    }
    for (const funder of funderOk) {
      if (!funder.categories.includes(problem.category)) continue
      if (funder.match && !funder.match.test(`${problem.name} ${problem.headline?.label || ''}`)) continue
      funders.push({ name: funder.name, url: funder.url, note: funder.note })
    }
    const companyNames = [
      ...(companies?.names || []).map((item) => ({ ...item, source: 'OpenAlex company affiliation' })),
      ...(sponsors?.names || []).map((item) => ({ ...item, source: 'ClinicalTrials.gov industry lead sponsor' })),
    ]
    return {
      ...problem,
      sensors: {
        openalex: sensor('openalex', 'OpenAlex works, last 12 months', works, 'works'),
        nih: sensor('nih', `NIH RePORTER projects, FY${year}`, nih, 'projects'),
        trials: problem.clinical ? sensor('clinicaltrials', 'ClinicalTrials.gov active trials', trials, 'active trials') : null,
        companies: sensor('openalex-companies', 'OpenAlex company affiliations', companies, 'companies', companies?.names || [], companies?.capped),
        sponsors: problem.clinical ? sensor('clinicaltrials-sponsors', 'ClinicalTrials.gov industry sponsors', sponsors, 'industry sponsors', sponsors?.names || [], sponsors?.capped, sponsors?.reason) : null,
      },
      pack: {
        placeholder: true,
        name: `Acme ${problem.name} Co. (open quest, not a real company)`,
        marketCap: null,
        valuation: null,
        revenue: null,
        label: 'AI-generated suggestion. Not a real company. Not a forecast.',
        concept: conceptFor(problem),
        customer: customerFor(problem),
        wedge: wedgeFor(problem, sponsors),
        metricsToMove: problem.metrics.slice(0, 4).map((item) => ({
          label: item.label,
          value: item.value,
          unit: item.unit,
          year: item.year,
          sourceUrl: item.sourceUrl,
        })),
        papers: verifiedPapers.map(({ apiUrl, ...paper }) => paper),
        datasets: datasets.slice(0, 6),
        funders: funders.slice(0, 6),
        comparables: companyNames.slice(0, 8),
      },
    }
  })

  console.log('Checking source URLs')
  const urls = new Set()
  for (const problem of enriched) {
    for (const item of problem.metrics) {
      if (item.sourceUrl) urls.add(item.sourceUrl)
      if (item.pageUrl) urls.add(item.pageUrl)
    }
    for (const sensor of Object.values(problem.sensors)) {
      if (sensor?.sourceUrl) urls.add(sensor.sourceUrl)
      for (const name of sensor?.names || []) if (name.url) urls.add(name.url)
    }
    for (const dataset of problem.pack.datasets) urls.add(dataset.url)
    for (const funder of problem.pack.funders) urls.add(funder.url)
    for (const paper of problem.pack.papers) urls.add(paper.url)
  }
  const list = [...urls]
  const checks = await pool(list, 8, async (url) => [url, await urlOk(url)])
  const bad = new Set(checks.filter(([, ok]) => !ok).map(([url]) => url))
  console.log(`URL check ${list.length - bad.size}/${list.length} ok`)
  if (bad.size) console.log([...bad].slice(0, 30).join('\n'))

  const problems = []
  const packs = {}
  for (const problem of enriched) {
    problem.metrics = problem.metrics
      .filter((item) => item.sourceUrl && !bad.has(item.sourceUrl))
      .map((item) => ({ ...item, pageUrl: item.pageUrl && !bad.has(item.pageUrl) ? item.pageUrl : null }))
    for (const sensor of Object.values(problem.sensors)) {
      if (!sensor?.names) continue
      sensor.names = sensor.names.map((name) => (name.url && bad.has(name.url) ? { ...name, url: sensor.sourceUrl } : name))
    }
    if (!problem.metrics.length) continue
    problem.slots = {
      deaths: chooseSlot(problem.metrics, 'deaths'),
      dalys: chooseSlot(problem.metrics, 'dalys'),
      people: chooseSlot(problem.metrics, 'people'),
      cases: chooseSlot(problem.metrics, 'cases'),
    }
    problem.headline = pickHeadline(problem.metrics)
    if (problem.headline?.pageUrl && bad.has(problem.headline.pageUrl)) problem.headline.pageUrl = null
    problem.pack.datasets = problem.pack.datasets.filter((item) => !bad.has(item.url))
    problem.pack.funders = problem.pack.funders.filter((item) => !bad.has(item.url))
    problem.pack.papers = problem.pack.papers.filter((item) => !bad.has(item.url))
    problem.pack.comparables = problem.pack.comparables.filter((item) => !item.url || !bad.has(item.url))
    problem.pack.metricsToMove = problem.pack.metricsToMove.filter((item) => !bad.has(item.sourceUrl))
    const { pack, ...rest } = problem
    problems.push(rest)
    packs[problem.slug] = pack
  }

  const snapshot = {
    retrievedOn: RETRIEVED,
    note: 'Every number was read from the source URL in this file on the retrieval date. Derived figures name the formula and both inputs. Rows overlap and must not be added. No market cap is stored.',
    floors: FLOORS,
    rateFloor: 'A rate-only row is kept when the latest global figure is at least 1 per 100,000, 1 per 1,000, or a percent strictly between 0 and 100, and the year is 2015 or later.',
    counts: { ...draft.counts, published: problems.length },
    sources: [
      { name: 'WHO Global Health Observatory xMart API', url: WHO },
      { name: 'UN SDG Indicator API', url: 'https://unstats.un.org/SDGAPI/v1/sdg/Series/List' },
      { name: 'World Bank Indicators API', url: 'https://api.worldbank.org/v2/sources/2?format=json' },
      { name: 'OpenAlex', url: 'https://api.openalex.org' },
      { name: 'NIH RePORTER', url: 'https://api.reporter.nih.gov/v2/projects/search' },
      { name: 'ClinicalTrials.gov API v2', url: 'https://clinicaltrials.gov/api/v2/studies' },
    ],
    problems,
  }
  mkdirSync(dirname(SNAPSHOT), { recursive: true })
  writeFileSync(SNAPSHOT, JSON.stringify(snapshot))
  writeFileSync(PACKS, JSON.stringify({ retrievedOn: RETRIEVED, label: 'AI-generated suggestion. Not a real company. Not a forecast.', packs }))
  console.log(`Wrote ${problems.length} problems`)
  const thin = {}
  for (const problem of problems) {
    const papers = packs[problem.slug].papers.length
    if (papers < 5) thin[problem.slug] = papers
  }
  console.log(`Packs with fewer than 5 papers: ${Object.keys(thin).length}`)
}

function sensor(feed, label, result, unit, names, capped = false, reason = null) {
  if (!result) {
    return { feed, status: 'unavailable', label, value: null, unit, query: null, sourceUrl: null, retrievedOn: RETRIEVED, reason: reason || 'No usable response.', names: names || [], capped }
  }
  return {
    feed,
    status: result.value == null ? 'unavailable' : 'ok',
    label,
    value: result.value ?? null,
    unit,
    query: result.query || null,
    sourceUrl: result.url || null,
    retrievedOn: RETRIEVED,
    reason: result.reason || reason,
    names: names || result.names || [],
    capped: Boolean(capped || result.capped),
  }
}

async function refreshPapers() {
  const snapshot = JSON.parse(readFileSync(SNAPSHOT, 'utf8'))
  const packFile = JSON.parse(readFileSync(PACKS, 'utf8'))
  let done = 0
  await pool(snapshot.problems, 2, async (problem) => {
    const search = searchText(problem)
    const found = await openAlexPapers(search)
    if (!found) {
      console.log(`paper search failed ${problem.slug}`)
      return
    }
    const papers = found.matched.length >= 5 ? found.matched : found.all
    const verified = []
    for (const paper of papers) {
      const pageOk = await urlOk(paper.url)
      verified.push({ title: paper.title, year: paper.year, citedBy: paper.citedBy, url: pageOk ? paper.url : paper.apiUrl, doi: paper.doi })
      if (verified.length >= 8) break
    }
    if (verified.length === 0) return
    packFile.packs[problem.slug].papers = verified
    done += 1
    if (done % 15 === 0) console.log(`papers ${done}/${snapshot.problems.length}`)
    await sleep(200)
  })
  const thin = Object.entries(packFile.packs).filter(([, pack]) => pack.papers.length < 5)
  writeFileSync(PACKS, JSON.stringify(packFile))
  console.log(`paper refresh done, under 5 papers: ${thin.length}`)
  console.log(thin.map(([slug, pack]) => `${slug} ${pack.papers.length}`).join('\n'))
}

if (STAGE === 'facts') await buildFacts()
else if (STAGE === 'enrich') await buildEnrich()
else if (STAGE === 'papers') await refreshPapers()
else throw new Error(`Unknown stage ${STAGE}`)
