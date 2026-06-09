import type { RadarRow } from '@/components/RadarClient'
import { problems, DOMAIN_LABEL } from '@/data/problems'
import { getCompaniesForProblem } from '@/data/companies'
import { getEcosystemForProblem } from '@/data/ecosystem'
import { opportunityScore, importanceScore, supplyScore } from '@/lib/priority'

/**
 * Compute the opportunity-ranked radar rows (demand vs supply per problem).
 * Shared by the homepage and /radar so the logic lives in one place.
 */
export function computeRadarRows(): RadarRow[] {
  return problems
    .map((p) => {
      const companies = getCompaniesForProblem(p.slug).length
      const capital = getEcosystemForProblem(p.slug).length
      const s = { companies, capital }
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
      }
    })
    .sort((a, b) => b.opportunity - a.opportunity)
}
