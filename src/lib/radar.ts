import type { RadarRow } from '@/components/RadarClient'
import { problems, DOMAIN_LABEL } from '@/data/problems'
import { getCompaniesForProblem } from '@/data/companies'
import { getEcosystemForProblem } from '@/data/ecosystem'
import { opportunityScore, importanceScore, supplyScore } from '@/lib/priority'
import { computeAllocations } from '@/lib/allocation'
import { demandScore } from '@/lib/demand'
import { getInLimitCap } from '@/data/in-limit'

/**
 * Compute the opportunity-ranked radar rows (demand vs supply per problem),
 * now carrying the capital-allocation layer (estimated $/yr at the problem,
 * proportionality ratio, verdict). Shared by the homepage and /radar so the
 * logic lives in one place.
 */
export function computeRadarRows(): RadarRow[] {
  const allocations = computeAllocations()
  return problems
    .map((p) => {
      const companies = getCompaniesForProblem(p.slug).length
      const capital = getEcosystemForProblem(p.slug).length
      const s = { companies, capital }
      const alloc = allocations.get(p.slug)
      const prize = getInLimitCap(p.slug)
      const demand = demandScore(p)
      return {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        domain: p.domain ?? null,
        domainLabel: p.domain ? DOMAIN_LABEL[p.domain] : null,
        trend: p.scale?.trend ?? null,
        series: p.scale?.series ?? null,
        companies,
        capital,
        demand: Math.round(importanceScore(p) * 100),
        supply: Math.round(supplyScore(p, s) * 100),
        opportunity: opportunityScore(p, s),
        demandComposite: demand.score,
        demandCorroboration: demand.corroboration,
        demandConsidered: demand.considered,
        capitalUsd: alloc?.capitalUsd ?? null,
        capitalMomentum: alloc?.momentum ?? null,
        allocationRatio: alloc?.ratio ?? null,
        allocationVerdict: alloc?.verdict ?? null,
        inLimitUsd: prize?.marketCap.value ?? null,
      }
    })
    .sort((a, b) => b.opportunity - a.opportunity)
}
