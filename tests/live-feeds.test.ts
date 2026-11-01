import { describe, expect, it } from 'vitest'
import { problems } from '@/data/problems'
import { owidCharts } from '@/data/owid-charts'
import { reduceWhoFacts, type WhoFactRow } from '@/lib/sources/who'
import { parseOwidCsv, readOwidChart } from '@/lib/sources/owid'
import { readWdiLastUpdated } from '@/lib/sources/worldbank'

const lifeRows: WhoFactRow[] = [
  { PERIOD_CODE: '2001', VALUE_NUMERIC: 67.4, DIMENSION_1: 'SEX', DIMENSION_MEMBER_1: 'MLE', LAST_UPDATED: '2026-10-01T18:04:56.913+02:00' },
  { PERIOD_CODE: '2000', VALUE_NUMERIC: 67.1, DIMENSION_1: 'SEX', DIMENSION_MEMBER_1: 'BTSX', LAST_UPDATED: '2026-10-01T18:04:56.913+02:00' },
  { PERIOD_CODE: '2001', VALUE_NUMERIC: 67.5, DIMENSION_1: 'SEX', DIMENSION_MEMBER_1: 'BTSX', LAST_UPDATED: '2026-10-01T18:04:56.913+02:00' },
  { PERIOD_CODE: '2001', VALUE_NUMERIC: 70.1, DIMENSION_1: 'SEX', DIMENSION_MEMBER_1: 'FMLE', LAST_UPDATED: '2026-10-01T18:04:56.913+02:00' },
]

describe('WHO xMart series', () => {
  it('keeps the both-sexes global series and drops the sex split', () => {
    const reduced = reduceWhoFacts(lifeRows)
    expect(reduced.status).toBe('ok')
    if (reduced.status !== 'ok') return
    expect(reduced.series).toEqual([
      { year: 2000, value: 67.1 },
      { year: 2001, value: 67.5 },
    ])
    expect(reduced.sourceLastUpdated).toBe('2026-10-01')
  })

  it('keeps an undivided series such as malaria deaths', () => {
    const reduced = reduceWhoFacts([
      { PERIOD_CODE: '2023', VALUE_NUMERIC: 597000, DIMENSION_1: null, DIMENSION_MEMBER_1: null, LAST_UPDATED: '2025-12-19T15:58:41.923+01:00' },
      { PERIOD_CODE: '2024', VALUE_NUMERIC: 609930, DIMENSION_1: null, DIMENSION_MEMBER_1: null, LAST_UPDATED: '2025-12-19T15:58:41.923+01:00' },
    ])
    expect(reduced).toMatchObject({
      status: 'ok',
      series: [
        { year: 2023, value: 597000 },
        { year: 2024, value: 609930 },
      ],
    })
  })

  it('refuses a sex-split series with no both-sexes row', () => {
    const reduced = reduceWhoFacts([
      { PERIOD_CODE: '2019', VALUE_NUMERIC: 30, DIMENSION_1: 'SEX', DIMENSION_MEMBER_1: 'MLE' },
      { PERIOD_CODE: '2019', VALUE_NUMERIC: 28, DIMENSION_1: 'SEX', DIMENSION_MEMBER_1: 'FMLE' },
    ])
    expect(reduced.status).toBe('unavailable')
  })

  it('refuses duplicate years left by another dimension', () => {
    const reduced = reduceWhoFacts([
      { PERIOD_CODE: '2020', VALUE_NUMERIC: 1, DIMENSION_1: 'AGEGROUP', DIMENSION_MEMBER_1: 'YEARS15-49' },
      { PERIOD_CODE: '2020', VALUE_NUMERIC: 2, DIMENSION_1: 'AGEGROUP', DIMENSION_MEMBER_1: 'YEARS50-69' },
    ])
    expect(reduced.status).toBe('unavailable')
  })
})

describe('OWID chart parsing', () => {
  const csv = [
    'Entity,Code,Year,Life expectancy,Extra',
    'Afghanistan,AFG,2020,62.5,no',
    'World,OWID_WRL,2021,71.2,keep',
    'World,OWID_WRL,2020,70.9,keep',
  ].join('\n')

  it('keeps only the World value column', () => {
    expect(parseOwidCsv(csv)).toEqual({
      valueLabel: 'Life expectancy',
      series: [
        { year: 2020, value: 70.9 },
        { year: 2021, value: 71.2 },
      ],
    })
  })

  it('requires a citation and at least two points', () => {
    const oneYear = 'Entity,Code,Year,Value\nWorld,OWID_WRL,2024,1\n'
    expect(readOwidChart('life-expectancy', oneYear, { chart: { citation: 'Source' } })).toBeNull()
    expect(
      readOwidChart('life-expectancy', csv, {
        chart: { title: 'Life expectancy', originalChartUrl: 'https://ourworldindata.org/grapher/life-expectancy' },
        columns: {},
      }),
    ).toBeNull()
    const chart = readOwidChart('life-expectancy', csv, {
      chart: { title: 'Life expectancy' },
      columns: { 'Life expectancy': { citationShort: 'UN WPP (2024) – with major processing by Our World in Data', unit: 'years', lastUpdated: '2025-10-22' } },
    })
    expect(chart?.citation).toContain('Our World in Data')
    expect(chart?.series).toHaveLength(2)
    expect(chart?.asOf).toBe('2025-10-22')
    expect(chart?.url).toBe('https://ourworldindata.org/grapher/life-expectancy')
  })
})

describe('OWID chart map', () => {
  it('only names problems that exist, and records the four with no verified chart', () => {
    const known = new Set(problems.map((problem) => problem.slug))
    for (const [slug, chart] of Object.entries(owidCharts)) {
      expect(known.has(slug)).toBe(true)
      expect(chart.slug.length).toBeGreaterThan(0)
      expect(chart.entityCode).toBe('OWID_WRL')
      expect(chart.verifiedOn).toBe('2026-11-01')
    }
    const unmapped = problems.map((problem) => problem.slug).filter((slug) => !owidCharts[slug]).sort()
    expect(unmapped).toEqual(['biosecurity', 'cancer', 'copd', 'loneliness'])
  })
})

describe('World Bank last-updated', () => {
  it('reads meta.lastupdated and rejects anything else', () => {
    expect(readWdiLastUpdated([{ page: 1, lastupdated: '2026-10-08' }, []])).toBe('2026-10-08')
    expect(readWdiLastUpdated([{ lastupdated: '2026-04-08T00:00:00Z' }])).toBeNull()
    expect(readWdiLastUpdated({ lastupdated: '2026-10-08' })).toBeNull()
    expect(readWdiLastUpdated(null)).toBeNull()
  })
})
