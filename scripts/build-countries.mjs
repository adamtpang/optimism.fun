// Reads the World Bank snapshot and generates src/data/countries.ts
// Filters to real countries (ISO-3166-1 alpha-2 only), sorts by GDP desc, takes top 60.
// Source: https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SNAPSHOT = path.join(ROOT, 'src/data/snapshots/worldbank-gdp-2024.json')
const OUT = path.join(ROOT, 'src/data/countries.ts')

// ISO-3166-1 alpha-2 codes (real countries + territories). World Bank aggregates use codes outside this set.
const ISO_ALPHA2 = new Set(
  (
    'AF AL DZ AS AD AO AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR VG BN BG BF BI CV KH CM CA KY CF TD CL CN HK MO CO KM CD CG CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR PF GA GM GE DE GH GI GR GL GD GU GT GN GW GY HT HN HU IS IN ID IR IQ IE IM IL IT JM JP JO KZ KE KI KP KR XK KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NC NZ NI NE NG NU MP NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC MF VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VE VN VI YE ZM ZW'
  )
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean),
)

const raw = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'))
const records = raw[1] ?? []
const meta = raw[0] ?? {}

const rows = records
  .filter(
    (r) =>
      r.value != null &&
      r.country &&
      typeof r.country.id === 'string' &&
      ISO_ALPHA2.has(r.country.id),
  )
  .map((r) => ({
    iso2: r.country.id,
    iso3: r.countryiso3code,
    name: r.country.value,
    gdp2024: Number(r.value),
    asOf: `${r.date}-12-31`,
  }))
  .sort((a, b) => b.gdp2024 - a.gdp2024)
  .slice(0, 60)

const TODAY = new Date().toISOString().slice(0, 10)

const ts = `// Auto-generated from src/data/snapshots/worldbank-gdp-2024.json
// Source: World Bank — NY.GDP.MKTP.CD (GDP, current US$). Regenerate via scripts/build-countries.mjs.
// Snapshot last updated: ${meta.lastupdated ?? 'unknown'}

import type { Country } from './types'

const TODAY = '${TODAY}'
const SOURCE = 'World Bank — GDP (current US$), NY.GDP.MKTP.CD'
const SOURCE_URL =
  'https://data.worldbank.org/indicator/NY.GDP.MKTP.CD'

export const countries: Country[] = [
${rows
  .map(
    (r, i) => `  {
    rank: ${i + 1},
    iso2: '${r.iso2}',
    iso3: '${r.iso3}',
    name: ${JSON.stringify(r.name)},
    gdp: {
      value: ${Math.round(r.gdp2024)},
      unit: 'USD',
      source: SOURCE,
      sourceUrl: SOURCE_URL,
      confidence: 'high',
      asOf: '${r.asOf}',
    },
    asOf: TODAY,
  },`,
  )
  .join('\n')}
]

export const getCountryByIso = (iso: string) =>
  countries.find((c) => c.iso2 === iso || c.iso3 === iso)
`

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, ts)
console.log(`wrote ${rows.length} countries to ${OUT}`)
console.log(`top 5: ${rows.slice(0, 5).map((r) => `${r.name} $${(r.gdp2024 / 1e12).toFixed(2)}T`).join(', ')}`)
