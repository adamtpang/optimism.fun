/**
 * Founder-problem fit — score every problem against a person's profile, so the
 * output is the handful of problems that could be their life's work, each
 * turned into an actionable quest.
 *
 * The weighting encodes the thesis: obsession comes first. The domains a person
 * cannot stop thinking about dominate the score; their archetype refines it; the
 * size of the gap (opportunity) breaks ties toward the problems that need them
 * most. Deterministic and transparent — every match shows its reasons.
 */
import type { Domain } from '@/data/types'
import { problems, DOMAIN_LABEL } from '@/data/problems'
import { ARCHETYPES, type Archetype, type ArchetypeKey } from '@/data/archetypes'
import { opportunityScore, supplyScore } from '@/lib/priority'
import { getCompaniesForProblem } from '@/data/companies'
import { getEcosystemForProblem } from '@/data/ecosystem'

export type FitProfile = {
  /** Domains the person is drawn to (their obsessions). */
  domains: Domain[]
  /** Their founder archetype. */
  archetype: ArchetypeKey
}

export type FitResult = {
  slug: string
  name: string
  tagline: string
  domain: Domain | null
  /** 0..100, relative fit. */
  score: number
  /** Why this problem fits — shown verbatim on the quest card. */
  reasons: string[]
  opportunity: number
}

const W_DOMAIN = 3 // obsession dominates
const W_ARCH_DOMAIN = 1.5
const W_ARCH_TIER = 1
const W_OPP = 0.5

export function scoreFit(profile: FitProfile): FitResult[] {
  const arch: Archetype = ARCHETYPES[profile.archetype]
  const domainSet = new Set(profile.domains)

  const raw = problems.map((p) => {
    const companies = getCompaniesForProblem(p.slug).length
    const capital = getEcosystemForProblem(p.slug).length
    const opp = opportunityScore(p, { companies, capital })
    const oppNorm = opp / 100

    const domainHit = p.domain ? domainSet.has(p.domain) : false
    const archDomainHit = p.domain ? arch.domains.includes(p.domain) : false
    const archTierHit = arch.tiers.includes(p.tier)

    const score =
      (domainHit ? W_DOMAIN : 0) +
      (archDomainHit ? W_ARCH_DOMAIN : 0) +
      (archTierHit ? W_ARCH_TIER : 0) +
      W_OPP * oppNorm

    const reasons: string[] = []
    if (domainHit && p.domain) {
      reasons.push(`It’s in ${DOMAIN_LABEL[p.domain]} — one of the worlds you said you can’t stop thinking about.`)
    }
    if (archDomainHit || archTierHit) {
      reasons.push(`${arch.name} founders like ${arch.exemplars[0].name} have historically won here.`)
    }
    if (oppNorm > 0.35) {
      reasons.push('High demand, thin supply — this is one of the biggest open gaps on the radar.')
    }
    if (reasons.length === 0) {
      reasons.push('A real problem worth a life, even if it sits outside your stated obsessions.')
    }

    return { p, score, reasons, opp }
  })

  const max = Math.max(...raw.map((r) => r.score), 1)

  return raw
    .map((r) => ({
      slug: r.p.slug,
      name: r.p.name,
      tagline: r.p.tagline,
      domain: r.p.domain ?? null,
      score: Math.round((r.score / max) * 100),
      reasons: r.reasons,
      opportunity: r.opp,
    }))
    .sort((a, b) => b.score - a.score)
}
