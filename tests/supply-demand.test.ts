import { describe, expect, it } from 'vitest'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { NOT_ENOUGH, balanceRows, coveredMean, formatCovered, formatGap, meanPresent, percentileHigh, sourcedCompanyCount } from '@/lib/sourced-balance'
import { demandSnapshot } from '@/lib/demand-snapshot'
import { FETCHED_PAGE_TAGS } from '@/data/technologies'
import { openQuestPlaceholders } from '@/lib/open-quests'
import { TECHNOLOGY_TAGS, appliedTechnologyTags } from '@/data/technologies'
import { rankBySlug } from '@/lib/open-data'
import { NOT_SOURCED } from '@/lib/quest-types'

describe('supply and demand score', () => {
  it('leaves a missing value out of the mean and does not treat it as zero', () => {
    expect(meanPresent([null, null])).toBeNull()
    expect(meanPresent([1, null, 1])).toBe(1)
    expect(meanPresent([1, 0])).toBe(0.5)
    expect(formatGap(null, 1).label).toBe(NOT_ENOUGH)
    expect(formatGap(1, 0.25)).toEqual({ value: 75, label: '75' })
    expect(coveredMean([0.2, null, null], 3)).toBeNull()
    expect(coveredMean([0.2, 0.4, 0.8], 3)).toBeCloseTo(0.466666, 5)
    expect(formatCovered(0.5, 1, 3)).toBe(NOT_ENOUGH)
    expect(formatCovered(0.5, 3, 3)).toBe('50')
  })

  it('ranks only the problems that have a number', () => {
    const ranks = percentileHigh([10, null, 30, 30])
    expect(ranks[1]).toBeNull()
    expect(ranks[0]).toBe(0)
    expect(ranks[2]).toBe(0.75)
    expect(ranks[3]).toBe(0.75)
    expect(percentileHigh([4])).toEqual([null])
  })

  it('does not change the priority order', () => {
    const ranks = rankBySlug()
    const rows = balanceRows()
    expect(rows.map((row) => row.slug)).toEqual(
      [...problems].sort((a, b) => (ranks.get(a.slug) ?? 0) - (ranks.get(b.slug) ?? 0) || a.name.localeCompare(b.name)).map((problem) => problem.slug),
    )
  })

  it('shows not yet sourced when a demand score has no usable inputs', () => {
    for (const row of balanceRows()) {
      const demandIn = row.inputs.filter((input) => input.role === 'demand' && input.inScore)
      if (demandIn.length < 3) {
        expect(row.demandScore).toBeNull()
        expect(row.demandLabel).toBe(NOT_ENOUGH)
      } else if (row.demandScore != null) {
        expect(demandIn.length).toBeGreaterThanOrEqual(3)
      }
      if (row.supplyScore == null) expect(row.supplyLabel).toBe(NOT_ENOUGH)
      if (row.demandScore == null || row.supplyScore == null) expect(row.gapLabel).toBe(NOT_ENOUGH)
      const capital = row.inputs.find((input) => input.label === 'Annual capital')
      expect(capital).toBeTruthy()
      if (capital?.value == null) expect(capital?.display).toBe(NOT_SOURCED)
    }
  })
})

describe('open quest placeholders', () => {
  it('never enters supply counts and never carries invented money', () => {
    const names = new Set(companies.map((company) => company.name))
    const slugs = new Set(companies.map((company) => company.slug))
    for (const quest of openQuestPlaceholders()) {
      expect(quest.placeholder).toBe(true)
      expect(quest.marketCap).toBeNull()
      expect(quest.valuation).toBeNull()
      expect(quest.revenue).toBeNull()
      expect(quest.name).toContain('(open quest, not a real company)')
      expect(names.has(quest.name)).toBe(false)
      expect(slugs.has(quest.id)).toBe(false)
    }
    for (const problem of problems) {
      const counted = companies.filter((company) => company.problemSlugs.includes(problem.slug)).length
      expect(sourcedCompanyCount(problem.slug)).toBe(counted)
      const row = balanceRows().find((item) => item.slug === problem.slug)
      expect(row && row.companyCount >= counted).toBe(true)
      if (row?.openQuest) expect(counted).toBe(0)
    }
    expect(problems.some((problem) => problem.slug === 'ai' || problem.name === 'AI')).toBe(false)
  })

  it('keeps every technology tag on a stored source sentence and URL', () => {
    expect(appliedTechnologyTags().length).toBe(TECHNOLOGY_TAGS.length + FETCHED_PAGE_TAGS.length)
    const openai = appliedTechnologyTags().find((tag) => tag.companySlug === 'openai')
    expect(openai?.sourceUrl).toBe('https://en.wikipedia.org/wiki/OpenAI')
    expect(openai?.evidence).toContain('Artificial intelligence')
  })

  it('stores an OpenAlex, NIH, USAspending, and Wikipedia reading for every problem', () => {
    for (const problem of problems) {
      const feeds = new Set((demandSnapshot.problems[problem.slug] ?? []).map((reading) => reading.feed))
      for (const feed of ['openalex', 'nih', 'usaspending', 'wikipedia']) {
        expect(feeds.has(feed), `${problem.slug} ${feed}`).toBe(true)
      }
    }
  })
})
