import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { problems } from '@/data/problems'
import { citationRepairs } from '@/data/citation-repairs'
import { KARDASHEV, formatKardashev } from '@/lib/kardashev'
import { yearsBefore1950FromBce } from '@/lib/calendar'
import { discoveries } from '@/data/discoveries'
import { publicPaths } from '@/lib/public-routes'
import { RANKING_AFTER, RANKING_BEFORE, RANKING_MODEL_VERSION, scoreRows } from '@/lib/score-export'
import { renderedExport } from '@/lib/rendered-export'
import { headroomScenarios } from '@/lib/marketcap'
import { companies } from '@/data/companies'
import { ecosystem } from '@/data/ecosystem'
import { deathRatePair } from '@/lib/citations'
import { isConditionalStake, quantityComparable, severityScore } from '@/lib/priority'
import { burdenFromSnapshot, owidChartFromSnapshot, RENDER_SNAPSHOT_ID, renderSnapshot, wdiSeriesFromSnapshot } from '@/lib/render-snapshot'
import { whitepapers } from '@/data/whitepapers'
import { progress } from '@/data/progress'
import { getCapitalFlow } from '@/data/capital-flows'
import { demandSignalRegistry } from '@/data/demand-signals'

const repo = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

describe('audit corrections', () => {
  it('uses the WHO 2025 report’s 2023 NTD count, not 1.7 billion', () => {
    const ntd = problems.find((p) => p.slug === 'neglected-tropical-diseases')!
    expect(ntd.humansAffected.value).toBe(1_495_000_000)
    expect(ntd.humansAffected.observationYear).toBe(2023)
    expect(ntd.humansAffected.publicationYear).toBe(2025)
    expect(ntd.scale?.value).toBe(1_495_000_000)
    expect(ntd.tagline).not.toMatch(/1\.7 billion/)
  })

  it('does not apply the WHO 59 percent figure to the IDF 20–79 count', () => {
    const diabetes = problems.find((p) => p.slug === 'diabetes')!
    expect(diabetes.humansAffected.unit).toMatch(/20–79/)
    expect(diabetes.humansAffected.observationYear).toBe(2024)
    expect(diabetes.tagline).toMatch(/30\+/)
    expect(diabetes.tagline).toMatch(/2022/)
    expect(diabetes.description).not.toMatch(/59 percent are not even diagnosed/)
    expect(deathRatePair(diabetes)).toBeUndefined()
    expect(diabetes.severity).toBeUndefined()
    expect(diabetes.mortalityPairs?.[0]?.deaths).toMatchObject({ value: 2_000_000, year: 2023 })
    expect(diabetes.mortalityPairs?.[0]?.affected).toMatchObject({ value: 830_000_000, year: 2022 })
    expect(diabetes.mortalityPairs?.[0]?.notScoredBecause).toMatch(/not the same denominator/)
    expect(diabetes.mortalityPairs?.some((pair) => pair.deaths.value === 1_600_000 && pair.notScoredBecause)).toBe(true)
  })

  it('treats the Kardashev index as a logarithm', () => {
    expect(KARDASHEV.currentWatts).toBe(2e13)
    expect(KARDASHEV.typeIWatts).toBe(1e16)
    expect(KARDASHEV.index).toBeCloseTo(0.7301, 3)
    expect(KARDASHEV.fractionOfTypeI).toBeCloseTo(0.002, 6)
    const shown = formatKardashev()
    expect(shown.fraction).toBe('0.2%')
    expect(shown.caption).toMatch(/not a percent/)
    expect(repo('src/app/good-quests/page.tsx')).not.toMatch(/\* 100/)
  })

  it('converts BCE to BP with a 1950 epoch and no year 0', () => {
    expect(yearsBefore1950FromBce(3200)).toBe(5149)
    expect(yearsBefore1950FromBce(9000)).toBe(10949)
    expect(yearsBefore1950FromBce(1)).toBe(1950)
    expect(repo('src/app/ages/page.tsx')).not.toMatch(/k BP/)
  })

  it('does not say isolation or loneliness caused the mortality increase', () => {
    const row = discoveries.find((d) => d.id === 'wang-loneliness-mortality-2023')!
    expect(row.summary).toMatch(/associated with/)
    expect(row.summary).toMatch(/not proof/)
    expect(row.summary).not.toMatch(/raised/)
  })

  it('records shingles absolute and relative figures from the Nature paper', () => {
    const row = discoveries.find((d) => d.id === 'eyting-shingles-dementia-2025')!
    expect(row.summary).toMatch(/3\.5 percentage points/)
    expect(row.summary).toMatch(/6\.5-33\.4/)
    expect(row.summary).toMatch(/Zostavax/)
    expect(row.summary).toMatch(/79 to 80/)
  })

  it('does not treat a non-significant P value as noninferiority', () => {
    const row = discoveries.find((d) => d.id === 'mantis-childhood-brain-tumors-2026')!
    expect(row.summary).toMatch(/does not show noninferiority/)
    expect(row.summary).toMatch(/not marked false/)
  })

  it('does not score cancer deaths over new diagnoses as a person-year risk', () => {
    const cancer = problems.find((p) => p.slug === 'cancer')!
    expect(deathRatePair(cancer)).toBeUndefined()
    expect(cancer.humansAffected.countKind).toBe('incidence')
    expect(severityScore(cancer)).toBe(0.5)
  })

  it('keeps a conditional extinction stake out of annual severity', () => {
    const bio = problems.find((p) => p.slug === 'biosecurity')!
    expect(isConditionalStake(bio)).toBe(true)
    expect(bio.severity?.value).toBe(1)
    expect(severityScore(bio)).toBe(0.5)
  })

  it('labels market-cap headroom as scenarios, not an interval', () => {
    const row = headroomScenarios(100, 40)
    expect(row).toMatchObject({ low: 0, base: 60, high: 100 })
    expect(row.note).toMatch(/Not an empirical confidence interval/)
    expect(repo('src/app/marketcap/page.tsx')).not.toMatch(/Measured headroom/)
  })

  it('documents all 16 audited destinations', () => {
    expect(citationRepairs).toHaveLength(16)
    const src = [
      repo('src/data/problems.ts'),
      repo('src/data/ages.ts'),
      repo('src/data/founders.ts'),
      repo('src/data/voices.ts'),
      repo('src/data/progress.ts'),
      repo('src/data/capital-flows.ts'),
      repo('src/data/infographics.ts'),
    ].join('\n')
    for (const repair of citationRepairs) {
      if (repair.status === 'unchanged-false-404') {
        expect(src).toContain(repair.oldUrl)
      } else if (repair.status === 'replaced' && repair.newUrl) {
        expect(src).toContain(repair.newUrl)
        expect(src).not.toContain(repair.oldUrl)
      } else {
        expect(repair.reason.length).toBeGreaterThan(20)
      }
    }
  })

  it('derives counts and indexes the public routes', () => {
    expect(problems.length).toBeGreaterThan(11)
    expect(companies.length).toBeGreaterThan(0)
    expect(ecosystem.length).toBeGreaterThan(15)
    const paths = publicPaths()
    expect(paths).toContain('/methodology')
    expect(paths).toContain('/data')
    expect(paths).toContain('/p/cancer')
    expect(paths).toContain('/marketcap')
    expect(paths).toContain('/coverage')
    expect(paths).toContain('/whitepapers')
    expect(paths.some((path) => path.includes('?'))).toBe(false)
    expect(repo('src/app/methodology/page.tsx')).not.toMatch(/10 problems/)
    expect(repo('src/components/EmailCapture.tsx')).not.toMatch(/ships every monday/i)
  })

  it('exports reproducible scores and says when a live series was captured', () => {
    const rows = scoreRows()
    expect(rows).toHaveLength(problems.length)
    expect(rows.every((row) => row.model === RANKING_MODEL_VERSION)).toBe(true)
    const again = scoreRows()
    expect(again.map((row) => row.opportunity)).toEqual(rows.map((row) => row.opportunity))
    const rendered = renderedExport()
    expect(rendered.liveCapture.owid.find((row) => row.problem === 'neglected-tropical-diseases')?.status).toBe('ok')
    expect(rendered.who.retrievedAt).toBe('2026-11-06')
    expect(rendered.worldbank.lastupdated).toBeTruthy()
    expect(rendered.liveCapture).toBe(renderSnapshot)
    expect(rendered.snapshotId).toBe(RENDER_SNAPSHOT_ID)
  })

  it('keeps the NTD headline and the later chart as different observations', () => {
    const chart = owidChartFromSnapshot('neglected-tropical-diseases')
    expect(chart.state).toBe('ok')
    if (chart.state !== 'ok') return
    const point2023 = chart.chart.series.find((point) => point.year === 2023)
    const point2024 = chart.chart.series.find((point) => point.year === 2024)
    expect(point2024).toEqual({ year: 2024, value: 1409526996 })
    expect(point2023?.value).not.toBe(1_495_000_000)
    const exported = renderedExport().liveCapture.owid.find((row) => row.problem === 'neglected-tropical-diseases')
    expect(exported?.series).toEqual(chart.chart.series)
    expect(exported?.unit).toBe(chart.chart.unit)
  })

  it('renders every mapped OWID, WHO, and World Bank series from the export snapshot', () => {
    for (const row of renderSnapshot.owid) {
      const rendered = owidChartFromSnapshot(row.problem)
      expect(rendered.state, row.problem).toBe('ok')
      if (rendered.state !== 'ok') continue
      expect(rendered.chart.series).toEqual(row.series)
      expect(rendered.chart.unit).toBe(row.unit)
      expect(rendered.chart.asOf).toBe(row.sourceAsOf || RENDER_SNAPSHOT_ID)
    }
    for (const feed of Object.values(demandSignalRegistry)) {
      if (!feed.burden) continue
      const reading = burdenFromSnapshot(feed.burden)
      expect(reading.status, feed.burden.kind).toBe('ok')
      if (reading.status !== 'ok') continue
      const burden = feed.burden
      if (burden.kind === 'owid') {
        const row = renderSnapshot.owid.find((item) => item.slug === burden.slug)
        expect(reading.value).toBe(row?.latest?.value)
        expect(reading.year).toBe(row?.latest?.year)
      }
      if (burden.kind === 'who') {
        const row = renderSnapshot.who.find((item) => item.code === burden.code)
        expect(reading.value).toBe(row?.latest?.value)
      }
      if (burden.kind === 'wdi') {
        const row = wdiSeriesFromSnapshot(burden.indicator)
        expect(reading.value).toBe(row?.latest?.value)
      }
    }
  })

  it('does not treat population stocks as prevalence', () => {
    for (const slug of ['biosecurity', 'climate-change', 'longevity', 'energy-abundance', 'neglected-tropical-diseases']) {
      expect(quantityComparable(problems.find((p) => p.slug === slug)!), slug).toBe(false)
    }
    expect(quantityComparable(problems.find((p) => p.slug === 'copd')!)).toBe(true)
  })

  it('does not present the three unresolved citations as established numbers', () => {
    const gdp = progress.find((row) => row.slug === 'gdp-per-capita')!
    expect(gdp.citationStatus).toBe('unavailable')
    expect(repo('src/app/progress/page.tsx')).toMatch(/Citation unavailable/)
    expect(gdp.description).not.toMatch(/\$16,700/)
    const flow = getCapitalFlow('infectious-disease')!
    expect(flow.usdPerYear.citationStatus).toBe('unavailable')
    expect(flow.usdPerYear.value).toBe(0)
    expect(flow.series ?? []).toEqual([])
    expect(repo('src/app/p/[slug]/page.tsx')).toMatch(/Citation unavailable/)
    const founders = repo('src/data/founders.ts')
    expect(founders).toMatch(/Dilip Shanghvi/)
    expect(founders).toMatch(/No program, foundation, or dollar claim is shown/)
    expect(founders).not.toMatch(/Shantilal Shanghvi Foundation/)
  })

  it('lists only real whitepapers and indexes those routes', () => {
    expect(whitepapers.length).toBeGreaterThan(0)
    const paths = publicPaths()
    expect(paths).toContain('/whitepapers')
    for (const paper of whitepapers) {
      expect(problems.some((problem) => problem.slug === paper.problemSlug), paper.slug).toBe(true)
      expect(paper.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(paths).toContain(`/p/${paper.problemSlug}/whitepaper`)
    }
    expect(paths.some((path) => path.startsWith('/admin'))).toBe(false)
    expect(repo('src/app/whitepapers/page.tsx')).not.toMatch(/Monday it ships/)
  })

  it('freezes the pre-change ranking order', () => {
    expect(RANKING_MODEL_VERSION).toBe('2026-11-06.2')
    expect(RANKING_BEFORE).toHaveLength(problems.length)
    const now = scoreRows()
      .slice()
      .sort((a, b) => Number(b.opportunity) - Number(a.opportunity))
      .map((row) => row.slug)
    expect(now).not.toEqual([...RANKING_BEFORE])
    expect(now).toEqual([...RANKING_AFTER])
  })
})
