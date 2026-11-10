/**
 * Explainable quest matching. The order is a list of yes/no rules, then the
 * existing site rank. Nothing in the result is a fit score or a percentage.
 *
 * Sort, true first:
 * 1. The player's rarest intersecting field meets the quest's least-supplied gap.
 * 2. Domain on the card is the quest's domain.
 * 3. A skill on the card covers the quest's domain.
 * 4. Time or capital on the card can fill that thinner side.
 * 5. A place on the card is on a sourced builder or funder.
 * 6. A community or network on the card is already sourced on the quest.
 * 7. Risk appetite matches the quest's tier, or a low appetite meets sourced teams.
 * 8. Existing site rank, then name.
 */
import { SKILLS, type SkillId } from '@/lib/where-match'
import {
  CAPITAL_LABEL,
  RISK_LABEL,
  TIME_LABEL,
  type PlayerCard,
  type PlayerOptions,
} from '@/lib/player-card'
import type { Domain } from '@/data/types'
import type { LeastSupplied, QuestAction, QuestView } from '@/lib/quest-types'

export type QuestMatch = {
  slug: string
  name: string
  href: string
  rank: number
  domainLabel: string | null
  reasons: string[]
  playerGaps: string[]
  dataGaps: string[]
  onlyYou: string
  firstAction: { name: string; url: string; detail: string }
}

type Side = 'teams' | 'capital'

type Candidate = {
  label: string
  frequency: number
  order: number
  side: Side
  sentence: string
}

const FULL_TIME = new Set(['full-time', 'decade'])
const DEPLOYS_CAPITAL = new Set(['raise', 'allocates'])

function skillHits(skills: SkillId[], domain: Domain | null): SkillId[] {
  if (!domain) return []
  return skills.filter((id) => SKILLS.find((skill) => skill.id === id)?.domains.includes(domain))
}

function skillLabel(id: SkillId): string {
  return SKILLS.find((skill) => skill.id === id)?.label ?? id
}

function optionLabel(id: string, rows: { id: string; label: string }[]): string {
  return rows.find((row) => row.id === id)?.label ?? id
}

function frequencies(quests: QuestView[]) {
  const domain = new Map<string, number>()
  const skill = new Map<string, number>()
  const place = new Map<string, number>()
  const community = new Map<string, number>()
  const network = new Map<string, number>()
  let teamGaps = 0
  let capitalGaps = 0
  for (const quest of quests) {
    if (quest.domain) domain.set(quest.domain, (domain.get(quest.domain) ?? 0) + 1)
    if (quest.leastSupplied === 'teams') teamGaps += 1
    if (quest.leastSupplied === 'capital') capitalGaps += 1
    for (const skillId of SKILLS) {
      if (quest.domain && skillId.domains.includes(quest.domain)) {
        skill.set(skillId.id, (skill.get(skillId.id) ?? 0) + 1)
      }
    }
    for (const country of quest.countries) place.set(country, (place.get(country) ?? 0) + 1)
    for (const slug of quest.funderSlugs) community.set(slug, (community.get(slug) ?? 0) + 1)
    for (const id of [...quest.companyIds, ...quest.founderIds]) {
      network.set(id, (network.get(id) ?? 0) + 1)
    }
  }
  return { domain, skill, place, community, network, teamGaps, capitalGaps }
}

function intersections(card: PlayerCard, quest: QuestView, freq: ReturnType<typeof frequencies>, options: PlayerOptions): Candidate[] {
  const out: Candidate[] = []
  const side = quest.leastSupplied
  if (side !== 'teams' && side !== 'capital') return out

  if (side === 'teams') {
    for (const id of skillHits(card.skills, quest.domain)) {
      const label = skillLabel(id)
      out.push({
        label,
        frequency: freq.skill.get(id) ?? 0,
        order: 3,
        side,
        sentence: `Your ${label} meets this quest's gap in teams. It is the rarest intersecting field on this card, and named team rows are fewer than named capital rows.`,
      })
    }
    if (quest.domain && card.domains.includes(quest.domain) && quest.domainLabel) {
      out.push({
        label: quest.domainLabel,
        frequency: freq.domain.get(quest.domain) ?? 0,
        order: 4,
        side,
        sentence: `Your ${quest.domainLabel} domain meets this quest's gap in teams. It is the rarest intersecting field on this card, and named team rows are fewer than named capital rows.`,
      })
    }
    if (FULL_TIME.has(card.time)) {
      out.push({
        label: TIME_LABEL[card.time],
        frequency: freq.teamGaps,
        order: 5,
        side,
        sentence: `Your time (${TIME_LABEL[card.time]}) meets this quest's gap in teams. It is the rarest intersecting field on this card, and named team rows are fewer than named capital rows.`,
      })
    }
    if (quest.countries.length > 0) {
      for (const place of card.places) {
        if (quest.countries.includes(place)) continue
        out.push({
          label: place,
          frequency: freq.place.get(place) ?? 0,
          order: 0,
          side,
          sentence: `Your place ${place} meets this quest's gap in teams. It is the rarest intersecting field on this card. No sourced builder or funder on this quest is based there.`,
        })
      }
    }
    for (const id of card.networks) {
      if (!quest.companyIds.includes(id)) continue
      const label = optionLabel(id, options.networks)
      out.push({
        label,
        frequency: freq.network.get(id) ?? 0,
        order: 2,
        side,
        sentence: `Your network includes ${label}, a sourced team on the thinner side. It is the rarest intersecting field on this card.`,
      })
    }
  }

  if (side === 'capital') {
    if (DEPLOYS_CAPITAL.has(card.capital)) {
      out.push({
        label: CAPITAL_LABEL[card.capital],
        frequency: freq.capitalGaps,
        order: 6,
        side,
        sentence: `Your capital (${CAPITAL_LABEL[card.capital]}) meets this quest's gap in capital. It is the rarest intersecting field on this card, and named capital rows are fewer than named team rows.`,
      })
    }
    for (const id of card.communities) {
      if (!quest.funderSlugs.includes(id)) continue
      const label = optionLabel(id, options.communities)
      out.push({
        label,
        frequency: freq.community.get(id) ?? 0,
        order: 1,
        side,
        sentence: `Your community ${label} meets this quest's gap in capital. It is the rarest intersecting field on this card, and that community is a sourced funder here.`,
      })
    }
    for (const id of card.networks) {
      if (!quest.founderIds.includes(id)) continue
      const label = optionLabel(id, options.networks)
      out.push({
        label,
        frequency: freq.network.get(id) ?? 0,
        order: 2,
        side,
        sentence: `Your network includes ${label}, a sourced funder on the thinner side. It is the rarest intersecting field on this card.`,
      })
    }
  }

  return out
}

function rarest(candidates: Candidate[]): Candidate | null {
  return candidates.reduce<Candidate | null>((best, item) => {
    if (!best) return item
    if (item.frequency !== best.frequency) return item.frequency < best.frequency ? item : best
    return item.order < best.order ? item : best
  }, null)
}

function rarestField(card: PlayerCard, freq: ReturnType<typeof frequencies>, options: PlayerOptions): string | null {
  const fields: { label: string; frequency: number; order: number }[] = []
  for (const id of card.skills) {
    fields.push({ label: skillLabel(id), frequency: freq.skill.get(id) ?? 0, order: 3 })
  }
  for (const id of card.domains) {
    const label = optionLabel(id, options.domains)
    fields.push({ label, frequency: freq.domain.get(id) ?? 0, order: 4 })
  }
  for (const place of card.places) fields.push({ label: place, frequency: freq.place.get(place) ?? 0, order: 0 })
  for (const id of card.communities) {
    fields.push({ label: optionLabel(id, options.communities), frequency: freq.community.get(id) ?? 0, order: 1 })
  }
  for (const id of card.networks) {
    fields.push({ label: optionLabel(id, options.networks), frequency: freq.network.get(id) ?? 0, order: 2 })
  }
  if (FULL_TIME.has(card.time)) fields.push({ label: TIME_LABEL[card.time], frequency: freq.teamGaps, order: 5 })
  if (DEPLOYS_CAPITAL.has(card.capital)) {
    fields.push({ label: CAPITAL_LABEL[card.capital], frequency: freq.capitalGaps, order: 6 })
  }
  const pick = rarest(
    fields.map((field) => ({ ...field, side: 'teams' as const, sentence: '' })),
  )
  return pick?.label ?? null
}

function onlyYouLine(
  card: PlayerCard,
  quest: QuestView,
  candidates: Candidate[],
  freq: ReturnType<typeof frequencies>,
  options: PlayerOptions,
): string {
  const hit = rarest(candidates)
  if (hit) return hit.sentence
  const rare = rarestField(card, freq, options)
  const rareBit = rare ? `Your rarest field on this card is ${rare}. ` : ''
  if (quest.leastSupplied === 'not yet sourced') {
    return `${rareBit}This quest's least-supplied gap is not yet sourced, so there is no intersection to claim.`
  }
  if (quest.leastSupplied === 'even') {
    return `${rareBit}Named team rows and named capital rows are the same count, so there is no thinner side to intersect.`
  }
  return `${rareBit}It does not intersect this quest's gap in ${quest.leastSupplied}.`
}

function firstAction(card: PlayerCard, quest: QuestView): { name: string; url: string; detail: string } {
  const wantsBuild = card.time === 'hours' || card.time === 'nights' || FULL_TIME.has(card.time)
  const wantsFund = card.capital === 'personal' || DEPLOYS_CAPITAL.has(card.capital)
  const pick = (kinds: QuestAction['kind'][]) => quest.actions.find((action) => kinds.includes(action.kind))
  const chosen = (wantsBuild ? pick(['build', 'learn']) : undefined) ?? (wantsFund ? pick(['fund']) : undefined) ?? quest.actions[0]
  if (chosen) return { name: chosen.name, url: chosen.url, detail: chosen.detail }
  const finding = quest.possible[0] ?? quest.newestFinding
  if (finding) {
    return {
      name: finding.title,
      url: finding.url,
      detail: quest.possible[0] ? 'Newest tractability finding on file.' : 'Newest sourced finding on file.',
    }
  }
  return { name: quest.name, url: quest.href, detail: 'Read the problem page and its sources.' }
}

type Flags = {
  intersects: boolean
  domain: boolean
  skill: boolean
  fills: boolean
  place: boolean
  community: boolean
  network: boolean
  risk: boolean
}

function compare(a: { flags: Flags; rank: number; name: string }, b: { flags: Flags; rank: number; name: string }): number {
  const keys: (keyof Flags)[] = ['intersects', 'domain', 'skill', 'fills', 'place', 'community', 'network', 'risk']
  for (const key of keys) {
    if (a.flags[key] !== b.flags[key]) return a.flags[key] ? -1 : 1
  }
  return a.rank - b.rank || a.name.localeCompare(b.name)
}

export function matchQuests(card: PlayerCard, quests: QuestView[], options: PlayerOptions): QuestMatch[] {
  const freq = frequencies(quests)
  const ranked: { flags: Flags; rank: number; name: string; match: QuestMatch }[] = []

  for (const quest of quests) {
    const matchedSkills = skillHits(card.skills, quest.domain)
    const domainHit = Boolean(quest.domain && card.domains.includes(quest.domain))
    const placesHere = card.places.filter((place) => quest.countries.includes(place))
    const communitiesHere = card.communities.filter((id) => quest.funderSlugs.includes(id))
    const companiesHere = card.networks.filter((id) => quest.companyIds.includes(id))
    const foundersHere = card.networks.filter((id) => quest.founderIds.includes(id))
    const capitalHit = quest.leastSupplied === 'capital' && DEPLOYS_CAPITAL.has(card.capital)
    const timeHit = quest.leastSupplied === 'teams' && FULL_TIME.has(card.time)
    const placeGap =
      quest.leastSupplied === 'teams' &&
      quest.countries.length > 0 &&
      card.places.some((place) => !quest.countries.includes(place))
    const riskHigh = card.risk === 'high' && (quest.tier === 'x-risk' || quest.tier === 'hard-tech')
    const riskLow = card.risk === 'low' && quest.teamsSourced
    const candidates = intersections(card, quest, freq, options)
    const flags: Flags = {
      intersects: candidates.length > 0,
      domain: domainHit,
      skill: matchedSkills.length > 0,
      fills: capitalHit || timeHit || placeGap || (domainHit && quest.leastSupplied === 'teams') || (matchedSkills.length > 0 && quest.leastSupplied === 'teams'),
      place: placesHere.length > 0,
      community: communitiesHere.length > 0,
      network: companiesHere.length > 0 || foundersHere.length > 0,
      risk: riskHigh || riskLow,
    }
    const any = Object.values(flags).some(Boolean)
    if (!any) continue

    const reasons: string[] = []
    if (domainHit && quest.domainLabel) {
      reasons.push(
        quest.leastSupplied === 'teams'
          ? `Your ${quest.domainLabel} domain meets this quest's gap in teams.`
          : `Your ${quest.domainLabel} domain is this quest's domain.`,
      )
    }
    for (const id of matchedSkills) {
      const label = skillLabel(id)
      reasons.push(
        quest.leastSupplied === 'teams'
          ? `Your ${label} meets this quest's gap in teams.`
          : `Your ${label} meets this quest's domain${quest.domainLabel ? `, ${quest.domainLabel}` : ''}.`,
      )
    }
    for (const place of placesHere) {
      reasons.push(`Your place ${place} is where a sourced builder or funder on this quest is based.`)
    }
    if (placeGap) {
      const missing = card.places.filter((place) => !quest.countries.includes(place))
      reasons.push(
        `Your place ${missing.join(', ')} meets this quest's gap in teams. No sourced builder or funder on this quest is based there.`,
      )
    }
    for (const id of communitiesHere) {
      reasons.push(`Your community ${optionLabel(id, options.communities)} is a sourced funder of this quest.`)
    }
    for (const id of companiesHere) {
      reasons.push(`Your network includes ${optionLabel(id, options.networks)}, already sourced as a team on this quest.`)
    }
    for (const id of foundersHere) {
      reasons.push(`Your network includes ${optionLabel(id, options.networks)}, already sourced as a funder on this quest.`)
    }
    if (capitalHit) {
      reasons.push(`Your capital (${CAPITAL_LABEL[card.capital]}) meets this quest's gap in capital.`)
    }
    if (timeHit) {
      reasons.push(`Your time (${TIME_LABEL[card.time]}) meets this quest's gap in teams.`)
    }
    if (riskHigh) {
      reasons.push(`Your risk appetite is high, and this quest is tagged ${quest.tier}.`)
    }
    if (riskLow) {
      reasons.push('Your risk appetite is low, and this quest already has named teams to join.')
    }

    const playerGaps: string[] = []
    if (!domainHit && matchedSkills.length === 0 && quest.domainLabel) {
      playerGaps.push(`A skill or domain in ${quest.domainLabel}. The card does not list one.`)
    }
    if (quest.leastSupplied === 'teams' && !FULL_TIME.has(card.time)) {
      playerGaps.push(`Time to be the team. The card says ${TIME_LABEL[card.time]}.`)
    }
    if (quest.leastSupplied === 'capital' && !DEPLOYS_CAPITAL.has(card.capital)) {
      playerGaps.push(`Capital you can deploy or raise. The card says ${CAPITAL_LABEL[card.capital]}.`)
    }
    if (card.risk === 'low' && (quest.tier === 'x-risk' || quest.tier === 'hard-tech')) {
      playerGaps.push(`This quest is tagged ${quest.tier}. The card says low risk appetite.`)
    }

    const dataGaps: string[] = []
    if (!quest.teamsSourced) dataGaps.push('Named teams: not yet sourced.')
    if (!quest.capitalSourced) dataGaps.push('Named capital: not yet sourced.')

    ranked.push({
      flags,
      rank: quest.rank,
      name: quest.name,
      match: {
        slug: quest.slug,
        name: quest.name,
        href: quest.href,
        rank: quest.rank,
        domainLabel: quest.domainLabel,
        reasons,
        playerGaps,
        dataGaps,
        onlyYou: onlyYouLine(card, quest, candidates, freq, options),
        firstAction: firstAction(card, quest),
      },
    })
  }

  return ranked.sort(compare).map((row) => row.match)
}
