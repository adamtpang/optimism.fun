import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SKILLS } from '@/lib/where-match'
import { emptyPlayerCard, type PlayerCard, type PlayerOptions } from '@/lib/player-card'
import { matchQuests } from '@/lib/quest-match'
import type { QuestView } from '@/lib/quest-types'
import { buildPlayerOptions, buildQuestBoard } from '@/lib/quest-board'
import { problems } from '@/data/problems'

const options: PlayerOptions = {
  skills: SKILLS.map((skill) => ({ id: skill.id, label: skill.label })),
  domains: [
    { id: 'health', label: 'Health' },
    { id: 'energy', label: 'Energy' },
    { id: 'ai', label: 'AI' },
  ],
  places: ['USA', 'Kenya'],
  communities: [{ id: 'emergent-ventures', label: 'Emergent Ventures' }],
  networks: [
    { id: 'company:moderna', label: 'Moderna', group: 'company' },
    { id: 'founder:Larry Page', label: 'Larry Page', group: 'founder' },
  ],
}

function card(partial: Partial<PlayerCard> = {}): PlayerCard {
  return { ...emptyPlayerCard(), ...partial }
}

function quest(partial: Partial<QuestView> & Pick<QuestView, 'slug' | 'name' | 'rank'>): QuestView {
  return {
    tagline: '',
    domain: null,
    domainLabel: null,
    tier: 'welfare',
    href: `/p/${partial.slug}`,
    possible: [],
    newestFinding: null,
    retractedOnly: false,
    builders: [],
    namedPeople: [],
    funders: [],
    demand: [],
    teamCount: 0,
    funderCount: 0,
    teamsSourced: false,
    capitalSourced: false,
    leastSupplied: 'not yet sourced',
    countries: [],
    funderSlugs: [],
    companyIds: [],
    founderIds: [],
    actions: [],
    gapLine: '',
    ...partial,
  }
}

const healthTeams = quest({
  slug: 'malaria',
  name: 'Malaria',
  rank: 4,
  domain: 'health',
  domainLabel: 'Health',
  tier: 'welfare',
  teamsSourced: true,
  capitalSourced: true,
  teamCount: 1,
  funderCount: 4,
  leastSupplied: 'teams',
  countries: ['USA'],
  actions: [{ kind: 'build', name: 'Build the test', url: 'https://example.com/build', detail: 'A sourced build action.' }],
})

const healthUnknown = quest({
  slug: 'unknown-health',
  name: 'Unknown health',
  rank: 2,
  domain: 'health',
  domainLabel: 'Health',
  tier: 'welfare',
})

const energyCapital = quest({
  slug: 'grid',
  name: 'Grid',
  rank: 1,
  domain: 'energy',
  domainLabel: 'Energy',
  tier: 'hard-tech',
  teamsSourced: true,
  capitalSourced: true,
  teamCount: 6,
  funderCount: 1,
  leastSupplied: 'capital',
  countries: ['USA'],
  funderSlugs: ['emergent-ventures'],
  founderIds: ['founder:Larry Page'],
  actions: [{ kind: 'fund', name: 'Fund the test', url: 'https://example.com/fund', detail: 'A sourced fund action.' }],
})

const xrisk = quest({
  slug: 'biosecurity',
  name: 'Biosecurity',
  rank: 3,
  domain: 'bio',
  domainLabel: 'Biosecurity',
  tier: 'x-risk',
  teamsSourced: true,
  capitalSourced: true,
  teamCount: 2,
  funderCount: 2,
  leastSupplied: 'even',
  companyIds: ['company:moderna'],
})

const fixtures = [healthTeams, healthUnknown, energyCapital, xrisk]

function prose(match: { reasons: string[]; onlyYou: string; playerGaps: string[]; dataGaps: string[]; firstAction: { detail: string } }) {
  return [...match.reasons, match.onlyYou, ...match.playerGaps, ...match.dataGaps, match.firstAction.detail].join('\n')
}

describe('quest matching', () => {
  it('does not treat an empty card as the top of the ranking', () => {
    expect(matchQuests(card(), fixtures, options)).toEqual([])
  })

  it('ranks a skill that meets a team gap ahead of the same domain with no sourced gap', () => {
    const matches = matchQuests(card({ skills: ['bio'], time: 'decade' }), fixtures, options)
    expect(matches.map((match) => match.slug)).toEqual(['malaria', 'unknown-health', 'biosecurity'])
    expect(matches[0].reasons).toContain("Your Biology meets this quest's gap in teams.")
    expect(matches[0].reasons).toContain("Your time (A decade) meets this quest's gap in teams.")
    expect(matches[0].onlyYou).toContain("Your time (A decade) meets this quest's gap in teams.")
    const skillOnly = matchQuests(card({ skills: ['bio'] }), fixtures, options)
    expect(skillOnly[0].onlyYou).toContain("Your Biology meets this quest's gap in teams.")
    expect(matches[0].firstAction).toEqual({
      name: 'Build the test',
      url: 'https://example.com/build',
      detail: 'A sourced build action.',
    })
    expect(matches[1].onlyYou).toContain('not yet sourced')
    expect(prose(matches[0])).not.toMatch(/%|fit score|score/i)
    expect(matches[0]).not.toHaveProperty('score')
  })

  it('matches capital only where named capital rows are the fewer side', () => {
    const matches = matchQuests(card({ capital: 'allocates' }), fixtures, options)
    expect(matches.map((match) => match.slug)).toEqual(['grid'])
    expect(matches[0].reasons).toContain("Your capital (Allocates other people's capital) meets this quest's gap in capital.")
    expect(matches[0].onlyYou).toContain("gap in capital")
    expect(matches[0].firstAction.name).toBe('Fund the test')
    expect(matches[0].playerGaps).toContain('A skill or domain in Energy. The card does not list one.')
  })

  it('uses a place that no sourced builder occupies as the team-gap intersection', () => {
    const matches = matchQuests(card({ places: ['Kenya'] }), fixtures, options)
    const malaria = matches.find((match) => match.slug === 'malaria')
    expect(malaria?.reasons.some((reason) => reason.includes('Kenya') && reason.includes('gap in teams'))).toBe(true)
    expect(malaria?.onlyYou).toContain('Kenya')
    expect(matches.find((match) => match.slug === 'grid')).toBeUndefined()
  })

  it('names a sourced community when capital is the thinner side', () => {
    const matches = matchQuests(card({ communities: ['emergent-ventures'] }), fixtures, options)
    expect(matches.map((match) => match.slug)).toEqual(['grid'])
    expect(matches[0].reasons[0]).toContain('Emergent Ventures')
    expect(matches[0].onlyYou).toContain('Emergent Ventures')
  })

  it('states a high risk appetite against the tier and does not invent a percent', () => {
    const matches = matchQuests(card({ risk: 'high' }), fixtures, options)
    const ids = matches.map((match) => match.slug)
    expect(ids).toContain('biosecurity')
    expect(ids).toContain('grid')
    expect(ids).not.toContain('malaria')
    for (const match of matches) {
      expect(prose(match)).not.toMatch(/%/)
      expect(match.reasons.some((reason) => reason.includes('risk appetite is high'))).toBe(true)
    }
  })

  it('drops a domain the index does not use', () => {
    const board = buildQuestBoard()
    const liveOptions = buildPlayerOptions()
    const matches = matchQuests(card({ domains: ['ai'] }), board, liveOptions)
    expect(matches).toEqual([])
    const health = matchQuests(card({ domains: ['health'] }), board, liveOptions)
    const healthSlugs = problems.filter((problem) => problem.domain === 'health').map((problem) => problem.slug)
    expect(health.map((match) => match.slug).sort()).toEqual([...healthSlugs].sort())
    expect(health.every((match) => match.reasons.some((reason) => reason.includes('Health')))).toBe(true)
  })
})

describe('new quest copy has no em dash', () => {
  it('keeps authored sentences free of em and en dashes', () => {
    const files = [
      'src/lib/quest-types.ts',
      'src/lib/quest-match.ts',
      'src/lib/quest-board.ts',
      'src/lib/player-card.ts',
      'src/lib/contribution-sort.ts',
      'src/components/QuestList.tsx',
      'src/components/PlayerCardPanel.tsx',
      'src/app/quests/page.tsx',
      'src/app/where/page.tsx',
      'src/app/founders/page.tsx',
      'src/app/companies/page.tsx',
    ]
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      expect(text, file).not.toMatch(/[—–]/)
    }
  })
})
