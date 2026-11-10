import { describe, expect, it } from 'vitest'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { founders } from '@/data/founders'
import { buildQuestBoard } from '@/lib/quest-board'
import { NOT_SOURCED, leastSuppliedGap } from '@/lib/quest-types'
import { demandSnapshot } from '@/lib/demand-snapshot'
import { publicPaths } from '@/lib/public-routes'

describe('quest board', () => {
  const board = buildQuestBoard()

  it('keeps one quest per problem in the existing rank order', () => {
    expect(board).toHaveLength(problems.length)
    const ranks = board.map((quest) => quest.rank)
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b))
    expect(new Set(board.map((quest) => quest.slug)).size).toBe(problems.length)
  })

  it('copies humans affected and does not fill a missing market size', () => {
    for (const quest of board) {
      const problem = problems.find((row) => row.slug === quest.slug)
      expect(problem).toBeTruthy()
      const humans = quest.demand.find((fact) => fact.label === 'Humans affected')
      expect(humans?.value).toBe(problem!.humansAffected.value.toLocaleString('en-US'))
      expect(humans?.source).toBe(problem!.humansAffected.source)
      const market = quest.demand.find((fact) => fact.label === 'Market size')
      if (problem!.marketSize) {
        expect(market?.value).toBe(problem!.marketSize.value.toLocaleString('en-US'))
      } else {
        expect(market?.value).toBe(NOT_SOURCED)
      }
    }
  })

  it('lists only sourced builders and says when a side is missing', () => {
    for (const quest of board) {
      const problem = problems.find((row) => row.slug === quest.slug)
      for (const builder of quest.builders) {
        const tagged = companies.some((company) => company.name === builder.name && company.problemSlugs.includes(quest.slug))
        const listed = problem?.organizations?.some((org) => org.name === builder.name) ?? false
        const vehicle = founders.some((founder) =>
          founder.frontierBets?.some((bet) => bet.problemSlug === quest.slug && bet.vehicle === builder.name),
        )
        expect(tagged || listed || vehicle, `${quest.slug}: ${builder.name}`).toBe(true)
      }
      if (!quest.teamsSourced) expect(quest.gapLine).toContain('Named teams: not yet sourced.')
      if (!quest.capitalSourced) expect(quest.gapLine).toContain('Named capital: not yet sourced.')
      expect(quest.gapLine).not.toMatch(/\d+%/)
    }
    const bio = board.find((quest) => quest.slug === 'biosecurity')
    expect(bio?.builders.some((builder) => builder.name === 'Moderna')).toBe(true)
  })

  it('copies a stored demand reading and leaves a failed feed unsourced', () => {
    for (const [slug, readings] of Object.entries(demandSnapshot.problems)) {
      const quest = board.find((row) => row.slug === slug)
      expect(quest).toBeTruthy()
      for (const reading of readings) {
        const fact = quest?.demand.find((row) => row.label === reading.label && row.asOf === reading.retrievedOn)
        expect(fact, `${slug} ${reading.feed}`).toBeTruthy()
        if (reading.status === 'ok' && reading.value != null) {
          expect(fact?.value).toBe(reading.value.toLocaleString('en-US'))
        } else {
          expect(fact?.value).toBe(NOT_SOURCED)
        }
      }
    }
  })

  it('treats a missing side as unsourced rather than zero', () => {
    expect(leastSuppliedGap(null, 3)).toBe('not yet sourced')
    expect(leastSuppliedGap(1, 4)).toBe('teams')
    expect(leastSuppliedGap(4, 1)).toBe('capital')
    expect(leastSuppliedGap(2, 2)).toBe('even')
  })

  it('is on the public path list', () => {
    expect(publicPaths()).toContain('/quests')
  })
})
