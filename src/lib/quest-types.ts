import type { Domain, Tier } from '@/data/types'

/** Shown wherever a figure or list is absent. Never replaced with an estimate. */
export const NOT_SOURCED = 'not yet sourced'

export type DemandFact = {
  label: string
  /** Exact stored figure, or `not yet sourced`. */
  value: string
  unit: string
  source: string
  sourceUrl: string | null
  asOf: string
}

export type SourcedParty = {
  name: string
  href: string | null
  detail: string
  source: string
  sourceUrl: string | null
}

export type QuestFinding = {
  id: string
  title: string
  published: string
  summary: string
  url: string
  source: string
  changes: string
  review: string
  status: string | null
  notice: string | null
  noticeUrl: string | null
}

export type QuestAction = {
  kind: 'build' | 'fund' | 'buy' | 'learn'
  name: string
  url: string
  detail: string
}

/**
 * Named-row comparison only. A missing list is `not yet sourced`, not zero.
 * `even` means both lists exist and have the same count.
 */
export type LeastSupplied = 'teams' | 'capital' | 'even' | 'not yet sourced'

export type QuestView = {
  slug: string
  name: string
  tagline: string
  domain: Domain | null
  domainLabel: string | null
  tier: Tier
  rank: number
  href: string
  /** Tractability findings, newest first. These are the "what just became possible" rows. */
  possible: QuestFinding[]
  /** Newest non-retracted finding when no tractability row exists. */
  newestFinding: QuestFinding | null
  /** True when every finding on file is retracted. */
  retractedOnly: boolean
  builders: SourcedParty[]
  /** People named on the problem. Not counted as team supply. */
  namedPeople: SourcedParty[]
  funders: SourcedParty[]
  demand: DemandFact[]
  teamCount: number
  funderCount: number
  teamsSourced: boolean
  capitalSourced: boolean
  leastSupplied: LeastSupplied
  countries: string[]
  funderSlugs: string[]
  companyIds: string[]
  founderIds: string[]
  actions: QuestAction[]
  gapLine: string
}

export function leastSuppliedGap(teams: number | null, capital: number | null): LeastSupplied {
  if (teams == null || capital == null) return 'not yet sourced'
  if (teams < capital) return 'teams'
  if (capital < teams) return 'capital'
  return 'even'
}

export function gapLineFor(input: {
  demandSourced: boolean
  teams: number | null
  capital: number | null
  least: LeastSupplied
}): string {
  const demand = input.demandSourced
    ? 'Sourced demand is listed on this quest.'
    : 'Demand: not yet sourced.'
  const teams =
    input.teams == null
      ? 'Named teams: not yet sourced.'
      : `${input.teams} named team ${input.teams === 1 ? 'row' : 'rows'} on this site.`
  const capital =
    input.capital == null
      ? 'Named capital: not yet sourced.'
      : `${input.capital} named capital ${input.capital === 1 ? 'row' : 'rows'} on this site.`
  const thin =
    input.least === 'teams'
      ? 'Named team rows are fewer than named capital rows.'
      : input.least === 'capital'
        ? 'Named capital rows are fewer than named team rows.'
        : input.least === 'even'
          ? `Named team rows and named capital rows are the same count (${input.teams}).`
          : 'The thinner side is not yet sourced.'
  return `${demand} ${teams} ${capital} ${thin}`
}
