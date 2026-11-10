import { describe, expect, it } from 'vitest'
import {
  INSUFFICIENT,
  countsAsRealCompany,
  knownCompanyCount,
  openQuestStatus,
  realSupplyCount,
  scoreProblemIndex,
  type IndexDraft,
} from '@/lib/problem-index-score'
import { indexPack, indexProblems, indexTableRows, problemSnapshot } from '@/lib/problem-index'
import { balanceRows } from '@/lib/sourced-balance'

function draft(partial: {
  slug?: string
  name?: string
  clinical?: boolean
  deaths?: number | null
  dalys?: number | null
  people?: number | null
  cases?: number | null
  openalex?: number | null
  nih?: number | null
  trials?: number | null
  companies?: number | null
  sponsors?: number | null
  companyNames?: { name: string; placeholder?: boolean }[]
  sponsorNames?: { name: string; placeholder?: boolean }[]
  companiesCapped?: boolean
}): IndexDraft {
  const sensor = (value: number | null | undefined, names?: { name: string; placeholder?: boolean }[], capped = false) => {
    if (value === undefined) return null
    if (value === null) return { status: 'unavailable' as const, value: null, capped, names: names || [] }
    return { status: 'ok' as const, value, capped, names: names || [] }
  }
  return {
    slug: partial.slug || 'row',
    name: partial.name || partial.slug || 'Row',
    category: 'Health',
    clinical: partial.clinical ?? true,
    slots: {
      deaths: partial.deaths ?? null,
      dalys: partial.dalys ?? null,
      people: partial.people ?? null,
      cases: partial.cases ?? null,
    },
    sensors: {
      openalex: sensor(partial.openalex),
      nih: sensor(partial.nih),
      trials: sensor(partial.trials),
      companies: sensor(partial.companies, partial.companyNames, partial.companiesCapped),
      sponsors: sensor(partial.sponsors, partial.sponsorNames),
    },
  }
}

describe('problem index score', () => {
  it('publishes a demand score only with at least 3 percentile inputs', () => {
    const thin = scoreProblemIndex([
      draft({ slug: 'a', name: 'A', deaths: 100, openalex: 10, nih: null, trials: null, companies: 1, sponsors: 1 }),
      draft({ slug: 'b', name: 'B', deaths: 10, openalex: 2, nih: null, trials: null, companies: 0, sponsors: 0 }),
    ])
    for (const row of thin) {
      expect(row.demandInputs).toBeLessThan(3)
      expect(row.demandScore).toBeNull()
      expect(row.demandLabel).toBe(INSUFFICIENT)
      expect(row.gapLabel).toBe(INSUFFICIENT)
      expect(row.rank).toBeNull()
    }

    const enough = scoreProblemIndex([
      draft({ slug: 'a', name: 'A', deaths: 100, people: 1000, openalex: 10, companies: 1, sponsors: 0 }),
      draft({ slug: 'b', name: 'B', deaths: 10, people: 100, openalex: 1, companies: 4, sponsors: 2 }),
    ])
    for (const row of enough) {
      expect(row.demandInputs).toBeGreaterThanOrEqual(3)
      expect(row.demandScore).not.toBeNull()
      expect(row.demandLabel).not.toBe(INSUFFICIENT)
    }
    const high = enough.find((row) => row.slug === 'a')
    const low = enough.find((row) => row.slug === 'b')
    expect(high?.rank).toBe(1)
    expect(low?.rank).toBe(2)
    expect((high?.gap || 0) > (low?.gap || 0)).toBe(true)
  })

  it('never counts a placeholder company as supply', () => {
    expect(countsAsRealCompany('Acme Malaria Co. (open quest, not a real company)')).toBe(false)
    expect(countsAsRealCompany('Pfizer')).toBe(true)
    const sensor = {
      status: 'ok' as const,
      value: 2,
      names: [
        { name: 'Acme Malaria Co. (open quest, not a real company)', placeholder: true },
        { name: 'Pfizer' },
      ],
    }
    expect(realSupplyCount(sensor)).toBe(1)
    const rows = scoreProblemIndex([
      draft({
        slug: 'a',
        name: 'A',
        clinical: false,
        deaths: 5,
        people: 5,
        openalex: 5,
        companies: 1,
        companyNames: [{ name: 'Acme A Co. (open quest, not a real company)', placeholder: true }],
      }),
      draft({ slug: 'b', name: 'B', clinical: false, deaths: 1, people: 1, openalex: 1, companies: 0, companyNames: [] }),
    ])
    const open = rows.find((row) => row.slug === 'a')
    expect(open?.companyCount).toBe(0)
    expect(open?.openQuest).toBe(true)
    expect(openQuestStatus(0, null, false)).toBe(true)
    expect(openQuestStatus(0, null, true)).toBe(false)
    expect(knownCompanyCount(0, null, true)).toBeNull()
  })

  it('keeps a source URL on every committed row and ignores placeholder companies', () => {
    expect(indexProblems().length).toBeGreaterThan(0)
    expect(indexProblems().length).toBeLessThanOrEqual(500)
    const before = balanceRows().map((row) => [row.slug, row.rank, row.demandLabel, row.supplyLabel, row.gapLabel])
    for (const problem of indexProblems()) {
      expect(problem.headline.sourceUrl, problem.slug).toMatch(/^https:\/\//)
      expect(problem.metrics.length).toBeGreaterThan(0)
      for (const metric of problem.metrics) {
        expect(metric.sourceUrl, `${problem.slug} ${metric.label}`).toMatch(/^https:\/\//)
        expect(Number.isFinite(metric.value)).toBe(true)
        expect(metric.retrievedOn).toBe(problemSnapshot.retrievedOn)
      }
      const pack = indexPack(problem.slug)
      expect(pack, problem.slug).toBeTruthy()
      expect(pack?.placeholder).toBe(true)
      expect(pack?.name).toContain('not a real company')
      expect(pack?.marketCap).toBeNull()
      expect(pack?.valuation).toBeNull()
      expect(pack?.revenue).toBeNull()
      expect(pack?.label.toLowerCase()).toContain('ai-generated')
      const names = [
        ...(problem.sensors.companies?.names || []),
        ...(problem.sensors.sponsors?.names || []),
      ]
      expect(names.some((name) => !countsAsRealCompany(name.name))).toBe(false)
    }
    const scored = indexTableRows()
    for (const row of scored) {
      const problem = indexProblems().find((item) => item.slug === row.slug)
      const draft = problem as IndexDraft
      const parts = [
        draft.slots.deaths,
        draft.slots.dalys,
        draft.slots.people,
        draft.slots.cases,
        draft.sensors.openalex?.status === 'ok' && !draft.sensors.openalex.capped ? draft.sensors.openalex.value : null,
        draft.sensors.nih?.status === 'ok' && !draft.sensors.nih.capped ? draft.sensors.nih.value : null,
        draft.sensors.trials?.status === 'ok' && !draft.sensors.trials.capped ? draft.sensors.trials.value : null,
      ].filter((value) => typeof value === 'number')
      if (row.demandLabel !== INSUFFICIENT) expect(parts.length).toBeGreaterThanOrEqual(3)
      if (parts.length < 3) expect(row.demandLabel).toBe(INSUFFICIENT)
    }
    expect(balanceRows().map((row) => [row.slug, row.rank, row.demandLabel, row.supplyLabel, row.gapLabel])).toEqual(before)
  })

  it('leaves a capped company list out of supply', () => {
    const rows = scoreProblemIndex([
      draft({ slug: 'a', name: 'A', clinical: false, companies: 200, companiesCapped: true, deaths: 3, people: 3, openalex: 3 }),
      draft({ slug: 'b', name: 'B', clinical: false, companies: 0, deaths: 1, people: 1, openalex: 1 }),
    ])
    const capped = rows.find((row) => row.slug === 'a')
    expect(capped?.supplyScore).toBeNull()
    expect(capped?.supplyLabel).toBe(INSUFFICIENT)
    expect(capped?.openQuest).toBe(false)
    expect(capped?.companyNote).toContain('capped')
  })
})
