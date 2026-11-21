/**
 * Heart disease enters the ranked index with a sourced death toll, and cancer
 * no longer carries the unsourced $1T in-limit ceiling.
 */
import { describe, expect, it } from 'vitest'
import { problems } from '@/data/problems'
import { getInLimitCap } from '@/data/in-limit'
import { listCtas } from '@/data/ctas'
import { burdenForProblem } from '@/lib/burden'
import { computeRadarRows } from '@/lib/radar'
import { citationsForProblem, deathRatePair } from '@/lib/citations'
import { formatDeathShare } from '@/lib/format'
import { severityFromDeathRate } from '@/lib/priority'

const DATE = /^\d{4}-\d{2}-\d{2}$/

describe('heart disease in the ranking', () => {
  const heart = problems.find((p) => p.slug === 'heart-disease')!

  it('is a ranked problem with a sourced death toll', () => {
    expect(heart).toBeDefined()
    const rows = computeRadarRows()
    expect(rows.map((r) => r.slug)).toContain('heart-disease')
    const burden = burdenForProblem('heart-disease')!
    expect(burden.deaths).toBe(9_469_357)
    expect(burden.counted[0]!.deaths.sourceUrl).toBe(
      'https://cdn.who.int/media/docs/default-source/gho-documents/global-health-estimates/deaths_global_2026-09-30.xlsx',
    )
    expect(burden.counted[0]!.deaths.asOf).toMatch(DATE)
    expect(burden.counted[0]!.deaths.year).toBe(2023)
  })

  it('scores severity from the opened death and prevalence pair', () => {
    const pair = deathRatePair(heart)!
    expect(pair.deaths.value).toBe(9_469_357)
    expect(pair.affected.value).toBe(254_276_268)
    expect(pair.deaths.sourceUrl).toMatch(/^https:\/\//)
    expect(pair.affected.sourceUrl).toMatch(/^https:\/\//)
    expect(pair.deaths.asOf).toMatch(DATE)
    expect(pair.affected.asOf).toMatch(DATE)
    expect(heart.severity!.value).toBeCloseTo(severityFromDeathRate(pair.deaths.value, pair.affected.value), 3)
    expect(formatDeathShare(9_469_357 / 61_071_367)).toBe('15.5% of all deaths')
    expect(formatDeathShare(0.1)).toBe('10% of all deaths')
    const cites = citationsForProblem(heart).map((cite) => cite.text).join('\n')
    expect(cites).toContain('694,708')
  })

  it('does not also count those deaths under hypertension or longevity', () => {
    expect(burdenForProblem('hypertension')!.counted.map((c) => c.slug)).not.toContain('ischaemic-heart-disease')
    expect(burdenForProblem('longevity')!.counted.map((c) => c.slug)).not.toContain('ischaemic-heart-disease')
  })
})

describe('cancer figures', () => {
  const cancer = problems.find((p) => p.slug === 'cancer')!

  it('no longer has the $1T in-limit ceiling', () => {
    expect(getInLimitCap('cancer')).toBeUndefined()
    const blob = JSON.stringify(cancer)
    expect(blob).not.toMatch(/\$1T|\$1\.0T|1_000_000_000_000/)
    expect(cancer.headlineFigures?.some((figure) => figure.display === '$1T' || figure.display === '$1.0T')).toBeFalsy()
  })

  it('shows the two sourced replacement figures, each with a url and a date', () => {
    const figures = cancer.headlineFigures ?? []
    expect(figures.map((figure) => figure.display)).toEqual(['$252B', 'INT$25.2T'])
    for (const figure of figures) {
      expect(figure.sourceUrl, figure.id).toMatch(/^https:\/\//)
      expect(figure.asOf, figure.id).toMatch(DATE)
      expect(figure.source.length, figure.id).toBeGreaterThan(0)
      expect(figure.label.toLowerCase()).not.toMatch(/prize if solved/)
    }
    expect(figures[0]!.sourceUrl).toContain('iqvia.com')
    expect(figures[1]!.label.toLowerCase()).toContain('international dollars')
    expect(figures[1]!.sourceUrl).toContain('jamaoncology')
    const cites = citationsForProblem(cancer).map((cite) => cite.text).join('\n')
    expect(cites).toContain('INT$25.2T')
    expect(cites).toContain('$252B')
    expect(cites).toContain('jamaoncology')
  })

  it('fills build, fund, and learn, including the open data rows', () => {
    const rows = listCtas({ problemSlug: 'cancer' })
    expect(rows.some((row) => row.kind === 'build')).toBe(true)
    expect(rows.some((row) => row.kind === 'fund')).toBe(true)
    expect(rows.some((row) => row.kind === 'learn')).toBe(true)
    expect(rows.some((row) => row.id === 'nci-genomic-data-commons-learn-cancer')).toBe(true)
    expect(rows.some((row) => row.id === 'uk-biobank-learn-cancer')).toBe(true)
    for (const row of rows) {
      expect(row.url).toMatch(/^https:\/\//)
      expect(row.checkedDate).toMatch(DATE)
    }
  })
})

describe('new figures carry a url and a date', () => {
  it('checks every heart disease and cancer headline figure', () => {
    for (const slug of ['heart-disease', 'cancer']) {
      const problem = problems.find((p) => p.slug === slug)!
      for (const figure of problem.headlineFigures ?? []) {
        expect(figure.sourceUrl, figure.id).toMatch(/^https:\/\//)
        expect(figure.asOf, figure.id).toMatch(DATE)
      }
      expect(problem.humansAffected.sourceUrl, slug).toMatch(/^https:\/\//)
      expect(problem.humansAffected.asOf, slug).toMatch(DATE)
    }
  })
})
